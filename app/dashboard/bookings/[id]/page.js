"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, Users, MapPin, CreditCard } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import ImageUpload from "@/components/ui/ImageUpload";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { formatCurrency, formatDate } from "@/utils/format";
import { loadRazorpayScript } from "@/utils/loadRazorpayScript";
import { useAuth } from "@/context/AuthContext";

export default function TouristBookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setBooking(data.booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    setActionLoading(true);
    await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
    await load();
    setActionLoading(false);
  };

  const handlePay = async () => {
    setActionLoading(true);
    setPaymentMessage("");
    const orderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id }),
    });
    const orderData = await orderRes.json();
    if (!orderData.success) {
      setPaymentMessage(orderData.message);
      setActionLoading(false);
      return;
    }

    if (orderData.demoMode) {
      // Demo Payment Mode: simulate an instant successful payment.
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.payment.orderId, paymentId: `demo_${Date.now()}` }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setPaymentMessage("Demo payment completed successfully!");
        await load();
      } else {
        setPaymentMessage(verifyData.message);
      }
    } else {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setPaymentMessage("Couldn't load Razorpay's checkout script. Check your connection and try again.");
        setActionLoading(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: Math.round(booking.totalPrice * 100),
        currency: "INR",
        name: "TourMate",
        description: `Booking with ${booking.guide?.user?.name || "your guide"}`,
        order_id: orderData.payment.orderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#111c33" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setPaymentMessage("Payment successful!");
            await load();
          } else {
            setPaymentMessage(verifyData.message);
          }
        },
        modal: {
          ondismiss: () => setPaymentMessage("Payment cancelled."),
        },
      });
      razorpay.on("payment.failed", (response) => {
        setPaymentMessage(response.error?.description || "Payment failed. Please try again.");
      });
      razorpay.open();
    }
    setActionLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id, ...reviewForm }),
    });
    const data = await res.json();
    setActionLoading(false);
    if (data.success) {
      setReviewSubmitted(true);
      setReviewOpen(false);
    }
  };

  if (loading) return <LoadingSpinner full />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!booking) return null;

  return (
    <div className="max-w-2xl">
      <button onClick={() => router.back()} className="text-sm text-gold-600 font-semibold mb-4 hover:underline">
        ← Back
      </button>

      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold">Booking Details</h1>
          <Badge status={booking.status} />
        </div>

        <div className="flex items-center gap-3">
          <Avatar name={booking.guide?.user?.name} src={booking.guide?.user?.avatar} size={48} />
          <div>
            <p className="font-bold">{booking.guide?.user?.name}</p>
            <p className="flex items-center gap-1 text-sm text-charcoal/60 dark:text-white/60">
              <MapPin size={13} /> {booking.guide?.location}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p className="flex items-center gap-2">
            <Calendar size={14} /> {formatDate(booking.date)}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={14} /> {booking.startTime} ({booking.durationHours}h)
          </p>
          <p className="flex items-center gap-2">
            <Users size={14} /> {booking.numberOfPeople} people
          </p>
          <p className="flex items-center gap-2 font-semibold">{formatCurrency(booking.totalPrice)}</p>
        </div>

        {booking.notes && <p className="text-sm bg-black/5 dark:bg-white/5 rounded-lg p-3">{booking.notes}</p>}

        <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
          <span className="text-sm font-medium">Payment Status</span>
          <Badge status={booking.paymentStatus} />
        </div>

        {paymentMessage && <p className="text-sm text-gold-600">{paymentMessage}</p>}

        <div className="flex flex-wrap gap-3">
          {booking.status === "confirmed" && booking.paymentStatus !== "paid" && (
            <Button onClick={handlePay} loading={actionLoading} icon={CreditCard}>
              Pay Now
            </Button>
          )}
          {["pending", "confirmed"].includes(booking.status) && (
            <Button variant="outline" onClick={handleCancel} loading={actionLoading}>
              Cancel Booking
            </Button>
          )}
          {booking.status === "completed" && !reviewSubmitted && (
            <Button variant="secondary" onClick={() => setReviewOpen(true)}>
              Leave a Review
            </Button>
          )}
          {reviewSubmitted && <p className="text-sm text-green-600 font-semibold">Thanks for your review!</p>}
        </div>
      </div>

      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Leave a Review">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="label-field">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                  className="p-1 text-2xl leading-none"
                  aria-label={`Rate ${r} stars`}
                >
                  <span className={r <= reviewForm.rating ? "text-gold-500" : "text-black/20 dark:text-white/20"}>★</span>
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Your review"
            required
            minLength={5}
            value={reviewForm.text}
            onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
            placeholder="Share your experience..."
          />
          <ImageUpload
            label="Add a photo (optional)"
            round={false}
            value={reviewForm.image || ""}
            onChange={(url) => setReviewForm({ ...reviewForm, image: url })}
            folder="tourmate/reviews"
          />
          <Button type="submit" loading={actionLoading} className="w-full">
            Submit Review
          </Button>
        </form>
      </Modal>
    </div>
  );
}
