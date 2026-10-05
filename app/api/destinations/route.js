import { connectDB } from "@/lib/db";
import Destination from "@/models/Destination";
import { ok, fail, serverError } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const destinations = await Destination.find().sort({ isFeatured: -1, name: 1 });
    return ok({ destinations });
  } catch (err) {
    return serverError(err, "Failed to load destinations.");
  }
}
