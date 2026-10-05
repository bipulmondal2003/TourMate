"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRef = useRef(null);

  const visibleRef = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [overText, setOverText] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia(
      "(pointer: fine) and (hover: hover)"
    ).matches;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!fine || reduced) return;

    setEnabled(true);

    document.documentElement.classList.add(
      "custom-cursor-active"
    );

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;

    let targetX = ringX;
    let targetY = ringY;

    let raf = null;

    // =================================================
    // Smooth Cursor Ring
    // =================================================

    const tick = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    // =================================================
    // Water Drop Trail
    // =================================================

    const createWaterDrop = (x, y) => {
      if (!trailRef.current) return;

      const drop = document.createElement("span");

      drop.className = "cursor-water-drop";

      const size = 4 + Math.random() * 7;

      const offsetX = (Math.random() - 0.5) * 16;
      const offsetY = (Math.random() - 0.5) * 16;

      drop.style.width = `${size}px`;
      drop.style.height = `${size}px`;

      drop.style.left = `${x + offsetX}px`;
      drop.style.top = `${y + offsetY}px`;

      drop.style.setProperty(
        "--drift-x",
        `${(Math.random() - 0.5) * 30}px`
      );

      drop.style.setProperty(
        "--drift-y",
        `${(Math.random() - 0.5) * 30}px`
      );

      trailRef.current.appendChild(drop);

      setTimeout(() => {
        drop.remove();
      }, 900);
    };

    // =================================================
    // Normal Water Ripple
    // =================================================

    const createRipple = (x, y) => {
      if (!trailRef.current) return;

      const ripple = document.createElement("span");

      ripple.className = "cursor-water-ripple";

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      trailRef.current.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 700);
    };

    // =================================================
    // CLICK WATER SPLASH
    // =================================================

    const createClickSplash = (x, y) => {
      if (!trailRef.current) return;

      // -----------------------------------------------
      // Main splash ripple
      // -----------------------------------------------

      const splash = document.createElement("span");

      splash.className = "cursor-click-splash";

      splash.style.left = `${x}px`;
      splash.style.top = `${y}px`;

      trailRef.current.appendChild(splash);

      setTimeout(() => {
        splash.remove();
      }, 750);

      // -----------------------------------------------
      // Inner ripple
      // -----------------------------------------------

      const innerRipple = document.createElement("span");

      innerRipple.className = "cursor-click-inner-ripple";

      innerRipple.style.left = `${x}px`;
      innerRipple.style.top = `${y}px`;

      trailRef.current.appendChild(innerRipple);

      setTimeout(() => {
        innerRipple.remove();
      }, 450);

      // -----------------------------------------------
      // Small splash droplets
      // -----------------------------------------------

      for (let i = 0; i < 10; i++) {
        const drop = document.createElement("span");

        drop.className = "cursor-click-drop";

        const angle = Math.random() * Math.PI * 2;

        const distance = 18 + Math.random() * 35;

        const size = 3 + Math.random() * 5;

        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;

        drop.style.left = `${x}px`;
        drop.style.top = `${y}px`;

        drop.style.setProperty(
          "--x",
          `${Math.cos(angle) * distance}px`
        );

        drop.style.setProperty(
          "--y",
          `${Math.sin(angle) * distance}px`
        );

        trailRef.current.appendChild(drop);

        setTimeout(() => {
          drop.remove();
        }, 700);
      }
    };

    // =================================================
    // Mouse Movement
    // =================================================

    let lastDropTime = 0;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Move cursor dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      // -----------------------------------------------
      // Water trail throttle
      // -----------------------------------------------

      const now = performance.now();

      if (now - lastDropTime > 35) {
        createWaterDrop(e.clientX, e.clientY);

        // Random ripple
        if (Math.random() > 0.75) {
          createRipple(e.clientX, e.clientY);
        }

        lastDropTime = now;
      }
    };

    // =================================================
    // Hover Detection
    // =================================================

    const onOver = (e) => {
      const target = e.target;

      setOverText(
        Boolean(
          target.closest(
            "textarea, input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button])"
          )
        )
      );

      setHovering(
        Boolean(
          target.closest(
            "a, button, [data-cursor-hover], select, input[type=checkbox], input[type=radio], input[type=submit], input[type=button]"
          )
        )
      );
    };

    // =================================================
    // Mouse Leave
    // =================================================

    const onLeaveWindow = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    // =================================================
    // Click
    // =================================================

    const onClick = (e) => {
      createClickSplash(e.clientX, e.clientY);
    };

    // =================================================
    // Event Listeners
    // =================================================

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("click", onClick);

    document.addEventListener(
      "mouseleave",
      onLeaveWindow
    );

    // =================================================
    // Cleanup
    // =================================================

    return () => {
      cancelAnimationFrame(raf);

      window.removeEventListener(
        "mousemove",
        onMove
      );

      window.removeEventListener(
        "mouseover",
        onOver
      );

      window.removeEventListener(
        "click",
        onClick
      );

      document.removeEventListener(
        "mouseleave",
        onLeaveWindow
      );

      document.documentElement.classList.remove(
        "custom-cursor-active"
      );
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* =============================================
          Water Particle Layer
      ============================================= */}

      <div
        ref={trailRef}
        className="cursor-water-trail"
        aria-hidden="true"
      />

      {/* =============================================
          Small Cursor Dot
      ============================================= */}

      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor-dot"
        style={{
          opacity: visible && !overText ? 1 : 0,
        }}
      />

      {/* =============================================
          Smooth Cursor Ring
      ============================================= */}

      <div
        ref={ringRef}
        aria-hidden="true"
        className={`custom-cursor-ring ${
          hovering ? "is-hovering" : ""
        }`}
        style={{
          opacity: visible && !overText ? 1 : 0,
        }}
      />
    </>
  );
}



