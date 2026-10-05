import { connectDB } from "@/lib/db";
import Guide from "@/models/Guide";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, fail, withErrorHandling } from "@/lib/apiResponse";
import { createNotification } from "@/services/notificationService";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const query = status ? { status } : {};
  const guides = await Guide.find(query).populate("user", "name email avatar").sort({ createdAt: -1 });
  return ok({ guides });
}

async function handlePATCH(req) {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const { guideId, status } = await req.json();
  if (!["approved", "rejected", "suspended", "pending"].includes(status)) return fail("Invalid status.");

  const guide = await Guide.findByIdAndUpdate(guideId, { status }, { new: true }).populate("user", "name");
  if (!guide) return fail("Guide not found.", 404);

  if (status === "approved" || status === "rejected") {
    await createNotification({
      user: guide.user._id,
      type: status === "approved" ? "guide_approved" : "guide_rejected",
      title: status === "approved" ? "Guide profile approved!" : "Guide profile rejected",
      message:
        status === "approved"
          ? "Congratulations! You can now accept bookings."
          : "Your guide application was not approved this time.",
      link: "/guide-dashboard/profile",
    });
  }

  return ok({ guide });
}

export const GET = withErrorHandling(handleGET, "GET /api/admin/guides");
export const PATCH = withErrorHandling(handlePATCH, "PATCH /api/admin/guides");
