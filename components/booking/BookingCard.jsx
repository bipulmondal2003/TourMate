import Link from "next/link";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { formatCurrency, formatDate } from "@/utils/format";

export default function BookingCard({ booking, viewerRole, basePath }) {
  const other = viewerRole === "TOURIST" ? booking.guide?.user : booking.tourist;

  return (
    <Link href={`${basePath}/bookings/${booking._id}`} className="card p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={other?.name || "User"} src={other?.avatar} size={36} />
          <div>
            <p className="font-semibold text-sm">{other?.name || "Unknown"}</p>
            <p className="text-xs text-charcoal/50 dark:text-white/50 flex items-center gap-1">
              <MapPin size={12} /> {booking.guide?.location}
            </p>
          </div>
        </div>
        <Badge status={booking.status} />
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-charcoal/70 dark:text-white/70">
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {formatDate(booking.date)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} /> {booking.startTime} ({booking.durationHours}h)
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} /> {booking.numberOfPeople}
        </span>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
        <Badge status={booking.paymentStatus} />
        <span className="font-bold">{formatCurrency(booking.totalPrice)}</span>
      </div>
    </Link>
  );
}
