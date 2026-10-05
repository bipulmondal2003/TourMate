import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";

export async function PATCH(req, { params }) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;

  await connectDB();
  const notification = await Notification.findOne({ _id: params.id, user: user.id });
  if (!notification) return fail("Notification not found.", 404);

  notification.isRead = true;
  await notification.save();
  return ok({ notification });
}
