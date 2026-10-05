import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail } from "@/lib/apiResponse";

export async function GET() {
  try {
    const session = getCurrentUserFromCookies();
    if (!session) return fail("Not authenticated.", 401);

    await connectDB();
    const user = await User.findById(session.id);
    if (!user || user.isSuspended) return fail("Not authenticated.", 401);

    return ok({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    return fail(err.message || "Failed to load session.", 500);
  }
}
