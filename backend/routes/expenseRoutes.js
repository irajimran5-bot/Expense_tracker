import express from "express";
import { validateExpense } from "../middleware/validator.js";
import { getExpenses,addExpense, deleteExpense,updateExpense,getExpenseStats } from "../controller/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router(protect);
router.get("/stats",getExpenseStats);
router.get("/",getExpenses);
router.post('/',validateExpense,addExpense);
router.delete("/:id",deleteExpense);
router.put("/:id",updateExpense);
export default router;