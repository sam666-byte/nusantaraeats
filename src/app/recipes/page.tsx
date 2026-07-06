import Link from "next/link";
import { recipes } from "@/data/recipes";
import { KATEGORI_LIST } from "@/types";
import RecipesGrid from "@/components/RecipesGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Recipes — NusantaraEats",
  description: "Browse all authentic Indonesian recipes by category, region, difficulty, and cooking time.",
  alternates: { canonical: "https://nusantaraeats.com/recipes" },
};

export default function RecipesPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Recipes — NusantaraEats",
    description: "Browse all authentic Indonesian recipes by category, region, difficulty, and cooking time.",
    url: "https://nusantaraeats.com/recipes",
    publisher: { "@type": "Organization", name: "NusantaraEats", url: "https://nusantaraeats.com" },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Indonesian Recipes",
    description: "Complete collection of authentic Indonesian recipes",
    numberOfItems: recipes.length,
    itemListElement: recipes.slice(0, 24).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://nusantaraeats.com/recipes/${r.slug}`,
      name: r.shortTitle || r.title.replace(/ Recipe:.*$/, '').replace(/ Recipe$/, ''),
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nusantaraeats.com" },
      { "@type": "ListItem", position: 2, name: "Recipes", item: "https://nusantaraeats.com/recipes" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <article className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6">
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-zinc-300">Recipes</span>
      </nav>

      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-black text-white sm:text-5xl">
          All <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Recipes</span>
        </h1>
        <p className="mt-3 text-lg text-zinc-400">{recipes.length} authentic Indonesian recipes</p>
      </div>

      {/* Category Links */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {KATEGORI_LIST.map((k) => {
          const count = recipes.filter((r) => r.kategori === k.id).length;
          return (
            <Link
              key={k.id}
              href={`/categories/${k.id}`}
              className="group rounded-xl border border-amber-500/10 bg-zinc-900 p-4 text-center transition-all hover:border-amber-500/30 hover:bg-zinc-800"
            >
              <span className="text-2xl">{k.icon}</span>
              <h3 className="mt-2 font-serif text-sm font-bold text-white group-hover:text-amber-400">{k.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{count} recipes</p>
            </Link>
          );
        })}
      </div>

      {/* Recipe Grid - client component imports data directly */}
      <RecipesGrid totalCount={recipes.length} />
    </article>
    </>
  );
}
