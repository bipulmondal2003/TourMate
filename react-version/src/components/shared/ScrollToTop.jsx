import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Next.js scrolls to the top on every navigation; React Router does not, so we do it here. */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
