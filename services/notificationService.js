import Notification from "@/models/Notification";

/**
 * Central place for creating notifications so every route follows
 * the same shape. Demonstrates the "services" layer separating
 * business logic from route handlers.
 */
export async function createNotification({ user, type, title, message, link = "" }) {
  return Notification.create({ user, type, title, message, link });
}
