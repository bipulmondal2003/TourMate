"use client";

import { LayoutDashboard, Calendar, Heart, MessageSquare, Bell, User, Settings } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
  return (
    <DashboardShell roles={["TOURIST"]} links={LINKS} label="Traveler">
      {children}
    </DashboardShell>
  );
}
