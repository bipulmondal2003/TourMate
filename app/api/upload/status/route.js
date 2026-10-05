import { ok } from "@/lib/apiResponse";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

// Lets the client check upload availability up front without triggering
// a real upload attempt, so the UI can show a graceful fallback.
export async function GET() {
  return ok({ configured: isCloudinaryConfigured });
}
