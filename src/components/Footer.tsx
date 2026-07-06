"use client";

import Link from "next/link";
import { KATEGORI_LIST } from "@/types";
import FooterViewCounter from "./FooterViewCounter";

export default function Footer() {
  return (
    <footer className="border-t border-amber-500/10 bg-black print-hidden">
      {/* Main Footer */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="font-serif text-2xl font-black tracking-widest text-white">
              Nusantara<span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text italic text-transparent">Eats</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Your free online cookbook for authentic Indonesian recipes. 500+ recipes from across the archipelago.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com/nusantaraeats" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-all hover:border-amber-500/30 hover:text-amber-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.208 1.791-4 4-4s4 1.792 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://tiktok.com/@nusantaraeats" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-all hover:border-amber-500/30 hover:text-amber-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.8 1.56v-3.4a4.85 4.85 0 01-1-.34z"/></svg>
              </a>
              <a href="https://pinterest.com/nusantaraeats" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-all hover:border-amber-500/30 hover:text-amber-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.286 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.418 2.557-5.418 5.206 0 1.031.397 2.138.893 2.746a.36.36 0 01.083.345c-.091.378-.293 1.193-.334 1.361-.053.22-.174.265-.402.159-1.499-.698-2.436-2.893-2.436-4.65 0-3.78 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.233 7.464-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.353-1.497 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400">Categories</h3>
            <ul className="space-y-2.5">
              {KATEGORI_LIST.map((k) => (
                <li key={k.id}>
                  <Link href={`/categories/${k.id}`} className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-amber-400">
                    <span>{k.icon}</span> {k.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400">Popular Regions</h3>
            <ul className="space-y-2.5">
              {[
                { name: "West Sumatra", href: "/regions/west-sumatra" },
                { name: "Java", href: "/regions/java" },
                { name: "Bali", href: "/regions/bali" },
                { name: "Sulawesi", href: "/regions/sulawesi" },
                { name: "Sumatra", href: "/regions/sumatra" },
                { name: "Papua & Maluku", href: "/regions/papua-maluku" },
              ].map((r) => (
                <li key={r.name}>
                  <Link href={r.href} className="text-sm text-zinc-500 transition-colors hover:text-amber-400">
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-amber-400">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { name: "All Recipes", href: "/recipes" },
                { name: "About Us", href: "/about" },
                { name: "Search", href: "/search" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Editorial Policy", href: "/editorial-policy" },
              ].map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="text-sm text-zinc-500 transition-colors hover:text-amber-400">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-500/10 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} NusantaraEats. Made with ❤️ for Indonesia. 🇮🇩
          </p>
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <span>◆</span>
            <span className="mx-1">500+ Recipes</span>
            <span>◆</span>
            <span className="mx-1">34 Regions</span>
            <span>◆</span>
            <FooterViewCounter />
          </div>
        </div>
      </div>
    </footer>
  );
}
