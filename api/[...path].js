const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../server/.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();

const app = require("../server/src/app");
const connectDatabase = require("../server/src/config/db");

let databasePromise = null;

function isSetupError(error) {
  return /MONGODB_URI|Razorpay keys|RAZORPAY|JWT_SECRET/i.test(
    error && error.message ? error.message : ""
  );
}

async function ensureDatabase() {
  if (!databasePromise) {
    databasePromise = connectDatabase().catch(function (error) {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise;
}

module.exports = async function handler(req, res) {
  try {
    await ensureDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Travel API setup error:", error);
    return res.status(500).json({
      success: false,
      setupRequired: isSetupError(error),
      error:
        process.env.NODE_ENV === "production" && isSetupError(error)
          ? "Booking backend needs MongoDB, JWT, and Razorpay environment variables in Vercel."
          : error.message || "Travel API failed to start.",
    });
  }
};
