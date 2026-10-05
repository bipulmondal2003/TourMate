import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { requireAdmin } from "@/lib/adminGuard";
import { ok } from "@/lib/apiResponse";

export async function GET(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const query = status ? { status } : {};

  const bookings = await Booking.find(query)
    .populate({ path: "guide", populate: { path: "user", select: "name avatar" } })
    .populate("tourist", "name avatar email")
    .sort({ createdAt: -1 });
  return ok({ bookings });
}
