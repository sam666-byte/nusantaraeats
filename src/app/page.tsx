"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import RecipeModal from "@/components/RecipeModal";
import { recipes, searchRecipes, filterByKategori } from "@/data/recipes";
import { KATEGORI_LIST, Recipe } from "@/types";

const FEATURED_SLUGS = [
  "rendang", "nasi-goreng-kampung", "sate-madura", "gudeg",
  "soto-betawi", "pempek", "rawon", "mie-aceh",
  "ayam-taliwang", "papeda", "soto-betawi-asli", "soto-lamongan",
];

const TRENDING_KEYWORDS = ["Rendang", "Soto Ayam", "Gudeg", "Pempek", "Nasi Goreng", "Sate Madura"];

const REGIONS = [
  { name: "West Sumatra", slug: "west-sumatra", count: 45, color: "from-amber-600 to-orange-700" },
  { name: "Java", slug: "java", count: 180, color: "from-amber-500 to-yellow-600" },
  { name: "Sulawesi", slug: "sulawesi", count: 35, color: "from-amber-700 to-red-700" },
  { name: "Bali", slug: "bali", count: 25, color: "from-amber-400 to-amber-600" },
  { name: "Sumatra", slug: "sumatra", count: 45, color: "from-amber-600 to-amber-800" },
  { name: "Kalimantan", slug: "kalimantan", count: 20, color: "from-amber-500 to-orange-600" },
  { name: "Papua & Maluku", slug: "papua-maluku", count: 18, color: "from-amber-600 to-red-600" },
  { name: "Jakarta", slug: "jakarta", count: 30, color: "from-amber-700 to-amber-900" },
];

