"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Languages, Briefcase, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import Rating from "@/components/ui/Rating";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import EmptyState from "@/components/ui/EmptyState";
import ReviewCard from "@/components/guides/ReviewCard";
import MapEmbed from "@/components/shared/MapEmbed";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
import Magnetic from "@/components/ui/Magnetic";
import { formatCurrency } from "@/utils/format";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/context/AuthContext";

export default function GuideDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [guideRes, reviewsRes] = await Promise.all([
          fetch(`/api/guides/${id}`).then((r) => r.json()),
          fetch(`/api/guides/${id}/reviews`).then((r) => r.json()),
        ]);
        if (!guideRes.success) throw new Error(guideRes.message);
        setGuide(guideRes.guide);
        if (reviewsRes.success) setReviews(reviewsRes.reviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const startConversation = async () => {
    if (!guide?.user?._id) return;
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otherUserId: guide.user._id }),
    });
    const data = await res.json();
    if (data.success) window.location.href = "/dashboard/messages";
  };

  if (loading) return <LoadingSpinner full />;
  if (error) return <ErrorMessage message={error} />;
  if (!guide) return <EmptyState title="Guide not found" />;

  return (
    <div>
      {/* Cinematic cover banner */}
      <div className="relative h-48 sm:h-60 overflow-hidden bg-navy-950">
        {guide.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={guide.coverImage} alt="" className="h-full w-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-950" />
        )}
        <div className="absolute -top-16 right-10 h-56 w-56 rounded-full bg-gold-500/20 blur-[90px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-offwhite dark:from-navy-950 to-transparent" />
      </div>

      <div className="container-page -mt-16 sm:-mt-20 pb-10 relative">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div>
            <Reveal className="card p-6 mb-6">
              <div className="flex items-start gap-4">
                <Avatar name={guide.user?.name} src={guide.user?.avatar} size={84} />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                      {guide.user?.name}
                      <ShieldCheck size={18} className="text-teal-500" aria-label="Verified guide" />
                    </h1>
                    {isAuthenticated && user?.role === "TOURIST" && (
                      <button
                        onClick={() => toggleFavorite(guide._id)}
                        data-cursor-hover
                        className="h-10 w-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
                        aria-label="Toggle favorite"
                      >
                        <Heart size={18} className={isFavorite(guide._id) ? "fill-red-500 text-red-500" : ""} />
                      </button>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-sm text-charcoal/60 dark:text-white/60 mt-1">
                    <MapPin size={14} className="text-gold-500" /> {guide.location}
                  </p>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <Rating value={guide.rating} count={guide.reviewCount} />
                    <span className="flex items-center gap-1 text-sm text-charcoal/60 dark:text-white/60">
                      <Briefcase size={14} /> {guide.experience}+ years experience
                    </span>
                  </div>
                </div>
              </div>

              {guide.bio && <p className="mt-5 text-sm text-charcoal/80 dark:text-white/80 leading-relaxed">{guide.bio}</p>}

              <div className="flex flex-wrap gap-2 mt-5">
                {guide.languages?.map((l) => (
                  <span key={l} className="text-xs px-3 py-1 rounded-full bg-navy-900/5 dark:bg-white/10 flex items-center gap-1">
                    <Languages size={12} /> {l}
                  </span>
                ))}
                {guide.specialties?.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>

              {isAuthenticated && user?.role === "TOURIST" && (
                <button onClick={startConversation} data-cursor-hover className="btn-outline mt-6 text-sm">
                  <MessageCircle size={16} /> Message {guide.user?.name?.split(" ")[0]}
                </button>
              )}
            </Reveal>

            <Reveal delay={0.05} className="mb-6">
              <MapEmbed location={guide.location} />
            </Reveal>

            <Reveal delay={0.1} className="card p-6">
              <h2 className="font-bold text-lg mb-4">Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <EmptyState title="No reviews yet" message="Be the first to book and review this guide." />
              ) : (
                <RevealGroup className="space-y-3" stagger={0.06}>
                  {reviews.map((r) => (
                    <RevealItem key={r._id}>
                      <ReviewCard
                        authorName={r.tourist?.name}
                        authorAvatar={r.tourist?.avatar}
                        rating={r.rating}
                        text={r.text}
                        image={r.image}
                        createdAt={r.createdAt}
                      />
                    </RevealItem>
                  ))}
                </RevealGroup>
              )}
            </Reveal>
          </div>

          <div>
            <TiltCard maxTilt={3} className="card p-6 sticky top-24 shadow-glow-lg">
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <p className="text-3xl font-extrabold text-gradient">{formatCurrency(guide.pricePerDay)}</p>
                  <p className="text-xs text-charcoal/50 dark:text-white/50">per day</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(guide.pricePerHour)}</p>
                  <p className="text-xs text-charcoal/50 dark:text-white/50">per hour</p>
                </div>
              </div>
              <Magnetic strength={0.12} block>
                <Link href={`/booking/${guide._id}`} data-cursor-hover className="btn-primary w-full">
                  Book This Guide
                </Link>
              </Magnetic>
              <p className="text-xs text-charcoal/40 dark:text-white/40 mt-4 text-center">
                Free to request — you&apos;ll only pay once the guide confirms.
              </p>
            </TiltCard>
          </div>
        </div>
      </div>
    </div>
  );
}
