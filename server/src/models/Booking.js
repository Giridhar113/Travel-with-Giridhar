const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    package: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    travelers: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    travelType: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    approxBudget: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    emiNeeded: {
      type: String,
      enum: ["Yes", "No", ""],
      default: "",
    },
    travelersType: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    preferredContact: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountSource: {
      type: String,
      trim: true,
      maxlength: 180,
      default: "",
    },
    razorpayOrderId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "closed"],
      default: "new",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
