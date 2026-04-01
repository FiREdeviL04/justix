import { Router } from "express";
import {
  approveLawyer,
  getDashboardStats,
  getUsers,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/users", getUsers);
router.get("/stats", getDashboardStats);
router.put("/approve-lawyer", approveLawyer);

export default router;
