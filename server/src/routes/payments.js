const express = require("express");
const {
  findBookingById,
  findBookingByRazorpayOrderId,
  updateBooking,
} = require("../models/Booking");
const {
  createRazorpayOrder,
  isRazorpayAuthError,
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
  if (!bookingId) {
    return null;
  }

  return findBookingById(bookingId);
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

    let payment;

    try {
      payment = await createRazorpayOrder(booking);
    } catch (paymentError) {
      if (isRazorpayAuthError(paymentError)) {
        console.error("Razorpay retry failed:", {
          statusCode: paymentError && paymentError.statusCode,
          code: paymentError && paymentError.error && paymentError.error.code,
          description: paymentError && paymentError.error && paymentError.error.description,
        });

        return res.status(503).json({
          success: false,
          error:
            "Payment gateway needs a valid Razorpay key pair. Please WhatsApp us to complete payment.",
          bookingId: booking._id,
          paymentSetupRequired: true,
        });
      }

      throw paymentError;
    }

    const updatedBooking = await updateBooking(booking._id, {
      razorpayOrderId: payment.orderId,
      paymentStatus: "pending",
    });
    return res.json(paymentResponse(updatedBooking || booking, payment));
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
      (razorpayOrderId && (await findBookingByRazorpayOrderId(razorpayOrderId)));

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found for this payment.",
      });
    }

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      await updateBooking(booking._id, { paymentStatus: "failed" });

      return res.status(400).json({
        success: false,
        error: "Missing Razorpay payment verification fields.",
      });
    }

    const orderMatches = booking.razorpayOrderId === razorpayOrderId;
    const signatureValid =
      orderMatches && verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!signatureValid) {
      await updateBooking(booking._id, { paymentStatus: "failed" });

      return res.status(400).json({
        success: false,
        error: "Payment verification failed.",
      });
    }

    const updatedBooking = await updateBooking(booking._id, {
      paymentStatus: "paid",
      razorpayPaymentId,
    });

    return res.json({
      success: true,
      message: "Payment verified.",
      bookingId: booking._id,
      paymentStatus: updatedBooking ? updatedBooking.paymentStatus : "paid",
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

    const booking = await findBookingByRazorpayOrderId(payment.order_id);

    if (!booking) {
      return res.json({ success: true, received: true });
    }

    if (event.event === "payment.captured") {
      await updateBooking(booking._id, {
        paymentStatus: "paid",
        razorpayPaymentId: payment.id,
      });
    }

    if (event.event === "payment.failed") {
      await updateBooking(booking._id, {
        paymentStatus: "failed",
        razorpayPaymentId: payment.id || booking.razorpayPaymentId,
      });
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
