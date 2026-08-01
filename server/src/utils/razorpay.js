const crypto = require("crypto");
const Razorpay = require("razorpay");

let razorpayClient = null;

function getRazorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID || "";
}

function getRazorpaySecret() {
  return process.env.RAZORPAY_KEY_SECRET || "";
}

function getRazorpayClient() {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpaySecret();

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayClient;
}

function safeCompareHex(left, right) {
  const leftBuffer = Buffer.from(String(left || ""), "hex");
  const rightBuffer = Buffer.from(String(right || ""), "hex");

  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyPaymentSignature(orderId, paymentId, signature) {
  const generatedSignature = crypto
    .createHmac("sha256", getRazorpaySecret())
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return safeCompareHex(generatedSignature, signature);
}

function verifyWebhookSignature(rawBody, signature) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET is missing.");
  }

  const generatedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return safeCompareHex(generatedSignature, signature);
}

async function createRazorpayOrder(booking) {
  const amountInPaise = Math.round(Number(booking.amount || 0) * 100);

  if (!amountInPaise || amountInPaise < 100) {
    throw new Error("Booking amount is invalid for payment.");
  }

  const order = await getRazorpayClient().orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: String(booking._id),
    notes: {
      bookingId: String(booking._id),
      package: booking.package,
      destination: booking.destination,
    },
  });

  return {
    key: getRazorpayKeyId(),
    orderId: order.id,
    amount: order.amount,
    currency: order.currency || "INR",
  };
}

function isRazorpayAuthError(error) {
  const description =
    error && error.error && error.error.description
      ? String(error.error.description)
      : String(error && error.message ? error.message : "");

  return Number(error && error.statusCode) === 401 || /authentication failed/i.test(description);
}

module.exports = {
  createRazorpayOrder,
  getRazorpayKeyId,
  isRazorpayAuthError,
  verifyPaymentSignature,
  verifyWebhookSignature,
};
