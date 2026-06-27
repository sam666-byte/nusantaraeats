import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";

export const metadata: Metadata = {
  title: "NusantaraEats — Authentic Indonesian Recipes",
  description:
    "Explore authentic Indonesian recipes from Sabang to Merauke. From Rendang to Papeda — every recipe is a cultural heritage.",
  openGraph: {
    title: "NusantaraEats — Authentic Indonesian Recipes",
    description:
      "Discover authentic Indonesian recipes. From Rendang to Papeda.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#0a0a0a] text-[#f0ece6]">
        <Particles />
        <Navbar />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
