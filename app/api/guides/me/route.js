import { connectDB } from "@/lib/db";
import Guide from "@/models/Guide";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";

export async function GET() {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;
  if (user.role !== "GUIDE") return fail("Only guides can access this endpoint.", 403);

  await connectDB();
  const guide = await Guide.findOne({ user: user.id }).populate("user", "name email avatar phone");
  if (!guide) return fail("Guide profile not found.", 404);
  return ok({ guide });
}
