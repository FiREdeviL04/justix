import { Router } from "express";
import {
  addCaseStudy,
  getMyLawyerProfile,
  getLawyerById,
  getLawyerInquiries,
  getLawyers,
  respondInquiry,
  updateLawyerProfile,
} from "../controllers/lawyerController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getLawyers);

router.get("/me", protect, authorize("lawyer"), getMyLawyerProfile);
router.put("/profile", protect, authorize("lawyer"), updateLawyerProfile);
router.post("/case-study", protect, authorize("lawyer"), addCaseStudy);
router.get("/inquiries/all", protect, authorize("lawyer"), getLawyerInquiries);
router.put("/inquiries/:inquiryId/respond", protect, authorize("lawyer"), respondInquiry);
router.get("/:id", getLawyerById);

export default router;
