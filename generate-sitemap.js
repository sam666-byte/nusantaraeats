const fs = require('fs');

// Read the extra recipes file and extract slugs
const recipesContent = fs.readFileSync('./src/data/recipes-extra.ts', 'utf8');
const extraSlugs = [];
const slugRegex = /slug:\s*"([^"]+)"/g;
let match;
while ((match = slugRegex.exec(recipesContent)) !== null) {
  extraSlugs.push(match[1]);
}

console.log(`Extra recipe slugs: ${extraSlugs.length}`);

// Generate sitemap
const today = '2026-07-06';

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
  <url><loc>https://nusantaraeats.com/blog</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/blog/ultimate-indonesian-food-guide</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://nusantaraeats.com/recipes</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://nusantaraeats.com/search</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://nusantaraeats.com/guides/indonesian-food-guide</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://nusantaraeats.com/privacy-policy</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>https://nusantaraeats.com/terms</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>https://nusantaraeats.com/editorial-policy</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.3</priority></url>

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

  <!-- Extra Recipes -->
`;

extraSlugs.forEach(slug => {
  sitemap += `  <url>
    <loc>https://nusantaraeats.com/recipes/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
});

sitemap += `
</urlset>`;

fs.writeFileSync('./public/sitemap.xml', sitemap);
console.log(`Sitemap updated with ${extraSlugs.length} extra recipes`);
