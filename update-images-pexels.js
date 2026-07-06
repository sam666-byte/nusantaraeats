const fs = require('fs');

// Better search terms for each dish
const dishSearchTerms = {
  'javanese-fried-rice': 'nasi goreng indonesian',
  'padang-beef-rendang': 'rendang beef',
  'madura-chicken-satay': 'chicken satay',
  'lamongan-chicken-soto': 'soto ayam',
  'betawi-gado-gado': 'gado gado',
  'complete-malang-meatballs': 'bakso meatball',
  'bangka-sweet-martabak': 'martabak',
  'cendol-dawet-ayu-ice': 'cendol',
  'palembang-submarine-pempek': 'pempek',
  'nusantara-es-teler': 'es teler',
  'galangal-fried-chicken': 'fried chicken indonesian',
  'stir-fried-water-spinach-with-shrimp-paste': 'kangkung',
  'jimbaran-grilled-fish': 'grilled fish',
  'indonesian-oxtail-soup': 'oxtail soup',
  'javanese-fried-noodles': 'mie goreng',
  'spicy-fried-potatoes-with-liver': 'fried potato',
  'thick-gravy-mixed-vegetables': 'mixed vegetables',
  'steamed-spiced-goldfish': 'steamed fish',
  'beef-rib-soup': 'beef rib soup',
  'solo-liwet-rice': 'nasi liwet',
  'taliwang-grilled-chicken': 'grilled chicken',
  'young-jackfruit-gudeg': 'gudeg',
  'crispy-fried-banana': 'fried banana',
  'gejrot-tofu': 'tofu',
  'surabaya-mixed-ice': 'mixed ice',
  'potato-fritters': 'potato fritter',
  'grilled-tilapia': 'grilled fish',
  'jakarta-chicken-porridge': 'chicken porridge',
  'mendoan-tempeh': 'tempeh',
  'pak-min-klaten-chicken-soup': 'chicken soup',
  'pallubasa-soup': 'beef soup',
  'padang-satay': 'satay beef',
  'balinese-minced-satay': 'minced satay',
  'pusut-satay': 'satay',
  'klatak-iron-skewer-satay': 'goat satay',
  'maranggi-beef-satay': 'beef satay',
  'yogyakarta-gudeg': 'jackfruit stew',
  'lodeh-vegetable-stew': 'vegetable stew',
  'rice-cake-with-vegetable-stew': 'rice cake',
  'ketoprak': 'ketoprak',
  'betawi-coconut-rice': 'coconut rice',
  'yellow-turmeric-rice': 'turmeric rice',
  'cone-shaped-festive-rice': 'tumpeng',
  'manado-porridge': 'porridge',
  'brothers-soup': 'soup',
  'tinutuan-porridge': 'manado porridge',
  'klepon-rice-balls': 'klepon',
  'sesame-balls': 'onde onde',
  'layer-cake': 'layer cake',
  'mud-cake': 'kue lumpur',
  'bika-ambon-honeycomb-cake': 'bika ambon',
  'snow-white-cookies': 'cookies',
  'cheese-stick-cookies': 'cheese cookie',
  'pineapple-tart-cookies': 'pineapple tart',
  'bamboo-sticky-rice': 'lemang',
  'sweet-sticky-rice-cake': 'wajik',
  'doger-ice': 'es doger',
  'pletok-herbal-ice': 'herbal drink',
  'uwuh-herbal-drink': 'wedang',
  'ronde-ginger-drink': 'ginger drink',
  'bandrek-ginger-drink': 'bandrek',
  'sekoteng-ginger-drink': 'sekoteng',
  'palm-sap-drink': 'palm drink',
  'gempol-ice': 'ice drink',
  'cendol-jelly-drink': 'cendol',
  'kopyor-coconut-ice': 'coconut ice',
  'betutu-slow-cooked-chicken': 'betutu chicken',
  'smashed-fried-chicken': 'fried chicken',
  'pop-chicken': 'ayam pop',
  'jengkol-rendang': 'jengkol',
  'beaten-smoked-beef': 'dendeng',
  'intestine-curry': 'gulai',
  'kalio-beef-curry': 'kalio',
  'patin-fish-sour-soup': 'fish soup',
  'fermented-durian-fish': 'tempoyak',
  'aceh-curry-noodles': 'mie aceh',
  'beulangong-curry-soup': 'curry soup',
  'goat-meat-soup': 'goat soup',
  'solo-timlo-soup': 'timlo',
  'tongseng-stir-fry': 'tongseng',
  'oncom-rice': 'oncom',
  'rice-cake-with-tofu': 'tofu rice cake',
  'serabi-coconut-pancake': 'serabi',
  'rolled-coconut-crepe': 'dadar gulung',
  'lemper-sticky-rice-roll': 'lemper',
  'arem-arem-rice-roll': 'arem arem',
  'putu-steamed-cake': 'putu',
  'cenil-tapioca-balls': 'cenil',
  'gethuk-cassava-cake': 'gethuk',
  'mochi-rice-cake': 'mochi',
  'cubit-pinch-cake': 'kue cubit',
  'pukis-half-moon-cake': 'pukis',
  'bakpia-sweet-roll': 'bakpia',
  'wingko-coconut-cake': 'wingko',
  'talam-steamed-cake': 'kue talam',
  'butung-banana-ice': 'banana ice',
  'young-coconut-ice': 'coconut ice',
  'sugarcane-ice': 'sugarcane juice',
  'shaved-cucumber-ice': 'cucumber ice',
  'red-bean-ice': 'red bean',
};

