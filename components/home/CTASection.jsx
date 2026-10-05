import Link from "next/link";
import Magnetic from "@/components/ui/Magnetic";
import Reveal from "@/components/motion/Reveal";

export default function CTASection() {
  return (
    <section className="container-page pb-20">
      <Reveal
        className="relative overflow-hidden rounded-xl3 border border-white/10 shadow-glow-lg backdrop-blur-xl bg-gradient-to-br from-navy-900/95 to-navy-950/95 text-white p-10 sm:p-14 text-center"
      >
        <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-gold-500/20 blur-[90px]" />
        <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-teal-500/15 blur-[90px]" />
        <div className="relative">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Ready to explore <span className="text-gradient">like a local?</span>
          </h2>
          <p className="text-white/65 mb-8 max-w-xl mx-auto leading-relaxed">
            Find a trusted local guide on TourMate — or share your own expertise and start guiding travelers yourself.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Magnetic>
              <Link href="/guides" data-cursor-hover className="btn-secondary">
                Explore Guides
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/register?role=GUIDE" data-cursor-hover className="btn-outline border-white/30 text-white hover:bg-white/10">
                Become a Guide
              </Link>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
