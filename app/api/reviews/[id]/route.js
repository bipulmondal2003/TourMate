import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";

// Admin moderation: hide/unhide or delete a review
export async function PATCH(req, { params }) {
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

export async function DELETE(_req, { params }) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;
  if (user.role !== "ADMIN") return fail("Admin access required.", 403);

  await connectDB();
  const review = await Review.findByIdAndDelete(params.id);
  if (!review) return fail("Review not found.", 404);
  return ok({ message: "Review deleted." });
}
