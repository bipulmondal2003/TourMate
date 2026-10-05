import { connectDB } from "@/lib/db";
import TourCategory from "@/models/TourCategory";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, fail, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const categories = await TourCategory.find().sort({ name: 1 });
  return ok({ categories });
}

async function handlePOST(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const body = await req.json();
  if (!body.name) return fail("Category name is required.");
  const category = await TourCategory.create(body);
  return ok({ category }, 201);
}

async function handleDELETE(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await TourCategory.findByIdAndDelete(id);
  return ok({ message: "Category deleted." });
}

export const GET = withErrorHandling(handleGET, "GET /api/admin/categories");
export const POST = withErrorHandling(handlePOST, "POST /api/admin/categories");
export const DELETE = withErrorHandling(handleDELETE, "DELETE /api/admin/categories");
