import LawyerProfile from "../models/LawyerProfile.js";
import Inquiry from "../models/Inquiry.js";
import { getExperienceLevel } from "../utils/lawyerHelpers.js";

const LAWYER_CACHE_TTL_MS = 20_000;
const lawyerCache = new Map();

const makeKey = (prefix, payload = {}) =>
  `${prefix}|${Object.entries(payload)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${String(value)}`)
    .join("|")}`;

const readCache = (key) => {
  const hit = lawyerCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    lawyerCache.delete(key);
    return null;
  }
  return hit.data;
};

const writeCache = (key, data) => {
  lawyerCache.set(key, {
    data,
    expiresAt: Date.now() + LAWYER_CACHE_TTL_MS,
  });
};

const clearLawyerCache = () => {
  lawyerCache.clear();
};

export const getLawyers = async (req, res, next) => {
  try {
    const { specialization, experienceLevel, budget, availability } = req.query;
    const key = makeKey("list", req.query);
    const cached = readCache(key);
    if (cached) {
      return res.json(cached);
    }

    const filter = { approvalStatus: "approved" };

    if (specialization) filter.specialization = specialization;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (budget) filter.pricing = budget;
    if (availability !== undefined) filter.availability = availability === "true";

    const profiles = await LawyerProfile.find(filter)
      .populate({ path: "userId", select: "name email phone", options: { lean: true } })
      .sort({ rating: -1, experienceYears: -1 })
      .lean();

    writeCache(key, profiles);

    return res.json(profiles);
  } catch (error) {
    return next(error);
  }
};

export const getLawyerById = async (req, res, next) => {
  try {
    const key = makeKey("by-id", { id: req.params.id });
    const cached = readCache(key);
    if (cached) {
      return res.json(cached);
    }

    const profile = await LawyerProfile.findOne({ userId: req.params.id }).populate(
      { path: "userId", select: "name email phone", options: { lean: true } }
    );

    if (!profile || profile.approvalStatus !== "approved") {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    const payload = profile.toObject();
    writeCache(key, payload);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
};

export const getMyLawyerProfile = async (req, res, next) => {
  try {
    const profile = await LawyerProfile.findOne({ userId: req.user._id }).populate(
      { path: "userId", select: "name email phone", options: { lean: true } }
    );

    if (!profile) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};

export const updateLawyerProfile = async (req, res, next) => {
  try {
    const { experienceYears, specialization, bio, pricing, availability } = req.body;

    const profile = await LawyerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    if (experienceYears !== undefined) {
      profile.experienceYears = Number(experienceYears);
      profile.experienceLevel = getExperienceLevel(Number(experienceYears));
    }
    if (specialization) profile.specialization = specialization;
    if (bio !== undefined) profile.bio = bio;
    if (pricing) profile.pricing = pricing;
    if (availability !== undefined) profile.availability = Boolean(availability);

    profile.approvalStatus = "pending";

    await profile.save();
    clearLawyerCache();
    return res.json({ message: "Profile updated and sent for admin review", profile });
  } catch (error) {
    return next(error);
  }
};

export const addCaseStudy = async (req, res, next) => {
  try {
    const { title, description, outcome } = req.body;

    if (!title || !description || !outcome) {
      return res.status(400).json({ message: "Missing case study fields" });
    }

    const profile = await LawyerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Lawyer profile not found" });
    }

    profile.caseStudies.push({ title, description, outcome });
    profile.approvalStatus = "pending";
    await profile.save();
    clearLawyerCache();

    return res.status(201).json({ message: "Case study added", profile });
  } catch (error) {
    return next(error);
  }
};

export const getLawyerInquiries = async (req, res, next) => {
  try {
    const inquiryDocs = await Inquiry.find({ lawyerId: req.user._id })
      .populate({ path: "customerId", select: "name email phone", options: { lean: true } })
      .sort({ createdAt: -1 })
      .lean();

    const inquiries = inquiryDocs.map((inquiry) => {

      // Share full customer contact details only after the lawyer accepts the request.
      if (inquiry.status !== "accepted" && inquiry.customerId) {
        inquiry.customerId = {
          _id: inquiry.customerId._id,
          name: inquiry.customerId.name,
        };
      }

      return inquiry;
    });

    return res.json(inquiries);
  } catch (error) {
    return next(error);
  }
};

export const respondInquiry = async (req, res, next) => {
  try {
    const { inquiryId } = req.params;
    const { status, responseMessage } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const inquiry = await Inquiry.findOne({ _id: inquiryId, lawyerId: req.user._id });

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    inquiry.status = status;
    inquiry.responseMessage = responseMessage || "";
    await inquiry.save();

    return res.json({ message: "Inquiry updated", inquiry });
  } catch (error) {
    return next(error);
  }
};
