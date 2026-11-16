import { Star } from "lucide-react";

export default function Rating({ value = 0, count, size = 16 }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={size} className="fill-gold-500 text-gold-500" />
      <span className="text-sm font-semibold">{value.toFixed ? value.toFixed(1) : value}</span>
      {count !== undefined && <span className="text-xs text-charcoal/50 dark:text-white/50">({count})</span>}
    </div>
  );
}
