"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, Users, MapPin, Check, X, CheckCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { formatCurrency, formatDate } from "@/utils/format";

export default function GuideBookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  const runAction = async (action) => {
    setActionLoading(true);
    await fetch(`/api/bookings/${id}/${action}`, { method: "POST" });
    await load();
    setActionLoading(false);
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
          <Avatar name={booking.tourist?.name} src={booking.tourist?.avatar} size={48} />
          <div>
            <p className="font-bold">{booking.tourist?.name}</p>
            <p className="text-sm text-charcoal/60 dark:text-white/60">{booking.tourist?.email}</p>
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
          <p className="flex items-center gap-2">
            <MapPin size={14} /> {booking.category}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
          <span className="text-sm font-medium">Total Payout</span>
          <span className="font-bold text-lg">{formatCurrency(booking.totalPrice)}</span>
        </div>

        {booking.notes && <p className="text-sm bg-black/5 dark:bg-white/5 rounded-lg p-3">{booking.notes}</p>}

        <div className="flex flex-wrap gap-3">
          {booking.status === "pending" && (
            <>
              <Button onClick={() => runAction("accept")} loading={actionLoading} icon={Check}>
                Accept
              </Button>
              <Button variant="danger" onClick={() => runAction("reject")} loading={actionLoading} icon={X}>
                Reject
              </Button>
            </>
          )}
          {booking.status === "confirmed" && (
            <>
              <Button onClick={() => runAction("complete")} loading={actionLoading} icon={CheckCircle}>
                Mark Completed
              </Button>
              <Button variant="outline" onClick={() => runAction("cancel")} loading={actionLoading}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
