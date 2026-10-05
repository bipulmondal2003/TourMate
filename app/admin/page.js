"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, Calendar, Wallet, Star, MapPin } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency } from "@/utils/format";

export default function AdminOverviewPage() {
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
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold">Admin Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard icon={Users} label="Total Users" value={stats.totalUsers} />
        <DashboardCard icon={UserCheck} label="Approved Guides" value={stats.totalGuides} accent="blue" />
        <DashboardCard icon={UserCheck} label="Pending Guides" value={stats.pendingGuides} accent="red" />
        <DashboardCard icon={Calendar} label="Total Bookings" value={stats.totalBookings} />
        <DashboardCard icon={Wallet} label="Revenue" value={formatCurrency(stats.revenue)} accent="green" />
        <DashboardCard icon={Star} label="Total Reviews" value={stats.totalReviews} accent="blue" />
      </div>

      <div>
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <MapPin size={18} /> Popular Destinations
        </h2>
        <div className="card divide-y divide-black/5 dark:divide-white/5">
          {stats.popularDestinations.map((d) => (
            <div key={d._id} className="flex items-center justify-between p-4 text-sm">
              <span className="font-medium">{d.name}</span>
              <span className="text-charcoal/50 dark:text-white/50">{d.guideCount} guides</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-4">Bookings by Status</h2>
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.bookingsByStatus.map((b) => (
            <div key={b._id} className="card p-4 text-center">
              <p className="text-2xl font-extrabold">{b.count}</p>
              <p className="text-xs capitalize text-charcoal/60 dark:text-white/60">{b._id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
