import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";

export async function GET() {
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
