const fs = require('fs');

// Indonesian dish names for search
const dishSearchTerms = {
  'javanese-fried-rice': 'nasi goreng',
  'padang-beef-rendang': 'rendang',
  'madura-chicken-satay': 'sate ayam',
  'lamongan-chicken-soto': 'soto ayam',
  'betawi-gado-gado': 'gado gado',
  'complete-malang-meatballs': 'bakso',
  'bangka-sweet-martabak': 'martabak manis',
  'cendol-dawet-ayu-ice': 'cendol',
  'palembang-submarine-pempek': 'pempek',
  'nusantara-es-teler': 'es teler',
  'galangal-fried-chicken': 'ayam goreng lengkuas',
  'stir-fried-water-spinach-with-shrimp-paste': 'kangkung',
  'jimbaran-grilled-fish': 'ikan bakar',
  'indonesian-oxtail-soup': 'sop buntut',
  'javanese-fried-noodles': 'mie goreng',
  'spicy-fried-potatoes-with-liver': 'sambal goreng kentang',
  'thick-gravy-mixed-vegetables': 'capcay',
  'steamed-spiced-goldfish': 'pepes ikan',
  'beef-rib-soup': 'sop iga',
  'solo-liwet-rice': 'nasi liwet',
  'taliwang-grilled-chicken': 'ayam bakar taliwang',
  'young-jackfruit-gudeg': 'gudeg',
  'crispy-fried-banana': 'pisang goreng',
  'gejrot-tofu': 'tahu gejrot',
  'surabaya-mixed-ice': 'es campur',
  'potato-fritters': 'perkedel kentang',
  'grilled-tilapia': 'ikan bakar nila',
  'jakarta-chicken-porridge': 'bubur ayam',
  'mendoan-tempeh': 'tempe mendoan',
  'pak-min-klaten-chicken-soup': 'sop ayam',
  'pallubasa-soup': 'pallubasa',
  'padang-satay': 'sate padang',
  'balinese-minced-satay': 'sate lilit',
  'pusut-satay': 'sate pusut',
  'klatak-iron-skewer-satay': 'sate klatak',
  'maranggi-beef-satay': 'sate maranggi',
  'yogyakarta-gudeg': 'gudeg',
  'lodeh-vegetable-stew': 'sayur lodeh',
  'rice-cake-with-vegetable-stew': 'lontong sayur',
  'ketoprak': 'ketoprak',
  'betawi-coconut-rice': 'nasi uduk',
  'yellow-turmeric-rice': 'nasi kuning',
  'cone-shaped-festive-rice': 'nasi tumpeng',
  'manado-porridge': 'tinutuan',
  'brothers-soup': 'sop saudara',
  'tinutuan-porridge': 'tinutuan',
  'klepon-rice-balls': 'klepon',
  'sesame-balls': 'onde-onde',
  'layer-cake': 'kue lapis',
  'mud-cake': 'kue lumpur',
  'bika-ambon-honeycomb-cake': 'bika ambon',
  'snow-white-cookies': 'putri salju',
  'cheese-stick-cookies': 'kastengel',
  'pineapple-tart-cookies': 'nastar',
  'bamboo-sticky-rice': 'lemang',
  'sweet-sticky-rice-cake': 'wajik',
  'doger-ice': 'es doger',
  'pletok-herbal-ice': 'bir pletok',
  'uwuh-herbal-drink': 'wedang uwuh',
  'ronde-ginger-drink': 'wedang ronde',
  'bandrek-ginger-drink': 'bandrek',
  'sekoteng-ginger-drink': 'sekoteng',
  'palm-sap-drink': 'lahang',
  'gempol-ice': 'es gempol',
  'cendol-jelly-drink': 'cendol',
  'kopyor-coconut-ice': 'es kopyor',
  'betutu-slow-cooked-chicken': 'ayam betutu',
  'smashed-fried-chicken': 'ayam geprek',
  'pop-chicken': 'ayam pop',
  'jengkol-rendang': 'rendang jengkol',
  'beaten-smoked-beef': 'dendeng batokok',
  'intestine-curry': 'gulai tambusu',
  'kalio-beef-curry': 'kalio',
  'patin-fish-sour-soup': 'pindang patin',
  'fermented-durian-fish': 'tempoyak',
  'aceh-curry-noodles': 'mie aceh',
  'beulangong-curry-soup': 'kuah beulangong',
  'goat-meat-soup': 'sop kambing',
  'solo-timlo-soup': 'timlo solo',
  'tongseng-stir-fry': 'tongseng',
  'oncom-rice': 'tutug oncom',
  'rice-cake-with-tofu': 'kupat tahu',
  'serabi-coconut-pancake': 'serabi',
  'rolled-coconut-crepe': 'dadar gulung',
  'lemper-sticky-rice-roll': 'lemper',
  'arem-arem-rice-roll': 'arem-arem',
  'putu-steamed-cake': 'kue putu',
  'cenil-tapioca-balls': 'cenil',
  'gethuk-cassava-cake': 'gethuk',
  'mochi-rice-cake': 'mochi',
  'cubit-pinch-cake': 'kue cubit',
  'pukis-half-moon-cake': 'pukis',
  'bakpia-sweet-roll': 'bakpia',
  'wingko-coconut-cake': 'wingko',
  'talam-steamed-cake': 'kue talam',
  'butung-banana-ice': 'es palu butung',
  'young-coconut-ice': 'es kelapa muda',
  'sugarcane-ice': 'es tebu',
  'shaved-cucumber-ice': 'es timun serut',
  'red-bean-ice': 'es kacang merah',
};

