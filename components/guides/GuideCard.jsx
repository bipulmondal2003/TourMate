"use client";

import Link from "next/link";
import { MapPin, Heart, Languages, Briefcase, ArrowUpRight } from "lucide-react";
import Rating from "@/components/ui/Rating";
import Avatar from "@/components/ui/Avatar";
import Magnetic from "@/components/ui/Magnetic";
import TiltCard from "@/components/motion/TiltCard";
import { formatCurrency } from "@/utils/format";

/**
 * Presentational component — receives everything it needs via props.
 * Demonstrates: props, conditional rendering (favorite state), composition.
 */
export default function GuideCard({
  id,
  name,
  image,
  location,
  rating = 0,
  reviewCount = 0,
  price,
  languages = [],
  experience = 0,
  isFavorite = false,
  onToggleFavorite,
}) {
  return (
    <TiltCard maxTilt={5} className="card overflow-hidden group flex flex-col h-full">
      <div className="relative h-48 bg-navy-900/5 dark:bg-white/5 overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-navy-900/5 to-gold-500/5 dark:from-white/5 dark:to-gold-500/5">
            <Avatar name={name} size={64} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy-950/70 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
          <Briefcase size={11} className="text-gold-400" /> {experience}+ yrs
        </div>
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(id);
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            data-cursor-hover
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-navy-950/90 backdrop-blur-sm flex items-center justify-center shadow-soft transition-transform duration-200 hover:scale-110 active:scale-90"
          >
            <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : "text-charcoal dark:text-white"} />
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base tracking-tight">{name}</h3>
          <Rating value={rating} count={reviewCount} size={14} />
        </div>
        <p className="flex items-center gap-1 text-sm text-charcoal/60 dark:text-white/60">
          <MapPin size={14} className="text-gold-500 shrink-0" /> {location}
        </p>
        {languages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {languages.slice(0, 3).map((l) => (
              <span
                key={l}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-navy-900/5 dark:bg-white/10 text-charcoal/70 dark:text-white/70"
              >
                <Languages size={10} /> {l}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-black/5 dark:border-white/5">
          <div>
            <span className="font-bold text-lg text-gradient">{formatCurrency(price)}</span>
            <span className="text-xs text-charcoal/50 dark:text-white/50">/day</span>
          </div>
          <Magnetic strength={0.18}>
            <Link href={`/guides/${id}`} data-cursor-hover className="btn-primary text-sm px-4 py-2 group/btn">
              View Profile
              <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </TiltCard>
  );
}
