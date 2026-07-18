import expenseRoutes from "./routes/expenseRoutes.js";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
dotenv.config();
connectDB();
const app=express();
app.use(express.json());
app.use("/api/expenses",expenseRoutes);
app.use(errorHandler);
const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`Server running successfully on PORT: ${PORT}`)
});
