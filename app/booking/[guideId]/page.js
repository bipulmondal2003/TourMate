"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Rating from "@/components/ui/Rating";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import BookingForm from "@/components/booking/BookingForm";

export default function BookingPage() {
  const { guideId } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/guides/${guideId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setGuide(data.guide);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [guideId]);

  if (loading) return <LoadingSpinner full />;
  if (error) return <ErrorMessage message={error} />;
  if (!guide) return null;

  return (
    <div className="container-page py-10 max-w-xl mx-auto">
      <div className="card p-4 flex items-center gap-3 mb-6">
        <Avatar name={guide.user?.name} src={guide.user?.avatar} size={48} />
        <div>
          <p className="font-bold">{guide.user?.name}</p>
          <p className="flex items-center gap-1 text-sm text-charcoal/60 dark:text-white/60">
            <MapPin size={13} /> {guide.location}
          </p>
        </div>
        <div className="ml-auto">
          <Rating value={guide.rating} count={guide.reviewCount} size={14} />
        </div>
      </div>
      <BookingForm guide={guide} />
    </div>
  );
}
