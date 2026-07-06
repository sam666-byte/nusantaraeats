// Auto-generate social media posts from recipes
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

// Generate posts for top recipes
const topSlugs = [
  'rendang', 'nasi-goreng-kampung', 'sate-madura', 'gudeg',
  'soto-betawi', 'pempek', 'rawon', 'mie-aceh',
  'ayam-taliwang', 'papeda', 'coto-makassar', 'es-cendol'
];

const posts = {
  reddit: [],
  pinterest: [],
  instagram: [],
  twitter: []
};

topSlugs.forEach(slug => {
  const recipe = recipes.find(r => r.slug === slug);
  if (!recipe) return;

  const title = recipe.shortTitle || recipe.title.replace(/ Recipe:.*$/, '').replace(/ Recipe$/, '');
  const url = `https://nusantaraeats.com/recipes/${slug}`;
  const imageUrl = `https://nusantaraeats.com/images/${slug}.jpg`;

  // Reddit post
  posts.reddit.push(`## ${title}
**Subreddit:** r/food
**Title:** [Homemade] ${title} - Authentic Indonesian Recipe
**Body:** Made this amazing ${title}! ${recipe.description.substring(0, 100)}... Full recipe: ${url}
`);

  // Pinterest pin
  posts.pinterest.push(`## ${title}
**Image:** ${imageUrl}
**Title:** ${title} Recipe - NusantaraEats
**Description:** Authentic Indonesian ${title}. Easy step-by-step recipe with cultural history. ${url} #indonesianfood #${slug.replace(/-/g, '')} #asianrecipes #foodporn
**Link:** ${url}
`);

  // Instagram caption
  posts.instagram.push(`## ${title}
**Caption:** 🇮🇩 ${title} - A taste of Indonesia! ${recipe.description.substring(0, 80)}... 

Full recipe in bio! 

#indonesianfood #${slug.replace(/-/g, '')} #asianfood #foodporn #homecooking #traditionalfood #authenticrecipes #cooking #recipe #foodie
`);

  // Twitter/X post
  posts.twitter.push(`## ${title}
**Tweet:** 🇮🇩 ${title} - ${recipe.description.substring(0, 100)}...

Full recipe: ${url}

#IndonesianFood #${slug.replace(/-/g, '')} #FoodLovers
`);
});

// Write posts to files
fs.writeFileSync('seo/social-posts/reddit.md', '# Reddit Posts\n\n' + posts.reddit.join('\n---\n\n'));
fs.writeFileSync('seo/social-posts/pinterest.md', '# Pinterest Pins\n\n' + posts.pinterest.join('\n---\n\n'));
fs.writeFileSync('seo/social-posts/instagram.md', '# Instagram Captions\n\n' + posts.instagram.join('\n---\n\n'));
fs.writeFileSync('seo/social-posts/twitter.md', '# Twitter/X Posts\n\n' + posts.twitter.join('\n---\n\n'));

console.log(`Generated ${posts.reddit.length} posts for each platform`);
