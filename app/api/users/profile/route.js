import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Guide from "@/models/Guide";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

// Update the current user's own profile (name, phone, avatar) and,
// for guides, their guide-profile fields.
async function handlePATCH(req) {
  const session = getCurrentUserFromCookies();
  const authError = requireAuth(session);
  if (authError) return authError;

  await connectDB();
  const body = await req.json();
  const { name, phone, avatar, guideFields } = body;

  const user = await User.findById(session.id);
  if (!user) return fail("User not found.", 404);

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();

  let guide = null;
  if (session.role === "GUIDE" && guideFields) {
    guide = await Guide.findOneAndUpdate({ user: session.id }, guideFields, { new: true });
  }

  return ok({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone },
    guide,
  });
}

export const PATCH = withErrorHandling(handlePATCH, "PATCH /api/users/profile");
