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

    await connectDB();
    const booking = await Booking.findById(params.id);
    if (!booking) return fail("Booking not found.", 404);

    const guide = await Guide.findById(booking.guide);
    const isTourist = booking.tourist.toString() === user.id;
    const isGuide = guide && guide.user.toString() === user.id;
    if (!isTourist && !isGuide && user.role !== "ADMIN") return fail("Not authorized.", 403);

    if (!["pending", "confirmed"].includes(booking.status)) {
      return fail("This booking can no longer be cancelled.", 400);
    }

    booking.status = "cancelled";
    await booking.save();

    const notifyUser = isTourist ? guide?.user : booking.tourist;
    if (notifyUser) {
      await createNotification({
        user: notifyUser,
        type: "booking_cancelled",
        title: "Booking cancelled",
        message: "A booking has been cancelled.",
        link: `/dashboard/bookings/${booking._id}`,
      });
    }

    return ok({ booking });
  } catch (err) {
    return serverError(err, "Failed to cancel booking.");
  }
}
