import { notFound } from "next/navigation";
import Link from "next/link";
import { recipes } from "@/data/recipes";
import { KATEGORI_LIST } from "@/types";
import type { Metadata } from "next";
import CategoryRecipeGrid from "@/components/CategoryRecipeGrid";

interface Props {
  params: Promise<{ kategori: string }>;
}

export async function generateStaticParams() {
  return KATEGORI_LIST.map((k) => ({ kategori: k.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori } = await params;
  const kategoriInfo = KATEGORI_LIST.find((k) => k.id === kategori);
  if (!kategoriInfo) return {};
  const recipeCount = recipes.filter((r) => r.kategori === kategori).length;
  const desc = `Explore ${recipeCount} authentic Indonesian ${kategoriInfo.name.toLowerCase()} recipes. ${kategoriInfo.desc}.`;
  return {
    title: `${kategoriInfo.name} Recipes — NusantaraEats`,
    description: desc,
    alternates: { canonical: `https://nusantaraeats.com/categories/${kategori}` },
    openGraph: {
      title: `${kategoriInfo.name} Recipes — NusantaraEats`,
      description: desc,
      url: `https://nusantaraeats.com/categories/${kategori}`,
      siteName: "NusantaraEats",
    },
    twitter: {
      card: "summary_large_image",
      title: `${kategoriInfo.name} Recipes — NusantaraEats`,
      description: desc,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { kategori } = await params;
  const kategoriInfo = KATEGORI_LIST.find((k) => k.id === kategori);
  if (!kategoriInfo) notFound();

  const categoryRecipes = recipes.filter((r) => r.kategori === kategori);

  // Get unique origins in this category
  const origins = [...new Set(categoryRecipes.map((r) => r.origin))];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${kategoriInfo.name} Recipes — NusantaraEats`,
    description: `Explore ${categoryRecipes.length} authentic Indonesian ${kategoriInfo.name.toLowerCase()} recipes. ${kategoriInfo.desc}.`,
    url: `https://nusantaraeats.com/categories/${kategori}`,
    publisher: { "@type": "Organization", name: "NusantaraEats", url: "https://nusantaraeats.com" },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${kategoriInfo.name} Recipes`,
    description: `List of authentic Indonesian ${kategoriInfo.name.toLowerCase()} recipes`,
    numberOfItems: categoryRecipes.length,
    itemListElement: categoryRecipes.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://nusantaraeats.com/recipes/${r.slug}`,
      name: r.title,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nusantaraeats.com" },
      { "@type": "ListItem", position: 2, name: "Recipes", item: "https://nusantaraeats.com/recipes" },
      { "@type": "ListItem", position: 3, name: kategoriInfo.name, item: `https://nusantaraeats.com/categories/${kategori}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <article className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/recipes" className="hover:text-amber-400 transition-colors">Recipes</Link>
        <span>/</span>
        <span className="text-zinc-300">{kategoriInfo.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-12 text-center">
        <span className="text-5xl">{kategoriInfo.icon}</span>
        <h1 className="mt-4 font-serif text-4xl font-black text-white sm:text-5xl">
          {kategoriInfo.name}
        </h1>
        <p className="mt-3 text-lg text-zinc-400">{kategoriInfo.desc}</p>
        <p className="mt-2 text-sm text-zinc-500">{categoryRecipes.length} recipes available</p>
      </div>

      {/* Origin Filters */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {origins.map((origin) => (
          <span key={origin} className="rounded-full border border-amber-500/15 bg-zinc-900 px-4 py-2 text-xs text-zinc-400">
            🗺️ {origin}
          </span>
        ))}
      </div>

      {/* Recipe Grid - client component imports data directly */}
      <CategoryRecipeGrid categorySlug={kategori} total={categoryRecipes.length} />

      {/* Back */}
      <div className="mt-16 text-center">
        <Link href="/recipes" className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-500">
          ← Browse All Recipes
        </Link>
      </div>
    </article>
    </>
  );
}
