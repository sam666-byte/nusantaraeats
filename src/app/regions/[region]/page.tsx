import { notFound } from "next/navigation";
import Link from "next/link";
import { recipes } from "@/data/recipes";
import type { Metadata } from "next";

const REGIONS = [
  { id: "west-sumatra", name: "West Sumatra", desc: "Home of rendang, padang cuisine, and rich coconut-based dishes", icon: "🏔️" },
  { id: "java", name: "Java", desc: "The heart of Javanese cuisine — from Yogyakarta to Surabaya", icon: "🏛️" },
  { id: "bali", name: "Bali", desc: "Balinese cuisine with unique spices, sambal, and ceremonial dishes", icon: "🌺" },
  { id: "sulawesi", name: "Sulawesi", desc: "Makassar and Manado cuisine — bold flavors from eastern Indonesia", icon: "🐟" },
  { id: "sumatra", name: "Sumatra", desc: "Aceh, Minang, and Palembang — the spice island's diverse flavors", icon: "🌿" },
  { id: "kalimantan", name: "Kalimantan", desc: "Dayak and Banjar cuisine from Borneo", icon: "🌴" },
  { id: "papua-maluku", name: "Papua & Maluku", desc: "Eastern Indonesia — sago, seafood, and tropical ingredients", icon: "🌊" },
  { id: "jakarta", name: "Jakarta", desc: "Betawi cuisine and the melting pot of Indonesian street food", icon: "🏙️" },
];

function getRecipesForRegion(region: string) {
  const regionMap: Record<string, string[]> = {
    "west-sumatra": ["West Sumatra", "Padang", "Minang"],
    "java": ["Java", "Yogyakarta", "Surabaya", "Solo", "Central Java", "East Java", "West Java", "Sunda"],
    "bali": ["Bali", "Ubud"],
    "sulawesi": ["South Sulawesi", "Makassar", "North Sulawesi", "Manado"],
    "sumatra": ["Aceh", "Palembang", "South Sumatra", "North Sumatra", "Karo"],
    "kalimantan": ["South Kalimantan", "Banjar", "Kalimantan"],
    "papua-maluku": ["Papua", "Maluku", "North Maluku", "Ternate"],
    "jakarta": ["Jakarta", "Betawi"],
  };
  const keywords = regionMap[region] || [];
  return recipes.filter((r) => keywords.some((k) => r.origin.includes(k)));
}

export async function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const regionInfo = REGIONS.find((r) => r.id === region);
  if (!regionInfo) return {};
  const count = getRecipesForRegion(region).length;
  return {
    title: `${regionInfo.name} Recipes — NusantaraEats`,
    description: `Discover ${count} authentic ${regionInfo.name} recipes. ${regionInfo.desc}. Explore the rich culinary traditions of Indonesia.`,
    alternates: { canonical: `https://nusantaraeats.com/regions/${region}` },
  };
}

interface Props {
  params: Promise<{ region: string }>;
}

export default async function RegionPage({ params }: Props) {
  const { region } = await params;
  const regionInfo = REGIONS.find((r) => r.id === region);
  if (!regionInfo) notFound();

  const regionRecipes = getRecipesForRegion(region);

  // Get unique categories in this region
  const categories = [...new Set(regionRecipes.map((r) => r.kategori))];

  return (
    <article className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-zinc-300">Regions</span>
        <span>/</span>
        <span className="text-zinc-300">{regionInfo.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-12 text-center">
        <span className="text-5xl">{regionInfo.icon}</span>
        <h1 className="mt-4 font-serif text-4xl font-black text-white sm:text-5xl">
          {regionInfo.name} Recipes
        </h1>
        <p className="mt-3 text-lg text-zinc-400">{regionInfo.desc}</p>
        <p className="mt-2 text-sm text-zinc-500">{regionRecipes.length} recipes from this region</p>
      </div>

      {/* Category Tags */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Link key={cat} href={`/categories/${cat}`} className="rounded-full border border-amber-500/15 bg-zinc-900 px-4 py-2 text-xs text-zinc-400 hover:border-amber-500/30 hover:text-amber-400 transition-colors">
            {cat.replace("-", " & ")}
          </Link>
        ))}
      </div>

      {/* Recipe Grid */}
      {regionRecipes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regionRecipes.map((r) => {
            const stars = "★".repeat(Math.floor(r.rating)) + "☆".repeat(5 - Math.floor(r.rating));
            return (
              <Link key={r.id} href={`/recipes/${r.slug}`} className="group overflow-hidden rounded-xl border border-amber-500/10 bg-zinc-900 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10">
                <div className="relative h-56 overflow-hidden">
                  <img src={r.image} alt={`Authentic ${r.title} from ${r.origin}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 rounded bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400 backdrop-blur-sm">{r.kesulitan}</span>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-sm text-amber-400">
                    <span>{stars}</span>
                    <span className="ml-1 text-xs text-zinc-400">{r.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="font-serif text-xl font-bold text-white transition-colors group-hover:text-amber-400">{r.title}</h2>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">{r.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                    <span>⏱ {r.waktu} mins</span>
                    <span>👥 {r.porsi}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-zinc-500">No recipes found for this region yet.</p>
        </div>
      )}

      {/* Other Regions */}
      <div className="mt-16">
        <h2 className="mb-6 text-center font-serif text-2xl font-bold text-white">Explore Other Regions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.filter((r) => r.id !== region).slice(0, 4).map((r) => (
            <Link key={r.id} href={`/regions/${r.id}`} className="group rounded-xl border border-amber-500/10 bg-zinc-900 p-4 text-center transition-all hover:border-amber-500/30 hover:bg-zinc-800">
              <span className="text-2xl">{r.icon}</span>
              <h3 className="mt-2 font-serif text-sm font-bold text-white group-hover:text-amber-400">{r.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{getRecipesForRegion(r.id).length} recipes</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Back */}
      <div className="mt-12 text-center">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-500">
          ← Browse All Recipes
        </Link>
      </div>
    </article>
  );
}
