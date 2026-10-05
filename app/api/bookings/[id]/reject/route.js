import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Guide from "@/models/Guide";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";
import { createNotification } from "@/services/notificationService";

export async function POST(_req, { params }) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;
    if (user.role !== "GUIDE") return fail("Only guides can reject bookings.", 403);

    await connectDB();
    const booking = await Booking.findById(params.id);
    if (!booking) return fail("Booking not found.", 404);

    const guide = await Guide.findById(booking.guide);
    if (!guide || guide.user.toString() !== user.id) return fail("Not authorized.", 403);
    if (booking.status !== "pending") return fail("Only pending bookings can be rejected.", 400);

    booking.status = "rejected";
    await booking.save();

    await createNotification({
      user: booking.tourist,
      type: "booking_rejected",
      title: "Booking declined",
      message: "Unfortunately, your guide is unable to accept this booking.",
      link: `/dashboard/bookings/${booking._id}`,
    });

    return ok({ booking });
  } catch (err) {
    return fail(err.message || "Failed to reject booking.", 500);
  }
}
