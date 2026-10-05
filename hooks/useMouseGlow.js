"use client";

import { useEffect } from "react";

/**
 * Tracks the cursor and eases a pair of CSS custom properties toward it
 * on document.documentElement:
 *   --mx / --my : cursor position as a % of viewport (for the spotlight)
 *   --px / --py : cursor offset from center, -1..1 (for background parallax)
 * A single rAF-driven listener powers every glass surface and the aurora
 * background at once — no per-element mouse listeners needed.
 */
export function useMouseGlow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = null;
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;

    const tick = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      const root = document.documentElement;
      root.style.setProperty("--mx", currentX + "%");
      root.style.setProperty("--my", currentY + "%");
      root.style.setProperty("--px", ((currentX - 50) / 50).toFixed(3));
      root.style.setProperty("--py", ((currentY - 50) / 50).toFixed(3));

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };

    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
