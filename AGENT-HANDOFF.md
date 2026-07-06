# NusantaraEats - Agent Handoff Document

## Project Overview

**Website:** https://nusantaraeats.com
**Stack:** Next.js 16 + Tailwind CSS, Static Export, Cloudflare Pages
**Repo:** https://github.com/sam666-byte/nusantaraeats
**Total Recipes:** 500 resep (ID 1-500)
**Total Images:** 355 AI-generated JPG (1024x1024) + 129 generating

---

## Current State (Last Updated: 2026-07-01)

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

## Cloudflare Workers AI — Free Tier Models

### Setup
- **KV Namespace:** `nusantaraeats-views` (ID: `7736b7450fc74eba80ab78f51068b3c6`)
- **KV Binding:** `VIEWS_KV` (production + preview)
- **AI Binding:** Add `[[ai]]` + `binding = "AI"` to wrangler.toml to enable
- **Account ID:** `243dd09cf194815c3fce5ce09528167c`
- **API Token:** `cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728`

### Free Tier: 10,000 Neurons/day

#### LLM Text Models (Available for Free)
| Model | Input Cost (neurons/M tokens) | Est. Free Tokens/Day |
|-------|-------------------------------|---------------------|
| `@cf/meta/llama-3.2-1b-instruct` | 2,457 | ~4M |
| `@cf/meta/llama-3.2-3b-instruct` | 4,625 | ~2M |
| `@cf/meta/llama-3.1-8b-instruct-fp8-fast` | 4,119 | ~2.4M |
| `@cf/meta/llama-3.2-11b-vision-instruct` | 4,410 | ~2.2M (supports images!) |
| `@cf/meta/llama-4-scout-17b-16e-instruct` | 24,545 | ~400K |
| `@cf/mistral/mistral-7b-instruct-v0.1` | 10,000 | ~1M |
| `@cf/qwen/qwen3-30b-a3b-fp8` | 4,625 | ~2M |
| `@cf/google/gemma-3-12b-it` | 31,371 | ~320K |
| `@cf/ibm-granite/granite-4.0-h-micro` | 1,542 | **~6.5M** (cheapest!) |

#### Image Generation
| Model | Cost | Est. Free Images/Day |
|-------|------|---------------------|
| `@cf/black-forest-labs/flux-1-schnell` | 4.8 neurons per 512x512 tile | ~2,000 |

#### Audio
| Model | Cost | Est. Free Audio/Day |
|-------|------|---------------------|
| `@cf/openai/whisper` | 41.14 neurons/min | ~240 minutes |

#### Embeddings
| Model | Cost |
|-------|------|
| `@cf/baai/bge-small-en-v1.5` | 1,841 neurons/M tokens |
| `@cf/baai/bge-m3` | 1,075 neurons/M tokens |

### Example: AI Chat in Cloudflare Functions
```javascript
// functions/api/chat.js
export async function onRequest(context) {
  const { messages } = await context.request.json();
  const result = await context.env.AI.run("@cf/meta/llama-3.2-1b-instruct", {
    messages,
  });
  return new Response(JSON.stringify(result));
}
```

### wrangler.toml AI Config
```toml
[[ai]]
binding = "AI"
```

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

## SEO Implementation (2026-07-01) — POST-DEPLOY FIXES

### All Fixes Deployed
1. ✅ **Broken region links fixed** — Homepage regions now match valid routes (west-sumatra, java, bali, sulawesi, sumatra, kalimantan, papua-maluku, jakarta)
2. ✅ **Footer region links fixed** — Papua → papua-maluku, Aceh → sumatra (no more 404)
3. ✅ **Recipe detail `/regions/indonesia` link removed** — Changed to `/recipes`
4. ✅ **Schema JSON-LD cookTime removed** — Only `totalTime` used (no fake prepTime/cookTime split)
5. ✅ **Ingredient subtitles filtered from schema** — "Ground spice paste:" no longer in `recipeIngredient`
6. ✅ **FAQ "Indonesia, Indonesia" duplication fixed** — Now "originates from Indonesia."
7. ✅ **FAQ "quick preparation" hallucination fixed** — Checks instructions for slow-cooking keywords
8. ✅ **FAQ ingredient subtitle cleanup** — Filtered from FAQ generation
9. ✅ **Rendang totalTime corrected** — `waktu` updated from 30 to 240 minutes (PT4H)
10. ✅ **Sitemap updated** — 8 regional URLs added (520 total)
11. ✅ **View counter implemented** — Cloudflare KV + API + ViewCounter component

### View Counter Setup
- **API:** `functions/api/views/[[slug]].js`
- **Component:** `src/components/ViewCounter.tsx`
- **KV Namespace:** `nusantaraeats-views` (ID: `7736b7450fc74eba80ab78f51068b3c6`)
- **Binding:** `VIEWS_KV` on Cloudflare Pages project

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
- ✅ **Sitemap** updated to 520 URLs (500 recipes + 5 categories + 8 regions + 7 other pages)

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

*Last updated: 2026-07-01 (v2 — post-deploy SEO fixes + view counter + Cloudflare Workers AI docs)*
