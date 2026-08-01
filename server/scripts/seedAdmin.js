const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../../.env.local") });
require("dotenv").config();

const bcrypt = require("bcryptjs");
const { ensureDatabase } = require("../src/config/db");
const { upsertAdmin } = require("../src/models/Admin");

async function seedAdmin() {
  const email = String(process.env.ADMIN_SEED_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_SEED_PASSWORD || "");

  if (!email || !password) {
    throw new Error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required.");
  }

  await ensureDatabase();

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await upsertAdmin({
    email,
    passwordHash,
    role: "admin",
  });
  const demoEmail = String(
    process.env.ADMIN_DEMO_EMAIL || "admin@travelwithgiridhar.local"
  )
    .trim()
    .toLowerCase();

  if (demoEmail && demoEmail !== email) {
    await upsertAdmin({
      email: demoEmail,
      passwordHash,
      role: "admin",
    });
  }

  console.log(`Admin ready: ${admin.email}`);
}

seedAdmin()
  .catch((error) => {
    console.error("Admin seed failed:", error.message);
    process.exitCode = 1;
  });
