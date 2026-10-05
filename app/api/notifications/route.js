import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
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
  const notifications = await Notification.find({ user: user.id }).sort({ createdAt: -1 }).limit(50);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return ok({ notifications, unreadCount });
}

export const GET = withErrorHandling(handleGET, "GET /api/notifications");
