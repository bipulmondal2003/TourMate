import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok } from "@/lib/apiResponse";

// Demo flow: generates a reset token and returns it directly in the
// response instead of emailing it, since no email provider is configured.
export async function POST(req) {
  await connectDB();
  const { email } = await req.json();

  const user = await User.findOne({ email: email?.toLowerCase() });
  // Always respond success (don't leak which emails exist)
  if (!user) return ok({ message: "If that email exists, a reset link has been generated." });

  const token = crypto.randomBytes(20).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 30);
  await user.save();

  return ok({
    message: "Demo mode: no email service is configured, so here is your reset token directly.",
    demoResetToken: token,
  });
}
