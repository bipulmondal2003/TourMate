"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Wallet, Star, Clock } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import BookingCard from "@/components/booking/BookingCard";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utils/format";

export default function GuideDashboardPage() {
  const { user } = useAuth();
  const [guide, setGuide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [guideRes, bookingsRes] = await Promise.all([
        fetch("/api/guides/me").then((r) => r.json()),
        fetch("/api/bookings").then((r) => r.json()),
      ]);
      if (guideRes.success) setGuide(guideRes.guide);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner full />;

  const pending = bookings.filter((b) => b.status === "pending");
  const upcoming = bookings.filter((b) => b.status === "confirmed").slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-extrabold">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-charcoal/60 dark:text-white/60">Here&apos;s your guide dashboard summary.</p>
        </div>
        {guide && <Badge status={guide.status} />}
      </div>

      {guide?.status === "pending" && (
        <div className="card p-4 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            Your guide profile is pending admin approval. You&apos;ll be notified once it&apos;s reviewed.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <DashboardCard icon={Calendar} label="Total Bookings" value={guide?.totalBookings || 0} />
        <DashboardCard icon={Wallet} label="Total Earnings" value={formatCurrency(guide?.totalEarnings || 0)} accent="green" />
        <DashboardCard icon={Star} label="Rating" value={guide?.rating?.toFixed(1) || "0.0"} accent="blue" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Clock size={18} /> Pending Requests ({pending.length})
          </h2>
          <Link href="/guide-dashboard/bookings" className="text-sm text-gold-600 font-semibold hover:underline">
            View all
          </Link>
        </div>
        {pending.length === 0 ? (
          <EmptyState icon={Calendar} title="No pending requests" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {pending.slice(0, 4).map((b) => (
              <BookingCard key={b._id} booking={b} viewerRole="GUIDE" basePath="/guide-dashboard" />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-bold text-lg mb-4">Upcoming Confirmed Tours</h2>
        {upcoming.length === 0 ? (
          <EmptyState icon={Calendar} title="No upcoming tours" />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {upcoming.map((b) => (
              <BookingCard key={b._id} booking={b} viewerRole="GUIDE" basePath="/guide-dashboard" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
