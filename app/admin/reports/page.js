"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency } from "@/utils/format";

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      if (data.success) setStats(data.stats);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
        <BarChart3 size={22} /> Platform Reports
      </h1>
      <div className="card p-6 space-y-3 text-sm">
        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
          <span>Total Users</span>
          <span className="font-bold">{stats.totalUsers}</span>
        </div>
        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
          <span>Approved Guides</span>
          <span className="font-bold">{stats.totalGuides}</span>
        </div>
        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
          <span>Pending Guide Applications</span>
          <span className="font-bold">{stats.pendingGuides}</span>
        </div>
        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
          <span>Total Bookings</span>
          <span className="font-bold">{stats.totalBookings}</span>
        </div>
        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
          <span>Total Reviews</span>
          <span className="font-bold">{stats.totalReviews}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Revenue</span>
          <span className="font-bold">{formatCurrency(stats.revenue)}</span>
        </div>
      </div>
    </div>
  );
}
