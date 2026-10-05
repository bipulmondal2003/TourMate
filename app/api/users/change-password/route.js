import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUserFromCookies, verifyPassword, hashPassword } from "@/lib/auth";
import { ok, fail, requireAuth, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handlePOST(req) {
  const session = getCurrentUserFromCookies();
  const authError = requireAuth(session);
  if (authError) return authError;

  await connectDB();
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return fail("Current and new password are required.");
  if (newPassword.length < 6) return fail("New password must be at least 6 characters.");

  const user = await User.findById(session.id).select("+password");
  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) return fail("Current password is incorrect.", 401);

  user.password = await hashPassword(newPassword);
  await user.save();

  return ok({ message: "Password changed successfully." });
}

export const POST = withErrorHandling(handlePOST, "POST /api/users/change-password");
