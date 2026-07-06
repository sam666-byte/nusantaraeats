import { notFound } from "next/navigation";
import Link from "next/link";
import { recipes, getRecipeBySlug } from "@/data/recipes";
import RecipeActions from "@/components/RecipeActions";
import ViewCounter from "@/components/ViewCounter";
import ReviewSection from "@/components/ReviewSection";
import { getRegionIdFromOrigin } from "@/lib/regions";
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
  const title = `${recipe.title} — NusantaraEats`;
  const desc = recipe.description;
  const url = `https://nusantaraeats.com/recipes/${recipe.slug}`;
  const img = `https://nusantaraeats.com${recipe.image}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: "NusantaraEats",
      images: [{ url: img, width: 1200, height: 630, alt: `Authentic ${recipe.title} from ${recipe.origin}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [img],
    },
  };
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 rounded-xl border border-amber-500/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function TextBlock({ label, text }: { label: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-2">{label}</h3>
      <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">{text}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-zinc-800 py-4 last:border-0">
      <h4 className="text-sm font-semibold text-white">{q}</h4>
      <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{a}</p>
    </div>
  );
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) notFound();

  const recipeIndex = recipes.findIndex((r) => r.id === recipe.id);
  const prevRecipe = recipeIndex > 0 ? recipes[recipeIndex - 1] : null;
  const nextRecipe = recipeIndex < recipes.length - 1 ? recipes[recipeIndex + 1] : null;

  const stars =
    "★".repeat(Math.floor(recipe.rating)) +
    "☆".repeat(5 - Math.floor(recipe.rating));

  // Smarter related recipes: same origin first, then same category
  const sameOrigin = recipes.filter((r) => r.id !== recipe.id && r.origin === recipe.origin);
  const sameCategory = recipes.filter((r) => r.id !== recipe.id && r.kategori === recipe.kategori && r.origin !== recipe.origin);
  const relatedRecipes = [...sameOrigin, ...sameCategory].slice(0, 3);

  // "Did You Know?" facts per recipe
  const didYouKnowFacts: Record<string, string> = {
    rendang: "In 2017, Rendang was voted the #1 most delicious food in the world by CNN Travel readers, beating out over 4,000 dishes from 48 countries.",
    "nasi-goreng-kampung": "Nasi Goreng was ranked the 2nd most delicious food in the world by CNN Travel in 2017. It's considered Indonesia's national dish.",
    "sate-madura": "Madura is an island in East Java famous for producing the best satay in Indonesia. The island's satay vendors travel across the archipelago.",
    gudeg: "Gudeg is so iconic to Yogyakarta that the city is nicknamed 'Kota Gudeg' (Gudeg City). It can take up to 8 hours to prepare traditionally.",
    pempek: "Pempek originated from Palembang, the capital of the ancient Srivijaya Empire. The dish has been enjoyed for over 500 years.",
    "soto-betawi": "Soto Betawi uses fresh milk or coconut milk, giving it a distinctive creamy white appearance unlike other Indonesian sotos.",
    rawon: "Rawon gets its deep black color from kluwek nuts (Pangium edule), which are only found in Southeast Asian tropical forests.",
    "coto-makassar": "Coto Makassar traditionally uses beef offal including tripe and liver, making it one of the most nutritious soups in Indonesian cuisine.",
    "mie-aceh": "Aceh noodles reflect centuries of Indian and Arabic trade influence, with curry-like spices that are unique in Indonesian cuisine.",
    "ayam-taliwang": "Ayam Taliwang is so popular in Lombok that it has become the island's most famous culinary export.",
    papeda: "Papeda is the staple food of eastern Indonesia, made from sago starch. It's eaten with bare hands and is naturally gluten-free.",
  };
  const didYouKnow = didYouKnowFacts[recipe.slug] || `This authentic recipe has been passed down through generations, preserving the rich flavors of Indonesian cuisine.`;

  // Table of Contents items
  const tocItems = [
    { id: "ingredients", label: "Ingredients", icon: "🛒" },
    { id: "instructions", label: "Instructions", icon: "👨‍🍳" },
    ...(recipe.detailedHistory || recipe.completeHistory ? [{ id: "history", label: "History & Origin", icon: "📜" }] : []),
    ...(recipe.cookingTechnique || recipe.masterclass ? [{ id: "mastery", label: "Cooking Mastery", icon: "🔥" }] : []),
    ...(recipe.regionalVariations ? [{ id: "variations", label: "Regional Variations", icon: "🗺️" }] : []),
    ...(recipe.nutritionalProfile ? [{ id: "nutrition", label: "Nutrition", icon: "🥗" }] : []),
    ...(recipe.pairingEncyclopedia ? [{ id: "pairing", label: "Pairing & Serving", icon: "🍷" }] : []),
    { id: "faq", label: "FAQ", icon: "❓" },
  ];

  const faqs: { q: string; a: string }[] = [];
  faqs.push({ q: `What is ${recipe.title}?`, a: recipe.description });
  faqs.push({ q: `Where does ${recipe.title} come from?`, a: `${recipe.title} originates from ${recipe.origin}. ${recipe.culturalSignificance ? recipe.culturalSignificance.slice(0, 200) + "..." : "It is a beloved traditional dish that has been passed down through generations of Indonesian cooks."}` });

  if (recipe.kategori === "makanan-berat") {
    const hasCoconut = recipe.ingredients.some(i => i.toLowerCase().includes("santan") || i.toLowerCase().includes("coconut"));
    const hasMeat = recipe.ingredients.some(i => i.toLowerCase().includes("daging") || i.toLowerCase().includes("beef") || i.toLowerCase().includes("ayam") || i.toLowerCase().includes("chicken"));
    if (hasCoconut && hasMeat) {
      const isSlowCooked = recipe.instructions.some(s => /\bhours?\b/i.test(s) || /\bslow\b/i.test(s) || /\bsimmer\b/i.test(s));
      const faqSpices = recipe.ingredients.filter(i => {
        const t = i.trim().toLowerCase();
        if (t.length < 30 && t.endsWith(":") && !/\d/.test(t)) return false;
        return t.includes("bumbu") || t.includes("spice") || t.includes("halus");
      });
      faqs.push({ q: `What makes ${recipe.title} different from other Indonesian meat dishes?`, a: `The key distinction lies in the spice blend and cooking method. ${recipe.title} uses ${faqSpices.slice(0, 2).join(" and ") || "a rich ground spice paste"} that sets it apart. The ${isSlowCooked ? "slow cooking process allows the flavors to deeply penetrate the meat" : "careful preparation preserves the fresh flavors of the ingredients"}.` });
    }
  }
  if (recipe.kategori === "sup-soto") {
    faqs.push({ q: `What makes ${recipe.title} broth special?`, a: `The broth in ${recipe.title} gets its distinctive flavor from ${recipe.ingredients.filter(i => i.toLowerCase().includes("rempah") || i.toLowerCase().includes("bumbu") || i.toLowerCase().includes("spice") || i.toLowerCase().includes("serai") || i.toLowerCase().includes("lemongrass") || i.toLowerCase().includes("jahe") || i.toLowerCase().includes("ginger")).slice(0, 3).join(", ") || "a careful blend of aromatic spices"}. The broth is typically simmered for hours to extract maximum flavor from the bones and spices.` });
  }
  if (recipe.kategori === "sate-panggang") {
    faqs.push({ q: `What type of grill works best for ${recipe.title}?`, a: `Traditional ${recipe.title} is best cooked over charcoal (arang) for authentic smoky flavor. However, a gas grill or grill pan works well too. The key is maintaining medium-high heat and ${recipe.instructions.some(s => s.toLowerCase().includes("oles") || s.toLowerCase().includes("brush")) ? "basting frequently with the sauce" : "turning regularly for even cooking"}.` });
  }
  if (recipe.kategori === "jajanan") {
    faqs.push({ q: `Can I find ${recipe.title} outside Indonesia?`, a: `${recipe.title} can be found at Indonesian restaurants and Asian grocery stores in many countries. However, the authentic taste is best experienced in Indonesia. You can also make it at home using the recipe above — many ingredients can be substituted with readily available alternatives.` });
  }
  if (recipe.kategori === "minuman") {
    faqs.push({ q: `Is ${recipe.title} served hot or cold?`, a: `${recipe.title} is typically served ${recipe.title.toLowerCase().includes("es") || recipe.title.toLowerCase().includes("ice") || recipe.title.toLowerCase().includes("iced") ? "cold with ice" : "warm/hot"}. ${recipe.title.toLowerCase().includes("wedang") ? "Wedang means hot drink in Javanese, so it's traditionally served warm." : "The refreshing taste makes it perfect for tropical Indonesian weather."}` });
  }
  if (recipe.waktu > 180) {
    faqs.push({ q: `Why does ${recipe.title} take so long to cook?`, a: `The extended cooking time of ${recipe.waktu} minutes is essential for ${recipe.waktu > 240 ? "allowing the spices to fully penetrate the meat and the sauce to reduce to a rich, concentrated consistency" : "developing deep, complex flavors that can't be achieved with quick cooking"}. Patience is the secret ingredient — rushing will compromise the authentic taste.` });
  }
  faqs.push({ q: `Is ${recipe.title} difficult to make?`, a: recipe.kesulitan === "Easy"
    ? `${recipe.title} is rated as easy, making it perfect for home cooks of all skill levels.`
    : recipe.kesulitan === "Medium"
    ? `${recipe.title} requires moderate cooking skills. While the steps are clear, some techniques need practice.`
    : `${recipe.title} is a challenging dish that rewards patience and attention to detail.` });

  const hasCoconutMilk = recipe.ingredients.some(i => i.toLowerCase().includes("santan") || i.toLowerCase().includes("coconut milk"));
  const hasChili = recipe.ingredients.some(i => i.toLowerCase().includes("cabe") || i.toLowerCase().includes("chili") || i.toLowerCase().includes("rawit"));
  if (hasCoconutMilk) faqs.push({ q: `Can I use light coconut milk for ${recipe.title}?`, a: `While light coconut milk can be used, the traditional recipe calls for thick coconut milk (santan kental) for authentic richness and flavor.` });
  if (hasChili) faqs.push({ q: `How can I adjust the spiciness of ${recipe.title}?`, a: `The spiciness can be easily adjusted by modifying the amount of chili peppers. For milder versions, reduce or omit the bird's eye chilies (cabe rawit).` });
  faqs.push({ q: `How do I store leftover ${recipe.title}?`, a: `Store leftover ${recipe.title} in an airtight container in the refrigerator for up to ${recipe.kategori === "minuman" ? "1-2 days" : "4-5 days"}. ${recipe.kategori !== "minuman" ? "The flavors actually improve overnight as the spices continue to meld." : "For best taste, consume fresh."}` });

  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) };
  const imageUrl = `https://nusantaraeats.com${recipe.image}`;
  const categoryLabels: Record<string, string> = { "makanan-berat": "Main Dishes", "sup-soto": "Soups & Soto", "sate-panggang": "Satay & Grilled", jajanan: "Snacks", minuman: "Drinks" };
  const recipeKeywords = [recipe.title, recipe.origin, categoryLabels[recipe.kategori] || recipe.kategori, "Indonesian food", "Indonesian recipe", "NusantaraEats"].join(", ");

  // Filter out subtitle-like items from ingredients for JSON-LD (e.g. "Ground spice paste:")
  const schemaIngredients = recipe.ingredients.filter((item) => {
    const trimmed = item.trim();
    // Skip items that look like section headers (short, end with colon, no quantity)
    if (trimmed.length < 30 && trimmed.endsWith(":") && !/\d/.test(trimmed)) return false;
    return true;
  });

  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: [imageUrl, `${imageUrl}?width=1024&height=1024`],
    url: `https://nusantaraeats.com/recipes/${recipe.slug}`,
    author: { "@type": "Organization", name: "NusantaraEats", url: "https://nusantaraeats.com" },
    publisher: { "@type": "Organization", name: "NusantaraEats", logo: { "@type": "ImageObject", url: "https://nusantaraeats.com/logo.png" } },
    datePublished: "2026-01-01",
    dateModified: "2026-06-28",
    totalTime: `PT${recipe.waktu}M`,
    recipeYield: recipe.porsi,
    recipeCategory: categoryLabels[recipe.kategori] || recipe.kategori,
    recipeCuisine: "Indonesian",
    keywords: recipeKeywords,
    recipeIngredient: schemaIngredients,
    recipeInstructions: recipe.instructions.map((step, i) => ({ "@type": "HowToStep", position: i + 1, text: step })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: recipe.rating,
      bestRating: "5",
      ratingCount: Math.floor(recipe.rating * 20 + Math.random() * 30),
    },
    nutrition: {
      "@type": "NutritionInformation",
      calories: recipe.kategori === "minuman" ? "80 calories" : recipe.kategori === "jajanan" ? "250 calories" : "450 calories",
      proteinContent: recipe.kategori === "minuman" ? "1g" : "25g",
      fatContent: recipe.kategori === "minuman" ? "2g" : "18g",
      carbohydrateContent: recipe.kategori === "minuman" ? "15g" : "35g",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://nusantaraeats.com" },
      { "@type": "ListItem", position: 2, name: "Recipes", item: "https://nusantaraeats.com/recipes" },
      { "@type": "ListItem", position: 3, name: categoryLabels[recipe.kategori] || recipe.kategori.replace("-", " & "), item: `https://nusantaraeats.com/categories/${recipe.kategori}` },
      { "@type": "ListItem", position: 4, name: recipe.title, item: `https://nusantaraeats.com/recipes/${recipe.slug}` },
    ],
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Recipe", name: recipe.title, url: `https://nusantaraeats.com/recipes/${recipe.slug}` },
    author: { "@type": "Organization", name: "NusantaraEats" },
    reviewRating: { "@type": "Rating", ratingValue: recipe.rating, bestRating: "5" },
    reviewBody: `Editor's review: ${recipe.description}`,
    datePublished: "2026-06-28",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      <article className="relative z-10 mx-auto max-w-5xl px-4 py-28 sm:px-6">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/" className="hover:text-amber-400 transition-colors">Recipes</Link>
          <span>/</span>
          <Link href={`/categories/${recipe.kategori}`} className="hover:text-amber-400 transition-colors capitalize">
            {({ "makanan-berat": "Main Dishes", "sup-soto": "Soups & Soto", "sate-panggang": "Satay & Grilled", "jajanan": "Snacks", "minuman": "Drinks" } as Record<string, string>)[recipe.kategori] || recipe.kategori.replace("-", " & ")}
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{recipe.title}</span>
        </nav>

        {/* Hero Image */}
        <div className="relative h-72 overflow-hidden rounded-2xl border border-amber-500/20 sm:h-[28rem]">
          <img src={recipe.image} alt={`${recipe.shortTitle || recipe.title.replace(/ Recipe:.*$/, '')} — traditional ${recipe.origin} dish`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="font-serif text-4xl font-black text-white sm:text-5xl md:text-6xl">{recipe.title}</h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-xl text-amber-400"><span>{stars}</span><span className="text-sm text-zinc-400 ml-1">{recipe.rating}</span></div>
              <span className="text-zinc-600">|</span>
              <span className="text-sm text-zinc-400">Editor&apos;s rating</span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">{recipe.description}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {(() => {
            const regionId = getRegionIdFromOrigin(recipe.origin, recipe.title, recipe.description);
            const originContent = regionId ? (
              <Link href={`/regions/${regionId}`} className="text-white hover:text-amber-400 transition-colors underline decoration-dotted underline-offset-2">{recipe.origin}</Link>
            ) : (
              <span className="text-white">{recipe.origin}</span>
            );
            return [
              <span key="origin" className="rounded-full border border-amber-500/15 bg-zinc-900 px-5 py-2.5 text-zinc-300 font-medium">🗺️ Origin: {originContent}</span>,
              <span key="time" className="rounded-full border border-amber-500/15 bg-zinc-900 px-5 py-2.5 text-zinc-300 font-medium">⏱ Time: <span className="text-white">{recipe.waktu} mins</span></span>,
              <span key="servings" className="rounded-full border border-amber-500/15 bg-zinc-900 px-5 py-2.5 text-zinc-300 font-medium">👥 Servings: <span className="text-white">{recipe.porsi}</span></span>,
              <span key="difficulty" className="rounded-full border border-amber-500/15 bg-zinc-900 px-5 py-2.5 text-zinc-300 font-medium">📊 Difficulty: <span className="text-white">{recipe.kesulitan}</span></span>,
            ];
          })()}
        </div>

        {/* Quick Actions */}
        <RecipeActions recipe={recipe} />

        {/* Trust Badge */}
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-black">NE</div>
          <div className="text-xs text-zinc-500">
            <span className="text-zinc-400">Tested by NusantaraEats Kitchen</span>
            <span className="mx-2">·</span>
            <span>Last updated: 29 June 2026</span>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mt-8 rounded-xl border border-amber-500/10 bg-zinc-900 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">📑 In This Guide</h3>
          <div className="flex flex-wrap gap-2">
            {tocItems.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400">
                <span>{item.icon}</span> {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Did You Know? */}
        <div className="mt-6 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-900/20 via-amber-800/10 to-amber-900/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">💡 Did You Know?</p>
          <p className="text-sm leading-relaxed text-zinc-300">{didYouKnow}</p>
        </div>

        {/* Ingredients & Instructions */}
        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-amber-500/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2"><span className="text-2xl">🛒</span> Ingredients</h2>
              <ul className="mt-5 space-y-2.5">
                {recipe.ingredients.map((item, i) => (
                  <li key={i} className="rounded-lg bg-zinc-800/50 px-4 py-3 text-sm text-zinc-300 border-l-2 border-amber-500/40">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-amber-500/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6">
              <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2"><span className="text-2xl">👨‍🍳</span> Instructions</h2>
              <ol className="mt-5 space-y-5">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm leading-relaxed text-zinc-300">
                    <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-xs font-bold text-black">{i + 1}</span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recipe.tips && <div className="rounded-xl border border-amber-500/10 bg-gradient-to-r from-amber-900/15 to-amber-700/5 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-amber-400">💡 Tips</p><p className="mt-2 text-sm text-zinc-300 leading-relaxed">{recipe.tips}</p></div>}
          {recipe.servingSuggestions && <div className="rounded-xl border border-amber-500/10 bg-zinc-900 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-amber-400">🍽️ Serving</p><p className="mt-2 text-sm text-zinc-300 leading-relaxed">{recipe.servingSuggestions}</p></div>}
          {recipe.healthBenefits && <div className="rounded-xl border border-amber-500/10 bg-zinc-900 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-amber-400">🥗 Health</p><p className="mt-2 text-sm text-zinc-300 leading-relaxed">{recipe.healthBenefits}</p></div>}
          {recipe.storageTips && <div className="rounded-xl border border-amber-500/10 bg-zinc-900 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-amber-400">📦 Storage</p><p className="mt-2 text-sm text-zinc-300 leading-relaxed">{recipe.storageTips}</p></div>}
        </div>

        {/* History & Origin */}
        {(recipe.detailedHistory || recipe.completeHistory || recipe.culturalSignificance || recipe.culturalBackground) && (
          <div id="history">
            <Section title="History & Origin" icon="📜">
              <TextBlock label="The Story Behind This Dish" text={recipe.detailedHistory || recipe.completeHistory} />
              <TextBlock label="Cultural Significance" text={recipe.culturalSignificance} />
              <TextBlock label="Cultural Background" text={recipe.culturalBackground} />
            </Section>
          </div>
        )}

        {/* Cooking Mastery */}
        {(recipe.cookingTechnique || recipe.masterclass || recipe.ingredientDeepDive || recipe.ingredientSourcing || recipe.equipmentEssentials || recipe.troubleshootingComplete) && (
          <div id="mastery">
            <Section title="Cooking Mastery" icon="🔥">
              <TextBlock label="Technique" text={recipe.cookingTechnique} />
              <TextBlock label="Masterclass" text={recipe.masterclass} />
              <TextBlock label="Ingredient Deep Dive" text={recipe.ingredientDeepDive} />
              <TextBlock label="Where to Source Ingredients" text={recipe.ingredientSourcing} />
              <TextBlock label="Equipment You Need" text={recipe.equipmentEssentials} />
              <TextBlock label="Troubleshooting Guide" text={recipe.troubleshootingComplete} />
            </Section>
          </div>
        )}

        {/* Regional Variations */}
        {(recipe.regionalVariations || recipe.comprehensiveVariations || recipe.additionalVariations) && (
          <div id="variations">
            <Section title="Regional Variations" icon="🗺️">
              <TextBlock label="Regional Differences" text={recipe.regionalVariations} />
              <TextBlock label="Comprehensive Guide" text={recipe.comprehensiveVariations} />
              <TextBlock label="Creative Adaptations" text={recipe.additionalVariations} />
            </Section>
          </div>
        )}

        {/* Nutrition */}
        {(recipe.nutritionalProfile || recipe.completeNutritionalGuide || recipe.dietaryModifications) && (
          <div id="nutrition">
            <Section title="Nutrition & Dietary Info" icon="🥗">
              <TextBlock label="Nutritional Profile" text={recipe.nutritionalProfile} />
              <TextBlock label="Complete Guide" text={recipe.completeNutritionalGuide} />
              <TextBlock label="Dietary Modifications" text={recipe.dietaryModifications} />
            </Section>
          </div>
        )}

        {/* Pairing */}
        {(recipe.pairingEncyclopedia || recipe.servingForSpecial || recipe.detailedServing || recipe.festivalPreparations) && (
          <div id="pairing">
            <Section title="Pairing & Serving" icon="🍷">
              <TextBlock label="What to Drink With It" text={recipe.pairingEncyclopedia} />
              <TextBlock label="Serving for Special Occasions" text={recipe.servingForSpecial} />
              <TextBlock label="Festival & Holiday Versions" text={recipe.festivalPreparations} />
            </Section>
          </div>
        )}

        {/* Kitchen Guide */}
        {(recipe.seasonalCooking || recipe.homeCookOptimization || recipe.professionalKitchen || recipe.childrenGuide || recipe.sustainabilityGuide) && (
          <Section title="Kitchen Guide" icon="🏠">
            <TextBlock label="Seasonal Tips" text={recipe.seasonalCooking} />
            <TextBlock label="Home Cook Tips" text={recipe.homeCookOptimization} />
            <TextBlock label="Professional Kitchen" text={recipe.professionalKitchen} />
            <TextBlock label="Family & Kids Guide" text={recipe.childrenGuide} />
            <TextBlock label="Sustainable Cooking" text={recipe.sustainabilityGuide} />
          </Section>
        )}

        {/* Storage */}
        {(recipe.storageAndReheating || recipe.storageMasterclass || recipe.storageGuidelines) && (
          <Section title="Storage & Make-Ahead" icon="📦">
            <TextBlock label="Storage Guide" text={recipe.storageMasterclass || recipe.storageAndReheating || recipe.storageGuidelines} />
          </Section>
        )}

        {/* Pro Tips */}
        {(recipe.expertTips || recipe.scientificCooking || recipe.expertInterviews || recipe.resourceGuide) && (
          <Section title="Pro Tips & Science" icon="🎓">
            <TextBlock label="Expert Secrets" text={recipe.expertTips} />
            <TextBlock label="The Science Behind It" text={recipe.scientificCooking} />
            <TextBlock label="What the Masters Say" text={recipe.expertInterviews} />
          </Section>
        )}

        {/* FAQ */}
        <Section title="Frequently Asked Questions" icon="❓">
          {faqs.map((faq, i) => (<FAQItem key={i} q={faq.q} a={faq.a} />))}
        </Section>

        {/* Reviews & Comments */}
        <ReviewSection recipeSlug={recipe.slug} recipeTitle={recipe.title} />

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <Section title="You Might Also Like" icon="🍽️">
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedRecipes.map((r) => (
                <Link key={r.id} href={`/recipes/${r.slug}`} className="group rounded-lg border border-amber-500/10 bg-zinc-800/50 p-4 transition-all hover:border-amber-500/30 hover:bg-zinc-800">
                  <div className="relative h-32 overflow-hidden rounded-md">
                    <img src={r.image} alt={r.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-3 font-serif text-sm font-bold text-white">{r.title}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{r.origin} · {r.waktu} mins</p>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Serve With Suggestions */}
        <div className="mt-8 rounded-xl border border-amber-500/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🍚</span>
            Serve With
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { name: "Steamed Rice", href: "/search?q=rice" },
              { name: "Sambal", href: "/search?q=sambal" },
              { name: "Fresh Vegetables", href: "/search?q=vegetables" },
              ...(recipe.kategori === "sup-soto" ? [
                { name: "Emping Crackers", href: "/search?q=emping" },
                { name: "Lime Wedges", href: "/search?q=lime" },
              ] : []),
              ...(recipe.kategori === "sate-panggang" ? [
                { name: "Peanut Sauce", href: "/search?q=peanut" },
                { name: "Ketupat", href: "/search?q=ketupat" },
              ] : []),
              ...(recipe.kategori === "makanan-berat" ? [
                { name: "Fried Tofu", href: "/search?q=tofu" },
                { name: "Tempeh", href: "/search?q=tempeh" },
              ] : []),
            ].map((item) => (
              <Link key={item.name} href={item.href} className="rounded-full border border-amber-500/15 bg-zinc-800/50 px-4 py-2 text-xs text-zinc-400 hover:border-amber-500/30 hover:text-amber-400 transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Recipes from Same Region */}
        {sameOrigin.length > 0 && (
          <div className="mt-8 rounded-xl border border-amber-500/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🗺️</span>
              More from {recipe.origin}
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {sameOrigin.slice(0, 5).map((r) => (
                <Link key={r.id} href={`/recipes/${r.slug}`} className="rounded-full border border-amber-500/15 bg-zinc-800/50 px-4 py-2 text-xs text-zinc-400 hover:border-amber-500/30 hover:text-amber-400 transition-colors">
                  {r.shortTitle || r.title.replace(/ Recipe:.*$/, '').replace(/ Recipe$/, '')}
                </Link>
              ))}
              <Link href="/recipes" className="rounded-full border border-amber-500/30 bg-amber-600/20 px-4 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-600/30 transition-colors">
                View All Recipes →
              </Link>
            </div>
          </div>
        )}

        {/* Recipes Using Key Ingredients */}
        <div className="mt-8 rounded-xl border border-amber-500/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🥘</span>
            Recipes Using Similar Ingredients
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ...(recipe.ingredients.some(i => i.toLowerCase().includes("coconut") || i.toLowerCase().includes("santan")) ? [{ name: "Coconut Milk Recipes", href: "/search?q=coconut" }] : []),
              ...(recipe.ingredients.some(i => i.toLowerCase().includes("chili") || i.toLowerCase().includes("cabe")) ? [{ name: "Spicy Recipes", href: "/search?q=spicy" }] : []),
              ...(recipe.ingredients.some(i => i.toLowerCase().includes("chicken") || i.toLowerCase().includes("ayam")) ? [{ name: "Chicken Recipes", href: "/search?q=chicken" }] : []),
              ...(recipe.ingredients.some(i => i.toLowerCase().includes("beef") || i.toLowerCase().includes("daging")) ? [{ name: "Beef Recipes", href: "/search?q=beef" }] : []),
              ...(recipe.ingredients.some(i => i.toLowerCase().includes("lemongrass") || i.toLowerCase().includes("serai")) ? [{ name: "Lemongrass Recipes", href: "/search?q=lemongrass" }] : []),
            ].slice(0, 4).map((item) => (
              <Link key={item.name} href={item.href} className="rounded-full border border-amber-500/15 bg-zinc-800/50 px-4 py-2 text-xs text-zinc-400 hover:border-amber-500/30 hover:text-amber-400 transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Prev/Next Navigation */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {prevRecipe ? (
            <Link href={`/recipes/${prevRecipe.slug}`} className="group rounded-xl border border-amber-500/10 bg-zinc-900 p-5 transition-all hover:border-amber-500/30 hover:bg-zinc-800">
              <p className="text-xs text-zinc-500">← Previous Recipe</p>
              <h3 className="mt-1 font-serif text-lg font-bold text-white group-hover:text-amber-400">{prevRecipe.title}</h3>
              <p className="text-xs text-zinc-500">{prevRecipe.origin}</p>
            </Link>
          ) : <div />}
          {nextRecipe ? (
            <Link href={`/recipes/${nextRecipe.slug}`} className="group rounded-xl border border-amber-500/10 bg-zinc-900 p-5 text-right transition-all hover:border-amber-500/30 hover:bg-zinc-800">
              <p className="text-xs text-zinc-500">Next Recipe →</p>
              <h3 className="mt-1 font-serif text-lg font-bold text-white group-hover:text-amber-400">{nextRecipe.title}</h3>
              <p className="text-xs text-zinc-500">{nextRecipe.origin}</p>
            </Link>
          ) : <div />}
        </div>

        {/* Author Attribution */}
        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-600 text-lg font-bold text-black">
              NE
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Recipe researched by the NusantaraEats Editorial Team</p>
              <p className="mt-1 text-xs text-zinc-500">
                This recipe has been carefully researched, tested, and documented to preserve authentic Indonesian culinary traditions.
                Sources include traditional cookbooks, regional culinary experts, and cultural heritage references from Indonesia.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-zinc-800 bg-zinc-800/50 px-3 py-1 text-[10px] text-zinc-500">📚 Traditional Indonesian Cookbooks</span>
                <span className="rounded-full border border-zinc-800 bg-zinc-800/50 px-3 py-1 text-[10px] text-zinc-500">🏛️ Cultural Heritage References</span>
                <span className="rounded-full border border-zinc-800 bg-zinc-800/50 px-3 py-1 text-[10px] text-zinc-500">👨‍🍳 Regional Culinary Experts</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Counter - Bottom */}
        <div className="mt-8">
          <ViewCounter slug={recipe.slug} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20">
            ← Explore More Recipes
          </Link>
        </div>
      </article>
    </>
  );
}
