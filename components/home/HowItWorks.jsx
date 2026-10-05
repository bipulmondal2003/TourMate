import { Search, CalendarCheck, MapPinned } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";

const STEPS = [
  { icon: Search, title: "Discover", text: "Search and filter guides by destination, language, price and rating." },
  { icon: CalendarCheck, title: "Book", text: "Pick a date and time, and send a booking request in a few clicks." },
  { icon: MapPinned, title: "Explore", text: "Meet your guide and enjoy an authentic, personalized local experience." },
];

export default function HowItWorks() {
  return (
    <section className="container-page py-20">
      <Reveal as="div" className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">How TourMate Works</h2>
        <p className="text-charcoal/60 dark:text-white/60 mt-2">Three simple steps to your next adventure.</p>
      </Reveal>
      <RevealGroup className="grid sm:grid-cols-3 gap-6" stagger={0.12}>
        {STEPS.map((step, i) => (
          <RevealItem key={step.title}>
            <TiltCard maxTilt={4} className="card p-7 text-center h-full">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-gold-500/10 flex items-center justify-center mb-5 text-gold-600">
                <step.icon size={26} />
              </div>
              <div className="text-xs font-bold text-gold-600 mb-1.5 tracking-widest">STEP {i + 1}</div>
              <h3 className="font-bold text-lg mb-1.5">{step.title}</h3>
              <p className="text-sm text-charcoal/60 dark:text-white/60 leading-relaxed">{step.text}</p>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
