# NusantaraEats

English-language Indonesian recipe site — nusantaraeats.com

## Stack
- Static HTML/CSS/JS (no framework)
- Supabase (recipe data API)
- Deployed on Cloudflare Pages

## Structure
- `index.html` — homepage (static pre-rendered recipe cards with real `<a>` links)
- `recipes/<slug>/index.html` — 100+ static recipe pages (full Recipe/FAQ/Breadcrumb schema)
- `recipes/index.html` — recipe archive (links all recipes)
- `blog/` — articles
- `sitemap.xml` — all URLs
- `404.html` — custom 404 page

## SEO notes
- Homepage cards are static `<a href="/recipes/<slug>/">` (not JS modal-only)
- JSON-LD inline in HTML (not JS-injected)
- `lang="en"`, full English content
- Meta descriptions ≤155 chars, cut at word boundary
- twitter:card on all pages

## Security notes
- `unsplash-config.json` — DO NOT COMMIT secrets (revoke leaked key!)
- `smrj/` — admin panel; protect before public deploy
- Supabase anon key is public by design; verify RLS denies anonymous writes

## Local dev
Just open `index.html` or serve with any static server:
```bash
python3 -m http.server 8000
```
