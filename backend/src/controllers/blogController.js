import Blog from "../models/Blog.js";
import mongoose from "mongoose";

const BLOG_CACHE_TTL_MS = 20_000;
const blogCache = new Map();

const getReadTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

const readCache = (key) => {
  const hit = blogCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    blogCache.delete(key);
    return null;
  }
  return hit.data;
};

const writeCache = (key, data) => {
  blogCache.set(key, {
    data,
    expiresAt: Date.now() + BLOG_CACHE_TTL_MS,
  });
};

const clearBlogCache = () => {
  blogCache.clear();
};

export const createBlog = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "Title, content, and category are required" });
    }

    const latestBlog = await Blog.findOne({
      $or: [{ author: req.user._id }, { authorId: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .select("createdAt")
      .lean();

    if (latestBlog) {
      const elapsedMs = Date.now() - new Date(latestBlog.createdAt).getTime();
      if (elapsedMs < 24 * 60 * 60 * 1000) {
        return res.status(429).json({ message: "You can only post 1 blog per day" });
      }
    }

    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      author: req.user._id,
      authorName: req.user.name,
      category: category.trim(),
      readTime: getReadTime(content),
      isPublished: true,
    });

    clearBlogCache();
    return res.status(201).json(blog);
  } catch (error) {
    return next(error);
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const key = `blogs:list:${page}:${limit}`;
    const cached = readCache(key);
    if (cached) {
      return res.json(cached);
    }

    const [total, blogs] = await Promise.all([
      Blog.countDocuments({ isPublished: true }),
      Blog.find({ isPublished: true })
        .select("title content authorName category createdAt readTime isPublished")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const payload = {
      items: blogs,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    writeCache(key, payload);
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const key = `blog:${req.params.id}`;
    const cached = readCache(key);
    if (cached) {
      return res.json(cached);
    }

    const blog = await Blog.findOne({ _id: req.params.id, isPublished: true }).lean();

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    writeCache(key, blog);
    return res.json(blog);
  } catch (error) {
    return next(error);
  }
};

export const getMyBlogPostStatus = async (req, res, next) => {
  try {
    const latestBlog = await Blog.findOne({
      $or: [{ author: req.user._id }, { authorId: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .select("createdAt")
      .lean();

    if (!latestBlog) {
      return res.json({ canPost: true, message: "You can post 1 blog today" });
    }

    const nextAllowedAt = new Date(new Date(latestBlog.createdAt).getTime() + 24 * 60 * 60 * 1000);
    const remainingMs = nextAllowedAt.getTime() - Date.now();

    if (remainingMs <= 0) {
      return res.json({ canPost: true, message: "You can post 1 blog today" });
    }

    return res.json({
      canPost: false,
      message: "Limit reached",
      nextAllowedAt,
      remainingMs,
    });
  } catch (error) {
    return next(error);
  }
};
