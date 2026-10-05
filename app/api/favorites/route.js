import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET() {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;

  await connectDB();
  const favorites = await Favorite.find({ tourist: user.id }).populate({
    path: "guide",
    populate: { path: "user", select: "name avatar" },
  });
  return ok({ favorites });
}

export const GET = withErrorHandling(handleGET, "GET /api/favorites");
