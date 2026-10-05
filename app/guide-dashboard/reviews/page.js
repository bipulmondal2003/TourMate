"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import ReviewCard from "@/components/guides/ReviewCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function GuideReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const guideRes = await fetch("/api/guides/me").then((r) => r.json());
      if (guideRes.success) {
        const reviewRes = await fetch(`/api/guides/${guideRes.guide._id}/reviews`).then((r) => r.json());
        if (reviewRes.success) setReviews(reviewRes.reviews);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">My Reviews</h1>
      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" message="Reviews from tourists will show up here after completed bookings." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <ReviewCard
              key={r._id}
              authorName={r.tourist?.name}
              authorAvatar={r.tourist?.avatar}
              rating={r.rating}
              text={r.text}
              image={r.image}
              createdAt={r.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
