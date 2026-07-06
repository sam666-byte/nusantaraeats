"use client";

import { useState } from "react";
import Link from "next/link";
import { recipes } from "@/data/recipes";

export interface RecipeCardData {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  waktu: number;
  porsi: string;
  kesulitan: "Easy" | "Medium" | "Hard";
  rating: number;
  origin: string;
}

const PAGE_SIZE = 12;

function toMinimal(r: typeof recipes[0]): RecipeCardData {
  return {
    id: r.id,
    slug: r.slug,
    title: r.shortTitle || r.title.replace(/ Recipe:.*$/, '').replace(/ Recipe$/, ''),
    description: r.description,
    image: r.image,
    waktu: r.waktu,
    porsi: r.porsi,
    kesulitan: r.kesulitan,
    rating: r.rating,
    origin: r.origin,
  };
}

interface Props {
  categorySlug: string;
  total: number;
}

export default function CategoryRecipeGrid({ categorySlug, total }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categoryRecipes = recipes
    .filter((r) => r.kategori === categorySlug)
    .slice(0, visibleCount)
    .map(toMinimal);

  const hasMore = visibleCount < total;

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categoryRecipes.map((r) => {
          const stars = "★".repeat(Math.floor(r.rating)) + "☆".repeat(5 - Math.floor(r.rating));
          return (
            <Link
              key={r.id}
              href={`/recipes/${r.slug}`}
              className="group overflow-hidden rounded-xl border border-amber-500/10 bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={r.image} alt={`Authentic ${r.title} from ${r.origin}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute right-3 top-3 rounded bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400 backdrop-blur-sm">{r.kesulitan}</span>
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-sm text-amber-400">
                  <span>{stars}</span>
                  <span className="ml-1 text-xs text-zinc-400">{r.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="font-serif text-xl font-bold text-white transition-colors group-hover:text-amber-400">{r.title}</h2>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">{r.description}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                  <span>⏱ {r.waktu} mins</span>
                  <span>👥 {r.porsi}</span>
                  <span>🗺️ {r.origin}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20"
          >
            Load More Recipes ({Math.min(visibleCount, total)} of {total})
          </button>
        </div>
      )}
    </>
  );
}
