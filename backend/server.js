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

// Database Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Netlify bundling fix (extracts .default if present)
const authHandler = authRoutes?.default || authRoutes;
const expenseHandler = expenseRoutes?.default || expenseRoutes;

// Routes setup
if (typeof authHandler === "function") {
  app.use("/api/auth", authHandler);
  app.use("/auth", authHandler);
}

if (typeof expenseHandler === "function") {
  app.use("/api/expenses", expenseHandler);
  app.use("/expenses", expenseHandler);
}

// Error Handling Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running successfully on PORT: ${PORT}`);
  });
}

export default app;