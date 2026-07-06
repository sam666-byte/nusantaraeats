// Auto-generate RSS feed from recipes
const fs = require('fs');

const recipesContent = fs.readFileSync('src/data/recipes.ts', 'utf8');

// Extract recipe data
const recipeRegex = /id:\s*(\d+),\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*shortTitle:\s*"([^"]*)",\s*description:\s*"([^"]+)"/g;
const recipes = [];
let match;
while ((match = recipeRegex.exec(recipesContent)) !== null) {
  recipes.push({
    id: parseInt(match[1]),
    slug: match[2],
    title: match[3],
    shortTitle: match[4],
    description: match[5],
  });
}

// Sort by ID (newest first)
recipes.sort((a, b) => b.id - a.id);

const today = new Date().toUTCString();

let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>NusantaraEats — Authentic Indonesian Recipes</title>
    <link>https://nusantaraeats.com</link>
    <description>500+ authentic Indonesian recipes with step-by-step instructions, cultural history, and nutritional info.</description>
    <language>en-us</language>
    <lastBuildDate>${today}</lastBuildDate>
    <atom:link href="https://nusantaraeats.com/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://nusantaraeats.com/logo.png</url>
      <title>NusantaraEats</title>
      <link>https://nusantaraeats.com</link>
    </image>
`;

// Add 50 newest recipes
recipes.slice(0, 50).forEach(r => {
  const title = r.shortTitle || r.title.replace(/ Recipe:.*$/, '').replace(/ Recipe$/, '');
  rss += `    <item>
      <title>${title} — NusantaraEats</title>
      <link>https://nusantaraeats.com/recipes/${r.slug}</link>
      <guid isPermaLink="true">https://nusantaraeats.com/recipes/${r.slug}</guid>
      <description>${r.description.substring(0, 200)}...</description>
      <pubDate>${today}</pubDate>
      <media:thumbnail url="https://nusantaraeats.com/images/${r.slug}.jpg"/>
      <media:content url="https://nusantaraeats.com/images/${r.slug}.jpg"/>
    </item>
`;
});

rss += `  </channel>
</rss>`;

fs.writeFileSync('public/feed.xml', rss);
console.log(`RSS feed generated with ${Math.min(recipes.length, 50)} recipes`);
