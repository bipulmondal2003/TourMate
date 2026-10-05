import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";

export async function GET() {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;

  await connectDB();
  const notifications = await Notification.find({ user: user.id }).sort({ createdAt: -1 }).limit(50);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return ok({ notifications, unreadCount });
}
