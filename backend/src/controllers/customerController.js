import Inquiry from "../models/Inquiry.js";
import Favorite from "../models/Favorite.js";
import LawyerProfile from "../models/LawyerProfile.js";

const SEARCH_CACHE_TTL_MS = 20_000;
const searchCache = new Map();

const buildCacheKey = (query = {}) =>
  Object.entries(query)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${String(value)}`)
    .join("|");

const getCachedSearch = (key) => {
  const hit = searchCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    searchCache.delete(key);
    return null;
  }
  return hit.data;
};

const setCachedSearch = (key, data) => {
  searchCache.set(key, {
    data,
    expiresAt: Date.now() + SEARCH_CACHE_TTL_MS,
  });
};

export const searchLawyers = async (req, res, next) => {
  try {
    const { specialization, experienceLevel, budget, query } = req.query;
    const cacheKey = buildCacheKey(req.query);
    const cached = getCachedSearch(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const filter = { approvalStatus: "approved" };
    if (specialization) filter.specialization = specialization;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (budget) filter.pricing = budget;

    let profiles = await LawyerProfile.find(filter)
      .populate({ path: "userId", select: "name email phone", options: { lean: true } })
      .sort({ rating: -1, experienceYears: -1 })
      .lean();

    if (query) {
      const q = query.toLowerCase();
      profiles = profiles.filter((item) => {
        const name = item.userId?.name?.toLowerCase() || "";
        const bio = item.bio?.toLowerCase() || "";
        return name.includes(q) || bio.includes(q);
      });
    }

    setCachedSearch(cacheKey, profiles);

    return res.json(profiles);
  } catch (error) {
    return next(error);
  }
};

export const createInquiry = async (req, res, next) => {
  try {
    const { lawyerId, type, message, scheduledAt } = req.body;

    if (!lawyerId || !type || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const inquiry = await Inquiry.create({
      customerId: req.user._id,
      lawyerId,
      type,
      message,
      scheduledAt: scheduledAt || null,
    });

    return res.status(201).json({ message: "Inquiry submitted", inquiry });
  } catch (error) {
    return next(error);
  }
};

export const getCustomerBookings = async (req, res, next) => {
  try {
    const bookingDocs = await Inquiry.find({ customerId: req.user._id })
      .populate({ path: "lawyerId", select: "name email phone", options: { lean: true } })
      .sort({ createdAt: -1 })
      .lean();

    const bookings = bookingDocs.map((booking) => {

      // Share full lawyer contact details only after inquiry acceptance.
      if (booking.status !== "accepted" && booking.lawyerId) {
        booking.lawyerId = {
          _id: booking.lawyerId._id,
          name: booking.lawyerId.name,
        };
      }

      return booking;
    });

    return res.json(bookings);
  } catch (error) {
    return next(error);
  }
};

export const saveFavorite = async (req, res, next) => {
  try {
    const { lawyerId } = req.body;
    if (!lawyerId) {
      return res.status(400).json({ message: "lawyerId is required" });
    }

    await Favorite.findOneAndUpdate(
      { customerId: req.user._id, lawyerId },
      { customerId: req.user._id, lawyerId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ message: "Saved to favorites" });
  } catch (error) {
    return next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    await Favorite.findOneAndDelete({
      customerId: req.user._id,
      lawyerId: req.params.lawyerId,
    });

    return res.json({ message: "Favorite removed" });
  } catch (error) {
    return next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const favoriteDocs = await Favorite.find({ customerId: req.user._id }).select("lawyerId").lean();
    const lawyerIds = favoriteDocs.map((fav) => fav.lawyerId);

    const favorites = await LawyerProfile.find({ userId: { $in: lawyerIds }, approvalStatus: "approved" })
      .populate({ path: "userId", select: "name email phone", options: { lean: true } })
      .sort({ rating: -1 })
      .lean();

    return res.json(favorites);
  } catch (error) {
    return next(error);
  }
};
