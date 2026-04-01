import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) return;

  const existing = await User.findOne({ email: adminEmail });
  if (existing) return;

  const hashed = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: "Platform Admin",
    email: adminEmail,
    password: hashed,
    role: "admin",
    phone: "",
  });

  // eslint-disable-next-line no-console
  console.log("Default admin created from env credentials.");
};
