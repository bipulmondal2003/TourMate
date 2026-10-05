import { Landmark, Mountain, UtensilsCrossed, PawPrint, Sparkles, Moon } from "lucide-react";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const EXPERIENCES = [
  { icon: Landmark, label: "Heritage Tours" },
  { icon: Mountain, label: "Adventure" },
  { icon: UtensilsCrossed, label: "Food Trails" },
  { icon: PawPrint, label: "Wildlife" },
  { icon: Sparkles, label: "Spiritual" },
  { icon: Moon, label: "Nightlife" },
];

export default function PopularExperiences() {
  return (
    <section className="container-page py-20">
      <Reveal as="h2" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-12">
        Popular Experiences
      </Reveal>
      <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4" stagger={0.06}>
        {EXPERIENCES.map((exp) => (
          <RevealItem key={exp.label}>
            <div
              data-cursor-hover
              className="card p-5 text-center hover:-translate-y-1.5 hover:shadow-glow transition-all duration-300 cursor-default"
            >
              <exp.icon size={24} className="mx-auto mb-2 text-gold-600" />
              <p className="text-sm font-semibold">{exp.label}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
