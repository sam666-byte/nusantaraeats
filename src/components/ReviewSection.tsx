"use client";

import { useState, useEffect, useMemo } from "react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ReviewSectionProps {
  recipeSlug: string;
  recipeTitle: string;
}

function getStorageKey(slug: string) {
  return `nusantaraeats_reviews_${slug}`;
}

function loadReviews(slug: string): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(slug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReviews(slug: string, reviews: Review[]) {
  localStorage.setItem(getStorageKey(slug), JSON.stringify(reviews));
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";
  return (
    <div className={`flex gap-1 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-transform ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} ${
            star <= value ? "text-amber-400" : "text-zinc-700"
          }`}
        >
          {star <= value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ReviewSection({ recipeSlug, recipeTitle }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");

  useEffect(() => {
    setReviews(loadReviews(recipeSlug));
    setMounted(true);
  }, [recipeSlug]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      dist[r.rating - 1]++;
    });
    return dist;
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    if (sortBy === "newest") copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else if (sortBy === "highest") copy.sort((a, b) => b.rating - a.rating);
    else copy.sort((a, b) => a.rating - b.rating);
    return copy;
  }, [reviews, sortBy]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) return;

    const newReview: Review = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      helpful: 0,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveReviews(recipeSlug, updated);
    setName("");
    setRating(0);
    setComment("");
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function handleHelpful(reviewId: string) {
    const updated = reviews.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
    setReviews(updated);
    saveReviews(recipeSlug, updated);
  }

  if (!mounted) return null;

  return (
    <div className="mt-10 rounded-xl border border-amber-500/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">💬</span>
          Reviews & Comments
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Success message */}
      {submitted && (
        <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
          ✓ Your review has been posted! Thank you for sharing your experience.
        </div>
      )}

      {/* Rating Summary */}
      <div className="mt-6 grid gap-6 sm:grid-cols-[200px_1fr]">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-amber-400">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</div>
          <StarRating value={Math.round(avgRating)} readonly size="md" />
          <p className="mt-2 text-sm text-zinc-500">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
        </div>

        {/* Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star - 1];
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-8 text-right text-sm text-zinc-400">{star} ★</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-xs text-zinc-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-amber-500/20 bg-zinc-900/80 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Share Your Experience</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chef Budi"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Your Rating</label>
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`How was your experience making ${recipeTitle}? Any tips or modifications?`}
              required
              rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !comment.trim() || rating === 0}
            className="mt-4 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post Review
          </button>
        </form>
      )}

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div className="mt-6 flex items-center gap-2">
          <span className="text-xs text-zinc-500">Sort by:</span>
          {(["newest", "highest", "lowest"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                sortBy === opt
                  ? "bg-amber-600 text-black"
                  : "border border-zinc-700 text-zinc-400 hover:border-amber-500/30 hover:text-amber-400"
              }`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Reviews List */}
      <div className="mt-6 space-y-4">
        {sortedReviews.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-sm text-zinc-500">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-black">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{review.name}</p>
                    <div className="flex items-center gap-2">
                      <StarRating value={review.rating} readonly size="sm" />
                      <span className="text-xs text-zinc-500">{formatDate(review.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{review.comment}</p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-amber-400"
                >
                  <span>👍</span>
                  <span>Helpful{review.helpful > 0 ? ` (${review.helpful})` : ""}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
