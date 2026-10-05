import { connectDB } from "@/lib/db";
import Conversation from "@/models/Conversation";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth, withErrorHandling } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

// Always run at request time. Without this, Next.js can pre-render GET handlers during `next build`,
// freezing database results (and ignoring query strings) in the deployed app.
export const dynamic = "force-dynamic";

async function handleGET() {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;

  await connectDB();
  const conversations = await Conversation.find({ participants: user.id })
    .populate("participants", "name avatar role")
    .sort({ lastMessageAt: -1 });
  return ok({ conversations });
}

// Starts (or reuses) a conversation with another user
async function handlePOST(req) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;

  await connectDB();
  const { otherUserId } = await req.json();
  if (!isValidObjectId(otherUserId)) return fail("Invalid user id.");

  let conversation = await Conversation.findOne({
    participants: { $all: [user.id, otherUserId], $size: 2 },
  });
  if (!conversation) {
    conversation = await Conversation.create({ participants: [user.id, otherUserId] });
  }
  conversation = await conversation.populate("participants", "name avatar role");

  return ok({ conversation }, 201);
}

export const GET = withErrorHandling(handleGET, "GET /api/conversations");
export const POST = withErrorHandling(handlePOST, "POST /api/conversations");
