import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes — Check if handlers are valid functions/routers
if (authRoutes) app.use(["/api/auth", "/auth"], authRoutes);
if (expenseRoutes) app.use(["/api/expenses", "/expenses"], expenseRoutes);

// Error Handler
if (typeof errorHandler === "function") {
  app.use(errorHandler);
}

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running successfully on PORT: ${PORT}`);
  });
}

export default app;