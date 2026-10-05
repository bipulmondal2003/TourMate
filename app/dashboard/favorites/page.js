"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import GuideCard from "@/components/guides/GuideCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesPage() {
  const { favorites, toggleFavorite, loading: favLoading } = useFavorites();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      if (data.success) setGuides(data.favorites.map((f) => f.guide));
      setLoading(false);
    }
    load();
  }, [favorites.length]);

  if (loading || favLoading) return <LoadingSpinner full />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Favorite Guides</h1>
      {guides.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" message="Tap the heart icon on a guide's profile to save them here." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map(
            (g) =>
              g && (
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
                  isFavorite
                  onToggleFavorite={toggleFavorite}
                />
              )
          )}
        </div>
      )}
    </div>
  );
}
