import Avatar from "@/components/ui/Avatar";
import Rating from "@/components/ui/Rating";
import { formatDate } from "@/utils/format";

export default function ReviewCard({ authorName, authorAvatar, rating, text, image, createdAt }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-2">
        <Avatar name={authorName} src={authorAvatar} size={36} />
        <div>
          <p className="font-semibold text-sm">{authorName}</p>
          <p className="text-xs text-charcoal/50 dark:text-white/50">{formatDate(createdAt)}</p>
        </div>
        <div className="ml-auto">
          <Rating value={rating} size={14} />
        </div>
      </div>
      <p className="text-sm text-charcoal/80 dark:text-white/80">{text}</p>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="Review attachment" className="mt-3 h-28 w-28 object-cover rounded-lg" />
      )}
    </div>
  );
}
