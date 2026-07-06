"use client";

import Link from "next/link";
import { Recipe } from "@/types";

export default function RecipeCard({
  recipe,
  onClick,
  index,
}: {
  recipe: Recipe;
  onClick: () => void;
  index: number;
}) {
  const stars =
    "★".repeat(Math.floor(recipe.rating)) +
    "☆".repeat(5 - Math.floor(recipe.rating));

  const categoryColors: Record<string, string> = {
    "makanan-berat": "bg-amber-600",
    "sup-soto": "bg-orange-600",
    "sate-panggang": "bg-red-600",
    "jajanan": "bg-yellow-600",
    "minuman": "bg-green-600",
  };

  return (
    <div
      className="group overflow-hidden rounded-xl border border-amber-500/10 bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10"
      style={{
        opacity: 0,
        animation: `cardReveal 0.6s ease-out ${index * 0.06}s forwards`,
      }}
    >
      <style>{`
        @keyframes cardReveal {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Clickable image area - opens modal */}
      <div
        className="relative h-56 cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        <img
          src={recipe.image}
          alt={`Authentic ${recipe.shortTitle || recipe.title.replace(/ Recipe:.*$/, '').replace(/ Recipe$/, '')} from ${recipe.origin} — traditional Indonesian ${recipe.kategori === 'makanan-berat' ? 'main dish' : recipe.kategori === 'sup-soto' ? 'soup' : recipe.kategori === 'sate-panggang' ? 'grilled dish' : recipe.kategori === 'jajanan' ? 'snack' : 'drink'}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          width="800"
          height="448"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Category badge */}
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${categoryColors[recipe.kategori] || 'bg-amber-600'}`}>
          {recipe.kategori === "makanan-berat" ? "🍛 Main" : recipe.kategori === "sup-soto" ? "🍜 Soup" : recipe.kategori === "sate-panggang" ? "🍢 Grill" : recipe.kategori === "jajanan" ? "🍡 Snack" : "🍹 Drink"}
        </span>
        
        {/* Difficulty badge */}
        <span className="absolute right-3 top-3 rounded bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400 backdrop-blur-sm">
          {recipe.kesulitan}
        </span>
        
        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-black/60 px-2 py-1 backdrop-blur-sm">
          <span className="text-sm text-amber-400">{stars}</span>
          <span className="text-xs text-zinc-300 font-semibold">{recipe.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg font-bold text-white transition-colors group-hover:text-amber-400 line-clamp-1">
          {recipe.shortTitle || recipe.title.replace(/ Recipe:.*$/, '').replace(/ Recipe$/, '')}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
          {recipe.description}
        </p>
        
        {/* Metadata row */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1">⏱ {recipe.waktu}m</span>
          <span className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1">📍 {recipe.origin}</span>
          <span className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1">👥 {recipe.porsi}</span>
        </div>
        
        <Link
          href={`/recipes/${recipe.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300"
        >
          View Recipe →
        </Link>
      </div>
    </div>
  );
}
