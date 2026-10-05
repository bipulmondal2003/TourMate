"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/utils/format";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">All Bookings</h1>
      {bookings.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings yet" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-charcoal/50 dark:text-white/50 border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="p-3">Tourist</th>
                <th className="p-3">Guide</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-black/5 dark:border-white/5 last:border-0">
                  <td className="p-3">{b.tourist?.name}</td>
                  <td className="p-3">{b.guide?.user?.name}</td>
                  <td className="p-3">{formatDate(b.date)}</td>
                  <td className="p-3">
                    <Badge status={b.status} />
                  </td>
                  <td className="p-3">
                    <Badge status={b.paymentStatus} />
                  </td>
                  <td className="p-3 font-semibold">{formatCurrency(b.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
