import { connectDB } from "@/lib/db";
import Destination from "@/models/Destination";
import Guide from "@/models/Guide";
import { ok, fail } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

export async function GET(_req, { params }) {
  try {
    if (!isValidObjectId(params.id)) return fail("Invalid destination id.");
    await connectDB();
    const destination = await Destination.findById(params.id);
    if (!destination) return fail("Destination not found.", 404);

    const guides = await Guide.find({
      status: "approved",
      location: { $regex: destination.name, $options: "i" },
    }).populate("user", "name avatar");

    return ok({ destination, guides });
  } catch (err) {
    return fail(err.message || "Failed to load destination.", 500);
  }
}
