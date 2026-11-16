
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Client-side gate for role-restricted pages. Real enforcement always
 * happens on the server (API routes) — this only improves UX by
 * redirecting instead of flashing protected content.
 */
export default function ProtectedRoute({ roles, children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (roles && !roles.includes(user.role)) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, user, roles, navigate]);

  if (loading || !isAuthenticated || (roles && user && !roles.includes(user.role))) {
    return <LoadingSpinner full />;
  }

  return children;
}
