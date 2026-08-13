const express = require("express");
const rateLimit = require("express-rate-limit");
const { createBooking } = require("../models/Booking");
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
