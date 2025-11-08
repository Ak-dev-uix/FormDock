import express from "express";
import cors from "cors";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import authRoutes from "./routes/auth.js";
import formsRoutes from "./routes/forms.js";
import { initDB } from "./database.js";

config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Always resolve paths relative to project root (fixes ENOENT)
const FRONTEND_PATH = resolve(__dirname, "../frontend");

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(join(process.cwd(), "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formsRoutes);

// ✅ Serve static frontend files correctly
app.use(express.static(FRONTEND_PATH, {
  extensions: ["html"],
  index: "index.html",
}));

// ✅ Frontend routes
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

// ✅ Catch-all for frontend routing (avoid 404 on refresh)
app.get("*", (req, res) => {
  res.sendFile(join(FRONTEND_PATH, "index.html"));
});

// ✅ Initialize DB
let dbReady = false;
initDB()
  .then(() => {
    console.log("✅ Database initialized successfully");
    dbReady = true;
  })
  .catch((err) => {
    console.error("❌ Database init failed:", err);
  });

// ✅ Export app (for Zeabur / Vercel)
export default app;

// ✅ Local run support
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally at http://localhost:${PORT}`);
    console.log(`📁 Serving frontend from: ${FRONTEND_PATH}`);
  });
}
