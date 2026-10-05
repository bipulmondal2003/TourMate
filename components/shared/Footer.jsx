import Link from "next/link";
import { Compass, Facebook, Instagram, Twitter } from "lucide-react";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "For Tourists",
    links: [
      { href: "/guides", label: "Explore Guides" },
      { href: "/destinations", label: "Destinations" },
      { href: "/trip-planner", label: "Trip Planner" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

const SOCIALS = [Facebook, Instagram, Twitter];

export default function Footer() {
  return (
    <footer className="relative mt-28 bg-navy-950 text-offwhite/80 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-[36rem] rounded-full bg-gold-500/10 blur-[100px] pointer-events-none" />

      <div className="container-page relative py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 font-extrabold text-lg text-white mb-3">
            <span className="h-9 w-9 rounded-full bg-gold-500 flex items-center justify-center shadow-glow">
              <Compass size={20} className="text-navy-950" />
            </span>
            TourMate
          </div>
          <p className="text-sm text-offwhite/55 mb-5 leading-relaxed max-w-[22ch]">
            Explore the World With Someone Who Knows It Best.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map((Icon, i) => (
              <span
                key={i}
                data-cursor-hover
                className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-500/50 hover:text-gold-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <Icon size={15} />
              </span>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-semibold text-sm tracking-wide mb-4">{col.title}</h4>
            <ul className="space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} data-cursor-hover className="text-offwhite/60 hover:text-gold-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-offwhite/40">
        © {new Date().getFullYear()} TourMate. Academic demo project — all data is fictional.
      </div>
    </footer>
  );
}
