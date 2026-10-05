"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Menu, X, LayoutDashboard, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Avatar from "@/components/ui/Avatar";
import Magnetic from "@/components/ui/Magnetic";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/guides", label: "Explore Guides" },
  { href: "/destinations", label: "Destinations" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

function dashboardPathFor(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "GUIDE") return "/guide-dashboard";
  return "/dashboard";
}

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 12));

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-[var(--glass-fill-strong)] backdrop-blur-xl backdrop-saturate-150 border-b transition-all duration-300 ${
        scrolled ? "border-[var(--glass-border-hi)] shadow-[0_8px_30px_-16px_rgba(0,0,0,0.25)]" : "border-[var(--glass-border)]"
      }`}
    >
      <nav className={`container-page flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-14" : "h-16"}`}>
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg" data-cursor-hover>
          <span className="h-9 w-9 rounded-full bg-navy-900 dark:bg-gold-500 flex items-center justify-center shadow-glow">
            <Compass size={20} className="text-gold-400 dark:text-navy-950" />
          </span>
          {/* TourMate */}
          <span className="text-gradient text-4xl">TourMate</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                data-cursor-hover
                className={`relative py-1 hover:text-gold-600 transition-colors ${
                  pathname === link.href ? "text-gold-600 font-semibold" : ""
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gold-500"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          {!loading && !isAuthenticated && (
            <>
              <Magnetic>
                <Link href="/login" className="btn-outline">
                  Login
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/register" className="btn-primary">
                  Sign Up
                </Link>
              </Magnetic>
              {/* <Link href="/register?role=GUIDE" className="text-sm font-semibold text-gold-600 hover:underline">
                Become a Guide
              </Link> */}
            </>
          )}
          {!loading && isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                data-cursor-hover
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Avatar name={user?.name} src={user?.avatar} size={32} />
                <span className="text-sm font-medium">{user?.name?.split(" ")[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 card p-2 z-50 animate-in">
                  <Link
                    href={dashboardPathFor(user?.role)}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    href={`${dashboardPathFor(user?.role)}/notifications`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Bell size={16} /> Notifications
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="lg:hidden h-10 w-10 flex items-center justify-center"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-black/5 dark:border-white/5 px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
            <ThemeToggle />
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Link href="/login" className="btn-outline text-sm px-4 py-2" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm px-4 py-2" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href={dashboardPathFor(user?.role)}
                  className="btn-outline text-sm px-4 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-sm text-red-600 font-medium">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
