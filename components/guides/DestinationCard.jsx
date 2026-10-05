import Link from "next/link";
import { Users, ArrowUpRight } from "lucide-react";
import TiltCard from "@/components/motion/TiltCard";

export default function DestinationCard({ id, name, state, image, guideCount = 0 }) {
  return (
    <Link href={`/destinations/${id}`} className="block" data-cursor-hover>
      <TiltCard maxTilt={4} className="card overflow-hidden group">
        <div className="relative h-56 bg-navy-900/5 dark:bg-white/5 overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-navy-800 to-navy-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
          <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <ArrowUpRight size={16} className="text-white" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="font-bold text-xl tracking-tight">{name}</h3>
            <p className="text-xs text-white/70 mt-0.5">{state}</p>
          </div>
        </div>
        <div className="p-3.5 flex items-center gap-1.5 text-sm text-charcoal/60 dark:text-white/60">
          <Users size={14} className="text-gold-500" /> {guideCount} guides available
        </div>
      </TiltCard>
    </Link>
  );
}
