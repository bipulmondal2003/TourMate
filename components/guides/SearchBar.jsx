"use client";

import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search by destination, city, or guide name" }) {
  return (
    <div className="relative flex-1">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-white/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search guides"
        className="input-field pl-11 py-3 focus:shadow-glow transition-shadow"
      />
    </div>
  );
}
