import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";
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
app.put("/api/update-income", protect, async (req, res) => {
  try {
    const { totalIncome } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { totalIncome },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Income updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// Error Handling Middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running successfully on PORT: ${PORT}`);
  });
}

export default app;