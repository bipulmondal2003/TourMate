import { getCurrentUserFromCookies } from "@/lib/auth";
import { fail } from "@/lib/apiResponse";

export function requireAdmin() {
  const user = getCurrentUserFromCookies();
  if (!user) return { error: fail("Authentication required.", 401) };
  if (user.role !== "ADMIN") return { error: fail("Admin access required.", 403) };
  return { user };
}
