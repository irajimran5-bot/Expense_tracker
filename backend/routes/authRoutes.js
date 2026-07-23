import express from "express";
import { registerUser, loginUser } from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update-income", protect, async (req, res) => {
  try {
    const { totalIncome } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { totalIncome },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Income updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update income error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;