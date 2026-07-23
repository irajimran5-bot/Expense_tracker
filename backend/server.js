import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// 1. Initialize Express app FIRST
const app = express();

// 2. CORS & JSON Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// 3. Database Connection Middleware (Auto-connects on request)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// 4. Routes
app.use(["/api/auth", "/auth"], authRoutes);
app.use(["/api/expenses", "/expenses"], expenseRoutes);

// 5. Error Handling
app.use(errorHandler);

// 6. Local Development Server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running successfully on PORT: ${PORT}`);
  });
}

export default app;