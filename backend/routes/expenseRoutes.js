import express from "express";
import { getExpenses,addExpense, deleteExpense,updateExpense,getExpenseStats,updateIncome } from "../controller/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateExpense } from "../middleware/validator.js";
const router=express.Router();
router.post("/", protect, validateExpense, addExpense);
router.get("/", protect, getExpenses);
router.delete("/:id", protect, deleteExpense);
router.put("/:id", protect, validateExpense, updateExpense);
router.get("/stats", protect, getExpenseStats);
router.put("/update-income", protect, async (req, res) => {
  try {
    const { totalIncome } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { totalIncome }, 
      { new: type => true } 
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Income updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating income" });
  }
});
export default router;