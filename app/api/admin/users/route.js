import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, fail, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 });
  return ok({ users });
}

async function handlePATCH(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { userId, isSuspended } = await req.json();
  const user = await User.findByIdAndUpdate(userId, { isSuspended }, { new: true });
  if (!user) return fail("User not found.", 404);
  return ok({ user });
}

export const GET = withErrorHandling(handleGET, "GET /api/admin/users");
export const PATCH = withErrorHandling(handlePATCH, "PATCH /api/admin/users");
