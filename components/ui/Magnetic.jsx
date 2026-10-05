"use client";

import { useRef, useCallback } from "react";

/**
 * Wraps any element (typically a Link styled as a button) and makes it
 * lean gently toward the cursor within its bounds, springing back on
 * mouse leave. Used for CTA links that can't be the <Button> component
 * (Next.js <Link> navigation).
 */
export default function Magnetic({ children, strength = 0.25, className = "", block = false }) {
  const ref = useRef(null);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * (strength + 0.05)}px)`;
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  }, []);

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`magnetic ${block ? "block w-full" : "inline-block"} ${className}`}
    >
      {children}
    </span>
  );
}
