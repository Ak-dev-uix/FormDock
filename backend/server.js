import express from "express";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import authRoutes from "./routes/auth.js";
import formsRoutes from "./routes/forms.js";
import { initDB } from "./database.js";

config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🧩 Paths
const FRONTEND_PATH = join(__dirname, "../frontend");

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(join(process.cwd(), "uploads")));

// Serve static files from frontend folder (CSS, JS, images)
app.use(express.static(FRONTEND_PATH));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formsRoutes);

// ✅ Serve frontend pages
app.get("/", (req, res) => {
  res.sendFile(join(FRONTEND_PATH, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(join(FRONTEND_PATH, "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(join(FRONTEND_PATH, "signup.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(join(FRONTEND_PATH, "dashboard.html"));
});

// Catch-all fallback (for React/SPAs or direct URL access)
app.get("*", (req, res) => {
  res.sendFile(join(FRONTEND_PATH, "index.html"));
});

// Initialize database
initDB()
  .then(() => console.log("✅ Database initialized successfully"))
  .catch((err) => console.error("❌ Database init failed:", err));

// Export for deployment (Zeabur, Render, etc.)
export default app;

// Local run support
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📂 Serving frontend from: ${FRONTEND_PATH}`);
  });
}
