export default function Avatar({ src, name = "U", size = 40 }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border border-black/5 dark:border-white/10"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gold-500 text-navy-950 flex items-center justify-center font-bold shrink-0"
    >
      {initials}
    </div>
  );
}
