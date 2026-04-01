import { Router } from "express";
import { createBlog, getBlogById, getBlogs, getMyBlogPostStatus } from "../controllers/blogController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getBlogs);
router.get("/my/status", protect, authorize("lawyer"), getMyBlogPostStatus);
router.get("/:id", getBlogById);
router.post("/", protect, authorize("lawyer"), createBlog);

export default router;
