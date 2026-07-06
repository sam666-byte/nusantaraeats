import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";

export const metadata: Metadata = {
  title: "NusantaraEats — 500+ Authentic Indonesian Recipes | Free Cookbook",
  description:
    "Explore 500+ authentic Indonesian recipes from Sabang to Merauke. From Rendang to Papeda — every recipe includes ingredients, step-by-step instructions, cultural history, and nutritional info. Free online cookbook.",
  keywords: [
    "Indonesian recipes", "Indonesian food", "Indonesian cooking",
    "Rendang recipe", "Nasi Goreng", "Sate", "Soto", "Indonesian cuisine",
    "free cookbook", "Asian recipes", "Indonesian food guide",
    "authentic recipes", "traditional Indonesian food"
  ],
  authors: [{ name: "NusantaraEats" }],
  alternates: { canonical: "https://nusantaraeats.com/" },
  openGraph: {
    title: "NusantaraEats — 500+ Authentic Indonesian Recipes",
    description:
      "Discover 500+ authentic Indonesian recipes with step-by-step instructions, cultural history, and nutritional info. Your free online Indonesian cookbook.",
    url: "https://nusantaraeats.com",
    siteName: "NusantaraEats",
    images: [
      {
        url: "https://nusantaraeats.com/images/rendang.jpg",
        width: 1200,
        height: 630,
        alt: "Authentic Indonesian Rendang recipe",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NusantaraEats — 500+ Authentic Indonesian Recipes",
    description: "Discover 500+ authentic Indonesian recipes with step-by-step instructions and cultural history.",
    images: ["https://nusantaraeats.com/images/rendang.jpg"],
    creator: "@nusantaraeats",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "rss-feed": "https://nusantaraeats.com/feed.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#111111] text-[#f0ece6]">
        <style>{`
          @media print {
            header, nav, footer, .print-hidden,
            [class*="Navbar"], [class*="Footer"], [class*="Particles"],
            [class*="sticky"], [class*="fixed"] { display: none !important; }
            body { background: white !important; color: black !important; }
            a { color: black !important; text-decoration: underline !important; }
          }
        `}</style>
        <Particles />
        <Navbar />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