// "use client";

// import { useEffect, useRef, useState } from "react";

// /**
//  * A small dot + trailing ring that replaces the system cursor on
//  * desktop (fine pointer, hover-capable) — never on touch devices,
//  * never under prefers-reduced-motion. Expands over interactive
//  * elements (links, buttons, [data-cursor-hover]) for a premium feel.
//  * Positioned via direct style writes (no React state per frame) to
//  * stay cheap; only "hovering"/"visible" toggles trigger a re-render.
//  */
// export default function CustomCursor() {
//   const dotRef = useRef(null);
//   const ringRef = useRef(null);
//   const [enabled, setEnabled] = useState(false);
//   const [hovering, setHovering] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const [overText, setOverText] = useState(false);

//   useEffect(() => {
//     const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
//     const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     if (!fine || reduced) return;
//     setEnabled(true);
//     document.documentElement.classList.add("custom-cursor-active");

//     let ringX = window.innerWidth / 2;
//     let ringY = window.innerHeight / 2;
//     let targetX = ringX;
//     let targetY = ringY;
//     let raf = null;

//     const tick = () => {
//       ringX += (targetX - ringX) * 0.2;
//       ringY += (targetY - ringY) * 0.2;
//       if (ringRef.current) ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
//       raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);

//     const onMove = (e) => {
//       targetX = e.clientX;
//       targetY = e.clientY;
//       if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
//       if (!visible) setVisible(true);
//     };
//     const onOver = (e) => {
//       const target = e.target;
//       setOverText(Boolean(target.closest("textarea, input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button])")));
//       setHovering(Boolean(target.closest("a, button, [data-cursor-hover], select, input[type=checkbox], input[type=radio], input[type=submit], input[type=button]")));
//     };
//     const onLeaveWindow = () => setVisible(false);

//     window.addEventListener("mousemove", onMove);
//     window.addEventListener("mouseover", onOver);
//     document.addEventListener("mouseleave", onLeaveWindow);

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseover", onOver);
//       document.removeEventListener("mouseleave", onLeaveWindow);
//       document.documentElement.classList.remove("custom-cursor-active");
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   if (!enabled) return null;

//   return (
//     <>
//       <div
//         ref={dotRef}
//         aria-hidden="true"
//         className="custom-cursor-dot"
//         style={{ opacity: visible && !overText ? 1 : 0 }}
//       />
//       <div
//         ref={ringRef}
//         aria-hidden="true"
//         className={`custom-cursor-ring ${hovering ? "is-hovering" : ""}`}
//         style={{ opacity: visible && !overText ? 1 : 0 }}
//       />
//     </>
//   );
// }
