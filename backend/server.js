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

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(join(process.cwd(), "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formsRoutes);

// Serve static frontend files
app.use(express.static(join(__dirname, "../frontend"), {
  extensions: ["html"],
  index: "index.html",
}));

// Frontend routes
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../frontend", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(join(__dirname, "../frontend", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(join(__dirname, "../frontend", "signup.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(join(__dirname, "../frontend", "dashboard.html"));
});

// Catch-all (for direct link refresh)
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../frontend", "index.html"));
});

// Initialize DB before export (Vercel way)
let dbReady = false;
initDB()
  .then(() => {
    console.log("✅ Database initialized successfully");
    dbReady = true;
  })
  .catch((err) => {
    console.error("❌ Database init failed:", err);
  });

// ✅ Export app instead of app.listen (for Vercel)
export default app;

// ✅ Local run support (only when run manually)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally at http://localhost:${PORT}`);
  });
}
