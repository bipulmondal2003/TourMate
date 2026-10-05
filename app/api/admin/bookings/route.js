import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET(req) {
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

export const GET = withErrorHandling(handleGET, "GET /api/admin/bookings");
