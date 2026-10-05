import { ok } from "@/lib/apiResponse";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

// Lets the client check upload availability up front without triggering
// a real upload attempt, so the UI can show a graceful fallback.
export async function GET() {
  return ok({ configured: isCloudinaryConfigured });
}
