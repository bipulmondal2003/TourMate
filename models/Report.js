import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["user", "guide", "review", "booking"], required: true },
    reason: { type: String, required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ["open", "resolved", "dismissed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
