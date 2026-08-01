const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bookingsRouter = require("./routes/bookings");
const adminRouter = require("./routes/admin");

const app = express();

app.set("trust proxy", 1);

function parseAllowedOrigins() {
  return String(
    process.env.CORS_ORIGIN ||
      "https://travel-with-giridhar.vercel.app,http://localhost:5000,http://localhost:5500,http://127.0.0.1:5500"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const allowedOrigins = parseAllowedOrigins();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" && origin === "null")
      ) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
  })
);

app.use(express.json({ limit: "30kb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "Travel with Giridhar API",
    time: new Date().toISOString(),
  });
});

app.use("/api/bookings", bookingsRouter);
app.use("/api/admin", adminRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API route not found.",
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong on the server."
        : error.message || "Something went wrong on the server.",
  });
});

module.exports = app;
