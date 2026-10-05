import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

export async function POST(_req, { params }) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;
  if (!isValidObjectId(params.guideId)) return fail("Invalid guide id.");

  await connectDB();
  try {
    await Favorite.create({ tourist: user.id, guide: params.guideId });
  } catch (err) {
    if (err.code !== 11000) return fail("Failed to add favorite.", 500); // ignore duplicate
  }
  return ok({ message: "Added to favorites." }, 201);
}

export async function DELETE(_req, { params }) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;
  if (!isValidObjectId(params.guideId)) return fail("Invalid guide id.");

  await connectDB();
  await Favorite.findOneAndDelete({ tourist: user.id, guide: params.guideId });
  return ok({ message: "Removed from favorites." });
}
