import { connectDB } from "@/lib/db";
import TourCategory from "@/models/TourCategory";
import { ok, fail } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();
    const categories = await TourCategory.find().sort({ name: 1 });
    return ok({ categories });
  } catch (err) {
    return fail(err.message || "Failed to load categories.", 500);
  }
}
