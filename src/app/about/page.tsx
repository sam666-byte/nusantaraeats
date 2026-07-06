import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — NusantaraEats",
  description: "Learn about NusantaraEats — our mission to preserve and share authentic Indonesian culinary traditions with the world.",
  alternates: { canonical: "https://nusantaraeats.com/about" },
};

export default function AboutPage() {
  return (
    <article className="relative z-10 mx-auto max-w-4xl px-4 py-28 sm:px-6">
      <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-zinc-300">About Us</span>
      </nav>

      <div className="mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">— Our Heritage —</p>
        <h1 className="mt-4 font-serif text-4xl font-black text-white sm:text-5xl">
          The Story Behind
          <br />
          <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
            Every Recipe
          </span>
        </h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-zinc-300">
        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Our Mission</h2>
          <p className="leading-relaxed">
            NusantaraEats was born from a deep love for Indonesian cuisine. We believe every recipe is a
            <span className="text-amber-400 font-semibold"> cultural heritage</span> — passed down from
            generation to generation, from grandmother&apos;s kitchen to modern city tables.
          </p>
          <p className="mt-4 leading-relaxed">
            Our mission is to preserve and share authentic Indonesian culinary traditions with the world.
            From the rich rendang of West Sumatra to the delicate papeda of Papua, every recipe tells
            a story of Indonesia&apos;s incredible diversity.
          </p>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">What Makes Us Different</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { icon: "📸", title: "4K Photography", desc: "Every dish is captured in stunning detail, preserving the visual beauty of Indonesian cuisine." },
              { icon: "📖", title: "Deep Research", desc: "Each recipe is researched thoroughly — history, cultural significance, regional variations, and nutritional information." },
              { icon: "👨‍🍳", title: "Tested Recipes", desc: "Every recipe is tested multiple times to ensure accuracy and accessibility for home cooks worldwide." },
              { icon: "🌍", title: "Global Reach", desc: "Our content is in English, making authentic Indonesian cuisine accessible to food lovers around the world." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg bg-zinc-800/50 p-5">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-2 font-serif text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Our Coverage</h2>
          <p className="leading-relaxed">
            We cover recipes from across the Indonesian archipelago — from Aceh in the west to Papua in the east.
            Our collection includes:
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-amber-400">🍛</span> Main dishes from every region
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400">🍜</span> Soups and soto with authentic flavors
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400">🍢</span> Satay and grilled specialties
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400">🍡</span> Traditional snacks and desserts
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-400">🍹</span> Refreshing tropical drinks
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-amber-500/10 bg-zinc-900 p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-white">Connect With Us</h2>
          <p className="leading-relaxed">
            Have a recipe suggestion? Want to share your own family recipe? We&apos;d love to hear from you.
            Our goal is to create the most comprehensive and authentic Indonesian recipe collection on the internet.
          </p>
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:from-amber-400 hover:to-amber-600"
            >
              Explore Our Recipes
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
