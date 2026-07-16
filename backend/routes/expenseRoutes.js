const express=require("express");
import { getExpenses,addExpense } from "../controller/expenseController.js";
const router=express.router();
router.get("/",getExpenses);
router.post("/",addExpense);
export default router;