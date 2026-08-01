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

function getPublicDemoEmail() {
  return "admin@travelwithgiridhar.local";
}

function getPublicDemoPin() {
  return String(process.env.ADMIN_DEMO_PIN || "123456");
}

function isPublicDemoLogin(email, pin) {
  return (
    String(email || "").trim().toLowerCase() === getPublicDemoEmail() &&
    String(pin || "") === getPublicDemoPin()
  );
}

function resolveLoginEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const seedEmail = String(process.env.ADMIN_SEED_EMAIL || "").trim().toLowerCase();
  const configuredDemoEmail = String(process.env.ADMIN_DEMO_EMAIL || "")
    .trim()
    .toLowerCase();
  const publicDemoEmail = getPublicDemoEmail();

  if (
    seedEmail &&
    (normalizedEmail === publicDemoEmail || normalizedEmail === configuredDemoEmail)
  ) {
    return seedEmail;
  }

  return normalizedEmail;
}

function getDemoBookings() {
  const now = new Date();

  function dateOffset(days) {
    const date = new Date(now);
    date.setDate(now.getDate() + days);
    return date.toISOString();
  }

  return [
    {
      _id: "demo-booking-001",
      id: "demo-booking-001",
      name: "Ananya Rao",
      email: "ananya.demo@example.com",
      phone: "+91 98••••1234",
      package: "Premium Bali Tour",
      destination: "Bali, Indonesia",
      travelDate: dateOffset(32),
      travelers: 2,
      message: "Looking for a beach honeymoon plan with airport transfers.",
      status: "new",
      paymentStatus: "pending",
      amount: 40000,
      amountSource: "demo",
      razorpayOrderId: "demo_order_bali",
      razorpayPaymentId: "",
      createdAt: dateOffset(-1),
      updatedAt: dateOffset(-1),
    },
    {
      _id: "demo-booking-002",
      id: "demo-booking-002",
      name: "Vikram Kumar",
      email: "vikram.demo@example.com",
      phone: "+91 97••••4321",
      package: "Goa Beach Escape",
      destination: "Goa, India",
      travelDate: dateOffset(18),
      travelers: 4,
      message: "Friends trip. Need budget hotel and local sightseeing.",
      status: "contacted",
      paymentStatus: "paid",
      amount: 18000,
      amountSource: "demo",
      razorpayOrderId: "demo_order_goa",
      razorpayPaymentId: "demo_paid_goa",
      createdAt: dateOffset(-3),
      updatedAt: dateOffset(-2),
    },
    {
      _id: "demo-booking-003",
      id: "demo-booking-003",
      name: "Priya Mehta",
      email: "priya.demo@example.com",
      phone: "+91 96••••6789",
      package: "Manali Adventure Holiday",
      destination: "Manali, India",
      travelDate: dateOffset(44),
      travelers: 3,
      message: "Family mountain holiday with safe transport and guided activities.",
      status: "confirmed",
      paymentStatus: "paid",
      amount: 24000,
      amountSource: "demo",
      razorpayOrderId: "demo_order_manali",
      razorpayPaymentId: "demo_paid_manali",
      createdAt: dateOffset(-8),
      updatedAt: dateOffset(-5),
    },
    {
      _id: "demo-booking-004",
      id: "demo-booking-004",
      name: "Rahul Sharma",
      email: "rahul.demo@example.com",
      phone: "+91 95••••2468",
      package: "Dubai Desert Luxury",
      destination: "Dubai, UAE",
      travelDate: dateOffset(60),
      travelers: 5,
      message: "Luxury family package with desert safari and city tour.",
      status: "closed",
      paymentStatus: "failed",
      amount: 58000,
      amountSource: "demo",
      razorpayOrderId: "demo_order_dubai",
      razorpayPaymentId: "",
      createdAt: dateOffset(-15),
      updatedAt: dateOffset(-12),
    },
  ];
}

function filterDemoBookings(bookings, query) {
  const filter = buildAdminBookingQuery(query || {});
  return bookings.filter(function (booking) {
    const matchesStatus = !filter.status || booking.status === filter.status;
    const matchesPayment =
      !filter.paymentStatus || booking.paymentStatus === filter.paymentStatus;

    return matchesStatus && matchesPayment;
  });
}

function buildDemoStats(bookings) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  return {
    total: bookings.length,
    new: bookings.filter((booking) => booking.status === "new").length,
    confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
    thisWeek: bookings.filter((booking) => new Date(booking.createdAt) >= weekAgo).length,
    paidThisWeek: bookings.filter(
      (booking) =>
        booking.paymentStatus === "paid" && new Date(booking.createdAt) >= weekAgo
    ).length,
    revenueThisMonth: bookings
      .filter(
        (booking) =>
          booking.paymentStatus === "paid" && new Date(booking.createdAt) >= monthStart
      )
      .reduce((sum, booking) => sum + Number(booking.amount || 0), 0),
  };
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
    const password = String(req.body.password || req.body.pin || "");

    if (!submittedEmail || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and admin PIN are required.",
      });
    }

    if (isPublicDemoLogin(submittedEmail, password)) {
      return res.json({
        success: true,
        token: signAdminToken({
          _id: "demo-admin",
          email: getPublicDemoEmail(),
          role: "demo",
        }),
        admin: {
          email: getPublicDemoEmail(),
          role: "demo",
        },
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
    if (req.admin && req.admin.role === "demo") {
      const bookings = filterDemoBookings(getDemoBookings(), req.query);

      return res.json({
        success: true,
        demoMode: true,
        bookings,
        stats: buildDemoStats(getDemoBookings()),
        statuses: allowedStatuses,
        paymentStatuses: ["pending", "paid", "failed"],
      });
    }

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
    if (req.admin && req.admin.role === "demo") {
      return res.status(403).json({
        success: false,
        error: "Demo mode is read-only. Use your private admin PIN for full access.",
      });
    }

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
    if (req.admin && req.admin.role === "demo") {
      return res.status(403).json({
        success: false,
        error: "Demo mode is read-only. Use your private admin PIN for full access.",
      });
    }

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
