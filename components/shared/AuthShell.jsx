"use client";

import { motion } from "framer-motion";
import { Compass, ShieldCheck, MessageCircle, BadgeCheck } from "lucide-react";

const POINTS = [
  { icon: ShieldCheck, text: "Every guide is reviewed and approved before they can take bookings" },
  { icon: BadgeCheck, text: "Prices are calculated on the server — what you see is what you pay" },
  { icon: MessageCircle, text: "Message your guide directly before you book" },
];

/**
 * Two-column frame for login / register / password screens. The left
 * panel is decorative brand context (desktop only); the form card
 * passed as children sits in the right column.
 */
export default function AuthShell({ children }) {
  return (
    <div className="container-page py-10 lg:py-16 grid lg:grid-cols-2 gap-10 items-center min-h-[70vh]">
      <div className="hidden lg:block relative overflow-hidden rounded-xl3 bg-navy-950 text-white p-12 h-full min-h-[520px]">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-gold-500/25 blur-[90px]" />
        <div className="absolute -bottom-28 -right-10 h-72 w-72 rounded-full bg-teal-500/20 blur-[90px]" />
        <div className="relative h-full flex flex-col justify-between">
          <div className="flex items-center gap-2 font-extrabold text-lg">
            <span className="h-9 w-9 rounded-full bg-gold-500 flex items-center justify-center shadow-glow">
              <Compass size={20} className="text-navy-950" />
            </span>
            TourMate
          </div>
          <div>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
              Explore the world with someone who <span className="text-gradient">knows it best.</span>
            </h2>
            <ul className="mt-8 space-y-4">
              {POINTS.map((p, i) => (
                <motion.li
                  key={p.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 text-sm text-white/70"
                >
                  <span className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <p.icon size={16} className="text-gold-400" />
                  </span>
                  <span className="pt-1.5">{p.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-auto"
      >
        {children}
      </motion.div>
    </div>
  );
}
