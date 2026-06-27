"use client";

import { useEffect } from "react";
import { Recipe } from "@/types";

export default function RecipeModal({
  recipe,
  onClose,
}: {
  recipe: Recipe | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [recipe]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!recipe) return null;

  const stars =
    "★".repeat(Math.floor(recipe.rating)) +
    "☆".repeat(5 - Math.floor(recipe.rating));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
      style={{ opacity: 1 }}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-amber-500/20 bg-zinc-900 shadow-2xl shadow-black/50"
        style={{
          animation: "modalIn 0.3s ease-out",
        }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/20 bg-black/60 text-zinc-400 backdrop-blur transition-colors hover:border-amber-500/50 hover:text-amber-400"
        >
          ✕
        </button>

        <div className="relative h-64 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          <div className="absolute bottom-4 right-4 text-xl tracking-wider text-amber-400">
            {stars}
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-serif text-3xl font-bold text-amber-400">
            {recipe.title}
          </h2>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-500">
            <span>⏱ {recipe.waktu} menit</span>
            <span>👥 {recipe.porsi}</span>
            <span>📊 {recipe.kesulitan}</span>
            <span>🗺️ {recipe.origin}</span>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-serif text-lg font-bold text-white">
              🛒 Bahan-Bahan
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {recipe.ingredients.map((b, i) => (
                <li
                  key={i}
                  className="rounded bg-zinc-800 px-3 py-2 text-sm text-zinc-300"
                  style={{ borderLeft: "2px solid rgba(212,175,55,0.5)" }}
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-serif text-lg font-bold text-white">
              👨‍🍳 Langkah Memasak
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((l, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-black">
                    {i + 1}
                  </span>
                  {l}
                </li>
              ))}
            </ol>
          </div>

          {recipe.tips && (
            <div className="mt-6 rounded-lg bg-gradient-to-r from-amber-900/20 to-amber-700/10 p-4">
              <p className="text-sm font-semibold text-amber-400">💡 Tips</p>
              <p className="mt-1 text-sm text-zinc-400">{recipe.tips}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