const featuredRecipes = recipes.filter((r) => FEATURED_SLUGS.includes(r.slug)).slice(0, 12);

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

  // Search is handled by form action="/search" method="GET"

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NusantaraEats",
    url: "https://nusantaraeats.com",
    logo: "https://nusantaraeats.com/logo.png",
    description: "Authentic Indonesian recipes with detailed cooking guides, cultural history, and nutritional information.",
    sameAs: [],
    contactPoint: { "@type": "ContactPoint", contactType: "customer service" },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NusantaraEats",
    url: "https://nusantaraeats.com",
    description: "Authentic Indonesian recipes with detailed cooking guides, cultural history, and nutritional information.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nusantaraeats.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is NusantaraEats?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NusantaraEats is a free online cookbook featuring 500+ authentic Indonesian recipes from across the archipelago. Each recipe includes ingredients, step-by-step instructions, cultural history, and nutritional information."
        }
      },
      {
        "@type": "Question",
        name: "What are the most popular Indonesian dishes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some of the most popular Indonesian dishes include Rendang (slow-cooked beef in coconut milk), Nasi Goreng (fried rice), Sate (grilled skewers), Soto (traditional soup), Gudeg (jackfruit stew), and Pempek (fish cake from Palembang). All these recipes are available on NusantaraEats with detailed instructions."
        }
      },
      {
        "@type": "Question",
        name: "Are the recipes on NusantaraEats authentic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all 500+ recipes on NusantaraEats are researched from authentic Indonesian sources including traditional cookbooks, regional culinary experts, and cultural heritage references from Indonesia. Each recipe preserves the authentic flavors and cooking techniques of Indonesian cuisine."
        }
      },
      {
        "@type": "Question",
        name: "Can I make Indonesian food at home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! All recipes on NusantaraEats include detailed step-by-step instructions, complete ingredient lists, and helpful tips. Many recipes are rated as Easy or Medium difficulty, making them accessible for home cooks. The site also provides ingredient sourcing guidance for hard-to-find items."
        }
      },
      {
        "@type": "Question",
        name: "What types of Indonesian food does NusantaraEats cover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NusantaraEats covers all major categories of Indonesian cuisine: Main Dishes (makanan-berat), Soups & Soto (sup-soto), Satay & Grilled (sate-panggang), Snacks (jajanan), and Drinks (minuman). Recipes come from every region of Indonesia including Java, Sumatra, Bali, Sulawesi, Kalimantan, Papua, and more."
        }
      },
      {
        "@type": "Question",
        name: "Is NusantaraEats free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, NusantaraEats is completely free to use. You can browse all 500+ recipes, view ingredients and instructions, and access cultural history and nutritional information without any cost or registration required."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nusantaraeats.com" }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-20 pt-28">
        {/* Background image - much brighter */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80)",
            filter: "brightness(0.7) saturate(1.3)",
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />

        <div
          className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-0"
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
          <h1 className="font-serif text-[42px] font-black leading-tight text-white sm:text-[52px] md:text-[60px] lg:text-[68px]">
            Discover Authentic
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              Indonesian Cuisine
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-zinc-400 sm:text-base">
            500+ Recipes • Traditional • Regional • Step-by-Step
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-zinc-500">
            From the richness of Indonesian spices, traditions, and the warmth of its kitchen.
            Every recipe tells a story — from Sabang to Merauke.
          </p>

          {/* Search - bigger and more prominent */}
          <form action="/search" method="GET" className="mx-auto mt-8 flex w-full max-w-xl shadow-2xl shadow-black/50 rounded-xl overflow-hidden sm:max-w-2xl">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500 sm:h-6 sm:w-6"
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
                name="q"
                type="text"
                placeholder="Search recipes... (rendang, soto, gudeg)"
                className="w-full border-0 bg-white/95 py-[18px] pl-12 pr-4 text-[16px] text-zinc-800 placeholder-zinc-400 backdrop-blur outline-none sm:pl-14 sm:text-[17px]"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 text-[15px] font-bold uppercase tracking-wider text-black transition-all hover:from-amber-400 hover:to-amber-500 sm:px-10 sm:text-[16px]"
            >
              Search
            </button>
          </form>

          {/* Trending Keywords - bigger and brighter */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-[13px] font-semibold uppercase tracking-wider text-zinc-400">Popular:</span>
            {TRENDING_KEYWORDS.map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="rounded-full border border-amber-500/30 bg-amber-500/15 px-[14px] py-[8px] text-[13px] font-medium text-amber-300 transition-all hover:border-amber-500/50 hover:text-amber-200 hover:bg-amber-500/25"
              >
                {kw}
              </Link>
            ))}
          </div>

          {/* Stats - Premium Cards - bigger */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto sm:max-w-xl md:max-w-2xl">
            {[
              { icon: "📖", num: "500+", label: "Authentic Recipes" },
              { icon: "🗺️", num: "34", label: "Regions Covered" },
              { icon: "📸", num: "4K+", label: "Food Photos" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-amber-500/15 bg-white/5 backdrop-blur p-[18px] text-center sm:p-6">
                <span className="text-3xl sm:text-4xl">{s.icon}</span>
                <div className="mt-2 font-serif text-[32px] font-bold text-amber-400 leading-none sm:text-[38px]">{s.num}</div>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-zinc-400 font-medium sm:text-[12px]">{s.label}</p>
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

      {/* ─── RECIPES (Featured - immediately after hero) ─── */}
      <section id="resep" className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
              — Curated Collection —
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
              Featured <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Recipes</span>
            </h2>
            <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-amber-600">
              <span>◆</span><span>◆</span><span>◆</span>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {[
              { id: "all", label: "All", href: "/recipes" },
              ...KATEGORI_LIST.map((k) => ({ id: k.id, label: k.name, href: `/categories/${k.id}` })),
            ].map((f) => (
              <Link
                key={f.id}
                href={f.href}
                className={`rounded px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeFilter === f.id
                    ? "bg-amber-600 text-black shadow-lg shadow-amber-600/30"
                    : "border border-white/10 bg-transparent text-zinc-400 hover:border-amber-500/30 hover:text-amber-400"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>

          {/* Grid */}
          {displayed.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-zinc-500">No recipes found for &quot;{searchQuery}&quot;. Try a different keyword.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(searchQuery.trim() ? displayed : featuredRecipes).map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} onClick={() => setSelectedRecipe(r)} />
              ))}
            </div>
          )}

          {/* View All Link */}
          {!searchQuery.trim() && (
            <div className="mt-10 text-center">
              <Link href="/recipes" className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20">
                View All {recipes.length}+ Recipes →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── KATEGORI (after recipes) ─── */}
      <section className="relative z-10 px-4 py-16 border-t border-amber-500/10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">— Browse by Category —</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-white">Explore <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Categories</span></h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {KATEGORI_LIST.map((k) => {
              const categoryImages: Record<string, string> = {
                "makanan-berat": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80",
                "sup-soto": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
                "sate-panggang": "https://images.unsplash.com/photo-1529563257862-04e19c9ebf1a?w=400&q=80",
                "jajanan": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80",
                "minuman": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80",
              };
              return (
                <button
                  key={k.id}
                  onClick={() => { setActiveFilter(k.id); setSearchQuery(""); document.getElementById("resep")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="group relative overflow-hidden rounded-xl border border-amber-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/20"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${categoryImages[k.id]})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
                  <div className="relative p-5 text-center">
                    <span className="block text-3xl transition-transform duration-300 group-hover:scale-125">{k.icon}</span>
                    <h3 className="mt-3 font-serif text-sm font-bold text-white">{k.name}</h3>
                    <p className="mt-1 text-[10px] text-zinc-400">{k.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
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

      {/* ─── POPULAR REGIONS ─── */}
      <section className="relative z-10 border-t border-amber-500/10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
              — Explore by Region —
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
              Popular <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Regions</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-500">Discover recipes from every corner of the Indonesian archipelago</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {REGIONS.map((region) => (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}`}
                className="group relative overflow-hidden rounded-xl border border-amber-500/10 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-20 transition-opacity duration-300 group-hover:opacity-40`} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-white">{region.name}</h3>
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
                      {region.count}+
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">View recipes →</p>
                </div>
              </Link>
            ))}
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
