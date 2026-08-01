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

function hasLocalOnlyMongoUri() {
  return /^mongodb:\/\/(localhost|127\.0\.0\.1)(:|\/)/i.test(
    String(process.env.MONGODB_URI || "")
  );
}

function createSetupResponse(res, message) {
  return res.status(500).json({
    success: false,
    setupRequired: true,
    error: message,
  });
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
    if (hasLocalOnlyMongoUri()) {
      return createSetupResponse(
        res,
        "Live booking needs a MongoDB Atlas URI. The current MONGODB_URI points to local MongoDB, which Vercel cannot access."
      );
    }

    await ensureDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Travel API setup error:", error);
    if (isSetupError(error)) {
      return createSetupResponse(
        res,
        process.env.NODE_ENV === "production"
          ? "Booking backend needs MongoDB, JWT, and Razorpay environment variables in Vercel."
          : error.message || "Travel API setup is incomplete."
      );
    }

    return res.status(500).json({
      success: false,
      setupRequired: false,
      error: error.message || "Travel API failed to start.",
    });
  }
};
