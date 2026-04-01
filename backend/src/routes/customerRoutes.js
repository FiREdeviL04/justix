import { Router } from "express";
import {
  createInquiry,
  getCustomerBookings,
  getFavorites,
  removeFavorite,
  saveFavorite,
  searchLawyers,
} from "../controllers/customerController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/search", searchLawyers);

router.post("/inquiry", protect, authorize("customer"), createInquiry);
router.get("/customer/bookings", protect, authorize("customer"), getCustomerBookings);
router.get("/customer/favorites", protect, authorize("customer"), getFavorites);
router.post("/customer/favorites", protect, authorize("customer"), saveFavorite);
router.delete("/customer/favorites/:lawyerId", protect, authorize("customer"), removeFavorite);

export default router;
