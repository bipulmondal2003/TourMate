import { Compass, Users, Globe2, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container-page py-16 max-w-3xl">
      <h1 className="text-3xl font-extrabold mb-4 flex items-center gap-2">
        <Compass className="text-gold-500" /> About TourMate
      </h1>
      <p className="text-charcoal/70 dark:text-white/70 mb-6">
        TourMate is a tour guide booking platform built to connect travelers with knowledgeable local guides.
        Our mission is to make authentic, personalized travel experiences accessible and easy to book — while
        giving local guides a reliable way to grow their business.
      </p>
      <div className="grid sm:grid-cols-3 gap-6 mt-10">
        {[
          { icon: Users, title: "For Travelers", text: "Discover vetted local guides for any destination." },
          { icon: Globe2, title: "For Guides", text: "Manage bookings, availability and earnings in one place." },
          { icon: ShieldCheck, title: "Trust & Safety", text: "Every guide profile is reviewed before going live." },
        ].map((item) => (
          <div key={item.title} className="card p-5 text-center">
            <item.icon className="mx-auto mb-2 text-gold-600" size={26} />
            <h3 className="font-bold mb-1">{item.title}</h3>
            <p className="text-sm text-charcoal/60 dark:text-white/60">{item.text}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-charcoal/40 dark:text-white/40 mt-10">
        This is an academic project. All guides, destinations and reviews are fictional demo data.
      </p>
    </div>
  );
}
