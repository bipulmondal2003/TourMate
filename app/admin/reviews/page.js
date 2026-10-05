"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Rating from "@/components/ui/Rating";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    if (data.success) setReviews(data.reviews);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleHidden = async (review) => {
    setActionId(review._id);
    await fetch(`/api/reviews/${review._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: !review.isHidden }),
    });
    await load();
    setActionId(null);
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Moderate Reviews</h1>
      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">
                    {r.tourist?.name} → {r.guide?.user?.name}
                  </p>
                  <Rating value={r.rating} size={13} />
                </div>
                <div className="flex items-center gap-2">
                  {r.isHidden && <Badge status="rejected">Hidden</Badge>}
                  <Button size="sm" variant="outline" loading={actionId === r._id} onClick={() => toggleHidden(r)}>
                    {r.isHidden ? "Unhide" : "Hide"}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-charcoal/70 dark:text-white/70">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