async function searchPexels(searchTerm) {
  try {
    // Use Pexels's public search page
    const url = `https://www.pexels.com/search/${encodeURIComponent(searchTerm)}/`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // Extract image URLs from HTML
    const imageRegex = /https:\/\/images\.pexels\.com\/photos\/\d+\/[^"?]+\?/g;
    const matches = html.match(imageRegex);
    
    if (matches && matches.length > 0) {
      // Return first image with proper size
      return matches[0].replace(/\?/, '?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop');
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function updateRecipes() {
  const content = fs.readFileSync('/home/liveuser/nusantaraeats/src/data/recipes.ts', 'utf8');
  
  const slugRegex = /slug:\s*"([^"]+)"/g;
  const slugs = [];
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  
  console.log(`Found ${slugs.length} recipes`);
  
  let updatedContent = content;
  let updatedCount = 0;
  
  for (const slug of slugs) {
    // Check if already has Wikimedia image
    const slugIndex = updatedContent.indexOf(`slug: "${slug}"`);
    const imageIndex = updatedContent.indexOf('image:', slugIndex);
    const lineEnd = updatedContent.indexOf('\n', imageIndex);
    const currentImage = updatedContent.substring(imageIndex, lineEnd);
    
    if (currentImage.includes('commons.wikimedia.org')) {
      console.log(`⏭️  Skip (already Wikimedia): ${slug}`);
      continue;
    }
    
    const searchTerm = dishSearchTerms[slug];
    if (!searchTerm) {
      console.log(`❌ No search term: ${slug}`);
      continue;
    }
    
    console.log(`🔍 Searching: ${searchTerm}`);
    const imageUrl = await searchPexels(searchTerm);
    
    if (imageUrl) {
      const oldLine = currentImage;
      const newLine = `    image: "${imageUrl}"`;
      updatedContent = updatedContent.replace(oldLine, newLine);
      updatedCount++;
      console.log(`✅ Updated: ${slug}`);
    } else {
      console.log(`❌ No image: ${slug}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  fs.writeFileSync('/home/liveuser/nusantaraeats/src/data/recipes.ts', updatedContent);
  console.log(`\n✅ Updated ${updatedCount} images from Pexels`);
}

updateRecipes().catch(console.error);
