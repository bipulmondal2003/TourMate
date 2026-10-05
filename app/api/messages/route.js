import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { getCurrentUserFromCookies } from "@/lib/auth";
import { ok, fail, requireAuth } from "@/lib/apiResponse";
import { createNotification } from "@/services/notificationService";
import { isValidObjectId } from "@/utils/validators";

export async function GET(req) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;

  await connectDB();
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  if (!isValidObjectId(conversationId)) return fail("Invalid conversation id.");

  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !conversation.participants.some((p) => p.toString() === user.id)) {
    return fail("Not authorized.", 403);
  }

  const messages = await Message.find({ conversation: conversationId })
    .populate("sender", "name avatar")
    .sort({ createdAt: 1 });
  return ok({ messages });
}

export async function POST(req) {
  const user = getCurrentUserFromCookies();
  const authError = requireAuth(user);
  if (authError) return authError;

  await connectDB();
  const { conversationId, text } = await req.json();
  if (!isValidObjectId(conversationId)) return fail("Invalid conversation id.");
  if (!text || !text.trim()) return fail("Message text is required.");

  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !conversation.participants.some((p) => p.toString() === user.id)) {
    return fail("Not authorized.", 403);
  }

  const message = await Message.create({ conversation: conversationId, sender: user.id, text, readBy: [user.id] });
  conversation.lastMessage = text;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const recipient = conversation.participants.find((p) => p.toString() !== user.id);
  if (recipient) {
    await createNotification({
      user: recipient,
      type: "new_message",
      title: "New message",
      message: text.slice(0, 80),
      link: `/dashboard/messages`,
    });
  }

  const populated = await message.populate("sender", "name avatar");
  return ok({ message: populated }, 201);
}
