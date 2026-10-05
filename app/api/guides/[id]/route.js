import { connectDB } from "@/lib/db";
import Guide from "@/models/Guide";
import User from "@/models/User";
import { ok, fail, serverError } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  try {
    if (!isValidObjectId(params.id)) return fail("Invalid guide id.", 400);
    await connectDB();
    const guide = await Guide.findById(params.id).populate("user", "name email avatar phone");
    if (!guide) return fail("Guide not found.", 404);
    return ok({ guide });
  } catch (err) {
    return serverError(err, "Failed to load guide.");
  }
}
