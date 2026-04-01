import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    content: { type: String, required: true, trim: true, maxlength: 20000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    readTime: { type: Number, required: true, min: 1 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });
blogSchema.index({ author: 1 });
blogSchema.index({ isPublished: 1, createdAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
