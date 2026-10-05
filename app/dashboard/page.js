"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Heart, Bell, Clock } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import BookingCard from "@/components/booking/BookingCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";

export default function TouristDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [bookingsRes, favRes, notifRes] = await Promise.all([
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/favorites").then((r) => r.json()),
        fetch("/api/notifications").then((r) => r.json()),
      ]);
      if (bookingsRes.success) setBookings(bookingsRes.bookings);
      if (favRes.success) setFavoritesCount(favRes.favorites.length);
      if (notifRes.success) setNotificationsCount(notifRes.unreadCount);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner full />;

  const upcoming = bookings.filter((b) => ["pending", "confirmed"].includes(b.status)).slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-charcoal/60 dark:text-white/60">Here&apos;s what&apos;s happening with your trips.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <DashboardCard icon={Calendar} label="Total Bookings" value={bookings.length} />
        <DashboardCard icon={Heart} label="Favorite Guides" value={favoritesCount} accent="red" />
        <DashboardCard icon={Bell} label="Unread Notifications" value={notificationsCount} accent="blue" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Clock size={18} /> Upcoming Bookings
          </h2>
          <Link href="/dashboard/bookings" className="text-sm text-gold-600 font-semibold hover:underline">
            View all
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming bookings"
            message="Explore guides and book your next adventure!"
            action={
              <Link href="/guides" className="btn-primary">
                Explore Guides
              </Link>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {upcoming.map((b) => (
              <BookingCard key={b._id} booking={b} viewerRole="TOURIST" basePath="/dashboard" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
