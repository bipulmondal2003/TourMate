"use client";

import { MapPin } from "lucide-react";

/**
 * Google Maps Embed API (iframe, no client SDK/script loading needed).
 * The embed key is meant to be public — Google's own docs say to
 * restrict it by HTTP referrer in Cloud Console rather than hide it,
 * so NEXT_PUBLIC_ is correct and expected here (unlike Razorpay's
 * secret or Cloudinary's API secret, which must stay server-only).
 * Falls back to a plain location card when no key is configured.
 */
export default function MapEmbed({ location, height = 260 }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className="card flex items-center gap-3 p-5"
        style={{ height }}
      >
        <div className="h-11 w-11 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center shrink-0">
          <MapPin size={20} />
        </div>
        <div>
          <p className="font-semibold text-sm">{location}</p>
          <p className="text-xs text-charcoal/50 dark:text-white/50">
            Map preview unavailable — Google Maps isn&apos;t configured.
          </p>
        </div>
      </div>
    );
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`;

  return (
    <div className="card overflow-hidden" style={{ height }}>
      <iframe
        title={`Map showing ${location}`}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
