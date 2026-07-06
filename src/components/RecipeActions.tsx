"use client";

import { Recipe } from "@/types";
import { useState } from "react";

export default function RecipeActions({ recipe }: { recipe?: Recipe }) {
  const [showShare, setShowShare] = useState(false);

  if (!recipe) return null;

  const recipeUrl = `https://nusantaraeats.com/recipes/${recipe.slug}`;
  const recipeTitle = recipe.title;
  const recipeImage = `https://nusantaraeats.com${recipe.image}`;

  const shareUrls = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${recipeTitle}\n\n${recipeUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(recipeUrl)}&text=${encodeURIComponent(recipeTitle)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(recipeUrl)}&description=${encodeURIComponent(recipeTitle)}&media=${encodeURIComponent(recipeImage)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(recipeUrl)}&text=${encodeURIComponent(recipeTitle)}`,
  };

  const handleSaveLocal = () => {
    const content = `
${recipe.title}
${"=".repeat(recipe.title.length)}

${recipe.description}

Waktu: ${recipe.waktu} menit | Porsi: ${recipe.porsi} | Kesulitan: ${recipe.kesulitan}
Rating: ${"★".repeat(Math.floor(recipe.rating))}${"☆".repeat(5 - Math.floor(recipe.rating))} (${recipe.rating})

BAHAN-BAHAN:
${recipe.ingredients.map((i) => `- ${i}`).join("\n")}

CARA MEMASAK:
${recipe.instructions.map((i, idx) => `${idx + 1}. ${i}`).join("\n")}

${recipe.tips ? `TIPS:\n${recipe.tips}\n` : ""}
Sumber: NusantaraEats - ${recipeUrl}
`.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <a
        href="#ingredients"
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-500"
      >
        📋 Recipe
      </a>

      <button
        onClick={handleSaveLocal}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-all hover:border-green-500/30 hover:text-green-400"
      >
        💾 Save
      </button>

      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-all hover:border-amber-500/30 hover:text-amber-400"
      >
        🖨️ Print
      </button>

      <div className="relative">
        <button
          onClick={() => setShowShare(!showShare)}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-all hover:border-blue-500/30 hover:text-blue-400"
        >
          📤 Share
        </button>

        {showShare && (
          <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-2xl shadow-black/50">
            {Object.entries(shareUrls).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-300 capitalize transition-colors hover:bg-zinc-800 hover:text-amber-400"
                onClick={() => setShowShare(false)}
              >
                <span>
                  {platform === "whatsapp" && "💬"}
                  {platform === "twitter" && "🐦"}
                  {platform === "facebook" && "📘"}
                  {platform === "pinterest" && "📌"}
                  {platform === "telegram" && "✈️"}
                </span>
                {platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
