import { connectDB } from "@/lib/db";
import Conversation from "@/models/Conversation";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";
import { isValidObjectId } from "@/utils/validators";

export async function GET() {
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
export async function POST(req) {
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
