const express = require("express");
const rateLimit = require("express-rate-limit");
const { createBooking, findBookingsByContact } = require("../models/Booking");
const { validateBookingInput } = require("../utils/validators");
const { resolveBookingAmount } = require("../utils/packagePricing");

const router = express.Router();

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many booking requests. Please wait a few minutes and try again.",
  },
});

const lookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many status checks. Please wait a few minutes and try again.",
  },
});

function buildWhatsAppBookingMessage(booking) {
  return [
    "Hi Travel with Giridhar, I submitted a booking request.",
    "",
    `Booking ID: ${booking._id}`,
    `Name: ${booking.name}`,
    `Destination: ${booking.destination}`,
    `Package: ${booking.package}`,
    `Travel date: ${booking.travelDate}`,
    `Travelers: ${booking.travelers}`,
    `Preferred contact: ${booking.preferredContact || "WhatsApp"}`,
    "",
    "Please confirm availability and next steps.",
  ].join("\n");
}

function buildWhatsAppUrl(message) {
  const number = process.env.WHATSAPP_NUMBER || "918179721034";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function clean(value) {
  return String(value || "").trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));
}

function publicBookingStatus(booking) {
  return {
    id: booking._id,
    bookingId: booking._id,
    destination: booking.destination,
    package: booking.package,
    travelDate: booking.travelDate,
    travelers: booking.travelers,
    status: booking.status,
    amount: booking.amount,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

router.post("/lookup", lookupLimiter, async (req, res, next) => {
  try {
    const email = clean(req.body.email).toLowerCase();
    const phone = clean(req.body.phone);
    const phoneDigits = phone.replace(/\D/g, "");
    const errors = {};

    if (!isValidEmail(email)) {
      errors.email = "Enter the email used for booking.";
    }

    if (phoneDigits.length < 7) {
      errors.phone = "Enter the phone number used for booking.";
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({
        success: false,
        error: "Please enter the booking email and phone number.",
        errors,
      });
    }

    const bookings = await findBookingsByContact({ email, phone });

    return res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map(publicBookingStatus),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", bookingLimiter, async (req, res, next) => {
  try {
    const { errors, value } = validateBookingInput(req.body);

    if (Object.keys(errors).length) {
      return res.status(400).json({
        success: false,
        error: "Please fix the highlighted booking details.",
        errors,
      });
    }

    const pricing = resolveBookingAmount(value.package, value.destination);

    if (!pricing) {
      return res.status(400).json({
        success: false,
        error: "We could not match this package to a secure price. Please choose a listed package.",
        errors: {
          package: "Choose a listed package so the quote amount can be calculated safely.",
        },
      });
    }

    let booking = await createBooking({
      ...value,
      amount: pricing.amount,
      amountSource: pricing.source,
      contactChannel: "whatsapp",
    });

    const whatsappMessage = buildWhatsAppBookingMessage(booking);

    return res.status(201).json({
      success: true,
      message: "Booking request received.",
      bookingId: booking._id,
      booking,
      whatsappRequired: true,
      whatsappUrl: buildWhatsAppUrl(whatsappMessage),
      whatsappMessage,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
