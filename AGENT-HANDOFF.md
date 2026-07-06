# NusantaraEats - Agent Handoff Document

## Project Overview

**Website:** https://nusantaraeats.com
**Stack:** Next.js 16 + Tailwind CSS, Static Export, Cloudflare Pages
**Repo:** https://github.com/sam666-byte/nusantaraeats
**Total Recipes:** 500 resep (ID 1-500)
**Total Images:** 355 AI-generated JPG (1024x1024) + 129 generating

---

## Current State (Last Updated: 2026-06-30)

### Recipe Categories
| Category | Slug | Count |
|---|---|---|
| Main Dishes | makanan-berat | 107 |
| Soups & Soto | sup-soto | 68 |
| Satay & Grilled | sate-panggang | 55 |
| Snacks | jajanan | 77 |
| Drinks | minuman | 56 |

### What's Been Done This Session
1. ✅ **500 recipes total** (ID 1-500) - scraped 362 from live site + added 138 new authentic Indonesian recipes
2. ✅ **355 AI-generated images** via Cloudflare Workers AI API (129 more generating in background)
3. ✅ **Sitemap updated** to 512 URLs (500 recipes + categories + other pages)
4. ✅ **Deployed to Cloudflare Pages** - 500 recipes live at nusantaraeats.com
5. ✅ **Cloudflare cache purged** — all pages updated
6. ✅ **Bing verification files** uploaded (BingSiteAuth.xml, bingverify.html)
7. ✅ **IndexNow submission** — 100+ URLs submitted to Bing/Yandex/DuckDuckGo
8. ✅ **Google Search Console** — sitemap already registered
9. ✅ **SEO strategy files** created for organic traffic growth

---

## Deployment Setup

### Cloudflare Pages
- **Project name:** `nusantaraeats`
- **Domains:** nusantaraeats.com, www.nusantaraeats.com, nusantaraeats.pages.dev
- **Deploy command:**
  ```bash
  cd /home/liveuser/nusantaraeats
  npm run build
  CLOUDFLARE_API_TOKEN=cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728 npx wrangler pages deploy out --project-name=nusantaraeats --branch=main --commit-dirty=true
  ```

### Cloudflare Cache Purge
```bash
ZONE_ID=$(curl -s -H "Authorization: Bearer cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728" "https://api.cloudflare.com/client/v4/zones?name=nusantaraeats.com" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" -H "Authorization: Bearer cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728" -H "Content-Type: application/json" -d '{"purge_everything":true}'
```

### Deploy (Full Pipeline)
```bash
cd /home/liveuser/nusantaraeats
npm run build && \
CLOUDFLARE_API_TOKEN=cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728 npx wrangler pages deploy out --project-name=nusantaraeats --branch=main --commit-dirty=true && \
ZONE_ID=$(curl -s -H "Authorization: Bearer cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728" "https://api.cloudflare.com/client/v4/zones?name=nusantaraeats.com" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4) && \
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" -H "Authorization: Bearer cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728" -H "Content-Type: application/json" -d '{"purge_everything":true}'
```

---

## Image Generation Setup

### Cloudflare Workers AI API
- **Endpoint:** `https://api.cloudflare.com/client/v4/accounts/243dd09cf194815c3fce5ce09528167c/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`
- **Auth:** Bearer token `cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728`
- **Output:** PNG 1024x1024, convert to JPG quality 85%
- **Free tier:** 100,000 requests/day

### Generate Single Image
```bash
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/243dd09cf194815c3fce5ce09528167c/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0" \
  -H "Authorization: Bearer cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Close-up food photography of rendang, beef in dark spicy coconut sauce, professional food styling, clean background, no people, studio lighting"}' \
  --output /home/liveuser/nusantaraeats/public/images/rendang.png

# Convert PNG to JPG
python3 -c "
from PIL import Image
img = Image.open('/home/liveuser/nusantaraeats/public/images/rendang.png')
img = img.convert('RGB')
img.save('/home/liveuser/nusantaraeats/public/images/rendang.jpg', 'JPEG', quality=85)
" && rm /home/liveuser/nusantaraeats/public/images/rendang.png
```

### Prompt Template
```
Close-up food photography of [DISH NAME], [DESCRIPTION], professional food styling, clean background, no people, studio lighting, appetizing, 4k
```

---

## Project Structure

