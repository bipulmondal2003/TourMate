"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-triggered entrance animation. Wraps any block-level content
 * and fades/slides it in once it enters the viewport, then never
 * re-animates (viewport once:true) so scrolling back up stays calm.
 * Respects prefers-reduced-motion by rendering instantly.
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 22,
  duration = 0.6,
  className = "",
  once = true,
  amount = 0.2,
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (shouldReduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggers its direct motion children in on scroll. Use with
 * <RevealItem> for each child.
 */
export function RevealGroup({ children, className = "", stagger = 0.08, delay = 0, amount = 0.2 }) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "", y = 18 }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
