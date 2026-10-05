import { connectDB } from "@/lib/db";
import Availability from "@/models/Availability";
import Guide from "@/models/Guide";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, serverError } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    if (!isValidObjectId(params.id)) return fail("Invalid guide id.", 400);
    await connectDB();
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from") ? new Date(searchParams.get("from")) : new Date();

    const slots = await Availability.find({ guide: params.id, date: { $gte: from } }).sort({ date: 1 });
    return ok({ availability: slots });
  } catch (err) {
    return serverError(err, "Failed to load availability.");
  }
}

// Guide sets/updates their own availability for a date
export async function POST(req, { params }) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;

    await connectDB();
    const guide = await Guide.findById(params.id);
    if (!guide) return fail("Guide not found.", 404);
    if (guide.user.toString() !== user.id) return fail("You can only manage your own availability.", 403);

    const { date, isAvailable, slots } = await req.json();
    if (!date) return fail("Date is required.");

    const record = await Availability.findOneAndUpdate(
      { guide: params.id, date: new Date(date) },
      { isAvailable, slots: slots || [] },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return ok({ availability: record });
  } catch (err) {
    return serverError(err, "Failed to update availability.");
  }
}
