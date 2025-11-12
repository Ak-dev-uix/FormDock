// backend/api/index.js
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { initDB } from "../database.js"; // Adjust path because file is now one level up
import authRoutes from "../routes/auth.js";
import formsRoutes from "../routes/forms.js";

config();

const app = express();
app.use(cors());
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("Hello from backend 🚀 (Vercel version)");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formsRoutes);

// Initialize database only once
let dbInitialized = false;
if (!dbInitialized) {
  initDB()
    .then(() => {
      console.log("✅ Database connected successfully (Vercel)");
      dbInitialized = true;
    })
    .catch((err) => console.error("❌ Database connection failed:", err));
}

// Export handler instead of app.listen()
export default app;
