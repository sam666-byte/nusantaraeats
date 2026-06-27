"use client";

import { useState, useMemo } from "react";
import RecipeCard from "@/components/RecipeCard";
import RecipeModal from "@/components/RecipeModal";
import { recipes, searchRecipes, filterByKategori } from "@/data/recipes";
import { KATEGORI_LIST, Recipe } from "@/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const displayed = useMemo(() => {
    const byCategory = filterByKategori(activeFilter);
    if (!searchQuery.trim()) return byCategory;
    return byCategory.filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.origin.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeFilter, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.getElementById("searchInput") as HTMLInputElement)
      ?.value;
    setSearchQuery(input || "");
  };

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-20 pt-28">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80)",
            filter: "brightness(0.25) saturate(0.8)",
            transform: "scale(1.05)",
            animation: "heroZoom 20s ease-in-out infinite alternate",
          }}
        />
        <style>{`
          @keyframes heroZoom {
            0% { transform: scale(1.05); }
            100% { transform: scale(1.12); }
          }
        `}</style>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />

        <div
          className="relative z-10 mx-auto max-w-3xl text-center"
          style={{ animation: "fadeInUp 1.2s ease-out" }}
        >
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
            — Authentic Indonesian Recipes —
          </p>
          <h1 className="font-serif text-5xl font-black leading-tight text-white sm:text-7xl md:text-8xl">
            Flavors of
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              Indonesia
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-zinc-400 sm:text-lg">
            Discover the richness of Indonesian spices, traditions, and the
            warmth of its kitchen. Every recipe tells a story — from Sabang to
            Merauke.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mx-auto mt-10 flex max-w-xl shadow-2xl shadow-black/50">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                id="searchInput"
                type="text"
                placeholder="Search your favorite recipe... (rendang, soto, gudeg)"
                className="w-full border border-r-0 border-white/10 bg-zinc-900/80 py-4 pl-12 pr-4 text-sm text-white placeholder-zinc-500 backdrop-blur outline-none transition-colors focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-700 px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:from-amber-400 hover:to-amber-600"
            >
              Search
            </button>
          </form>

          {/* Stats */}
          <div className="mt-12 flex items-center justify-center gap-10">
            {[
              { num: String(recipes.length), label: "Featured Recipes" },
              { num: "5", label: "Categories" },
              { num: "4K", label: "HD Photos" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <span className="font-serif text-3xl font-bold text-amber-400 sm:text-4xl">
                  {s.num}
                </span>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-center">
          <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
            Explore
          </p>
          <span className="text-lg text-amber-500">↓</span>
        </div>
      </section>

      {/* ─── KATEGORI ─── */}
      <section className="relative z-10 -mt-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {KATEGORI_LIST.map((k) => (
              <button
                key={k.id}
                onClick={() => {
                  setActiveFilter(k.id);
                  setSearchQuery("");
                  document.getElementById("resep")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group rounded border border-amber-500/10 bg-zinc-900/80 p-4 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <span className="block text-2xl transition-transform duration-300 group-hover:scale-110">
                  {k.icon}
                </span>
                <h3 className="mt-2 font-serif text-sm font-bold text-white">
                  {k.name}
                </h3>
                <p className="mt-0.5 text-[10px] text-zinc-500">{k.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECIPES ─── */}
      <section id="resep" className="relative z-10 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
              — Curated Collection —
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
              Featured <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Recipes</span>
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-amber-600">
              <span>◆</span>
              <span>◆</span>
              <span>◆</span>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {[
              { id: "all", label: "All" },
              ...KATEGORI_LIST.map((k) => ({ id: k.id, label: k.name })),
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFilter(f.id);
                  setSearchQuery("");
                  const input = document.getElementById("searchInput") as HTMLInputElement;
                  if (input) input.value = "";
                }}
                className={`rounded px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeFilter === f.id
                    ? "bg-amber-600 text-black shadow-lg shadow-amber-600/30"
                    : "border border-white/10 bg-transparent text-zinc-400 hover:border-amber-500/30 hover:text-amber-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {displayed.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-zinc-500">
                No recipes found for &quot;{searchQuery}&quot;. Try a different
                keyword.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((r, i) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  index={i}
                  onClick={() => setSelectedRecipe(r)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="relative z-10 overflow-hidden border-t border-amber-500/10 px-4 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(212,175,55,0.03),transparent_50%),radial-gradient(ellipse_at_80%_50%,rgba(212,175,55,0.03),transparent_50%)] pointer-events-none" />
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
                — Our Heritage —
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
                The Story Behind
                <br />
                <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
                  Every Recipe
                </span>
              </h2>
              <div className="mt-4 flex gap-3 text-[10px] text-amber-600">
                <span>◆</span>
                <span>◆</span>
                <span>◆</span>
              </div>
              <p className="mt-6 text-base leading-relaxed text-zinc-400">
                NusantaraEats was born from a deep love for Indonesian cuisine.
                We believe every recipe is a{" "}
                <em className="text-amber-400">cultural heritage</em> — passed
                down from generation to generation, from grandmother&apos;s kitchen to
                modern city tables.
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Every photo is captured in <strong className="text-white">4K</strong> resolution,
                every step is tested thoroughly, and every recipe is curated
                with dedication. We are here to keep the flame of tradition alive.
              </p>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-lg border border-amber-500/20 shadow-2xl">
                <div className="absolute inset-4 border border-amber-500/20 pointer-events-none z-10 rounded" />
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Traditional Indonesian Kitchen"
                  className="w-full h-72 sm:h-96 object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MODAL ─── */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </>
  );
}
