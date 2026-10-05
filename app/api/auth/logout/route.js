import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/apiResponse";

export async function POST() {
  clearAuthCookie();
  return ok({ message: "Logged out." });
}
