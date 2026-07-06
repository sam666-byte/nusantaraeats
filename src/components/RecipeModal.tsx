"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Recipe } from "@/types";
import { getRegionIdFromOrigin } from "@/lib/regions";

function getSavedRecipes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("savedRecipes") || "[]");
  } catch {
    return [];
  }
}

function toggleSaved(slug: string): boolean {
  const saved = getSavedRecipes();
  const idx = saved.indexOf(slug);
  if (idx > -1) {
    saved.splice(idx, 1);
  } else {
    saved.push(slug);
  }
  localStorage.setItem("savedRecipes", JSON.stringify(saved));
  return idx === -1;
}

function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-6 border-t border-zinc-800 pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <h3 className="font-serif text-lg font-bold text-white">
          {icon} {title}
        </h3>
        <span className={`text-2xl transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function RecipeModal({
  recipe,
  onClose,
}: {
  recipe: Recipe | null;
  onClose: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (recipe) {
      setSaved(getSavedRecipes().includes(recipe.slug));
      document.body.style.overflow = "hidden";
      setShowShare(false);
      setCopied(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [recipe]);

  const handleSave = useCallback(() => {
    if (!recipe) return;
    const nowSaved = toggleSaved(recipe.slug);
    setSaved(nowSaved);
  }, [recipe]);

  const handleCopyLink = useCallback(() => {
    if (!recipe) return;
    const url = `https://nusantaraeats.com/recipes/${recipe.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [recipe]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handlePrint = useCallback(() => {
    if (!recipe) return;
    const recipeUrl = `https://nusantaraeats.com/recipes/${recipe.slug}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(recipeUrl)}&bgcolor=ffffff&color=000000`;
    const prepTime = Math.floor(recipe.waktu * 0.3);
    const cookTime = recipe.waktu - prepTime;
    const totalTime = recipe.waktu;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html>
<html><head><title>${recipe.title}</title>
<style>
  @page { margin: 1.5cm; }
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 700px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6; font-size: 14px; }
  .print-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d97706; padding-bottom: 12px; margin-bottom: 16px; }
  .print-logo { display: flex; align-items: center; gap: 10px; }
  .print-logo-icon { font-size: 24px; color: #d97706; }
  .print-logo-text { font-size: 20px; font-weight: 900; letter-spacing: 0.1em; color: #333; }
  .print-logo-text span { color: #d97706; font-style: italic; }
  .print-tagline { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 0.15em; }
  h1 { font-size: 24px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; margin: 0 0 12px; color: #1a1a1a; }
  .recipe-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 12px 16px; margin: 12px 0 16px; font-size: 13px; }
  .recipe-meta dt { color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
  .recipe-meta dd { margin: 0; font-weight: 600; color: #333; }
  .desc { font-size: 14px; margin-bottom: 16px; color: #555; }
  h2 { font-size: 16px; color: #d97706; margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
  ul, ol { padding-left: 20px; margin: 8px 0; }
  li { margin: 5px 0; font-size: 13px; }
  .tip { background: #fffbeb; border-left: 3px solid #d97706; padding: 10px 14px; margin: 16px 0; font-size: 12px; color: #666; }
  .print-footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-left { font-size: 10px; color: #aaa; }
  .footer-right { text-align: right; }
  .footer-right img { width: 80px; height: 80px; }
  .footer-url { font-size: 10px; color: #aaa; margin-top: 4px; }
  .page-num { text-align: center; font-size: 10px; color: #ccc; margin-top: 20px; }
  @media print {
    body { padding: 0; margin: 0; }
    .page-num { position: fixed; bottom: 0; width: 100%; }
  }
</style></head><body>
<div class="print-header">
  <div class="print-logo">
    <span class="print-logo-icon">◆</span>
    <div>
      <div class="print-logo-text">Nusantara<span>Eats</span></div>
      <div class="print-tagline">Authentic Indonesian Heritage Recipes</div>
    </div>
  </div>
</div>

<h1>${recipe.title.replace(/ Recipe:.*$/, "").replace(/ Recipe$/, "")}</h1>

<dl class="recipe-meta">
  <div><dt>Preparation Time</dt><dd>${prepTime} minutes</dd></div>
  <div><dt>Cooking Time</dt><dd>${cookTime} minutes</dd></div>
  <div><dt>Total Time</dt><dd>${totalTime} minutes</dd></div>
  <div><dt>Servings</dt><dd>${recipe.porsi}</dd></div>
  <div><dt>Difficulty</dt><dd>${recipe.kesulitan}</dd></div>
  <div><dt>Origin</dt><dd>${recipe.origin}</dd></div>
  <div><dt>Category</dt><dd>${recipe.kategori.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</dd></div>
  <div><dt>Rating</dt><dd>${recipe.rating} / 5</dd></div>
</dl>

<img src="https://nusantaraeats.com${recipe.image}" alt="${recipe.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin: 12px 0;" />

<p class="desc">${recipe.description}</p>

<h2>Ingredients</h2>
<ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>

<h2>Instructions</h2>
<ol>${recipe.instructions.map((s) => `<li>${s}</li>`).join("")}</ol>

${recipe.tips ? `<div class="tip"><strong>Tips:</strong> ${recipe.tips}</div>` : ""}

<div class="print-footer">
  <div class="footer-left">
    <div>Recipe from <strong>NusantaraEats.com</strong></div>
    <div class="footer-url">${recipeUrl}</div>
    <div style="margin-top: 4px;">Scan QR code for full heritage article</div>
  </div>
  <div class="footer-right">
    <img src="${qrUrl}" alt="QR Code" />
  </div>
</div>

<div class="page-num">NusantaraEats.com &mdash; Authentic Indonesian Recipes</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  }, [recipe]);

  if (!recipe) return null;

  const stars =
    "★".repeat(Math.floor(recipe.rating)) +
    "☆".repeat(5 - Math.floor(recipe.rating));

  const catLabels: Record<string, string> = {
    "makanan-berat": "Main Dishes",
    "sup-soto": "Soups & Soto",
    "sate-panggang": "Satay & Grilled",
    jajanan: "Snacks",
    minuman: "Drinks",
  };

  const shareURL = `https://nusantaraeats.com/recipes/${recipe.slug}`;
  const shareText = `Check out this ${recipe.title.replace(/ Recipe:.*$/, "").replace(/ Recipe$/, "")} recipe from NusantaraEats!`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${recipe.title} recipe preview`}
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-amber-500/20 bg-zinc-900 shadow-2xl shadow-black/50"
        style={{ animation: "modalIn 0.3s ease-out" }}>

        {/* Close button */}
        <button onClick={onClose} aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/20 bg-black/60 text-zinc-400 backdrop-blur transition-colors hover:border-amber-500/50 hover:text-amber-400">
          ✕
        </button>

        {/* Hero image */}
        <div className="relative h-56 overflow-hidden sm:h-64">
          <img src={recipe.image}
            alt={`${recipe.title} from ${recipe.origin}`}
            className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-12">
            <h2 className="font-serif text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
              {recipe.title.replace(/ Recipe:.*$/, "").replace(/ Recipe$/, "")}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl text-amber-400" aria-label={`Rating ${recipe.rating}`}>{stars}</span>
              <span className="text-sm text-zinc-400">{recipe.rating}</span>
              <span className="text-xs text-zinc-500">·</span>
              <span className="text-xs text-zinc-500">{catLabels[recipe.kategori] || recipe.kategori}</span>
            </div>
          </div>
        </div>

        {/* Action bar: Save + Share + Copy + Print — all together */}
        <div className="sticky top-0 z-10 flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900/95 px-3 py-2 backdrop-blur sm:px-4">
          <button onClick={handleSave} aria-label={saved ? "Unsave recipe" : "Save recipe"}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              saved
                ? "border-red-500/40 bg-red-500/15 text-red-400"
                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-amber-500/30 hover:text-amber-400"
            }`}>
            {saved ? "❤️ Saved" : "🤍 Save"}
          </button>

          <button onClick={handleCopyLink} aria-label="Copy recipe link"
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              copied
                ? "border-green-500/40 bg-green-500/15 text-green-400"
                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-amber-500/30 hover:text-amber-400"
            }`}>
            {copied ? "✅ Copied" : "🔗 Link"}
          </button>

          <div className="relative">
            <button onClick={() => setShowShare(!showShare)} aria-label="Share recipe"
              className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-400 transition-all hover:border-amber-500/30 hover:text-amber-400">
              📤 Share
            </button>
            {showShare && (
              <div className="absolute left-0 top-full z-30 mt-1 w-44 rounded-lg border border-zinc-700 bg-zinc-800 py-1 shadow-xl">
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareURL)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                  💬 WhatsApp
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareURL)}&text=${encodeURIComponent(shareText)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                  🐦 Twitter / X
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                  📘 Facebook
                </a>
                <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareURL)}&description=${encodeURIComponent(shareText)}&media=${encodeURIComponent("https://nusantaraeats.com" + recipe.image)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                  📌 Pinterest
                </a>
                <a href={`https://www.tiktok.com/share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700">
                  🎵 TikTok
                </a>
              </div>
            )}
          </div>

          <div className="ml-auto">
            <button onClick={handlePrint} aria-label="Print recipe"
              className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-400 transition-all hover:border-amber-500/30 hover:text-amber-400">
              🖨️ Print
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Meta */}
          <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
            <span className="rounded-full border border-amber-500/15 bg-zinc-800 px-3 py-1">⏱ {recipe.waktu} mins</span>
            <span className="rounded-full border border-amber-500/15 bg-zinc-800 px-3 py-1">👥 {recipe.porsi}</span>
            <span className="rounded-full border border-amber-500/15 bg-zinc-800 px-3 py-1">📊 {recipe.kesulitan}</span>
            {(() => {
              const regionId = getRegionIdFromOrigin(recipe.origin, recipe.title, recipe.description);
              return regionId ? (
                <Link href={`/regions/${regionId}`} onClick={onClose} className="rounded-full border border-amber-500/15 bg-zinc-800 px-3 py-1 hover:border-amber-500/30 hover:text-amber-400 transition-colors">🗺️ {recipe.origin}</Link>
              ) : (
                <span className="rounded-full border border-amber-500/15 bg-zinc-800 px-3 py-1">🗺️ {recipe.origin}</span>
              );
            })()}
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{recipe.description}</p>

          {/* Ingredients */}
          <div className="mt-5">
            <h3 className="mb-3 font-serif text-lg font-bold text-white">🛒 Ingredients</h3>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {recipe.ingredients.slice(0, 8).map((b, i) => (
                <li key={i} className="rounded bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 border-l-2 border-amber-500/40">
                  {b}
                </li>
              ))}
              {recipe.ingredients.length > 8 && (
                <li className="rounded bg-zinc-800 px-3 py-1.5 text-sm text-amber-400">
                  + {recipe.ingredients.length - 8} more ingredients
                </li>
              )}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mt-5">
            <h3 className="mb-3 font-serif text-lg font-bold text-white">👨‍🍳 Instructions</h3>
            <ol className="space-y-2">
              {recipe.instructions.slice(0, 4).map((l, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-xs font-bold text-black">
                    {i + 1}
                  </span>
                  {l}
                </li>
              ))}
              {recipe.instructions.length > 4 && (
                <li className="flex gap-3 text-sm text-amber-400">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-zinc-300">...</span>
                  + {recipe.instructions.length - 4} more steps
                </li>
              )}
            </ol>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <div className="mt-5 rounded-lg bg-gradient-to-r from-amber-900/20 to-amber-700/10 p-4">
              <p className="text-sm font-semibold text-amber-400">💡 Tips</p>
              <p className="mt-1 text-sm text-zinc-400 line-clamp-3">{recipe.tips}</p>
            </div>
          )}

          {/* History & Origin — collapsed */}
          <CollapsibleSection title="History & Origin" icon="📜">
            {recipe.detailedHistory && <p className="text-sm leading-relaxed text-zinc-400 mb-3">{recipe.detailedHistory}</p>}
            {recipe.culturalSignificance && (
              <>
                <h4 className="text-sm font-semibold text-amber-400 mt-3">Cultural Significance</h4>
                <p className="text-sm text-zinc-400 mt-1">{recipe.culturalSignificance}</p>
              </>
            )}
            {recipe.regionalVariations && (
              <>
                <h4 className="text-sm font-semibold text-amber-400 mt-3">Regional Variations</h4>
                <p className="text-sm text-zinc-400 mt-1">{recipe.regionalVariations}</p>
              </>
            )}
          </CollapsibleSection>

          {/* Cooking Mastery — collapsed */}
          <CollapsibleSection title="Cooking Mastery" icon="🔥">
            {recipe.cookingTechnique && <p className="text-sm leading-relaxed text-zinc-400">{recipe.cookingTechnique}</p>}
            {recipe.expertTips && <p className="text-sm text-zinc-400 mt-3 italic">{recipe.expertTips}</p>}
          </CollapsibleSection>

          {/* CTA */}
          <div className="mt-8 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 p-5 text-center">
            <p className="text-sm text-zinc-400">
              Want the <span className="text-amber-400 font-semibold">complete heritage guide</span>?
            </p>
            <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <button onClick={handleSave}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                  saved ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-amber-500/20 bg-zinc-800 text-zinc-300 hover:border-amber-500/40 hover:text-amber-400"
                }`}>
                {saved ? "❤️ Saved" : "🤍 Save Recipe"}
              </button>
              <Link href={`/recipes/${recipe.slug}`} onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-6 py-2 text-sm font-bold uppercase tracking-wider text-black transition-all hover:from-amber-400 hover:to-amber-600">
                Read Full Recipe →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
