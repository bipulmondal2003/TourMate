import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Guide from "@/models/Guide";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, serverError } from "@/lib/apiResponse";
import { createNotification } from "@/services/notificationService";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function POST(_req, { params }) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;
    if (user.role !== "GUIDE") return fail("Only guides can accept bookings.", 403);

    await connectDB();
    const booking = await Booking.findById(params.id);
    if (!booking) return fail("Booking not found.", 404);

    const guide = await Guide.findById(booking.guide);
    if (!guide || guide.user.toString() !== user.id) return fail("Not authorized.", 403);
    if (booking.status !== "pending") return fail("Only pending bookings can be accepted.", 400);

    booking.status = "confirmed";
    await booking.save();
    guide.totalBookings += 1;
    await guide.save();

    await createNotification({
      user: booking.tourist,
      type: "booking_accepted",
      title: "Booking confirmed!",
      message: "Your guide has accepted your booking request.",
      link: `/dashboard/bookings/${booking._id}`,
    });

    return ok({ booking });
  } catch (err) {
    return serverError(err, "Failed to accept booking.");
  }
}
