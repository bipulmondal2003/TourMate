"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How do I book a guide?", a: "Search for a guide, open their profile, and click 'Book This Guide' to submit a request with your preferred date and time." },
  { q: "How is the price calculated?", a: "Pricing is based on the guide's hourly/daily rate, the duration you select, and the number of people — calculated securely on our server." },
  { q: "What if Razorpay isn't configured?", a: "The platform automatically switches to a clearly labeled Demo Payment Mode so you can still test the full booking flow." },
  { q: "How do I become a guide?", a: "Register with the 'Guide' role. Your profile will be reviewed and approved by an admin before you can accept bookings." },
  { q: "Can I cancel a booking?", a: "Yes, pending or confirmed bookings can be cancelled from your dashboard before the tour date." },
  { q: "When can I leave a review?", a: "Reviews can only be submitted after a booking has been marked completed by the guide." },
];

export default function FaqPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="container-page py-16 max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {FAQS.map((item, i) => (
          <div key={item.q} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left font-semibold"
              aria-expanded={open === i}
            >
              {item.q}
              <ChevronDown size={18} className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm text-charcoal/70 dark:text-white/70">{item.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
