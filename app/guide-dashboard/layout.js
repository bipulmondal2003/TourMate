"use client";

import { LayoutDashboard, Calendar, CalendarClock, Wallet, Star, MessageSquare, User, Settings } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

const LINKS = [
  { href: "/guide-dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/guide-dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/guide-dashboard/availability", label: "Availability", icon: CalendarClock },
  { href: "/guide-dashboard/earnings", label: "Earnings", icon: Wallet },
  { href: "/guide-dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/guide-dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/guide-dashboard/profile", label: "Profile", icon: User },
  { href: "/guide-dashboard/settings", label: "Settings", icon: Settings },
];

export default function GuideDashboardLayout({ children }) {
  return (
    <DashboardShell roles={["GUIDE"]} links={LINKS} label="Guide">
      {children}
    </DashboardShell>
  );
}
