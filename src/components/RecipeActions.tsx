"use client";

export default function RecipeActions() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <a href="#ingredients" className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-500">
        📋 Jump to Recipe
      </a>
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-all hover:border-amber-500/30 hover:text-amber-400"
      >
        🖨️ Print Recipe
      </button>
    </div>
  );
}
