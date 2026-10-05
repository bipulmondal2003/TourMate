import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const reviews = await Review.find()
    .populate("tourist", "name avatar")
    .populate({ path: "guide", populate: { path: "user", select: "name" } })
    .sort({ createdAt: -1 });
  return ok({ reviews });
}

export const GET = withErrorHandling(handleGET, "GET /api/admin/reviews");
