import { connectDB } from "@/lib/db";
import TourCategory from "@/models/TourCategory";
import { ok, fail, serverError } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const categories = await TourCategory.find().sort({ name: 1 });
    return ok({ categories });
  } catch (err) {
    return serverError(err, "Failed to load categories.");
  }
}
