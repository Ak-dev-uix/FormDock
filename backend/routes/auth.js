import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { usersDB } from "../database.js";

const router = express.Router();

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await usersDB.read();
    const existingUser = usersDB.data.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: nanoid(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    usersDB.data.push(newUser);
    await usersDB.write();

    res.status(201).json({
      message: "User created successfully",
      userId: newUser.id,
      name: newUser.name
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    await usersDB.read();
    const user = usersDB.data.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "formdock_secret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      userId: user.id,
      name: user.name,
      username: user.name,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
