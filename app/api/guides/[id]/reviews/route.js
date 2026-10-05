import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { ok, fail, serverError } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  try {
    if (!isValidObjectId(params.id)) return fail("Invalid guide id.", 400);
    await connectDB();
    const reviews = await Review.find({ guide: params.id, isHidden: false })
      .populate("tourist", "name avatar")
      .sort({ createdAt: -1 });
    return ok({ reviews });
  } catch (err) {
    return serverError(err, "Failed to load reviews.");
  }
}
