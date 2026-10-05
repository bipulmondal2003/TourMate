import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Guide from "@/models/Guide";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

async function loadBookingWithOwnership(id, user) {
  const booking = await Booking.findById(id)
    .populate({ path: "guide", populate: { path: "user", select: "name avatar email" } })
    .populate("tourist", "name avatar email");
  if (!booking) return { error: fail("Booking not found.", 404) };

  const isOwnerTourist = booking.tourist._id.toString() === user.id;
  const isOwnerGuide = booking.guide.user._id.toString() === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isOwnerTourist && !isOwnerGuide && !isAdmin) {
    return { error: fail("You do not have access to this booking.", 403) };
  }
  return { booking };
}

export async function GET(_req, { params }) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;
    if (!isValidObjectId(params.id)) return fail("Invalid booking id.");

    await connectDB();
    const { booking, error } = await loadBookingWithOwnership(params.id, user);
    if (error) return error;

    return ok({ booking });
  } catch (err) {
    return fail(err.message || "Failed to load booking.", 500);
  }
}
