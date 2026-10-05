import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, fail } from "@/lib/apiResponse";

export async function GET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 });
  return ok({ users });
}

export async function PATCH(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { userId, isSuspended } = await req.json();
  const user = await User.findByIdAndUpdate(userId, { isSuspended }, { new: true });
  if (!user) return fail("User not found.", 404);
  return ok({ user });
}
