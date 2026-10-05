import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema(
  {
    guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide", required: true },
    date: { type: Date, required: true },
    isAvailable: { type: Boolean, default: true },
    slots: [{ type: String }], // e.g. ["09:00", "13:00", "16:00"]
  },
  { timestamps: true }
);

AvailabilitySchema.index({ guide: 1, date: 1 }, { unique: true });

export default mongoose.models.Availability || mongoose.model("Availability", AvailabilitySchema);
