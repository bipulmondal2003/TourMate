import Link from "next/link";
import { Bell, Calendar, CreditCard, MessageSquare, Star, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/utils/format";

const ICONS = {
  new_booking: Calendar,
  booking_accepted: CheckCircle,
  booking_rejected: XCircle,
  booking_cancelled: XCircle,
  payment_successful: CreditCard,
  payment_failed: CreditCard,
  tour_reminder: Bell,
  new_message: MessageSquare,
  new_review: Star,
  guide_approved: CheckCircle,
  guide_rejected: XCircle,
};

export default function NotificationItem({ type, title, message, isRead, link, createdAt, onClick }) {
  const Icon = ICONS[type] || Bell;
  const content = (
    <div
      onClick={onClick}
      className={`flex gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
        isRead ? "hover:bg-black/5 dark:hover:bg-white/5" : "bg-gold-500/10 hover:bg-gold-500/15"
      }`}
    >
      <div className="h-10 w-10 rounded-full bg-navy-900/5 dark:bg-white/10 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm text-charcoal/60 dark:text-white/60">{message}</p>
        <p className="text-xs text-charcoal/40 dark:text-white/40 mt-1">{formatDate(createdAt)}</p>
      </div>
      {!isRead && <span className="h-2 w-2 rounded-full bg-gold-500 mt-1 shrink-0" />}
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}
