# NusantaraEats SEO Automation

## Yang Sudah Dibuat (Auto)

### 1. Auto Sitemap ✅
File: `generate-sitemap-auto.js`
- Auto-generate dari recipes.ts
- 1000+ URLs
- Jalankan: `node generate-sitemap-auto.js`

### 2. Auto RSS Feed ✅
File: `generate-rss.js`
- Auto-generate 50 newest recipes
- Jalankan: `node generate-rss.js`

### 3. Auto Social Posts ✅
File: `generate-social-posts.js`
- Reddit, Pinterest, Instagram, Twitter posts
- Jalankan: `node generate-social-posts.js`

### 4. Auto Internal Linking ✅
- Origin → Region links
- Related Recipes
- Popular Recipes
- Category filters

### 5. Schema Markup ✅
- Recipe schema
- FAQ schema
- Breadcrumb schema
- Organization schema

## Yang Perlu Manual

### Submit ke Directories
1. **TasteAtlas** - https://tasteAtlas.com/claims
2. **Allrecipes** - Create profile
3. **Food.com** - Submit recipes
4. **Epicurious** - Guest posts

### Post di Reddit
File: `seo/social-posts/reddit.md`
- r/indonesianfood
- r/Indonesia
- r/cooking
- r/food

### Pinterest
File: `seo/social-posts/pinterest.md`
- Create account @nusantaraeats
- Post 5-10 pins per day
- Join group boards

### Instagram
File: `seo/social-posts/instagram.md`
- Post recipe photos
- Use hashtags
- Engage with food community

## Quick Commands

```bash
# Update sitemap
node generate-sitemap-auto.js && cp public/sitemap.xml out/sitemap.xml

# Update RSS
node generate-rss.js && cp public/feed.xml out/feed.xml

# Generate social posts
node generate-social-posts.js

# Full SEO rebuild
npm run build && node generate-sitemap-auto.js && node generate-rss.js
```

## Monitoring

### Google Search Console
- Submit sitemap: https://nusantaraeats.com/sitemap.xml
- Monitor indexing
- Check mobile usability

### Analytics
- Track traffic sources
- Monitor backlink growth
- Track keyword rankings
