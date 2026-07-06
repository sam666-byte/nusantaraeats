import Link from "next/link";
import type { Metadata } from "next";
import { recipes } from "@/data/recipes";

export const metadata: Metadata = {
  title: "Ultimate Indonesian Food Guide 2026 — NusantaraEats",
  description: "Complete guide to Indonesian cuisine: 500+ authentic recipes from 34 regions. Learn about rendang, nasi goreng, sate, gudeg, and 100+ traditional dishes with step-by-step instructions.",
  alternates: { canonical: "https://nusantaraeats.com/guides/indonesian-food-guide" },
  openGraph: {
    title: "Ultimate Indonesian Food Guide 2026",
    description: "Complete guide to Indonesian cuisine: 500+ authentic recipes from 34 regions.",
    url: "https://nusantaraeats.com/guides/indonesian-food-guide",
    siteName: "NusantaraEats",
    images: [{ url: "https://nusantaraeats.com/images/rendang.jpg", width: 1200, height: 630 }],
  },
};

const REGIONS_DATA = [
  { name: "West Sumatra", slug: "west-sumatra", icon: "🏔️", desc: "Home of rendang and rich coconut-based dishes", recipes: recipes.filter(r => r.origin.includes("West Sumatra") || r.origin.includes("Padang") || r.title.includes("Minang")).slice(0, 4) },
  { name: "Java", slug: "java", icon: "🏛️", desc: "From Yogyakarta's gudeg to Surabaya's rawon", recipes: recipes.filter(r => r.origin.includes("Java") || r.origin.includes("Yogyakarta") || r.origin.includes("Jawa")).slice(0, 4) },
  { name: "Bali", slug: "bali", icon: "🌺", desc: "Unique spices, sambal, and ceremonial dishes", recipes: recipes.filter(r => r.origin.includes("Bali")).slice(0, 4) },
  { name: "Sulawesi", slug: "sulawesi", icon: "🐟", desc: "Bold flavors from Makassar and Manado", recipes: recipes.filter(r => r.origin.includes("Sulawesi") || r.origin.includes("Makassar") || r.origin.includes("Manado")).slice(0, 4) },
];

const CATEGORIES_DATA = [
  { name: "Main Dishes", slug: "makanan-berat", icon: "🍛", count: recipes.filter(r => r.kategori === "makanan-berat").length },
  { name: "Soups & Soto", slug: "sup-soto", icon: "🍜", count: recipes.filter(r => r.kategori === "sup-soto").length },
  { name: "Satay & Grilled", slug: "sate-panggang", icon: "🍢", count: recipes.filter(r => r.kategori === "sate-panggang").length },
  { name: "Snacks", slug: "jajanan", icon: "🍡", count: recipes.filter(r => r.kategori === "jajanan").length },
  { name: "Drinks", slug: "minuman", icon: "🍹", count: recipes.filter(r => r.kategori === "minuman").length },
];

const TOP_RECIPES = [
  "rendang", "nasi-goreng-kampung", "sate-madura", "gudeg",
  "soto-betawi", "pempek", "rawon", "mie-aceh"
].map(slug => recipes.find(r => r.slug === slug)).filter(Boolean);

