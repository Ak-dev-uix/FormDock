import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { initDB } from "./database.js";
import authRoutes from "./routes/auth.js";
import formsRoutes from "./routes/forms.js";

config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Basic root route (frontend removed)
app.get("/", (req, res) => {
  res.send("Hello from backend 🚀");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formsRoutes);

// ✅ Initialize database
initDB()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// ✅ Local run & Zeabur support
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
