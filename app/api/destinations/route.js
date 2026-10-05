import { connectDB } from "@/lib/db";
import Destination from "@/models/Destination";
import { ok, fail } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();
    const destinations = await Destination.find().sort({ isFeatured: -1, name: 1 });
    return ok({ destinations });
  } catch (err) {
    return fail(err.message || "Failed to load destinations.", 500);
  }
}
