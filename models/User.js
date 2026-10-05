import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["TOURIST", "GUIDE", "ADMIN"], default: "TOURIST" },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    isSuspended: { type: Boolean, default: false },
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
