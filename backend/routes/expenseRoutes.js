import express from "express";
import { getExpenses, addExpense, deleteExpense, updateExpense, getExpenseStats, updateIncome } from "../controller/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateExpense } from "../middleware/validator.js";

const router = express.Router();

router.post("/", protect, validateExpense, addExpense);
router.get("/", protect, getExpenses);
router.get("/stats", protect, getExpenseStats);
router.put("/update-income", protect, updateIncome);

router.delete("/:id", protect, deleteExpense);
router.put("/:id", protect, validateExpense, updateExpense);

export default router;