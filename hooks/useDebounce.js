"use client";

import { useState, useEffect } from "react";

/**
 * Debounces a fast-changing value (e.g. a search input) so we don't
 * fire an API call on every keystroke.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