```
nusantaraeats/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage (client component with modal)
│   │   ├── layout.tsx            # Root layout (print CSS, navbar, footer)
│   │   ├── recipes/
│   │   │   ├── layout.tsx        # Recipes layout
│   │   │   ├── page.tsx          # /recipes listing
│   │   │   └── [slug]/page.tsx   # Recipe detail (SSG, JSON-LD)
│   │   ├── categories/[kategori]/page.tsx
│   │   ├── regions/[region]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── search/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── editorial-policy/page.tsx
│   │   └── resep/[slug]/page.tsx # Redirect to /recipes
│   ├── components/
│   │   ├── RecipeModal.tsx        # Quick View modal (save, share, print, collapsible)
│   │   ├── RecipeCard.tsx         # Card with onClick → modal
│   │   ├── RecipeActions.tsx      # Jump to Recipe + Print buttons
│   │   ├── CategoryRecipeGrid.tsx # Client component with Load More
│   │   ├── RecipesGrid.tsx        # Client component with Load More
│   │   ├── Navbar.tsx             # Sticky navbar (print-hidden)
│   │   ├── Footer.tsx             # Footer with view counter (print-hidden)
│   │   └── Particles.tsx          # Background particles (print-hidden)
│   ├── data/
│   │   └── recipes.ts            # All 500 recipes
│   └── types/
│       └── index.ts              # TypeScript types
├── public/
│   ├── images/                   # 355 recipe images (1024x1024 JPG)
│   ├── sitemap.xml               # 512 URLs
│   ├── robots.txt
│   ├── BingSiteAuth.xml          # Bing verification
│   ├── bingverify.html           # Bing verification HTML
│   ├── nusantaraeats.txt         # IndexNow key
│   └── _routes.json
├── out/                          # Static export (deployed to Cloudflare)
├── SEO-ACTION-PLAN.md            # SEO strategy document
├── social-media-content.md       # Social media content templates
├── medium-articles/              # Medium articles for backlinks
├── DAILY-SEO-CHECKLIST.md        # Daily/weekly/monthly SEO tasks
├── new-recipes-generator.js      # Script to add new recipes
├── generate-images-batch.js      # Script to generate images
├── generate-sitemap.js           # Script to generate sitemap
└── package.json
```

---

## Key Features

### Recipe Modal (Quick View)
- **Save Recipe** — localStorage-based, persists across sessions
- **Copy Link** — copies recipe URL to clipboard
- **Share** — WhatsApp, Twitter/X, Facebook, Pinterest, TikTok
- **Print** — opens clean print window with:
  - NusantaraEats logo + tagline
  - Recipe image (1024x1024)
  - Metadata grid (prep/cook/total time, servings, difficulty, origin, category, rating)
  - Ingredients + Instructions
  - QR code linking to full recipe
  - Footer branding
- **Collapsible Sections** — History & Origin, Cooking Mastery (default closed)
- **Anchor Navigation** — sticky bar with Ingredients, Instructions, Tips links

### Print CSS (layout.tsx)
```css
@media print {
  header, nav, footer, .print-hidden,
  [class*="Navbar"], [class*="Footer"], [class*="Particles"],
  [class*="sticky"], [class*="fixed"] { display: none !important; }
  body { background: white !important; color: black !important; }
  a { color: black !important; text-decoration: underline !important; }
}
```

### Recipe Schema (JSON-LD)
All 500 recipe pages have:
- `@type: Recipe`
- `image` (array format)
- `aggregateRating` (ratingValue, bestRating, ratingCount)
- `nutrition` (calories, protein, fat, carbs)
- `keywords`
- `recipeIngredient`, `recipeInstructions`
- `prepTime`, `cookTime`, `totalTime`
- `publisher.logo`

---

## Recipe Data Structure

```typescript
interface Recipe {
  id: number;
  slug: string;
  title: string;          // "Dish Name Recipe: Subtitle"
  shortTitle: string;
  description: string;
  image: string;          // /images/{slug}.jpg
  kategori: "makanan-berat" | "sup-soto" | "sate-panggang" | "jajanan" | "minuman";
  waktu: number;          // total cooking time in minutes
  porsi: string;          // servings
  kesulitan: "Easy" | "Medium" | "Hard";
  rating: number;
  origin: string;         // region/city
  ingredients: string[];
  instructions: string[];
  tips?: string;
  detailedHistory?: string;
  culturalSignificance?: string;
  regionalVariations?: string;
  cookingTechnique?: string;
  nutritionalProfile?: string;
  // ... 50+ content fields
}
```

---

## Common Tasks

### Add New Recipe
1. Add recipe object to `src/data/recipes.ts` (before closing `];`)
2. Generate image via Cloudflare AI API
3. Save to `public/images/{slug}.jpg`
4. Run `node generate-sitemap.js` to update sitemap
5. Build and deploy

### Generate Missing Images
```bash
cd /home/liveuser/nusantaraeats
python3 -c "
import re, os
with open('src/data/recipes.ts') as f: content = f.read()
slugs = re.findall(r'slug:\s*\"([^\"]+)\"', content)
missing = [s for s in slugs if not os.path.exists(f'public/images/{s}.jpg')]
print(f'Missing: {len(missing)}')
for s in missing: print(s)
"
```

### Check Duplicate Slugs
```bash
grep -oP 'slug:\s*"[^"]*"' src/data/recipes.ts | sort | uniq -d
```

### Verify All Images Exist
```bash
python3 -c "
import re, os
with open('src/data/recipes.ts') as f: content = f.read()
slugs = re.findall(r'slug:\s*\"([^\"]+)\"', content)
missing = [s for s in slugs if not os.path.exists(f'public/images/{s}.jpg')]
print(f'Total: {len(slugs)}, Missing: {len(missing)}')
"
```

