import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import { requireAdmin } from "@/lib/adminGuard";
import { ok, withErrorHandling } from "@/lib/apiResponse";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const payments = await Payment.find()
    .populate("tourist", "name email")
    .populate("booking")
    .sort({ createdAt: -1 });
  return ok({ payments });
}

export const GET = withErrorHandling(handleGET, "GET /api/admin/payments");
