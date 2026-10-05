import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // "HH:mm"
    durationHours: { type: Number, required: true, min: 1 },
    numberOfPeople: { type: Number, required: true, min: 1 },
    category: { type: String, default: "General" },
    totalPrice: { type: Number, required: true }, // ALWAYS server-calculated
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

BookingSchema.index({ guide: 1, date: 1 });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
