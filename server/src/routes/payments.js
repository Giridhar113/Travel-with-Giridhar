const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
} = require("../utils/razorpay");

const router = express.Router();

function paymentResponse(booking, payment) {
  return {
    success: true,
    bookingId: booking._id,
    paymentRequired: true,
    payment: {
      ...payment,
      bookingId: booking._id,
      amountRupees: booking.amount,
      package: booking.package,
      destination: booking.destination,
      customerName: booking.name,
      customerEmail: booking.email,
      customerPhone: booking.phone,
    },
  };
}

async function findBookingForPayment(bookingId) {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return null;
  }

  return Booking.findById(bookingId);
}

router.post("/retry", async (req, res, next) => {
  try {
    const booking = await findBookingForPayment(req.body.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found.",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(409).json({
        success: false,
        error: "This booking is already paid.",
      });
    }

    const payment = await createRazorpayOrder(booking);
    return res.json(paymentResponse(booking, payment));
  } catch (error) {
    return next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const {
      bookingId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body;

    const booking =
      (bookingId && (await findBookingForPayment(bookingId))) ||
      (razorpayOrderId && (await Booking.findOne({ razorpayOrderId })));

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found for this payment.",
      });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      booking.paymentStatus = "failed";
      await booking.save();

      return res.status(400).json({
        success: false,
        error: "Missing Razorpay payment verification fields.",
      });
    }

    const orderMatches = booking.razorpayOrderId === razorpayOrderId;
    const signatureValid =
      orderMatches && verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!signatureValid) {
      booking.paymentStatus = "failed";
      await booking.save();

      return res.status(400).json({
        success: false,
        error: "Payment verification failed.",
      });
    }

    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpayPaymentId;
    await booking.save();

    return res.json({
      success: true,
      message: "Payment verified.",
      bookingId: booking._id,
      paymentStatus: booking.paymentStatus,
    });
  } catch (error) {
    return next(error);
  }
});

async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.body;

    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return res.status(400).json({
        success: false,
        error: "Invalid webhook signature.",
      });
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    const payment = event.payload && event.payload.payment && event.payload.payment.entity;

    if (!payment || !payment.order_id) {
      return res.json({ success: true, received: true });
    }

    const booking = await Booking.findOne({ razorpayOrderId: payment.order_id });

    if (!booking) {
      return res.json({ success: true, received: true });
    }

    if (event.event === "payment.captured") {
      booking.paymentStatus = "paid";
      booking.razorpayPaymentId = payment.id;
      await booking.save();
    }

    if (event.event === "payment.failed") {
      booking.paymentStatus = "failed";
      booking.razorpayPaymentId = payment.id || booking.razorpayPaymentId;
      await booking.save();
    }

    return res.json({ success: true, received: true });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  router,
  handleWebhook,
  paymentResponse,
};
