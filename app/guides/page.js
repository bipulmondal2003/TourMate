"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, SlidersHorizontal } from "lucide-react";
import GuideCard from "@/components/guides/GuideCard";
import SearchBar from "@/components/guides/SearchBar";
import FilterPanel from "@/components/guides/FilterPanel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Modal from "@/components/ui/Modal";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { useDebounce } from "@/hooks/useDebounce";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_FILTERS = { language: "", category: "", minPrice: "", maxPrice: "", rating: "", sort: "rating" };

function GuidesContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [guides, setGuides] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const loadGuides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
      params.set("page", page);
      params.set("limit", 12);

      const res = await fetch(`/api/guides?${params.toString()}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setGuides(data.guides);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters, page]);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  return (
    <div className="container-page py-10">
      <Reveal>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Explore Guides</h1>
        <p className="text-charcoal/60 dark:text-white/60 mb-6">Find the perfect local expert for your next trip.</p>
      </Reveal>

      <Reveal delay={0.05} className="mb-6 flex gap-2">
        <SearchBar value={search} onChange={setSearch} />
        <button
          onClick={() => setMobileFiltersOpen(true)}
          data-cursor-hover
          className="lg:hidden btn-outline shrink-0 px-4"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={16} />
        </button>
      </Reveal>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
          </div>
        </aside>

        <Modal isOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filters" size="sm">
          <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
        </Modal>

        <div>
          {loading ? (
            <LoadingSpinner full />
          ) : error ? (
            <ErrorMessage message={error} onRetry={loadGuides} />
          ) : guides.length === 0 ? (
            <EmptyState icon={Users} title="No guides found" message="Try adjusting your search or filters." />
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${page}-${debouncedSearch}-${JSON.stringify(filters)}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {guides.map((g) => (
                    <GuideCard
                      key={g._id}
                      id={g._id}
                      name={g.user?.name}
                      image={g.user?.avatar}
                      location={g.location}
                      rating={g.rating}
                      reviewCount={g.reviewCount}
                      price={g.pricePerDay}
                      languages={g.languages}
                      experience={g.experience}
                      isFavorite={isFavorite(g._id)}
                      onToggleFavorite={isAuthenticated ? toggleFavorite : undefined}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      data-cursor-hover
                      className={`h-9 w-9 rounded-full text-sm font-semibold transition-all duration-200 ${
                        p === page
                          ? "bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-950 shadow-glow scale-105"
                          : "hover:bg-black/5 dark:hover:bg-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuidesPage() {
  return (
    <Suspense fallback={<LoadingSpinner full />}>
      <GuidesContent />
    </Suspense>
  );
}
