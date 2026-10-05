import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";
import { razorpayClient, isRazorpayConfigured, RAZORPAY_KEY_ID } from "@/lib/razorpay";

// Creates a payment order for a booking. Uses the real Razorpay Orders
// API when credentials are configured, otherwise falls back to a
// clearly labeled Demo Payment Mode so the flow can still be tested.
export async function POST(req) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;

    await connectDB();
    const { bookingId } = await req.json();
    const booking = await Booking.findById(bookingId);
    if (!booking) return fail("Booking not found.", 404);
    if (booking.tourist.toString() !== user.id) return fail("Not authorized.", 403);
    if (booking.status !== "confirmed") return fail("Only confirmed bookings can be paid for.", 400);
    if (booking.paymentStatus === "paid") return fail("This booking has already been paid for.", 400);

    if (isRazorpayConfigured) {
      // Razorpay amounts are in the smallest currency unit (paise for INR).
      const order = await razorpayClient.orders.create({
        amount: Math.round(booking.totalPrice * 100),
        currency: "INR",
        receipt: `booking_${booking._id}`,
        notes: { bookingId: booking._id.toString(), touristId: user.id },
      });

      const payment = await Payment.create({
        booking: booking._id,
        tourist: user.id,
        amount: booking.totalPrice,
        provider: "razorpay",
        orderId: order.id,
      });

      return ok({ payment, keyId: RAZORPAY_KEY_ID, demoMode: false });
    }

    // Demo Payment Mode — no real order or charge occurs.
    const orderId = `demo_order_${crypto.randomBytes(8).toString("hex")}`;
    const payment = await Payment.create({
      booking: booking._id,
      tourist: user.id,
      amount: booking.totalPrice,
      provider: "demo",
      orderId,
    });

    return ok({ payment, demoMode: true, message: "Demo Payment Mode: Razorpay is not configured." });
  } catch (err) {
    return fail(err.message || "Failed to create payment order.", 500);
  }
}
