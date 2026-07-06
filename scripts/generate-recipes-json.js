const fs = require('fs');
const path = require('path');

// Import recipes data
const recipesPath = path.join(__dirname, '../src/data/recipes.ts');
const content = fs.readFileSync(recipesPath, 'utf-8');

// Extract recipes array using regex
const recipesMatch = content.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\n\]);/);
if (!recipesMatch) {
  console.error('Could not parse recipes');
  process.exit(1);
}

// Parse the recipes - we'll use a simple approach
// Since the file is valid TS, let's just create the JSON manually
const categories = ['makanan-berat', 'sup-soto', 'sate-panggang', 'jajanan', 'minuman'];
const PAGE_SIZE = 12;

// Read the recipes file and extract minimal data
const lines = content.split('\n');
let recipes = [];
let currentRecipe = null;
let inRecipesArray = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  if (line.startsWith('id:')) {
    const id = parseInt(line.match(/id:\s*(\d+)/)?.[1] || '0');
    if (id > 0) {
      currentRecipe = { id };
    }
  }

  if (currentRecipe) {
    if (line.startsWith('slug:')) {
      currentRecipe.slug = line.match(/slug:\s*"([^"]+)"/)?.[1];
    }
    if (line.startsWith('title:')) {
      currentRecipe.title = line.match(/title:\s*"([^"]+)"/)?.[1];
    }
    if (line.startsWith('shortTitle:')) {
      currentRecipe.shortTitle = line.match(/shortTitle:\s*"([^"]+)"/)?.[1];
    }
    if (line.startsWith('description:')) {
      currentRecipe.description = line.match(/description:\s*"([^"]+)"/)?.[1];
    }
    if (line.startsWith('image:')) {
      currentRecipe.image = line.match(/image:\s*"([^"]+)"/)?.[1];
    }
    if (line.startsWith('kategori:')) {
      currentRecipe.kategori = line.match(/kategori:\s*"([^"]+)"/)?.[1];
    }
    if (line.startsWith('waktu:')) {
      currentRecipe.waktu = parseInt(line.match(/waktu:\s*(\d+)/)?.[1] || '0');
    }
    if (line.startsWith('porsi:')) {
      currentRecipe.porsi = line.match(/porsi:\s*"([^"]+)"/)?.[1];
    }
    if (line.startsWith('kesulitan:')) {
      currentRecipe.kesulitan = line.match(/kesulitan:\s*"([^"]+)"/)?.[1];
    }
    if (line.startsWith('rating:')) {
      currentRecipe.rating = parseFloat(line.match(/rating:\s*([\d.]+)/)?.[1] || '0');
    }
    if (line.startsWith('origin:')) {
      currentRecipe.origin = line.match(/origin:\s*"([^"]+)"/)?.[1];
    }

    // End of recipe
    if (line === '},' && currentRecipe.id && currentRecipe.slug) {
      recipes.push(currentRecipe);
      currentRecipe = null;
    }
  }
}

console.log(`Parsed ${recipes.length} recipes`);

// Generate JSON files for each category
const outDir = path.join(__dirname, '../public/data');
fs.mkdirSync(outDir, { recursive: true });

// Generate all recipes JSON (minimal)
const allMinimal = recipes.map(r => ({
  id: r.id,
  slug: r.slug,
  title: r.shortTitle || r.title?.replace(/ Recipe:.*$/, '').replace(/ Recipe$/, ''),
  description: r.description,
  image: r.image,
  waktu: r.waktu,
  porsi: r.porsi,
  kesulitan: r.kesulitan,
  rating: r.rating,
  origin: r.origin,
}));

fs.writeFileSync(path.join(outDir, 'recipes.json'), JSON.stringify(allMinimal));
console.log('Generated recipes.json');

// Generate category JSONs
for (const cat of categories) {
  const catRecipes = allMinimal.filter(r => {
    // We need to match category - since we don't have kategori in minimal,
    // we'll use the original data
    const original = recipes.find(orig => orig.id === r.id);
    return original?.kategori === cat;
  });

  fs.writeFileSync(path.join(outDir, `category-${cat}.json`), JSON.stringify(catRecipes));
  console.log(`Generated category-${cat}.json (${catRecipes.length} recipes)`);
}

console.log('Done!');
