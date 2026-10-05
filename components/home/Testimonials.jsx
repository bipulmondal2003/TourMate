import Rating from "@/components/ui/Rating";
import Avatar from "@/components/ui/Avatar";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";

const TESTIMONIALS = [
  { name: "Ananya Sharma", text: "Our guide in Jaipur made history come alive. Booking was seamless from start to finish.", rating: 5 },
  { name: "Rohit Verma", text: "Found an amazing food tour guide in Amritsar through TourMate. Highly recommend!", rating: 5 },
  { name: "Priya Nair", text: "The trip planner gave us a great starting itinerary, and our guide fine-tuned it perfectly.", rating: 4 },
];

export default function Testimonials() {
  return (
    <section className="relative py-20 bg-navy-900/[0.03] dark:bg-white/[0.03]">
      <div className="container-page">
        <Reveal as="h2" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-12">
          What Travelers Say
        </Reveal>
        <RevealGroup className="grid md:grid-cols-3 gap-6" stagger={0.1}>
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.name}>
              <TiltCard maxTilt={4} className="card p-7 h-full flex flex-col">
                <Rating value={t.rating} size={14} />
                <p className="text-[15px] my-4 text-charcoal/80 dark:text-white/80 leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-black/5 dark:border-white/5">
                  <Avatar name={t.name} size={34} />
                  <span className="font-semibold text-sm">{t.name}</span>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