export default function IndonesianFoodGuide() {
  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Ultimate Indonesian Food Guide 2026",
    description: "Complete guide to Indonesian cuisine with 500+ authentic recipes from 34 regions.",
    author: { "@type": "Organization", name: "NusantaraEats" },
    publisher: { "@type": "Organization", name: "NusantaraEats" },
    datePublished: "2026-01-01",
    dateModified: "2026-07-01",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nusantaraeats.com" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://nusantaraeats.com/guides" },
      { "@type": "ListItem", position: 3, name: "Indonesian Food Guide", item: "https://nusantaraeats.com/guides/indonesian-food-guide" },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is the most popular Indonesian food?", acceptedAnswer: { "@type": "Answer", text: "Rendang is widely considered Indonesia's most famous dish. In 2017, CNN Travel readers voted it the #1 most delicious food in the world. Other popular dishes include nasi goreng (fried rice), sate (satay), gudeg (jackfruit stew), and soto (traditional soup)." } },
      { "@type": "Question", name: "What are the main regions of Indonesian cuisine?", acceptedAnswer: { "@type": "Answer", text: "Indonesian cuisine varies by region: West Sumatra (Padang food, rendang), Java (gudeg, nasi goreng), Bali (lawar, babi guling), Sulawesi (coto makassar, pa'piong), Sumatra (mie aceh, pempek), Kalimantan (soto banjar), and Papua/Maluku (papeda, ikan bakar)." } },
      { "@type": "Question", name: "Is Indonesian food spicy?", acceptedAnswer: { "@type": "Answer", text: "Many Indonesian dishes are spicy, but not all. The level of spiciness varies by region and dish. Padang food from West Sumatra tends to be quite spicy, while Javanese cuisine is often milder and sweeter. Most recipes allow you to adjust chili levels to taste." } },
      { "@type": "Question", name: "What ingredients are commonly used in Indonesian cooking?", acceptedAnswer: { "@type": "Answer", text: "Common Indonesian ingredients include coconut milk (santan), lemongrass (serai), galangal (lengkuas), kaffir lime leaves, turmeric, shallots, garlic, candlenuts, and various chili peppers. Shrimp paste (terasi) and palm sugar (gula merah) are also essential." } },
      { "@type": "Question", name: "How many recipes does NusantaraEats have?", acceptedAnswer: { "@type": "Answer", text: "NusantaraEats has over 500 authentic Indonesian recipes from 34 regions across the archipelago. Each recipe includes step-by-step instructions, cultural history, nutritional information, and professional food photography." } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="relative z-10 mx-auto max-w-5xl px-4 py-28 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-300">Indonesian Food Guide</span>
        </nav>

        {/* Hero */}
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">— Complete Guide —</p>
          <h1 className="mt-4 font-serif text-4xl font-black text-white sm:text-5xl md:text-6xl">
            Ultimate <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Indonesian Food</span> Guide
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-400">
            Discover 500+ authentic recipes from 34 regions across the Indonesian archipelago.
            From fiery rendang to refreshing es cendol, explore the rich tapestry of Indonesian cuisine.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-zinc-500">
            <span>📖 {recipes.length}+ Recipes</span>
            <span>·</span>
            <span>🗺️ 34 Regions</span>
            <span>·</span>
            <span>📸 4K+ Photos</span>
            <span>·</span>
            <span>👨‍🍳 Tested & Verified</span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 rounded-xl border border-amber-500/10 bg-zinc-900 p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-400">📑 In This Guide</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "#top-dishes", label: "Top 8 Must-Try Dishes" },
              { href: "#categories", label: "Recipe Categories" },
              { href: "#regions", label: "Regional Cuisines" },
              { href: "#ingredients", label: "Essential Ingredients" },
              { href: "#history", label: "History & Culture" },
              { href: "#faq", label: "FAQ" },
            ].map((item) => (
              <a key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-amber-400 transition-colors">
                <span className="text-amber-500">→</span> {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Top 8 Must-Try Dishes */}
        <section id="top-dishes" className="mb-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-white">Top 8 Must-Try Indonesian Dishes</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOP_RECIPES.map((r) => r && (
              <Link key={r.id} href={`/recipes/${r.slug}`} className="group overflow-hidden rounded-xl border border-amber-500/10 bg-zinc-900 transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10">
                <div className="relative h-48 overflow-hidden">
                  <img src={r.image} alt={r.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-lg text-amber-400">{"★".repeat(Math.floor(r.rating))}</span>
                    <span className="ml-1 text-sm text-zinc-300">{r.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-400">{r.shortTitle || r.title.replace(/ Recipe:.*$/, "").replace(/ Recipe$/, "")}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{r.origin} · {r.waktu} mins · {r.kesulitan}</p>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-2">{r.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/recipes" className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-600 px-6 py-3 text-sm font-bold text-black hover:bg-amber-500 transition-colors">
              Explore All 500+ Recipes →
            </Link>
          </div>
        </section>

        {/* Recipe Categories */}
        <section id="categories" className="mb-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-white">Recipe Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES_DATA.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group flex items-center gap-4 rounded-xl border border-amber-500/10 bg-zinc-900 p-5 transition-all hover:border-amber-500/30 hover:bg-zinc-800">
                <span className="text-4xl">{cat.icon}</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-400">{cat.name}</h3>
                  <p className="text-sm text-zinc-500">{cat.count} recipes</p>
                </div>
                <span className="ml-auto text-amber-500">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Regional Cuisines */}
        <section id="regions" className="mb-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-white">Regional Cuisines</h2>
          <div className="space-y-8">
            {REGIONS_DATA.map((region) => (
              <div key={region.slug} className="rounded-xl border border-amber-500/10 bg-zinc-900 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{region.icon}</span>
                  <div>
                    <Link href={`/regions/${region.slug}`} className="font-serif text-xl font-bold text-white hover:text-amber-400 transition-colors">{region.name}</Link>
                    <p className="text-sm text-zinc-500">{region.desc}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {region.recipes.map((r) => r && (
                    <Link key={r.id} href={`/recipes/${r.slug}`} className="group flex items-center gap-3 rounded-lg bg-zinc-800/50 p-3 transition-all hover:bg-zinc-800">
                      <img src={r.image} alt={r.title} className="h-12 w-12 rounded object-cover" loading="lazy" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white group-hover:text-amber-400 truncate">{r.shortTitle || r.title.replace(/ Recipe:.*$/, "").replace(/ Recipe$/, "")}</p>
                        <p className="text-xs text-zinc-500">{r.waktu} mins</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href={`/regions/${region.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300">
                  View all {region.name} recipes →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Essential Ingredients */}
        <section id="ingredients" className="mb-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-white">Essential Indonesian Ingredients</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Coconut Milk (Santan)", desc: "The base for curries, rendang, and many traditional dishes. Freshly squeezed is best.", uses: "Rendang, Gulai, Opak" },
              { name: "Lemongrass (Serai)", desc: "Aromatic stalk that adds citrusy fragrance. Bruise before using to release oils.", uses: "Soto, Ayam Goreng, Sup" },
              { name: "Galangal (Lengkuas)", desc: "Related to ginger but with a sharper, more piney flavor. Essential in soups and curries.", uses: "Sayur Asem, Soto, Rendang" },
              { name: "Kaffir Lime Leaves", desc: "Intensely aromatic leaves used whole or shredded. Adds distinctive citrus note.", uses: "Rendang, Soto, Nasi Goreng" },
              { name: "Shrimp Paste (Terasi)", desc: "Fermented shrimp paste with pungent aroma. Toast before using to enhance flavor.", uses: "Sambal, Nasi Goreng, Pecel" },
              { name: "Palm Sugar (Gula Merah)", desc: "Natural sweetener from palm sap. Adds depth and caramel notes to dishes.", uses: "Gudeg, Sate, Es Cendol" },
            ].map((ing) => (
              <div key={ing.name} className="rounded-xl border border-amber-500/10 bg-zinc-900 p-5">
                <h3 className="font-serif text-lg font-bold text-amber-400">{ing.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{ing.desc}</p>
                <p className="mt-2 text-xs text-zinc-500"><span className="text-zinc-400">Used in:</span> {ing.uses}</p>
              </div>
            ))}
          </div>
        </section>

        {/* History & Culture */}
        <section id="history" className="mb-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-white">History & Culture of Indonesian Cuisine</h2>
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-zinc-300 leading-relaxed">
              Indonesian cuisine is one of the most diverse and flavorful in the world, shaped by centuries of trade, colonization, and cultural exchange. The archipelago&apos;s strategic position along ancient spice trade routes brought Indian, Chinese, Arab, and European influences that blended with indigenous cooking traditions.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              The use of spices like clove, nutmeg, and pepper made Indonesia a coveted destination for European colonial powers. The Dutch, Portuguese, and Spanish all sought control of the Spice Islands (Maluku), forever changing the culinary landscape of the region.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              Today, Indonesian food is celebrated globally. Rendang has been voted the world&apos;s most delicious food multiple times by CNN Travel. Nasi goreng is considered the national dish. From the rich, complex flavors of Padang cuisine to the fresh, vibrant dishes of Bali, each region offers a unique culinary experience.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="mb-8 font-serif text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is the most popular Indonesian food?", a: "Rendang is widely considered Indonesia's most famous dish. In 2017, CNN Travel readers voted it the #1 most delicious food in the world. Other popular dishes include nasi goreng, sate, gudeg, and soto." },
              { q: "What are the main regions of Indonesian cuisine?", a: "Indonesian cuisine varies by region: West Sumatra (Padang food), Java (gudeg, nasi goreng), Bali (lawar), Sulawesi (coto makassar), Sumatra (mie aceh), and many more." },
              { q: "Is Indonesian food spicy?", a: "Many dishes are spicy, but not all. Padang food tends to be quite spicy, while Javanese cuisine is often milder. Most recipes allow you to adjust chili levels." },
              { q: "What are essential Indonesian ingredients?", a: "Key ingredients include coconut milk, lemongrass, galangal, kaffir lime leaves, shrimp paste, palm sugar, and various chili peppers." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-amber-500/10 bg-zinc-900 p-5">
                <h3 className="font-serif text-lg font-bold text-white">{faq.q}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 p-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-white">Ready to Explore Indonesian Cuisine?</h2>
          <p className="mt-2 text-zinc-400">Start with our most popular recipes and discover the flavors of Indonesia.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/recipes" className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-8 py-3 text-sm font-bold text-black hover:bg-amber-500 transition-colors">
              Browse All Recipes →
            </Link>
            <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-zinc-900 px-8 py-3 text-sm font-semibold text-amber-400 hover:bg-zinc-800 transition-colors">
              Search Recipes
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
