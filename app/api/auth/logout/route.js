import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

export async function POST() {
  clearAuthCookie();
  return ok({ message: "Logged out." });
}
