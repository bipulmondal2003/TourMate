"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Encapsulates favorite-guide logic (fetch, add, remove) so any
 * component can reuse it without duplicating fetch calls.
 */
export function useFavorites() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      if (data.success) setFavorites(data.favorites.map((f) => f.guide._id || f.guide));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = async (guideId) => {
    const isFav = favorites.includes(guideId);
    const method = isFav ? "DELETE" : "POST";
    const res = await fetch(`/api/favorites/${guideId}`, { method });
    const data = await res.json();
    if (data.success) {
      setFavorites((prev) =>
        isFav ? prev.filter((id) => id !== guideId) : [...prev, guideId]
      );
    }
    return data;
  };

  return { favorites, loading, toggleFavorite, isFavorite: (id) => favorites.includes(id) };
}
