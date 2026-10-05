import mongoose from "mongoose";

const GuideSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, default: "" },
    location: { type: String, required: true },
    coverImage: { type: String, default: "" },
    experience: { type: Number, default: 0 }, // years
    languages: [{ type: String }],
    specialties: [{ type: String }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "TourCategory" }],
    pricePerDay: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "suspended"], default: "pending" },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GuideSchema.index({ location: "text", specialties: "text" });

export default mongoose.models.Guide || mongoose.model("Guide", GuideSchema);
