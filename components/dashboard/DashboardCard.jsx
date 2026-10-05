"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView, useReducedMotion } from "framer-motion";

function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function DashboardCard({ icon: Icon, label, value, accent = "gold" }) {
  const accentClass =
    accent === "green"
      ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
      : accent === "red"
      ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
      : accent === "blue"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
      : "bg-gold-100 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400";

  return (
    <div className="card p-5 flex items-center gap-4 hover:shadow-glow transition-shadow duration-300">
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${accentClass}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-charcoal/50 dark:text-white/50">{label}</p>
        <p className="text-2xl font-bold tracking-tight">
          {typeof value === "number" ? <CountUp value={value} /> : value}
        </p>
      </div>
    </div>
  );
}
