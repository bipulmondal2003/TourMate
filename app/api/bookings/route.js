import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Guide from "@/models/Guide";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";
import { calculateBookingPrice } from "@/utils/pricing";
import { createNotification } from "@/services/notificationService";
import { isValidObjectId } from "@/utils/validators";

// Create a booking (tourist only). Price is ALWAYS computed on the
// server from the guide's stored rates — the client total is ignored.
export async function POST(req) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;
    if (user.role !== "TOURIST") return fail("Only tourists can create bookings.", 403);

    await connectDB();
    const { guideId, date, startTime, durationHours, numberOfPeople, category, notes } = await req.json();

    if (!isValidObjectId(guideId)) return fail("Invalid guide id.");
    if (!date || !startTime || !durationHours || !numberOfPeople) {
      return fail("Date, start time, duration and number of people are required.");
    }

    const guide = await Guide.findById(guideId);
    if (!guide) return fail("Guide not found.", 404);
    if (guide.status !== "approved") return fail("This guide is not currently accepting bookings.", 400);

    const bookingDate = new Date(date);
    if (bookingDate < new Date(new Date().toDateString())) {
      return fail("Booking date cannot be in the past.");
    }

    // Prevent double-booking: overlapping confirmed/pending bookings for the same guide+date+time
    const conflict = await Booking.findOne({
      guide: guideId,
      date: bookingDate,
      startTime,
      status: { $in: ["pending", "confirmed"] },
    });
    if (conflict) return fail("This guide already has a booking at that date and time.", 409);

    const totalPrice = calculateBookingPrice({
      pricePerHour: guide.pricePerHour,
      pricePerDay: guide.pricePerDay,
      durationHours,
      numberOfPeople,
    });

    const booking = await Booking.create({
      tourist: user.id,
      guide: guideId,
      date: bookingDate,
      startTime,
      durationHours,
      numberOfPeople,
      category,
      notes,
      totalPrice,
    });

    await createNotification({
      user: guide.user,
      type: "new_booking",
      title: "New booking request",
      message: `You have a new booking request for ${bookingDate.toDateString()}.`,
      link: `/guide-dashboard/bookings/${booking._id}`,
    });

    const populated = await booking.populate([{ path: "guide", populate: { path: "user", select: "name avatar" } }]);

    return ok({ booking: populated }, 201);
  } catch (err) {
    return fail(err.message || "Failed to create booking.", 500);
  }
}

// List bookings for the current user (tourist sees their own,
// guide sees bookings for their guide profile, admin sees all via /api/admin/bookings)
export async function GET(req) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = {};
    if (user.role === "TOURIST") {
      query.tourist = user.id;
    } else if (user.role === "GUIDE") {
      const guide = await Guide.findOne({ user: user.id });
      if (!guide) return ok({ bookings: [] });
      query.guide = guide._id;
    } else {
      return fail("Use /api/admin/bookings for admin access.", 403);
    }
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate({ path: "guide", populate: { path: "user", select: "name avatar" } })
      .populate("tourist", "name avatar email")
      .sort({ date: -1, createdAt: -1 });

    return ok({ bookings });
  } catch (err) {
    return fail(err.message || "Failed to load bookings.", 500);
  }
}
