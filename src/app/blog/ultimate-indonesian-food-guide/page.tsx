import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Ultimate Guide to Indonesian Food: 50+ Dishes You Must Try | NusantaraEats",
  description: "From Rendang to Papeda, discover the diverse flavors of Indonesia's 17,000 islands. A comprehensive guide to the country's most iconic dishes, regional cuisines, and cooking traditions.",
  alternates: { canonical: "https://nusantaraeats.com/blog/ultimate-indonesian-food-guide" },
  openGraph: {
    title: "The Ultimate Guide to Indonesian Food: 50+ Dishes You Must Try",
    description: "From Rendang to Papeda, discover the diverse flavors of Indonesia's 17,000 islands.",
    url: "https://nusantaraeats.com/blog/ultimate-indonesian-food-guide",
    type: "article",
  },
};

export default function UltimateIndonesianFoodGuide() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the most popular Indonesian food?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rendang is widely considered the most famous Indonesian food, having been voted the world's most delicious food by CNN Travel readers. Other extremely popular dishes include Nasi Goreng (fried rice), Sate (satay), Soto (soup), and Gudeg (jackfruit stew)."
        }
      },
      {
        "@type": "Question",
        name: "What are the main types of Indonesian cuisine?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Indonesian cuisine is typically categorized into: Main Dishes (makanan berat) like Rendang and Nasi Padang, Soups & Soto (sup soto) like Soto Ayam and Coto Makassar, Satay & Grilled (sate panggang) like Sate Madura and Ayam Bakar, Snacks (jajanan) like Bakso and Martabak, and Drinks (minuman) like Es Cendol and Wedang Ronde."
        }
      },
      {
        "@type": "Question",
        name: "What spices are commonly used in Indonesian cooking?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Essential Indonesian spices include lemongrass (serai), galangal (lengkuas), turmeric (kunyit), ginger (jahe), kaffir lime leaves (daun jeruk), candlenuts (kemiri), shrimp paste (terasi/belacan), and various chilies. These form the base of most Indonesian spice pastes (bumbu)."
        }
      },
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="relative z-10 mx-auto max-w-4xl px-4 py-28 sm:px-6">
        <nav className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-zinc-300">Ultimate Indonesian Food Guide</span>
        </nav>

        <header className="mb-12">
          <span className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Food Guide
          </span>
          <h1 className="mt-4 font-serif text-4xl font-black text-white sm:text-5xl">
            The Ultimate Guide to Indonesian Food: 50+ Dishes You Must Try
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
            <span>July 6, 2026</span>
            <span>·</span>
            <span>12 min read</span>
          </div>
        </header>

        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80"
          alt="Indonesian food spread with various traditional dishes"
          className="w-full rounded-xl object-cover"
          width="1200"
          height="630"
        />

        <div className="prose prose-invert mt-8 max-w-none space-y-6 text-zinc-300">
          <p className="text-lg leading-relaxed">
            Indonesia is a culinary paradise with over 17,000 islands, each contributing unique flavors and cooking traditions to the nation&apos;s incredible food landscape. From the rich, spicy rendang of West Sumatra to the fresh seafood of Eastern Indonesia, every region tells a story through its cuisine.
          </p>

          <h2 className="font-serif text-2xl font-bold text-white mt-8">Main Dishes (Makanan Berat)</h2>
          <p>
            The heart of Indonesian cuisine lies in its main dishes, where bold flavors meet slow-cooking techniques passed down through generations.
          </p>

          <h3 className="font-serif text-xl font-bold text-white mt-6">Rendang</h3>
          <p>
            Originally from the Minangkabau people of West Sumatra, Rendang is a rich, spicy beef dish slow-cooked in coconut milk for hours until the sauce reduces to a dark, caramelized coating. In 2017, it was voted the world&apos;s most delicious food by CNN Travel readers.
          </p>
          <Link href="/recipes/rendang" className="text-amber-400 hover:text-amber-300">
            → Try our authentic Rendang recipe
          </Link>

          <h3 className="font-serif text-xl font-bold text-white mt-6">Nasi Padang</h3>
          <p>
            Nasi Padang is not just a dish but a dining experience from West Sumatra. Steamed rice is served with an array of Minangkabau dishes including rendang, gulai (curry), and various sambals. The unique serving style features dishes stacked on trays at your table.
          </p>

          <h3 className="font-serif text-xl font-bold text-white mt-6">Gudeg</h3>
          <p>
            Yogyakarta&apos;s signature dish, Gudeg is young jackfruit stewed for hours in coconut milk and palm sugar, creating a sweet, tender dish with a distinctive reddish-brown color. The city is even nicknamed &quot;Kota Gudeg&quot; (Gudeg City).
          </p>

          <h2 className="font-serif text-2xl font-bold text-white mt-8">Soups & Soto</h2>
          <p>
            Indonesian soups are aromatic, complex, and deeply satisfying. Each region has its own signature soup, often featuring a unique blend of spices.
          </p>

          <h3 className="font-serif text-xl font-bold text-white mt-6">Soto Ayam</h3>
          <p>
            Indonesia&apos;s most popular chicken soup features a yellow, turmeric-infused broth with shredded chicken, vermicelli noodles, and fresh garnishes. Every region has its own variation, from Soto Betawi in Jakarta to Soto Lamongan in East Java.
          </p>

          <h3 className="font-serif text-xl font-bold text-white mt-6">Coto Makassar</h3>
          <p>
            A rich, aromatic beef soup from South Sulawesi featuring various beef offal in a broth flavored with roasted peanuts and spices. It&apos;s a beloved breakfast dish in Makassar.
          </p>

          <h2 className="font-serif text-2xl font-bold text-white mt-8">Satay & Grilled</h2>
          <p>
            Indonesia&apos;s grilling tradition produces some of Southeast Asia&apos;s most flavorful dishes, from charcoal-grilled satay to whole roasted animals.
          </p>

          <h3 className="font-serif text-xl font-bold text-white mt-6">Sate Madura</h3>
          <p>
            Perhaps Indonesia&apos;s most famous satay, Sate Madura features tender chicken skewers grilled over charcoal and served with a rich, sweet peanut sauce. The island of Madura is renowned for producing the country&apos;s best satay vendors.
          </p>

          <h2 className="font-serif text-2xl font-bold text-white mt-8">Regional Cuisines</h2>
          <p>
            Indonesia&apos;s diversity is reflected in its regional cuisines, each with distinct characteristics:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Java:</strong> Known for sweeter flavors, rice-based dishes, and complex spice blends</li>
            <li><strong>Sumatra:</strong> Famous for spicy, coconut milk-rich dishes like Rendang and Gulai</li>
            <li><strong>Bali:</strong> Distinctive pork dishes and unique spice pastes (bumbu genep)</li>
            <li><strong>Sulawesi:</strong> Known for seafood and unique soups like Coto Makassar</li>
            <li><strong>Eastern Indonesia:</strong> Sago-based foods and grilled fish with dabu-dabu salsa</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-white mt-8">Essential Ingredients</h2>
          <p>
            Understanding Indonesian ingredients is key to authentic cooking:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Kecap Manis:</strong> Sweet soy sauce, fundamental to many dishes</li>
            <li><strong>Tempeh:</strong> Fermented soybean cake, a protein staple</li>
            <li><strong>Terasi:</strong> Fermented shrimp paste, adds umami depth</li>
            <li><strong>Santan:</strong> Coconut milk, the base of many curries</li>
            <li><strong>Rempah:</strong> Spice blends that form the foundation of Indonesian cooking</li>
          </ul>

          <h2 className="font-serif text-2xl font-bold text-white mt-8">Start Your Indonesian Food Journey</h2>
          <p>
            The best way to experience Indonesian cuisine is to start cooking! Our collection of 550+ authentic recipes includes detailed instructions, ingredient lists, and cultural context for every dish.
          </p>

          <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-900/20 p-6">
            <h3 className="font-serif text-xl font-bold text-white">Ready to Cook?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Explore our complete collection of authentic Indonesian recipes with step-by-step instructions.
            </p>
            <Link
              href="/recipes"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-2 text-sm font-bold text-black transition-all hover:bg-amber-500"
            >
              Browse All Recipes →
            </Link>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="text-sm font-semibold text-white">Frequently Asked Questions</h3>
          <div className="mt-4 space-y-4">
            <div className="border-b border-zinc-800 pb-4">
              <h4 className="text-sm font-semibold text-white">What is the most popular Indonesian food?</h4>
              <p className="mt-1 text-sm text-zinc-400">Rendang is widely considered the most famous Indonesian food, voted #1 by CNN Travel. Other popular dishes include Nasi Goreng, Sate, Soto, and Gudeg.</p>
            </div>
            <div className="border-b border-zinc-800 pb-4">
              <h4 className="text-sm font-semibold text-white">Is Indonesian food spicy?</h4>
              <p className="mt-1 text-sm text-zinc-400">Many Indonesian dishes are spicy, but the heat level varies. You can always adjust the amount of chili to suit your preference.</p>
            </div>
            <div className="pb-4">
              <h4 className="text-sm font-semibold text-white">Can I make Indonesian food at home?</h4>
              <p className="mt-1 text-sm text-zinc-400">Absolutely! Most Indonesian recipes use accessible ingredients. Our recipes include step-by-step instructions for home cooks of all skill levels.</p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
