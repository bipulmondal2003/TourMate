"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Generic data-fetching hook. Handles loading/error/data state so
 * individual pages don't repeat the same fetch boilerplate.
 */
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, options);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Request failed");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
