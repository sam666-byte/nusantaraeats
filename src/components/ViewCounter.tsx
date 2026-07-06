"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `/api/views/${slug}`;

    fetch(url, { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count || 0);
        setLoading(false);
      })
      .catch(() => {
        setCount(0);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <span className="text-xs text-zinc-500">Loading views...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 px-6 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20">
        <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-400">{count.toLocaleString()}</p>
        <p className="text-xs text-zinc-400">people viewed this recipe</p>
      </div>
    </div>
  );
}
