import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All 150 Recipes — NusantaraEats",
  description: "Browse all 150 authentic Indonesian recipes by category, region, difficulty, and cooking time.",
  alternates: { canonical: "https://nusantaraeats.com/recipes" },
  openGraph: {
    title: "All 150 Recipes — NusantaraEats",
    description: "Browse all 150 authentic Indonesian recipes by category, region, difficulty, and cooking time.",
    url: "https://nusantaraeats.com/recipes",
    siteName: "NusantaraEats",
    images: [{ url: "https://nusantaraeats.com/og-recipes.jpg", width: 1200, height: 630, alt: "NusantaraEats - Authentic Indonesian Recipes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All 150 Recipes — NusantaraEats",
    description: "Browse all 150 authentic Indonesian recipes by category, region, difficulty, and cooking time.",
  },
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
