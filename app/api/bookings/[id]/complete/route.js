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
    if (user.role !== "GUIDE") return fail("Only guides can mark bookings as completed.", 403);

    await connectDB();
    const booking = await Booking.findById(params.id);
    if (!booking) return fail("Booking not found.", 404);

    const guide = await Guide.findById(booking.guide);
    if (!guide || guide.user.toString() !== user.id) return fail("Not authorized.", 403);
    if (booking.status !== "confirmed") return fail("Only confirmed bookings can be completed.", 400);

    booking.status = "completed";
    await booking.save();

    if (booking.paymentStatus === "paid") {
      guide.totalEarnings += booking.totalPrice;
      await guide.save();
    }

    await createNotification({
      user: booking.tourist,
      type: "tour_reminder",
      title: "Tour completed",
      message: "Your tour has been marked as completed. Leave a review!",
      link: `/dashboard/bookings/${booking._id}`,
    });

    return ok({ booking });
  } catch (err) {
    return fail(err.message || "Failed to complete booking.", 500);
  }
}
