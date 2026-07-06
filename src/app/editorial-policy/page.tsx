import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy — NusantaraEats",
  description: "Learn about our editorial standards, recipe testing process, and commitment to authentic Indonesian cuisine.",
  alternates: { canonical: "https://nusantaraeats.com/editorial-policy" },
  openGraph: {
    title: "Editorial Policy — NusantaraEats",
    description: "Learn about our editorial standards, recipe testing process, and commitment to authentic Indonesian cuisine.",
    url: "https://nusantaraeats.com/editorial-policy",
    siteName: "NusantaraEats",
  },
  twitter: {
    card: "summary",
    title: "Editorial Policy — NusantaraEats",
    description: "Learn about our editorial standards, recipe testing process, and commitment to authentic Indonesian cuisine.",
  },
};

export default function EditorialPolicyPage() {
  return (
    <article className="relative z-10 mx-auto max-w-4xl px-4 py-28 sm:px-6">
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-zinc-300">Editorial Policy</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-serif text-4xl font-black text-white sm:text-5xl">Editorial Policy</h1>
        <p className="mt-3 text-sm text-zinc-500">Last updated: June 29, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-zinc-300">
        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Our Commitment</h2>
          <p className="leading-relaxed">
            At NusantaraEats, we are dedicated to preserving and sharing authentic Indonesian culinary traditions. Every recipe on our site is carefully researched, tested, and documented to ensure accuracy and authenticity.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Recipe Research</h2>
          <p className="leading-relaxed">
            Our recipe development process includes:
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-6">
            <li><strong>Source verification:</strong> Cross-referencing traditional cookbooks, regional culinary experts, and cultural heritage references.</li>
            <li><strong>Regional accuracy:</strong> Ensuring recipes reflect authentic regional techniques and ingredients.</li>
            <li><strong>Cultural context:</strong> Documenting the history, cultural significance, and traditions behind each dish.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Testing Process</h2>
          <p className="leading-relaxed">
            Every recipe undergoes rigorous testing in the NusantaraEats Kitchen:
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-6">
            <li>Tested multiple times for accuracy and consistency.</li>
            <li>Instructions reviewed for clarity and step-by-step precision.</li>
            <li>Ingredient quantities verified for proper measurements.</li>
            <li>Timing and cooking temperatures validated.</li>
            <li>Final taste test before publication.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Content Standards</h2>
          <p className="leading-relaxed">
            We adhere to the following content standards:
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-6">
            <li>Authenticity: Recipes stay true to traditional preparations.</li>
            <li>Accuracy: Ingredients and instructions are precise and tested.</li>
            <li>Clarity: Step-by-step instructions suitable for all skill levels.</li>
            <li>Inclusivity: Dietary modifications noted where applicable.</li>
            <li>Education: Cultural context and cooking techniques explained.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Corrections</h2>
          <p className="leading-relaxed">
            We are committed to accuracy. If you find an error in any recipe, please contact us at contact@nusantaraeats.com. We will review and correct any inaccuracies promptly.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Contact</h2>
          <p className="leading-relaxed">
            For editorial inquiries or recipe suggestions, please reach out to us at: contact@nusantaraeats.com
          </p>
        </section>
      </div>
    </article>
  );
}
