"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { recipes } from "@/data/recipes";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);

    // Add noindex meta tag
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
  }, []);

  const results = query.trim()
    ? recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase()) ||
          r.origin.toLowerCase().includes(query.toLowerCase()) ||
          r.ingredients.some((i) => i.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (document.getElementById("searchInput") as HTMLInputElement)?.value || "";
    setQuery(input);
    window.history.replaceState({}, "", `/search?q=${encodeURIComponent(input)}`);
  };

  if (!mounted) {
    return (
      <article className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-black text-white sm:text-5xl">
            Search <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Recipes</span>
          </h1>
          <p className="mt-3 text-lg text-zinc-400">Loading...</p>
        </div>
      </article>
    );
  }

  return (
    <article className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-zinc-300">Search</span>
      </nav>

      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-black text-white sm:text-5xl">
          Search <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Recipes</span>
        </h1>
        <p className="mt-3 text-lg text-zinc-400">Find your favorite Indonesian dishes</p>
      </div>

      {/* Search Input */}
      <div className="mx-auto mb-12 max-w-xl">
        <form onSubmit={handleSearch} className="flex shadow-2xl shadow-black/50">
          <input
            id="searchInput"
            type="text"
            defaultValue={query}
            placeholder="Search by name, ingredient, or region..."
            className="flex-1 border border-r-0 border-white/10 bg-zinc-900/80 py-4 px-6 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-amber-700 px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:from-amber-400 hover:to-amber-600"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {query.trim() && (
        <div>
          <p className="mb-6 text-sm text-zinc-500">
            {results.length} recipe{results.length !== 1 ? "s" : ""} found for &quot;{query}&quot;
          </p>

          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => {
                const stars = "★".repeat(Math.floor(r.rating)) + "☆".repeat(5 - Math.floor(r.rating));
                return (
                  <Link
                    key={r.id}
                    href={`/recipes/${r.slug}`}
                    className="group overflow-hidden rounded-xl border border-amber-500/10 bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img src={r.image} alt={r.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute right-3 top-3 rounded bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400 backdrop-blur-sm">{r.kesulitan}</span>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-sm text-amber-400">
                        <span>{stars}</span>
                        <span className="ml-1 text-xs text-zinc-400">{r.rating}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h2 className="font-serif text-xl font-bold text-white group-hover:text-amber-400">{r.title}</h2>
                      <p className="mt-1.5 line-clamp-2 text-sm text-zinc-400">{r.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                        <span>⏱ {r.waktu} mins</span>
                        <span>🗺️ {r.origin}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-zinc-500">No recipes found. Try a different keyword.</p>
              <p className="mt-2 text-sm text-zinc-600">Suggestions: rendang, soto, satay, nasi goreng, sambal</p>
            </div>
          )}
        </div>
      )}

      {/* Popular searches */}
      {!query.trim() && (
        <div className="text-center">
          <p className="mb-4 text-sm text-zinc-500">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Rendang", "Soto", "Nasi Goreng", "Satay", "Sambal", "Gudeg", "Pempek", "Gado-gado"].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-amber-500/15 bg-zinc-900 px-4 py-2 text-xs text-zinc-400 hover:border-amber-500/30 hover:text-amber-400 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
