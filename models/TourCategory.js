import mongoose from "mongoose";

const TourCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: "Compass" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.TourCategory || mongoose.model("TourCategory", TourCategorySchema);
