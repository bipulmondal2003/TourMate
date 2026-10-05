import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

// Admin moderation: hide/unhide or delete a review
async function handlePATCH(req, { params }) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;
  if (user.role !== "ADMIN") return fail("Admin access required.", 403);

  await connectDB();
  const { isHidden } = await req.json();
  const review = await Review.findByIdAndUpdate(params.id, { isHidden }, { new: true });
  if (!review) return fail("Review not found.", 404);
  return ok({ review });
}

async function handleDELETE(_req, { params }) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;
  if (user.role !== "ADMIN") return fail("Admin access required.", 403);

  await connectDB();
  const review = await Review.findByIdAndDelete(params.id);
  if (!review) return fail("Review not found.", 404);
  return ok({ message: "Review deleted." });
}

export const PATCH = withErrorHandling(handlePATCH, "PATCH /api/reviews/[id]");
export const DELETE = withErrorHandling(handleDELETE, "DELETE /api/reviews/[id]");
