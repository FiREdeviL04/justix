import User from "../models/User.js";
import LawyerProfile from "../models/LawyerProfile.js";
import Inquiry from "../models/Inquiry.js";

export const getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();

    const lawyerIds = users.filter((user) => user.role === "lawyer").map((user) => user._id);
    const profiles = await LawyerProfile.find({ userId: { $in: lawyerIds } }).select("userId approvalStatus").lean();

    const profileByUserId = new Map(profiles.map((profile) => [String(profile.userId), profile.approvalStatus]));

    const enrichedUsers = users.map((user) => ({
      ...user,
      approved: user.role === "lawyer" ? Boolean(user.approved) : null,
      approvalStatus: user.role === "lawyer" ? profileByUserId.get(String(user._id)) || "pending" : null,
    }));

    return res.json(enrichedUsers);
  } catch (error) {
    return next(error);
  }
};

export const approveLawyer = async (req, res, next) => {
  try {
    const { lawyerId, status, approvalStatus } = req.body;
    const nextStatus = approvalStatus || status;

    if (!lawyerId || !["approved", "rejected"].includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const profile = await LawyerProfile.findOne({ userId: lawyerId });
    if (!profile) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    const user = await User.findOne({ _id: lawyerId, role: "lawyer" });
    if (!user) {
      return res.status(404).json({ message: "Lawyer user not found" });
    }

    profile.approvalStatus = nextStatus;
    user.approved = nextStatus === "approved";

    await Promise.all([profile.save(), user.save()]);

    return res.json({ message: `Lawyer profile ${nextStatus}`, profile, approved: user.approved });
  } catch (error) {
    return next(error);
  }
};

export const getDashboardStats = async (_req, res, next) => {
  try {
    const [totalUsers, lawyers, customers, pendingLawyers, totalInquiries] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "lawyer" }),
      User.countDocuments({ role: "customer" }),
      LawyerProfile.countDocuments({ approvalStatus: "pending" }),
      Inquiry.countDocuments(),
    ]);

    return res.json({
      totalUsers,
      lawyers,
      customers,
      pendingLawyers,
      totalInquiries,
    });
  } catch (error) {
    return next(error);
  }
};
