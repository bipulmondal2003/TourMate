import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Guide from "@/models/Guide";
import Booking from "@/models/Booking";
import Review from "@/models/Review";
import Payment from "@/models/Payment";
import Destination from "@/models/Destination";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

// Aggregated stats for the admin dashboard / reports page
async function handleGET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();

  const [totalUsers, totalGuides, pendingGuides, totalBookings, totalReviews, payments, destinations, bookingsByStatus] =
    await Promise.all([
      User.countDocuments(),
      Guide.countDocuments({ status: "approved" }),
      Guide.countDocuments({ status: "pending" }),
      Booking.countDocuments(),
      Review.countDocuments(),
      Payment.find({ status: "paid" }),
      Destination.find().sort({ guideCount: -1 }).limit(5),
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return ok({
    stats: {
      totalUsers,
      totalGuides,
      pendingGuides,
      totalBookings,
      totalReviews,
      revenue,
      popularDestinations: destinations,
      bookingsByStatus,
    },
  });
}

export const GET = withErrorHandling(handleGET, "GET /api/admin/reports");
