import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ok, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

// Demo flow: generates a reset token and returns it directly in the
// response instead of emailing it, since no email provider is configured.
async function handlePOST(req) {
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

export const POST = withErrorHandling(handlePOST, "POST /api/auth/forgot-password");
