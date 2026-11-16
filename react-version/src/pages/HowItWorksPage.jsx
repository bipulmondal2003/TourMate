import HowItWorks from "@/components/home/HowItWorks";
import { UserPlus, Search, CalendarCheck, CreditCard, Star } from "lucide-react";

const DETAILED_STEPS = [
  { icon: UserPlus, title: "Create an account", text: "Sign up as a tourist or apply to become a guide." },
  { icon: Search, title: "Search & filter", text: "Find guides by destination, language, price, rating and category." },
  { icon: CalendarCheck, title: "Request a booking", text: "Choose a date, time and group size — the guide confirms availability." },
  { icon: CreditCard, title: "Pay securely", text: "Pay online (or use Demo Payment Mode) once your booking is confirmed." },
  { icon: Star, title: "Tour & review", text: "Enjoy your tour, then leave a review to help other travelers." },
];

export default function HowItWorksPage() {
  return (
    <div>
      <HowItWorks />
      <div className="container-page pb-16">
        <h2 className="text-2xl font-extrabold mb-6">The Full Journey</h2>
        <div className="space-y-4">
          {DETAILED_STEPS.map((step, i) => (
            <div key={step.title} className="card p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center shrink-0 font-bold">
                {i + 1}
              </div>
              <step.icon size={22} className="text-gold-600 shrink-0" />
              <div>
                <h3 className="font-bold">{step.title}</h3>
                <p className="text-sm text-charcoal/60 dark:text-white/60">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
