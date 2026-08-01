const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../server/.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();

const app = require("../server/src/app");
const { ensureDatabase } = require("../server/src/config/db");

let databasePromise = null;

function isSetupError(error) {
  return /DATABASE_URL|POSTGRES|SQL|JWT_SECRET/i.test(
    error && error.message ? error.message : ""
  );
}

function createSetupResponse(res, message) {
  return res.status(500).json({
    success: false,
    setupRequired: true,
    error: message,
  });
}

async function ensureApiDatabase() {
  if (!databasePromise) {
    databasePromise = ensureDatabase().catch(function (error) {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise;
}

module.exports = async function handler(req, res) {
  try {
    await ensureApiDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Travel API setup error:", error);
    if (isSetupError(error)) {
      return createSetupResponse(
        res,
        process.env.NODE_ENV === "production"
          ? "Booking backend needs DATABASE_URL and JWT environment variables in Vercel."
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
