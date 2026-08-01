const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Booking = require("../models/Booking");
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

  const existingAdminCount = await Admin.countDocuments();

  if (existingAdminCount > 0) {
    return null;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return Admin.create({
    email,
    passwordHash,
    role: "admin",
  });
}

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    let admin = await Admin.findOne({ email });

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
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const bookings = await Booking.find(buildAdminBookingQuery(req.query))
      .sort({ createdAt: sortDirection })
      .lean();

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const revenue = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const stats = {
      total: await Booking.countDocuments(),
      new: await Booking.countDocuments({ status: "new" }),
      confirmed: await Booking.countDocuments({ status: "confirmed" }),
      thisWeek: await Booking.countDocuments({ createdAt: { $gte: weekAgo } }),
      paidThisWeek: await Booking.countDocuments({
        paymentStatus: "paid",
        createdAt: { $gte: weekAgo },
      }),
      revenueThisMonth: revenue[0] ? revenue[0].total : 0,
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking ID.",
      });
    }

    const status = validateStatus(req.body.status);

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Choose a valid booking status.",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findByIdAndDelete(req.params.id).lean();

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
