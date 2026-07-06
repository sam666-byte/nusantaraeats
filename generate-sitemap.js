const fs = require('fs');
const path = require('path');

// Read recipes from TypeScript file
const recipesPath = path.join(__dirname, 'src/data/recipes.ts');
const content = fs.readFileSync(recipesPath, 'utf8');

// Extract slugs
const slugRegex = /slug:\s*"([^"]+)"/g;
const slugs = [];
let match;
while ((match = slugRegex.exec(content)) !== null) {
  slugs.push(match[1]);
}

console.log(`Found ${slugs.length} recipe slugs`);

// Generate sitemap
const today = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nusantaraeats.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nusantaraeats.com/recipes</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

// Add recipe pages
for (const slug of slugs) {
  sitemap += `  <url>
    <loc>https://nusantaraeats.com/recipes/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Add category pages
const categories = ['makanan-berat', 'sup-soto', 'sate-panggang', 'jajanan', 'minuman'];
for (const cat of categories) {
  sitemap += `  <url>
    <loc>https://nusantaraeats.com/categories/${cat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

// Add other pages
const otherPages = [
  { path: '/about', priority: '0.6' },
  { path: '/search', priority: '0.5' },
  { path: '/privacy-policy', priority: '0.3' },
  { path: '/terms', priority: '0.3' },
  { path: '/editorial-policy', priority: '0.3' }
];

for (const page of otherPages) {
  sitemap += `  <url>
    <loc>https://nusantaraeats.com${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
}

sitemap += `</urlset>`;

// Write sitemap
const sitemapPath = path.join(__dirname, 'public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

console.log(`Sitemap generated with ${slugs.length + otherPages.length + categories.length + 2} URLs`);
console.log(`Saved to: ${sitemapPath}`);
