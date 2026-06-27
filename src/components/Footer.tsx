export default function Footer() {
  return (
    <footer className="border-t border-amber-500/10 bg-black py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <span className="font-serif text-2xl font-black tracking-widest text-white">
              Nusantara<span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text italic text-transparent">Eats</span>
            </span>
            <p className="mt-2 text-sm font-light tracking-wider text-zinc-500">
              Authentic Indonesian Recipes
            </p>
          </div>
          <div className="flex gap-8">
            {[
              { label: "Home", href: "/" },
              { label: "Recipes", href: "/#resep" },
              { label: "About", href: "/#about" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-amber-400"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-amber-500/10 pt-6 text-center">
          <p className="text-xs tracking-wider text-zinc-600">
            &copy; {new Date().getFullYear()} NusantaraEats. Made with love for Indonesia. 🇮🇩
          </p>
        </div>
      </div>
    </footer>
  );
}
