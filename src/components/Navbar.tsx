"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-amber-500/10 bg-black/90 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg text-amber-400 transition-all duration-300 group-hover:scale-125">◆</span>
          <span className="font-serif text-2xl font-black tracking-widest text-white">
            Nusantara<span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 bg-clip-text italic text-transparent">Eats</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/#resep", label: "Recipes" },
            { href: "/#about", label: "About Us" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-sm font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-amber-400"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 hover:w-full group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
