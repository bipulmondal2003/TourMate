"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import BookingCard from "@/components/booking/BookingCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";

const TABS = ["all", "pending", "confirmed", "completed", "cancelled", "rejected"];

export default function TouristBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = tab === "all" ? bookings : bookings.filter((b) => b.status === tab);

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4">My Bookings</h1>
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

      {loading ? (
        <LoadingSpinner full />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings here" message="Bookings matching this filter will show up here." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <BookingCard key={b._id} booking={b} viewerRole="TOURIST" basePath="/dashboard" />
          ))}
        </div>
      )}
    </div>
  );
}