async function searchWikimedia(searchTerm) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&format=json&srlimit=3`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.query && data.query.search && data.query.search.length > 0) {
      // Get the first file title
      const fileTitle = data.query.search[0].title;
      // Convert to direct image URL
      const fileName = fileTitle.replace('File:', '').replace(/ /g, '_');
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1200`;
    }
    return null;
  } catch (error) {
    console.error(`Error searching for ${searchTerm}:`, error.message);
    return null;
  }
}

async function updateRecipes() {
  // Read current recipes.ts
  const content = fs.readFileSync('/home/liveuser/nusantaraeats/src/data/recipes.ts', 'utf8');
  
  // Extract recipe slugs
  const slugRegex = /slug:\s*"([^"]+)"/g;
  const slugs = [];
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  
  console.log(`Found ${slugs.length} recipes to update images`);
  
  let updatedContent = content;
  let updatedCount = 0;
  
  for (const slug of slugs) {
    const searchTerm = dishSearchTerms[slug];
    if (!searchTerm) {
      console.log(`No search term for ${slug}, skipping`);
      continue;
    }
    
    console.log(`Searching for: ${searchTerm} (${slug})`);
    const imageUrl = await searchWikimedia(searchTerm);
    
    if (imageUrl) {
      // Find and replace the image URL for this recipe
      const slugIndex = updatedContent.indexOf(`slug: "${slug}"`);
      if (slugIndex !== -1) {
        // Find the image line after this slug
        const imageIndex = updatedContent.indexOf('image:', slugIndex);
        if (imageIndex !== -1) {
          const lineEnd = updatedContent.indexOf('\n', imageIndex);
          const oldLine = updatedContent.substring(imageIndex, lineEnd);
          const newLine = `    image: "${imageUrl}"`;
          updatedContent = updatedContent.replace(oldLine, newLine);
          updatedCount++;
          console.log(`✅ Updated: ${slug}`);
        }
      }
    } else {
      console.log(`❌ No image found for: ${slug}`);
    }
    
    // Small delay to be nice to Wikimedia API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Write updated content
  fs.writeFileSync('/home/liveuser/nusantaraeats/src/data/recipes.ts', updatedContent);
  console.log(`\n✅ Updated ${updatedCount} recipe images from Wikimedia Commons`);
}

updateRecipes().catch(console.error);
