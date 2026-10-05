import { ShieldCheck, Wallet, Globe2, HeadphonesIcon } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const POINTS = [
  { icon: ShieldCheck, title: "Verified Guides", text: "Every guide is manually reviewed and approved by our team." },
  { icon: Wallet, title: "Transparent Pricing", text: "No hidden fees — see the total cost before you confirm." },
  { icon: Globe2, title: "Local Expertise", text: "Guides who genuinely know their city's hidden gems." },
  { icon: HeadphonesIcon, title: "Always Supported", text: "In-app chat and notifications keep you in the loop." },
];

export default function WhyChooseUs() {
  return (
    <section className="container-page py-20">
      <Reveal as="h2" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-12">
        Why Choose TourMate
      </Reveal>
      <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" stagger={0.08}>
        {POINTS.map((p) => (
          <RevealItem key={p.title} className="text-center group">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-navy-900 dark:bg-gold-500 text-gold-400 dark:text-navy-950 flex items-center justify-center mb-4 shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <p.icon size={24} />
            </div>
            <h3 className="font-bold mb-1.5">{p.title}</h3>
            <p className="text-sm text-charcoal/60 dark:text-white/60 leading-relaxed">{p.text}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
