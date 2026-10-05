import { connectDB } from "@/lib/db";
import Guide from "@/models/Guide";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET() {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;
  if (user.role !== "GUIDE") return fail("Only guides can access this endpoint.", 403);

  await connectDB();
  const guide = await Guide.findOne({ user: user.id }).populate("user", "name email avatar phone");
  if (!guide) return fail("Guide profile not found.", 404);
  return ok({ guide });
}

export const GET = withErrorHandling(handleGET, "GET /api/guides/me");
