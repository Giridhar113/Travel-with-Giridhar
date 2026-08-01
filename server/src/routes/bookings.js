const express = require("express");
const rateLimit = require("express-rate-limit");
const { createBooking, updateBooking } = require("../models/Booking");
const { validateBookingInput } = require("../utils/validators");
const { resolveBookingAmount } = require("../utils/packagePricing");
const { createRazorpayOrder, isRazorpayAuthError } = require("../utils/razorpay");
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

    let booking = await createBooking({
      ...value,
      amount: pricing.amount,
      amountSource: pricing.source,
      paymentStatus: "pending",
    });

    let payment;

    try {
      payment = await createRazorpayOrder(booking);
      booking = await updateBooking(booking._id, {
        razorpayOrderId: payment.orderId,
        paymentStatus: "pending",
      });
    } catch (paymentError) {
      const paymentSetupRequired = isRazorpayAuthError(paymentError);

      console.error("Razorpay order creation failed:", {
        statusCode: paymentError && paymentError.statusCode,
        code: paymentError && paymentError.error && paymentError.error.code,
        description: paymentError && paymentError.error && paymentError.error.description,
      });

      booking = await updateBooking(booking._id, {
        paymentStatus: paymentSetupRequired ? "pending" : "failed",
      });

      return res.status(paymentSetupRequired ? 503 : 502).json({
        success: false,
        error: paymentSetupRequired
          ? "Booking was saved, but the payment gateway needs a valid Razorpay key pair. Please WhatsApp us to complete payment."
          : "Booking was saved, but payment could not start. Please retry payment.",
        bookingId: booking && booking._id,
        paymentRetryAvailable: !paymentSetupRequired,
        paymentSetupRequired,
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
