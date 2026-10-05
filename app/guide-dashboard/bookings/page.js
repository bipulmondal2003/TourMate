"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import BookingCard from "@/components/booking/BookingCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const TABS = ["all", "pending", "confirmed", "completed", "cancelled", "rejected"];

export default function GuideBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = tab === "all" ? bookings : bookings.filter((b) => b.status === tab);

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4">Bookings</h1>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap ${
              tab === t ? "bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-950" : "bg-black/5 dark:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings here" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <BookingCard key={b._id} booking={b} viewerRole="GUIDE" basePath="/guide-dashboard" />
          ))}
        </div>
      )}
    </div>
  );
}
