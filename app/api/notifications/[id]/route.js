import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handlePATCH(req, { params }) {
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

export const PATCH = withErrorHandling(handlePATCH, "PATCH /api/notifications/[id]");
