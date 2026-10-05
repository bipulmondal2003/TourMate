import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import Guide from "@/models/Guide";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, serverError } from "@/lib/apiResponse";
import { createNotification } from "@/services/notificationService";
import { isValidObjectId } from "@/utils/validators";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

// Tourists may only review a guide after an eligible completed booking.
export async function POST(req) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;
    if (user.role !== "TOURIST") return fail("Only tourists can leave reviews.", 403);

    await connectDB();
    const { bookingId, rating, text, image } = await req.json();
    if (!isValidObjectId(bookingId)) return fail("Invalid booking id.");
    if (!rating || rating < 1 || rating > 5) return fail("Rating must be between 1 and 5.");
    if (!text || text.trim().length < 5) return fail("Please write a short review (5+ characters).");

    const booking = await Booking.findById(bookingId);
    if (!booking) return fail("Booking not found.", 404);
    if (booking.tourist.toString() !== user.id) return fail("You can only review your own bookings.", 403);
    if (booking.status !== "completed") return fail("You can only review completed bookings.", 400);

    const existing = await Review.findOne({ booking: bookingId });
    if (existing) return fail("You have already reviewed this booking.", 409);

    const review = await Review.create({
      tourist: user.id,
      guide: booking.guide,
      booking: bookingId,
      rating,
      text,
      image,
    });

    const guide = await Guide.findById(booking.guide);
    const allReviews = await Review.find({ guide: booking.guide, isHidden: false });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    guide.rating = Math.round(avg * 10) / 10;
    guide.reviewCount = allReviews.length;
    await guide.save();

    await createNotification({
      user: guide.user,
      type: "new_review",
      title: "New review received",
      message: `You received a ${rating}-star review.`,
      link: `/guide-dashboard/reviews`,
    });

    return ok({ review }, 201);
  } catch (err) {
    return serverError(err, "Failed to submit review.");
  }
}
