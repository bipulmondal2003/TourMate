import GuideCard from "@/components/guides/GuideCard";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { Users } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function FeaturedGuides({ guides, loadFailed = false }) {
  return (
    <section className="relative py-20 bg-navy-900/[0.03] dark:bg-white/[0.03]">
      <div className="container-page">
        <Reveal className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Featured Guides</h2>
            <p className="text-charcoal/60 dark:text-white/60 mt-1.5">Top-rated local experts ready to show you around.</p>
          </div>
          <Link href="/guides" data-cursor-hover className="text-sm font-semibold text-gold-600 hover:underline hidden sm:block">
            View all →
          </Link>
        </Reveal>
        {loadFailed ? (
          <EmptyState
            icon={Users}
            title="Guides are temporarily unavailable"
            message="We couldn't load guides right now. Please refresh the page in a moment."
          />
        ) : !guides || guides.length === 0 ? (
          <EmptyState icon={Users} title="No guides yet" message="Check back soon — new guides are joining TourMate regularly." />
        ) : (
          <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.slice(0, 8).map((g) => (
              <RevealItem key={g._id}>
                <GuideCard
                  id={g._id}
                  name={g.user?.name}
                  image={g.user?.avatar}
                  location={g.location}
                  rating={g.rating}
                  reviewCount={g.reviewCount}
                  price={g.pricePerDay}
                  languages={g.languages}
                  experience={g.experience}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