### Update Sitemap
```bash
cd /home/liveuser/nusantaraeats
node generate-sitemap.js
```

---

## SEO & Search Engine Setup

### Google Search Console
- **Status:** Sitemap registered
- **URL:** https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Anusantaraeats.com
- **Sitemap:** https://nusantaraeats.com/sitemap.xml (512 URLs)
- **OAuth Credentials:** `/home/liveuser/qwencloud-generator/client_secret.json`
- **Tokens:** `/home/liveuser/.google_search_console_tokens.json`

### Bing Webmaster Tools
- **Status:** Verification files uploaded
- **Verification File:** https://nusantaraeats.com/BingSiteAuth.xml
- **Verification Code:** `1D886112FE9B7E0F2B242BE003B6C777`
- **FTP Server:** ftp://192.168.1.2:2121 (BingSiteAuth.xml uploaded)

### IndexNow (Bing, Yandex, DuckDuckGo)
- **Status:** 100+ URLs submitted
- **Key File:** https://nusantaraeats.com/nusantaraeats.txt
- **Key:** `nusantaraeats`

---

## SEO Strategy Files

### Created Documents
1. **SEO-ACTION-PLAN.md** — Complete 5-phase SEO strategy
2. **social-media-content.md** — Ready-to-use captions for Instagram, Pinterest, Facebook, TikTok
3. **medium-articles/article-1-rendang.md** — Medium article for backlinks
4. **DAILY-SEO-CHECKLIST.md** — Daily/weekly/monthly SEO tasks

### Social Media Strategy
| Platform | Username | Status |
|----------|----------|--------|
| Instagram | @nusantaraeats | 🔲 Need to create |
| Pinterest | NusantaraEats | 🔲 Need to create |
| Facebook | NusantaraEats | 🔲 Need to create |
| TikTok | @nusantaraeats | 🔲 Need to create |

### Backlink Strategy
- **Medium.com** — Write articles about Indonesian cuisine
- **Quora.com** — Answer food-related questions
- **Reddit.com** — Post in r/food, r/cooking
- **Food Blogs** — Guest posting opportunities

---

## Environment Variables

| Variable | Value | Notes |
|---|---|---|
| CLOUDFLARE_API_TOKEN | cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728 | Deploy + AI API |
| Cloudflare Account ID | 243dd09cf194815c3fce5ce09528167c | AI API |
| FTP Server | 192.168.1.2:2121 | Bing verification file upload |

---

## SEO Implementation (2026-07-01)

### Technical SEO
- ✅ **robots.txt** optimized with GPTBot, ChatGPT-User, Baiduspider, Yandex directives
- ✅ **Meta tags** enhanced: keywords, Twitter cards, OG tags, canonical URLs
- ✅ **FAQ schema** added to homepage (6 questions)
- ✅ **Breadcrumb schema** added to homepage and recipe pages
- ✅ **Recipe schema** (JSON-LD) on all 500 recipe pages
- ✅ **Review schema** on all recipe pages
- ✅ **Open Graph** and **Twitter cards** on all pages
- ✅ **Canonical URLs** on all pages
- ✅ **Internal linking**: related recipes, same origin, ingredient-based links
- ✅ **Sitemap** updated to 512 URLs

### On-Page SEO
- ✅ **Title tags**: 500+ unique, SEO-optimized
- ✅ **Meta descriptions**: Unique for every recipe
- ✅ **H1, H2, H3** structure on all pages
- ✅ **Image alt text**: SEO-friendly alt attributes
- ✅ **URL slugs**: SEO-friendly (e.g., /recipes/rendang)

### Content SEO
- ✅ **500 unique recipes** with authentic Indonesian content
- ✅ **All content in English** (translated from Indonesian)
- ✅ **Cultural history** sections on recipe pages
- ✅ **Nutritional information** on recipe pages
- ✅ **FAQ sections** on every recipe page

### Off-Page SEO
- ✅ **Google Search Console**: Sitemap registered
- ✅ **Bing Webmaster Tools**: Verification files uploaded
- ✅ **IndexNow**: 100+ URLs submitted

### Monitoring Needed
- ⏳ **Google Analytics**: Setup required
- ⏳ **Search Console**: Monitor indexing status
- ⏳ **Core Web Vitals**: Check performance
- ⏳ **Backlink monitoring**: Track incoming links

---

## Google Search Console

- Email received: 17 Recipe structured data issues
- Critical: `image` field missing → Fixed (array format)
- Non-critical: `nutrition`, `keywords`, `aggregateRating`, `recipeIngredient` → All added
- Wait 1-7 days for Google to re-crawl and validate

---

## Contact

- **Website:** https://nusantaraeats.com
- **Owner GitHub:** sam666-byte
- **FTP Server:** 192.168.1.2:2121

---

*Last updated: 2026-07-01*
