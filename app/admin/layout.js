"use client";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Star,
  MapPin,
  Tag,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/guides", label: "Guides", icon: UserCheck },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  return (
    <DashboardShell roles={["ADMIN"]} links={LINKS} label="Admin">
      {children}
    </DashboardShell>
  );
}
