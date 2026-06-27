import { notFound } from "next/navigation";
import Link from "next/link";
import { recipes, getRecipeBySlug } from "@/data/recipes";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return {};
  return {
    title: `${recipe.title} — NusantaraEats`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.title} — NusantaraEats`,
      description: recipe.description,
      images: [{ url: recipe.image, width: 1200, height: 630 }],
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) notFound();

  const stars =
    "★".repeat(Math.floor(recipe.rating)) +
    "☆".repeat(5 - Math.floor(recipe.rating));

  return (
    <article className="relative z-10 mx-auto max-w-4xl px-4 py-28 sm:px-6">
      {/* Back */}
      <Link
        href="/#resep"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-zinc-500 transition-colors hover:text-amber-400"
      >
        ← Kembali ke resep
      </Link>

      {/* Hero Image */}
      <div className="relative h-72 overflow-hidden rounded-lg border border-amber-500/20 sm:h-96">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            {recipe.title}
          </h1>
          <div className="mt-2 flex items-center gap-1 text-lg text-amber-400">
            <span>{stars}</span>
            <span className="ml-1 text-sm text-zinc-400">{recipe.rating}</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {[
          { label: "🗺️", value: recipe.origin },
          { label: "⏱", value: `${recipe.waktu} menit` },
          { label: "👥", value: recipe.porsi },
          { label: "📊", value: recipe.kesulitan },
        ].map((m) => (
          <span
            key={m.label}
            className="rounded border border-amber-500/10 bg-zinc-900 px-4 py-2 text-zinc-300"
          >
            {m.label} {m.value}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-xl font-bold text-white">
            🛒 Bahan-bahan
          </h2>
          <ul className="mt-4 space-y-2">
            {recipe.ingredients.map((item, i) => (
              <li
                key={i}
                className="rounded bg-zinc-800/50 px-3 py-2 text-sm text-zinc-300"
                style={{ borderLeft: "2px solid rgba(212,175,55,0.5)" }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-serif text-xl font-bold text-white">
            👨‍🍳 Cara Memasak
          </h2>
          <ol className="mt-4 space-y-5">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-black">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Tips */}
      {recipe.tips && (
        <div className="mt-8 rounded-lg border border-amber-500/10 bg-gradient-to-r from-amber-900/10 to-amber-700/5 p-5">
          <p className="text-sm font-semibold text-amber-400">💡 Tips</p>
          <p className="mt-1 text-sm text-zinc-400">{recipe.tips}</p>
        </div>
      )}
    </article>
  );
}
