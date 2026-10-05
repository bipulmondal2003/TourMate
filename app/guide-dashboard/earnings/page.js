"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Calendar } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/utils/format";

export default function EarningsPage() {
  const [guide, setGuide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [guideRes, bookingsRes] = await Promise.all([
        fetch("/api/guides/me").then((r) => r.json()),
        fetch("/api/bookings?status=completed").then((r) => r.json()),
      ]);
      if (guideRes.success) setGuide(guideRes.guide);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner full />;

  const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Earnings</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <DashboardCard icon={Wallet} label="Total Earnings" value={formatCurrency(guide?.totalEarnings || 0)} accent="green" />
        <DashboardCard icon={TrendingUp} label="Completed Tours" value={bookings.length} />
        <DashboardCard icon={Calendar} label="Paid Bookings" value={paidBookings.length} accent="blue" />
      </div>

      <h2 className="font-bold mb-3">Completed & Paid Bookings</h2>
      {paidBookings.length === 0 ? (
        <EmptyState icon={Wallet} title="No earnings yet" message="Completed and paid bookings will appear here." />
      ) : (
        <div className="card divide-y divide-black/5 dark:divide-white/5">
          {paidBookings.map((b) => (
            <div key={b._id} className="flex items-center justify-between p-4 text-sm">
              <div>
                <p className="font-semibold">{b.tourist?.name}</p>
                <p className="text-charcoal/50 dark:text-white/50">{formatDate(b.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status="paid" />
                <span className="font-bold">{formatCurrency(b.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
