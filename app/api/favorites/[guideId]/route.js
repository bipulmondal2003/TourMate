import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, withErrorHandling } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

// Always run at request time (reads the auth cookie and live data).
export const dynamic = "force-dynamic";

async function handlePOST(_req, { params }) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;
  if (!isValidObjectId(params.guideId)) return fail("Invalid guide id.");

  await connectDB();
  try {
    await Favorite.create({ tourist: user.id, guide: params.guideId });
  } catch (err) {
    // 11000 = duplicate key: the guide is already a favorite, which is fine.
    // Anything else is a real failure: rethrow so it is logged and returned as a safe 500.
    if (err.code !== 11000) throw err;
  }
  return ok({ message: "Added to favorites." }, 201);
}

async function handleDELETE(_req, { params }) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;
  if (!isValidObjectId(params.guideId)) return fail("Invalid guide id.");

  await connectDB();
  await Favorite.findOneAndDelete({ tourist: user.id, guide: params.guideId });
  return ok({ message: "Removed from favorites." });
}

export const POST = withErrorHandling(handlePOST, "POST /api/favorites/[guideId]");
export const DELETE = withErrorHandling(handleDELETE, "DELETE /api/favorites/[guideId]");
