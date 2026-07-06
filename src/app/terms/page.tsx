import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — NusantaraEats",
  description: "Terms of Service for NusantaraEats. Read our terms and conditions for using this website.",
  alternates: { canonical: "https://nusantaraeats.com/terms" },
  openGraph: {
    title: "Terms of Service — NusantaraEats",
    description: "Terms of Service for NusantaraEats. Read our terms and conditions for using this website.",
    url: "https://nusantaraeats.com/terms",
    siteName: "NusantaraEats",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service — NusantaraEats",
    description: "Terms of Service for NusantaraEats. Read our terms and conditions for using this website.",
  },
};

export default function TermsPage() {
  return (
    <article className="relative z-10 mx-auto max-w-4xl px-4 py-28 sm:px-6">
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-zinc-300">Terms of Service</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-serif text-4xl font-black text-white sm:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-zinc-500">Last updated: June 29, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-zinc-300">
        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing and using NusantaraEats (nusantaraeats.com), you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our website.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Use of Content</h2>
          <p className="leading-relaxed">
            All recipes, images, and content on NusantaraEats are created for informational and educational purposes. You may:
          </p>
          <ul className="mt-4 space-y-2 list-disc pl-6">
            <li>View and cook recipes for personal use.</li>
            <li>Share links to our recipes with proper attribution.</li>
            <li>Print recipes for personal reference.</li>
          </ul>
          <p className="mt-4 leading-relaxed">
            You may not reproduce, distribute, or create derivative works from our content without written permission.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Recipe Accuracy</h2>
          <p className="leading-relaxed">
            While we strive for accuracy, recipes and nutritional information are provided as-is. Cooking results may vary based on ingredients, equipment, and technique. We recommend consulting a healthcare professional for dietary advice.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">User Conduct</h2>
          <p className="leading-relaxed">
            You agree not to use the website for any unlawful purpose, attempt to gain unauthorized access, or interfere with the website&apos;s operation.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Limitation of Liability</h2>
          <p className="leading-relaxed">
            NusantaraEats shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or recipes.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Changes to Terms</h2>
          <p className="leading-relaxed">
            We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Contact Us</h2>
          <p className="leading-relaxed">
            For questions about these Terms, please contact us at: contact@nusantaraeats.com
          </p>
        </section>
      </div>
    </article>
  );
}
