import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import { requireAdmin } from "@/lib/adminGuard";
import { ok } from "@/lib/apiResponse";

export async function GET() {
  const { error } = requireAdmin();
  if (error) return error;
  await connectDB();
  const payments = await Payment.find()
    .populate("tourist", "name email")
    .populate("booking")
    .sort({ createdAt: -1 });
  return ok({ payments });
}
