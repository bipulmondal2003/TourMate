import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, serverError } from "@/lib/apiResponse";
import { createNotification } from "@/services/notificationService";
import { RAZORPAY_KEY_SECRET } from "@/lib/razorpay";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;

    await connectDB();
    // Razorpay's checkout.js handler returns these exact field names on success.
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, paymentId } = await req.json();
    const finalOrderId = razorpay_order_id || orderId;
    const finalPaymentId = razorpay_payment_id || paymentId;

    const payment = await Payment.findOne({ orderId: finalOrderId });
    if (!payment) return fail("Payment record not found.", 404);
    if (payment.tourist.toString() !== user.id) return fail("Not authorized.", 403);

    let verified = true;
    if (payment.provider === "razorpay") {
      if (!RAZORPAY_KEY_SECRET) return fail("Razorpay is not configured on the server.", 500);
      // Recompute the HMAC signature ourselves — never trust the client's claim.
      const expected = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${finalOrderId}|${finalPaymentId}`)
        .digest("hex");
      verified = expected === razorpay_signature;
    }

    if (!verified) {
      payment.status = "failed";
      await payment.save();
      return fail("Payment signature verification failed.", 400);
    }

    payment.status = "paid";
    payment.paymentId = finalPaymentId || `demo_pay_${Date.now()}`;
    payment.signature = razorpay_signature || "demo_signature";
    await payment.save();

    const booking = await Booking.findById(payment.booking).populate("guide");
    booking.paymentStatus = "paid";
    await booking.save();

    await createNotification({
      user: user.id,
      type: "payment_successful",
      title: "Payment successful",
      message: `Your payment of ₹${payment.amount} was successful.`,
      link: `/dashboard/bookings/${booking._id}`,
    });
    if (booking.guide?.user) {
      await createNotification({
        user: booking.guide.user,
        type: "payment_successful",
        title: "Payment received",
        message: `Payment received for a booking on ${new Date(booking.date).toDateString()}.`,
        link: `/guide-dashboard/bookings/${booking._id}`,
      });
    }

    return ok({ booking, payment });
  } catch (err) {
    return serverError(err, "Payment verification failed.");
  }
}
