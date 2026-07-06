"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const url = `/api/views/${slug}`;

    // Increment on visit
    fetch(url, { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => setCount(null));
  }, [slug]);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      {count.toLocaleString()} views
    </span>
  );
}
