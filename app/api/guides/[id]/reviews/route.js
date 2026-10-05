import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { ok, fail } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

export async function GET(_req, { params }) {
  try {
    if (!isValidObjectId(params.id)) return fail("Invalid guide id.", 400);
    await connectDB();
    const reviews = await Review.find({ guide: params.id, isHidden: false })
      .populate("tourist", "name avatar")
      .sort({ createdAt: -1 });
    return ok({ reviews });
  } catch (err) {
    return fail(err.message || "Failed to load reviews.", 500);
  }
}
