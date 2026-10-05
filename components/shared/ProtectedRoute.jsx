"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Client-side gate for role-restricted pages. Real enforcement always
 * happens on the server (API routes) — this only improves UX by
 * redirecting instead of flashing protected content.
 */
export default function ProtectedRoute({ roles, children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, user, roles, router]);

  if (loading || !isAuthenticated || (roles && user && !roles.includes(user.role))) {
    return <LoadingSpinner full />;
  }

  return children;
}
