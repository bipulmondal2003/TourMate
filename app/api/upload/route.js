import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, serverError } from "@/lib/apiResponse";
import { uploadImage, isCloudinaryConfigured } from "@/lib/cloudinary";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Accepts multipart/form-data with a single "file" field, uploads it to
// Cloudinary, and returns the resulting secure URL. Requires Cloudinary
// credentials to be configured — callers should check /api/upload/status
// (or just handle the 501 below) to show an appropriate fallback.
export async function POST(req) {
  try {
    const user = getCurrentUserFromCookies();
    const authError = requireAuth(user);
    if (authError) return authError;

    if (!isCloudinaryConfigured) {
      return fail("Image uploads aren't available: Cloudinary isn't configured on this server.", 501);
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") return fail("No file provided.");
    if (!ALLOWED_TYPES.includes(file.type)) return fail("Only JPEG, PNG, WebP or GIF images are allowed.");
    if (file.size > MAX_BYTES) return fail("Image must be smaller than 5MB.");

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const folder = formData.get("folder") || "tourmate";
    const url = await uploadImage(dataUri, String(folder));

    return ok({ url }, 201);
  } catch (err) {
    return serverError(err, "Image upload failed.");
  }
}
