import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import expenseRoutes from "../../backend/routes/expenseRoutes.js";
import authRoutes from "../../backend/routes/authRoutes.js";
import connectDB from "../../backend/config/db.js";
import { errorHandler } from "../../backend/middleware/errorHandler.js";

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: true, 
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running successfully on PORT: ${PORT}`);
  });
}
export const handler = serverless(app);
