import DestinationCard from "@/components/guides/DestinationCard";
import Link from "next/link";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function PopularDestinations({ destinations }) {
  if (!destinations || destinations.length === 0) return null;
  return (
    <section className="container-page py-20">
      <Reveal className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Popular Destinations</h2>
          <p className="text-charcoal/60 dark:text-white/60 mt-1.5">Handpicked places travelers love to explore.</p>
        </div>
        <Link href="/destinations" data-cursor-hover className="text-sm font-semibold text-gold-600 hover:underline hidden sm:block">
          View all →
        </Link>
      </Reveal>
      <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.slice(0, 8).map((d) => (
          <RevealItem key={d._id}>
            <DestinationCard id={d._id} name={d.name} state={d.state} image={d.image} guideCount={d.guideCount} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
