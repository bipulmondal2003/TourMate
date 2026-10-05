import { connectDB } from "@/lib/db";
import TourCategory from "@/models/TourCategory";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, fail } from "@/lib/apiResponse";

export async function GET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const categories = await TourCategory.find().sort({ name: 1 });
  return ok({ categories });
}

export async function POST(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const body = await req.json();
  if (!body.name) return fail("Category name is required.");
  const category = await TourCategory.create(body);
  return ok({ category }, 201);
}

export async function DELETE(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await TourCategory.findByIdAndDelete(id);
  return ok({ message: "Category deleted." });
}
