import { connectDB } from "@/lib/db";
import Destination from "@/models/Destination";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, fail } from "@/lib/apiResponse";

export async function GET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const destinations = await Destination.find().sort({ name: 1 });
  return ok({ destinations });
}

export async function POST(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const body = await req.json();
  if (!body.name) return fail("Destination name is required.");
  const destination = await Destination.create(body);
  return ok({ destination }, 201);
}

export async function PATCH(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { id, ...updates } = await req.json();
  const destination = await Destination.findByIdAndUpdate(id, updates, { new: true });
  if (!destination) return fail("Destination not found.", 404);
  return ok({ destination });
}

export async function DELETE(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await Destination.findByIdAndDelete(id);
  return ok({ message: "Destination deleted." });
}
