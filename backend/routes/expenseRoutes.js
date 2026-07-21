import express from "express";
import { getExpenses,addExpense, deleteExpense,updateExpense,getExpenseStats } from "../controller/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateExpense } from "../middleware/validator.js";
const router=express.Router();
router.post("/", protect, validateExpense, addExpense);
router.get("/", protect, getExpenses);
router.delete("/:id", protect, deleteExpense);
router.put("/:id", protect, validateExpense, updateExpense);
router.get("/stats", protect, getExpenseStats);

export default router;