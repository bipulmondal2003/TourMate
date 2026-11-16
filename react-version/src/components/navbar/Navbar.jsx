
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  Compass,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Avatar from "@/components/ui/Avatar";
import Magnetic from "@/components/ui/Magnetic";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/guides", label: "Explore Guides" },
  { href: "/destinations", label: "Destinations" },
  // { href: "/trip-planner", label: "Trip Planner"},
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

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const handleLogout = async () => {
    await logout();

    setMenuOpen(false);
    setMobileOpen(false);

    navigate("/");
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <nav
        className={`
          container-page
          mx-auto
          transition-all
          duration-500
          ${scrolled ? "pt-2.5" : "pt-4"}
        `}
      >
        {/* =========================================================
            MAIN NAVBAR
        ========================================================== */}

        <div
          className={`
            pointer-events-auto
            relative
            flex
            items-center
            justify-between
            gap-3
            rounded-[26px]
            border
            border-[var(--glass-border-hi)]
            bg-[var(--glass-fill-strong)]
            px-3
            backdrop-blur-2xl
            backdrop-saturate-150
            shadow-[0_10px_40px_-18px_rgba(0,0,0,0.35)]
            transition-all
            duration-500
            ${
              scrolled
                ? "min-h-[56px] shadow-[0_12px_45px_-18px_rgba(0,0,0,0.4)]"
                : "min-h-[62px]"
            }

            before:pointer-events-none
            before:absolute
            before:inset-[1px]
            before:rounded-[25px]
            before:border
            before:border-white/[0.08]

            after:pointer-events-none
            after:absolute
            after:inset-0
            after:rounded-[26px]
            after:bg-gradient-to-b
            after:from-white/[0.06]
            after:to-transparent
          `}
        >
          {/* =======================================================
              LOGO
          ======================================================== */}

          <Link
            to="/"
            onClick={closeMenus}
            data-cursor-hover
            className="
              relative
              z-10
              flex
              shrink-0
              items-center
              gap-2.5
              pl-1
              pr-2
              group
            "
          >
            {/* Logo Icon */}

            <motion.span
  whileHover={{
    scale: 1.06,
    rotate: 5,
  }}
  transition={{
    type: "spring",
    stiffness: 350,
    damping: 18,
  }}
  className="
    relative
    z-20
    flex
    h-10
    w-10
    shrink-0
    items-center
    justify-center
    overflow-hidden
    rounded-full
    border
    border-white/20
    bg-slate-900
    shadow-[0_4px_20px_rgba(0,0,0,0.25)]
  "
>
  {/* Glass highlight */}
  <span
    className="
      absolute
      inset-[1px]
      rounded-full
      bg-gradient-to-br
      from-white/15
      via-white/5
      to-transparent
    "
  />

  {/* Gold glow */}
  <span
    className="
      absolute
      inset-0
      rounded-full
      bg-gold-400/10
      transition-all
      duration-300
      group-hover:bg-gold-400/20
    "
  />

  {/* Compass */}
  <Compass
    size={20}
    strokeWidth={2.3}
    className="
      relative
      z-10
      text-gold-400
      drop-shadow-[0_0_6px_rgba(250,180,50,0.45)]
      transition-transform
      duration-300
      group-hover:rotate-12
    "
  />
</motion.span>

            {/* Brand */}

            <span
              className="
                hidden
                sm:block
                text-[23px]
                font-black
                tracking-[-0.04em]
                text-gradient
              "
            >
              {/* TourMate */}
              <span className="text-gradient text-4xl">TourMate</span>
            </span>
          </Link>

          {/* =======================================================
              CENTER NAVIGATION
          ======================================================== */}

          <div
            className="
              relative
              z-10
              hidden
              lg:flex
              items-center
              rounded-full
              border
              border-[var(--glass-border)]
              bg-black/[0.035]
              dark:bg-white/[0.035]
              p-1
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]
            "
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  data-cursor-hover
                  className="
                    relative
                    rounded-full
                    px-3.5
                    xl:px-4
                    py-2
                    text-[13px]
                    xl:text-sm
                    font-medium
                    whitespace-nowrap
                    transition-colors
                    duration-300
                  "
                >
                  {/* Active Glass Pill */}

                  {isActive && (
                    <motion.span
                      layoutId="active-nav-pill"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="
                        absolute
                        inset-0
                        rounded-full
                        border
                        border-[var(--glass-border-hi)]
                        bg-[var(--glass-fill-strong)]
                        shadow-[0_3px_12px_rgba(0,0,0,0.10),inset_0_1px_1px_rgba(255,255,255,0.18)]
                      "
                    />
                  )}

                  {/* Hover Background */}

                  <span
                    className="
                      absolute
                      inset-0
                      rounded-full
                      bg-black/[0.035]
                      dark:bg-white/[0.055]
                      opacity-0
                      transition-opacity
                      duration-300
                      hover:opacity-100
                    "
                  />

                  {/* Text */}

                  <span
                    className={`
                      relative
                      z-10
                      ${
                        isActive
                          ? "text-[var(--text-primary)] font-semibold"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }
                    `}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* =======================================================
              RIGHT SIDE
          ======================================================== */}

          <div className="relative z-10 hidden lg:flex items-center gap-2">
            {/* Theme Toggle */}

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[var(--glass-border)]
                bg-black/[0.025]
                dark:bg-white/[0.04]
                transition-all
                duration-300
                hover:bg-black/[0.06]
                dark:hover:bg-white/[0.08]
              "
            >
              <ThemeToggle />
            </div>

            {/* =====================================================
                LOGGED OUT
            ====================================================== */}

            {!loading && !isAuthenticated && (
              <div className="flex items-center gap-2">
                <Magnetic>
                  <Link
                    to="/login"
                    data-cursor-hover
                    className="
                      flex
                      h-10
                      items-center
                      rounded-full
                      border
                      border-[var(--glass-border-hi)]
                      bg-black/[0.025]
                      dark:bg-white/[0.035]
                      px-4
                      text-sm
                      font-medium
                      text-[var(--text-primary)]
                      transition-all
                      duration-300
                      hover:bg-black/[0.06]
                      dark:hover:bg-white/[0.08]
                    "
                  >
                    Login
                  </Link>
                </Magnetic>

                <Magnetic>
                  <Link
                    to="/register"
                    data-cursor-hover
                    className="
                      flex
                      h-10
                      items-center
                      rounded-full
                      bg-[var(--navy-900)]
                      dark:bg-[var(--gold-500)]
                      px-5
                      text-sm
                      font-semibold
                      text-white
                      dark:text-[var(--navy-950)]
                      shadow-[0_5px_20px_rgba(0,0,0,0.12)]
                      transition-all
                      duration-300
                      hover:-translate-y-[1px]
                      hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)]
                    "
                  >
                    Sign Up
                  </Link>
                </Magnetic>
              </div>
            )}

            {/* =====================================================
                LOGGED IN
            ====================================================== */}

            {!loading && isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((value) => !value)}
                  data-cursor-hover
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[var(--glass-border-hi)]
                    bg-black/[0.025]
                    dark:bg-white/[0.035]
                    py-1
                    pl-1
                    pr-3
                    transition-all
                    duration-300
                    hover:bg-black/[0.06]
                    dark:hover:bg-white/[0.08]
                  "
                >
                  <Avatar name={user?.name} src={user?.avatar} size={32} />

                  <span className="max-w-[90px] truncate text-sm font-medium text-[var(--text-primary)]">
                    {user?.name?.split(" ")[0]}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`
                      text-[var(--text-secondary)]
                      transition-transform
                      duration-300
                      ${menuOpen ? "rotate-180" : ""}
                    `}
                  />
                </button>

                {/* User Dropdown */}

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.96,
                      }}
                      transition={{
                        duration: 0.18,
                      }}
                      className="
                        absolute
                        right-0
                        top-[calc(100%+10px)]
                        w-56
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[var(--glass-border-hi)]
                        bg-[var(--glass-fill-strong)]
                        p-2
                        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)]
                        backdrop-blur-2xl
                      "
                    >
                      {/* Dashboard */}

                      <Link
                        to={dashboardPathFor(user?.role)}
                        onClick={() => setMenuOpen(false)}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-2.5
                          text-sm
                          text-[var(--text-secondary)]
                          transition-colors
                          hover:bg-black/[0.05]
                          dark:hover:bg-white/[0.06]
                          hover:text-[var(--text-primary)]
                        "
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>

                      {/* Notifications */}

                      <Link
                        to={`${dashboardPathFor(user?.role)}/notifications`}
                        onClick={() => setMenuOpen(false)}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-2.5
                          text-sm
                          text-[var(--text-secondary)]
                          transition-colors
                          hover:bg-black/[0.05]
                          dark:hover:bg-white/[0.06]
                          hover:text-[var(--text-primary)]
                        "
                      >
                        <Bell size={16} />
                        Notifications
                      </Link>

                      {/* Divider */}

                      <div className="my-1 h-px bg-black/[0.07] dark:bg-white/[0.07]" />

                      {/* Logout */}

                      <button
                        onClick={handleLogout}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-2.5
                          text-sm
                          text-red-500
                          transition-colors
                          hover:bg-red-500/[0.08]
                        "
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* =======================================================
              MOBILE BUTTON
          ======================================================== */}

          <button
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            data-cursor-hover
            className="
              relative
              z-10
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[var(--glass-border)]
              bg-black/[0.025]
              dark:bg-white/[0.04]
              text-[var(--text-primary)]
              transition-all
              duration-300
              hover:bg-black/[0.06]
              dark:hover:bg-white/[0.08]
              lg:hidden
            "
          >
            <motion.div
              animate={{
                rotate: mobileOpen ? 90 : 0,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </button>
        </div>

        {/* ===========================================================
            MOBILE NAVIGATION
        ============================================================ */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -12,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -12,
                scale: 0.98,
              }}
              transition={{
                duration: 0.22,
              }}
              className="
                pointer-events-auto
                mt-2
                overflow-hidden
                rounded-[24px]
                border
                border-[var(--glass-border-hi)]
                bg-[var(--glass-fill-strong)]
                p-2
                shadow-[0_20px_60px_-15px_rgba(0,0,0,0.30)]
                backdrop-blur-2xl
                lg:hidden
              "
            >
              {/* Mobile Links */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[var(--glass-border)]
                  bg-black/[0.02]
                  dark:bg-white/[0.025]
                  p-1
                "
              >
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      data-cursor-hover
                      className="relative block"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobile-active-pill"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                          className="
                            absolute
                            inset-0
                            rounded-xl
                            border
                            border-[var(--glass-border-hi)]
                            bg-[var(--glass-fill-strong)]
                          "
                        />
                      )}

                      <span
                        className={`
                          relative
                          z-10
                          block
                          rounded-xl
                          px-4
                          py-3
                          text-sm
                          font-medium
                          ${
                            isActive
                              ? "text-[var(--text-primary)] font-semibold"
                              : "text-[var(--text-secondary)]"
                          }
                        `}
                      >
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Bottom */}

              <div
                className="
                  mt-2
                  flex
                  items-center
                  justify-between
                  gap-2
                  rounded-2xl
                  border
                  border-[var(--glass-border)]
                  bg-black/[0.02]
                  dark:bg-white/[0.025]
                  p-2
                "
              >
                <ThemeToggle />

                {!loading && !isAuthenticated ? (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="
                        rounded-full
                        border
                        border-[var(--glass-border-hi)]
                        px-4
                        py-2
                        text-sm
                        font-medium
                      "
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="
                        rounded-full
                        bg-[var(--navy-900)]
                        dark:bg-[var(--gold-500)]
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        dark:text-[var(--navy-950)]
                      "
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to={dashboardPathFor(user?.role)}
                      onClick={() => setMobileOpen(false)}
                      className="
                        rounded-full
                        border
                        border-[var(--glass-border-hi)]
                        px-4
                        py-2
                        text-sm
                        font-medium
                      "
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="
                        rounded-full
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-red-500
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
