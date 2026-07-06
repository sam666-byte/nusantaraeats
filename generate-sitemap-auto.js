// Auto-generate sitemap from recipes.ts
const fs = require('fs');
const path = require('path');

// Read recipes.ts and extract slugs
const recipesContent = fs.readFileSync('src/data/recipes.ts', 'utf8');
const slugRegex = /slug:\s*"([^"]+)"/g;
const slugs = [];
let match;
while ((match = slugRegex.exec(recipesContent)) !== null) {
  slugs.push(match[1]);
}

const today = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Homepage -->
  <url>
    <loc>https://nusantaraeats.com</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Static Pages -->
  <url><loc>https://nusantaraeats.com/about</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://nusantaraeats.com/recipes</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://nusantaraeats.com/search</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://nusantaraeats.com/guides/indonesian-food-guide</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>

  <!-- Categories -->
  <url><loc>https://nusantaraeats.com/categories/makanan-berat</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/categories/sup-soto</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/categories/sate-panggang</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/categories/jajanan</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/categories/minuman</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>

  <!-- Regions -->
  <url><loc>https://nusantaraeats.com/regions/west-sumatra</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/regions/java</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/regions/bali</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/regions/sulawesi</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/regions/sumatra</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/regions/kalimantan</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/regions/papua-maluku</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/regions/jakarta</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>

  <!-- Recipes (auto-generated) -->
`;

slugs.forEach(slug => {
  sitemap += `  <url>
    <loc>https://nusantaraeats.com/recipes/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
});

sitemap += `</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log(`Sitemap generated with ${slugs.length} recipe URLs (removed /resep/ duplicates)`);
