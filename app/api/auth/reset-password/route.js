import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { ok, fail } from "@/lib/apiResponse";

export async function POST(req) {
  await connectDB();
  const { token, password } = await req.json();
  if (!token || !password) return fail("Token and new password are required.");
  if (password.length < 6) return fail("Password must be at least 6 characters.");

  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } }).select(
    "+resetToken +resetTokenExpiry"
  );
  if (!user) return fail("This reset link is invalid or has expired.", 400);

  user.password = await hashPassword(password);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return ok({ message: "Password reset successfully. You can now log in." });
}
