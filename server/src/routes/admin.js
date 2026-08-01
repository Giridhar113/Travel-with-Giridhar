const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  countAdmins,
  createAdmin,
  findAdminByEmail,
} = require("../models/Admin");
const {
  countBookings,
  deleteBooking,
  findBookingById,
  listBookings,
  revenueSince,
  updateBooking,
} = require("../models/Booking");
const requireAdminAuth = require("../middleware/auth");
const { allowedStatuses, validateStatus } = require("../utils/validators");

const router = express.Router();

function signAdminToken(admin) {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );
}

function resolveLoginEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const seedEmail = String(process.env.ADMIN_SEED_EMAIL || "").trim().toLowerCase();
  const configuredDemoEmail = String(process.env.ADMIN_DEMO_EMAIL || "")
    .trim()
    .toLowerCase();
  const publicDemoEmail = "admin@travelwithgiridhar.local";

  if (
    seedEmail &&
    (normalizedEmail === publicDemoEmail || normalizedEmail === configuredDemoEmail)
  ) {
    return seedEmail;
  }

  return normalizedEmail;
}

function buildAdminBookingQuery(query) {
  const filter = {};
  const status = validateStatus(query.status);
  const paymentStatus = String(query.paymentStatus || "").trim().toLowerCase();

  if (status) {
    filter.status = status;
  }

  if (["pending", "paid", "failed"].includes(paymentStatus)) {
    filter.paymentStatus = paymentStatus;
  }

  return filter;
}

async function createFirstAdminIfAllowed(email, password) {
  const seedEmail = String(process.env.ADMIN_SEED_EMAIL || "").trim().toLowerCase();
  const seedPassword = String(process.env.ADMIN_SEED_PASSWORD || "");

  if (!seedEmail || !seedPassword || email !== seedEmail || password !== seedPassword) {
    return null;
  }

  const existingAdminCount = await countAdmins();

  if (existingAdminCount > 0) {
    return null;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return createAdmin({
    email,
    passwordHash,
    role: "admin",
  });
}

router.post("/login", async (req, res, next) => {
  try {
    const submittedEmail = String(req.body.email || "").trim().toLowerCase();
    const email = resolveLoginEmail(submittedEmail);
    const password = String(req.body.password || "");

    if (!submittedEmail || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    let admin = await findAdminByEmail(email);

    if (!admin) {
      admin = await createFirstAdminIfAllowed(email, password);
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid admin credentials.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: "Invalid admin credentials.",
      });
    }

    return res.json({
      success: true,
      token: signAdminToken(admin),
      admin: {
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/bookings", requireAdminAuth, async (req, res, next) => {
  try {
    const sortDirection = req.query.sort === "asc" ? "asc" : "desc";
    const bookings = await listBookings({
      ...buildAdminBookingQuery(req.query),
      sortDirection,
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const stats = {
      total: await countBookings(),
      new: await countBookings({ status: "new" }),
      confirmed: await countBookings({ status: "confirmed" }),
      thisWeek: await countBookings({ since: weekAgo }),
      paidThisWeek: await countBookings({ paymentStatus: "paid", since: weekAgo }),
      revenueThisMonth: await revenueSince(monthStart),
    };

    return res.json({
      success: true,
      bookings,
      stats,
      statuses: allowedStatuses,
      paymentStatuses: ["pending", "paid", "failed"],
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/bookings/:id", requireAdminAuth, async (req, res, next) => {
  try {
    const status = validateStatus(req.body.status);

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Choose a valid booking status.",
      });
    }

    const existingBooking = await findBookingById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found.",
      });
    }

    const booking = await updateBooking(req.params.id, { status });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found.",
      });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/bookings/:id", requireAdminAuth, async (req, res, next) => {
  try {
    const booking = await deleteBooking(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found.",
      });
    }

    return res.json({
      success: true,
      message: "Booking deleted.",
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
