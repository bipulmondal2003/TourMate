import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    state: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    guideCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Destination || mongoose.model("Destination", DestinationSchema);
