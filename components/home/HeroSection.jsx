"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import FloatingParticles from "@/components/effects/FloatingParticles";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroSection() {
  const router = useRouter();
  const [form, setForm] = useState({ destination: "", date: "", people: 1 });
  const searchBtnRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : 90]);
  const contentOpacity = useTransform(scrollY, [0, 450], [1, shouldReduceMotion ? 1 : 0.15]);
  const orbY = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : -60]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.destination) params.set("search", form.destination);
    router.push(`/guides?${params.toString()}`);
  };

  const handleMagnet = useCallback((e) => {
    const el = searchBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.28}px)`;
  }, []);
  const resetMagnet = useCallback(() => {
    if (searchBtnRef.current) searchBtnRef.current.style.transform = "translate(0, 0)";
  }, []);

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      {/* Base gradient + hero-local glows, layered above the global aurora so it stays cinematic */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/90 to-navy-950" />
      <motion.div style={{ y: orbY }} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -right-20 h-[30rem] w-[30rem] rounded-full bg-gold-500/20 blur-[110px]"
          style={{ transform: "translate(calc(var(--px, 0) * 14px), calc(var(--py, 0) * 10px))" }}
        />
        <div
          className="absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-teal-500/15 blur-[110px]"
          style={{ transform: "translate(calc(var(--px, 0) * -12px), calc(var(--py, 0) * 8px))" }}
        />
      </motion.div>
      <FloatingParticles />

      <div className="container-page relative py-28 lg:py-36 text-center">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          variants={shouldReduceMotion ? undefined : container}
          initial={shouldReduceMotion ? undefined : "hidden"}
          animate={shouldReduceMotion ? undefined : "show"}
        >
          <motion.span
            variants={shouldReduceMotion ? undefined : item}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-gold-300 text-xs font-semibold tracking-[0.14em] mb-7"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
            TRUSTED LOCAL GUIDES ACROSS INDIA
          </motion.span>

          <motion.h1
            variants={shouldReduceMotion ? undefined : item}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight max-w-4xl mx-auto"
          >
            Explore the World With
            <br className="hidden sm:block" /> Someone Who <span className="text-gradient">Knows It Best.</span>
          </motion.h1>

          <motion.p
            variants={shouldReduceMotion ? undefined : item}
            className="mt-6 text-[17px] text-white/65 max-w-xl mx-auto leading-relaxed"
          >
            Discover, connect, and book verified local tour guides for unforgettable, authentic experiences.
          </motion.p>

          <motion.form
            variants={shouldReduceMotion ? undefined : item}
            onSubmit={handleSearch}
            className="mt-11 max-w-3xl mx-auto p-3 flex flex-col md:flex-row gap-2 text-left rounded-2xl bg-white/[0.07] backdrop-blur-xl backdrop-saturate-150 border border-white/15 shadow-glow-lg"
          >
            <div className="flex-1 flex items-center gap-2 px-3 text-white">
              <MapPin size={18} className="text-gold-400 shrink-0" />
              <input
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="Where do you want to go?"
                className="w-full py-2.5 bg-transparent outline-none text-sm placeholder:text-white/40"
                aria-label="Destination"
              />
            </div>
            <div className="flex items-center gap-2 px-3 border-t md:border-t-0 md:border-l border-white/10 text-white">
              <Calendar size={18} className="text-gold-400 shrink-0" />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="py-2.5 bg-transparent outline-none text-sm [color-scheme:dark]"
                aria-label="Date"
              />
            </div>
            <div className="flex items-center gap-2 px-3 border-t md:border-t-0 md:border-l border-white/10 text-white">
              <Users size={18} className="text-gold-400 shrink-0" />
              <input
                type="number"
                min={1}
                value={form.people}
                onChange={(e) => setForm({ ...form, people: e.target.value })}
                className="py-2.5 w-16 bg-transparent outline-none text-sm"
                aria-label="Number of people"
              />
            </div>
            <button
              type="submit"
              className="magnetic btn-secondary shrink-0"
              onMouseMove={handleMagnet}
              onMouseLeave={resetMagnet}
              ref={searchBtnRef}
              data-cursor-hover
            >
              <Search size={16} /> Search Guides
            </button>
          </motion.form>
        </motion.div>

        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/30"
            >
              <ChevronDown size={22} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
