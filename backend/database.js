// database.js - Shared database configuration for all modules
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to separate JSON files inside the 'data' folder
const usersFile = path.join(__dirname, "data", "users.json");
const formsFile = path.join(__dirname, "data", "forms.json");

// Create adapters for each file
const usersAdapter = new JSONFile(usersFile);
const formsAdapter = new JSONFile(formsFile);

// Create LowDB instances
export const usersDB = new Low(usersAdapter, []);
export const formsDB = new Low(formsAdapter, []);

export async function initDB() {
  try {
    await usersDB.read();
    usersDB.data ||= [];
    await usersDB.write();

    await formsDB.read();
    formsDB.data ||= [];
    await formsDB.write();

    console.log("✅ Users and Forms databases initialized");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
