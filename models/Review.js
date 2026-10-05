import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ booking: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
