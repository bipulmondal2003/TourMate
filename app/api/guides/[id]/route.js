import { connectDB } from "@/lib/db";
import Guide from "@/models/Guide";
import { ok, fail } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

export async function GET(_req, { params }) {
  try {
    if (!isValidObjectId(params.id)) return fail("Invalid guide id.", 400);
    await connectDB();
    const guide = await Guide.findById(params.id).populate("user", "name email avatar phone");
    if (!guide) return fail("Guide not found.", 404);
    return ok({ guide });
  } catch (err) {
    return fail(err.message || "Failed to load guide.", 500);
  }
}
