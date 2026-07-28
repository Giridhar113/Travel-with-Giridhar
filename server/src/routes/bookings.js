const express = require("express");
const rateLimit = require("express-rate-limit");
const Booking = require("../models/Booking");
const { validateBookingInput } = require("../utils/validators");
const { resolveBookingAmount } = require("../utils/packagePricing");
const { createRazorpayOrder } = require("../utils/razorpay");
const { paymentResponse } = require("./payments");

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
          package: "Choose a listed package so payment amount can be calculated safely.",
        },
      });
    }

    const booking = await Booking.create({
      ...value,
      amount: pricing.amount,
      amountSource: pricing.source,
      paymentStatus: "pending",
    });

    let payment;

    try {
      payment = await createRazorpayOrder(booking);
    } catch (paymentError) {
      booking.paymentStatus = "failed";
      await booking.save();

      return res.status(502).json({
        success: false,
        error: "Booking was saved, but payment could not start. Please retry payment.",
        bookingId: booking._id,
        paymentRetryAvailable: true,
      });
    }

    return res.status(201).json({
      message: "Booking request received.",
      ...paymentResponse(booking, payment),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
