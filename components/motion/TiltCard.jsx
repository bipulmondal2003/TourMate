"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * Wraps a card and gives it a subtle 3D tilt toward the cursor, with a
 * spring-based return to flat on mouse leave. Kept deliberately gentle
 * (max ~6deg) so it reads as premium depth, not a gimmick. No-ops
 * under prefers-reduced-motion or on touch devices (no mousemove).
 */
export default function TiltCard({ children, className = "", maxTilt = 6, scale = 1.015 }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springConfig = { stiffness: 220, damping: 20, mass: 0.4 };
  const rx = useSpring(useTransform(my, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const ry = useSpring(useTransform(mx, [0, 1], [-maxTilt, maxTilt]), springConfig);
  const s = useSpring(1, springConfig);

  const handleMove = (e) => {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
    s.set(scale);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    s.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={shouldReduceMotion ? undefined : { rotateX: rx, rotateY: ry, scale: s, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
