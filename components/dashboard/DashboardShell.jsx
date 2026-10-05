"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";

/**
 * Shared frame for the Tourist, Guide and Admin dashboards. Each
 * layout.js passes its own links + allowed roles, so routing and
 * authorization stay exactly per-dashboard; only the visual shell
 * (sidebar, active-link indicator, page transition) is shared.
 */
export default function DashboardShell({ roles, links, label, children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <ProtectedRoute roles={roles}>
      <div className="container-page py-10 grid lg:grid-cols-[250px_1fr] gap-8">
        <aside className="card p-3 h-fit lg:sticky lg:top-24">
          <div className="hidden lg:flex items-center gap-3 px-3 pt-3 pb-4 mb-2 border-b border-black/5 dark:border-white/5">
            <Avatar name={user?.name || "User"} src={user?.avatar} size={40} />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-gold-600 font-semibold">{label}</p>
            </div>
          </div>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto" aria-label={`${label} navigation`}>
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-cursor-hover
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? "text-white dark:text-navy-950" : "text-charcoal/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={`${label}-active-pill`}
                      className="absolute inset-0 rounded-xl bg-navy-900 dark:bg-gold-500 shadow-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <link.icon size={16} className="relative" />
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0"
        >
          {children}
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
