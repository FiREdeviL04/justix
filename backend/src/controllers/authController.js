import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import LawyerProfile from "../models/LawyerProfile.js";
import { generateToken } from "../utils/token.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
      const missing = [];
      if (!name) missing.push("name");
      if (!email) missing.push("email");
      if (!password) missing.push("password");
      if (!role) missing.push("role");
      return res.status(400).json({ 
        message: `Missing required fields: ${missing.join(", ")}${!role ? " (role must be 'lawyer' or 'customer')" : ""}` 
      });
    }

    if (!["lawyer", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role for registration. role must be either 'lawyer' or 'customer'" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || "",
    });

    if (role === "lawyer") {
      await LawyerProfile.create({ userId: user._id });
    }

    return res.status(201).json({
      message: "Registered successfully",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const missing = [];
      if (!email) missing.push("email");
      if (!password) missing.push("password");
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    if (!email || !role || !["lawyer", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    const resetToken = crypto.randomBytes(16).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      role: user.role,
      resetToken,
    });

    return res.json({
      message: "Password reset link sent to your email",
      expiresInMinutes: 15,
    });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return next(error);
  }
};
