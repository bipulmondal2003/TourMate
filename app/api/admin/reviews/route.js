import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { requireAdmin } from "@/lib/adminGuard";
import { ok } from "@/lib/apiResponse";

export async function GET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const reviews = await Review.find()
    .populate("tourist", "name avatar")
    .populate({ path: "guide", populate: { path: "user", select: "name" } })
    .sort({ createdAt: -1 });
  return ok({ reviews });
}
