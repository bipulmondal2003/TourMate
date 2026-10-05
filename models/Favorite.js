import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide", required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ tourist: 1, guide: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
