"use client";

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

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-lg border border-amber-500/10 bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10"
      style={{
        opacity: 0,
        animation: `cardReveal 0.6s ease-out ${index * 0.06}s forwards`,
      }}
      onClick={onClick}
    >
      <style>{`
        @keyframes cardReveal {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative h-56 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <span className="absolute right-3 top-3 rounded bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400 backdrop-blur-sm">
          {recipe.kesulitan}
        </span>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-sm text-amber-400">
          <span>{stars}</span>
          <span className="ml-1 text-xs text-zinc-400">{recipe.rating}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-xl font-bold text-white transition-colors group-hover:text-amber-400">
          {recipe.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
          {recipe.description}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">⏱ {recipe.waktu} mnt</span>
          <span className="flex items-center gap-1">👥 {recipe.porsi}</span>
          <span className="flex items-center gap-1">🗺️ {recipe.origin}</span>
        </div>
      </div>
    </div>
  );
}
