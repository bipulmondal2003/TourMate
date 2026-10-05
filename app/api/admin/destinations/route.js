import { connectDB } from "@/lib/db";
import Destination from "@/models/Destination";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, fail, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const destinations = await Destination.find().sort({ name: 1 });
  return ok({ destinations });
}

async function handlePOST(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const body = await req.json();
  if (!body.name) return fail("Destination name is required.");
  const destination = await Destination.create(body);
  return ok({ destination }, 201);
}

async function handlePATCH(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { id, ...updates } = await req.json();
  const destination = await Destination.findByIdAndUpdate(id, updates, { new: true });
  if (!destination) return fail("Destination not found.", 404);
  return ok({ destination });
}

async function handleDELETE(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await Destination.findByIdAndDelete(id);
  return ok({ message: "Destination deleted." });
}

export const GET = withErrorHandling(handleGET, "GET /api/admin/destinations");
export const POST = withErrorHandling(handlePOST, "POST /api/admin/destinations");
export const PATCH = withErrorHandling(handlePATCH, "PATCH /api/admin/destinations");
export const DELETE = withErrorHandling(handleDELETE, "DELETE /api/admin/destinations");
