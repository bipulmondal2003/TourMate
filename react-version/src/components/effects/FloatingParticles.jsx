/**
 * Pure-CSS drifting dust motes for dark hero areas. Positions and
 * timings are derived from the index (no Math.random) so server and
 * client render identically. Hidden entirely under reduced motion.
 */
const COUNT = 16;

export default function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => {
        const left = (i * 37 + 11) % 100;
        const top = (i * 53 + 7) % 100;
        const size = 2 + (i % 3);
        return (
          <span
            key={i}
            className="particle"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDuration: `${9 + (i % 5) * 2}s`,
              animationDelay: `${-(i % 7) * 1.3}s`,
            }}
          />
        );
      })}
    </div>
  );
}
