import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getProfile,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/auth", authUser);

router.post("/register", registerUser);

router.post("/logout", logoutUser);

router.get("/get", protect, getProfile);

router.put("/update", protect, updateUserProfile);

export default router;
