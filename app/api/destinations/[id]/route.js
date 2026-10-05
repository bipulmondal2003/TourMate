import { connectDB } from "@/lib/db";
import Destination from "@/models/Destination";
import Guide from "@/models/Guide";
import { ok, fail, serverError } from "@/lib/apiResponse";
import { isValidObjectId, escapeRegex } from "@/utils/validators";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  try {
    if (!isValidObjectId(params.id)) return fail("Invalid destination id.");
    await connectDB();
    const destination = await Destination.findById(params.id);
    if (!destination) return fail("Destination not found.", 404);

    const guides = await Guide.find({
      status: "approved",
      location: { $regex: escapeRegex(destination.name), $options: "i" },
    }).populate("user", "name avatar");

    return ok({ destination, guides });
  } catch (err) {
    return serverError(err, "Failed to load destination.");
  }
}
