// "use client";

// import { useMouseGlow } from "@/hooks/useMouseGlow";

// /**
//  * Mounted once in the root layout. Renders the fixed aurora background
//  * (fluid, slowly-drifting gradient blobs with mouse parallax) and the
//  * cursor spotlight overlay that follows the pointer across every page.
//  * Both read CSS custom properties set by a single mouse listener.
//  */
// export default function GlassEffects() {
//   useMouseGlow();

//   return (
//     <>
//       <div className="aurora-stage" aria-hidden="true">
//         <div
//           className="aurora-blob"
//           style={{
//             width: 520,
//             height: 520,
//             top: "-10%",
//             left: "2%",
//             background: "radial-gradient(circle, rgba(238,166,42,0.45), transparent 70%)",
//             animation: "drift-a 24s ease-in-out infinite",
//             transform: "translate(calc(var(--px, 0) * 16px), calc(var(--py, 0) * 12px))",
//           }}
//         />
//         <div
//           className="aurora-blob"
//           style={{
//             width: 460,
//             height: 460,
//             top: "26%",
//             right: "0%",
//             background: "radial-gradient(circle, rgba(24,38,66,0.5), transparent 70%)",
//             animation: "drift-b 28s ease-in-out infinite",
//             transform: "translate(calc(var(--px, 0) * -20px), calc(var(--py, 0) * 10px))",
//           }}
//         />
//         <div
//           className="aurora-blob"
//           style={{
//             width: 480,
//             height: 480,
//             bottom: "-14%",
//             left: "28%",
//             background: "radial-gradient(circle, rgba(56,150,180,0.32), transparent 70%)",
//             animation: "drift-c 32s ease-in-out infinite",
//             transform: "translate(calc(var(--px, 0) * 12px), calc(var(--py, 0) * -14px))",
//           }}
//         />
//       </div>
//       <div className="cursor-spotlight" aria-hidden="true" />
//     </>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useMouseGlow } from "@/hooks/useMouseGlow";

export default function GlassEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMouseGlow();

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="aurora-stage" aria-hidden="true">
        <div
          className="aurora-blob"
          style={{
            width: 520,
            height: 520,
            top: "-10%",
            left: "2%",
            background:
              "radial-gradient(circle, rgba(238,166,42,0.45), transparent 70%)",
            animation: "drift-a 24s ease-in-out infinite",
            transform:
              "translate(calc(var(--px, 0) * 16px), calc(var(--py, 0) * 12px))",
          }}
        />

        <div
          className="aurora-blob"
          style={{
            width: 460,
            height: 460,
            top: "26%",
            right: "0%",
            background:
              "radial-gradient(circle, rgba(24,38,66,0.5), transparent 70%)",
            animation: "drift-b 28s ease-in-out infinite",
            transform:
              "translate(calc(var(--px, 0) * -20px), calc(var(--py, 0) * 10px))",
          }}
        />

        <div
          className="aurora-blob"
          style={{
            width: 480,
            height: 480,
            bottom: "-14%",
            left: "28%",
            background:
              "radial-gradient(circle, rgba(56,150,180,0.32), transparent 70%)",
            animation: "drift-c 32s ease-in-out infinite",
            transform:
              "translate(calc(var(--px, 0) * 12px), calc(var(--py, 0) * -14px))",
          }}
        />
      </div>

      <div className="cursor-spotlight" aria-hidden="true" />
    </>
  );
}