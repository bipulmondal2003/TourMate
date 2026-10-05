"use client";

import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { SlidersHorizontal } from "lucide-react";

const LANGUAGES = ["English", "Hindi", "Punjabi", "French", "Spanish", "German"];
const CATEGORIES = ["Heritage", "Adventure", "Food", "Wildlife", "Spiritual", "Nightlife"];

/**
 * Controlled filter form. Every field is driven by `filters` state
 * that the parent owns — demonstrates lifting state up.
 */
export default function FilterPanel({ filters, onChange, onReset }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });
  const activeCount = Object.entries(filters).filter(([k, v]) => k !== "sort" && v).length;

  return (
    <div className="card p-5 space-y-5 shadow-glow">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2 tracking-tight">
          <SlidersHorizontal size={16} className="text-gold-500" /> Filters
          {activeCount > 0 && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-gold-500 text-navy-950">{activeCount}</span>
          )}
        </h3>
        <button onClick={onReset} data-cursor-hover className="text-xs text-gold-600 font-semibold hover:underline">
          Reset
        </button>
      </div>

      <Select label="Language" value={filters.language} onChange={(e) => update("language", e.target.value)}>
        <option value="">Any language</option>
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </Select>

      <Select label="Category" value={filters.category} onChange={(e) => update("category", e.target.value)}>
        <option value="">Any category</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <div>
        <label className="label-field">Price Range (₹/day)</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            placeholder="Min"
          />
          <Input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            placeholder="Max"
          />
        </div>
      </div>

      <Select label="Minimum Rating" value={filters.rating} onChange={(e) => update("rating", e.target.value)}>
        <option value="">Any rating</option>
        {[4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r}+ stars
          </option>
        ))}
      </Select>

      <div className="pt-4 border-t border-black/5 dark:border-white/5">
        <Select label="Sort By" value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="rating">Top Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="experience">Most Experienced</option>
        </Select>
      </div>
    </div>
  );
}
