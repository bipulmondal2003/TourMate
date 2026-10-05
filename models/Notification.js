import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "new_booking",
        "booking_accepted",
        "booking_rejected",
        "booking_cancelled",
        "payment_successful",
        "payment_failed",
        "tour_reminder",
        "new_message",
        "new_review",
        "guide_approved",
        "guide_rejected",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
