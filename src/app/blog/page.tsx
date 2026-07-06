import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Indonesian Food Guide & Recipes | NusantaraEats",
  description: "Discover the rich world of Indonesian cuisine through our blog. Learn about food history, cooking techniques, regional specialties, and cultural traditions behind authentic Indonesian recipes.",
  alternates: { canonical: "https://nusantaraeats.com/blog" },
};

const blogPosts = [
  {
    slug: "ultimate-indonesian-food-guide",
    title: "The Ultimate Guide to Indonesian Food: 50+ Dishes You Must Try",
    excerpt: "From Rendang to Papeda, discover the diverse flavors of Indonesia's 17,000 islands. A comprehensive guide to the country's most iconic dishes.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    date: "2026-07-06",
    readTime: "12 min read",
    category: "Food Guide",
  },
  {
    slug: "history-of-rendang",
    title: "The History of Rendang: From Ceremonial Dish to World's Best Food",
    excerpt: "How a Minangkabau ceremonial dish became CNN's #1 most delicious food in the world. The fascinating journey of rendang through centuries.",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80",
    date: "2026-07-05",
    readTime: "8 min read",
    category: "Food History",
  },
  {
    slug: "indonesian-spice-guide",
    title: "Indonesian Spice Guide: The Essential Ingredients for Authentic Flavors",
    excerpt: "Master the aromatic world of Indonesian spices. Learn about galangal, lemongrass, kaffir lime, turmeric, and more essential ingredients.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    date: "2026-07-04",
    readTime: "10 min read",
    category: "Cooking Tips",
  },
  {
    slug: "indonesian-street-food-guide",
    title: "Indonesian Street Food Guide: 30 Must-Try Street Eats",
    excerpt: "Experience the vibrant street food culture of Indonesia. From Bakso carts to Martabak vendors, discover the best street eats across the archipelago.",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    date: "2026-07-03",
    readTime: "15 min read",
    category: "Food Guide",
  },
  {
    slug: "indonesian-cooking-techniques",
    title: "Traditional Indonesian Cooking Techniques You Should Know",
    excerpt: "Learn the ancient cooking methods that make Indonesian food unique. From slow-cooking rendang to grilling over coconut husks.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    date: "2026-07-02",
    readTime: "11 min read",
    category: "Cooking Tips",
  },
  {
    slug: "indonesian-vegetarian-dishes",
    title: "15 Authentic Indonesian Vegetarian Dishes You'll Love",
    excerpt: "Indonesia has a rich tradition of plant-based cooking. Discover delicious vegetarian dishes from gado-gado to tempeh goreng.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    date: "2026-07-01",
    readTime: "9 min read",
    category: "Recipes",
  },
];

export default function BlogPage() {
  return (
    <article className="relative z-10 mx-auto max-w-5xl px-4 py-28 sm:px-6">
      <div className="mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-400">
          — Our Blog —
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-white sm:text-5xl">
          Indonesian Food <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Blog</span>
        </h1>
        <p className="mt-4 text-sm text-zinc-400">
          Stories, guides, and tips from the world of Indonesian cuisine
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-xl border border-amber-500/10 bg-zinc-900 transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                width="600"
                height="400"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-amber-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {post.category}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-2 font-serif text-lg font-bold text-white group-hover:text-amber-400 line-clamp-2">
                {post.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                {post.excerpt}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300">
                Read More →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
