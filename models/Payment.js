import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    provider: { type: String, enum: ["razorpay", "demo"], default: "demo" },
    orderId: { type: String, default: "" },
    paymentId: { type: String, default: "" },
    signature: { type: String, default: "" },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
