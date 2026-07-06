const fs = require('fs');

const PEXELS_KEY = 'cbdG0RojUuXsiSiSDunBWz5N1B16uVq6vaH2O1DVt3C4dF8oq5ftYtQD';

// Search terms for each recipe (English terms for better results)
const searchTerms = {
  'javanese-fried-rice': 'nasi goreng indonesian fried rice',
  'padang-beef-rendang': 'rendang beef indonesian',
  'madura-chicken-satay': 'chicken satay sate',
  'lamongan-chicken-soto': 'soto ayam indonesian soup',
  'betawi-gado-gado': 'gado gado indonesian salad',
  'complete-malang-meatballs': 'bakso indonesian meatball',
  'bangka-sweet-martabak': 'martabak indonesian pancake',
  'cendol-dawet-ayu-ice': 'cendol indonesian drink',
  'palembang-submarine-pempek': 'pempek indonesian fish cake',
  'nusantara-es-teler': 'es teler indonesian ice',
  'galangal-fried-chicken': 'ayam goreng indonesian fried chicken',
  'stir-fried-water-spinach-with-shrimp-paste': 'kangkung stir fry water spinach',
  'jimbaran-grilled-fish': 'grilled fish indonesian',
  'indonesian-oxtail-soup': 'oxtail soup sop buntut',
  'javanese-fried-noodles': 'mie goreng indonesian noodles',
  'spicy-fried-potatoes-with-liver': 'sambal goreng kentang potato',
  'thick-gravy-mixed-vegetables': 'capcay indonesian vegetables',
  'steamed-spiced-goldfish': 'pepes ikan steamed fish',
  'beef-rib-soup': 'beef rib soup sop iga',
  'solo-liwet-rice': 'nasi liwet indonesian rice',
  'taliwang-grilled-chicken': 'ayam bakar grilled chicken',
  'young-jackfruit-gudeg': 'gudeg indonesian jackfruit',
  'crispy-fried-banana': 'pisang goreng fried banana',
  'gejrot-tofu': 'tahu gejrot tofu',
  'surabaya-mixed-ice': 'es campur indonesian mixed ice',
  'potato-fritters': 'perkedel kentang potato fritter',
  'grilled-tilapia': 'ikan bakar grilled fish',
  'jakarta-chicken-porridge': 'bubur ayam chicken porridge',
  'mendoan-tempeh': 'tempe mendoan indonesian',
  'pak-min-klaten-chicken-soup': 'sop ayam chicken soup',
  'pallubasa-soup': 'pallubasa beef soup',
  'padang-satay': 'sate padang indonesian satay',
  'balinese-minced-satay': 'sate lilit bali satay',
  'pusut-satay': 'sate pusut indonesian',
  'klatak-iron-skewer-satay': 'sate klatak goat satay',
  'maranggi-beef-satay': 'sate maranggi beef satay',
  'yogyakarta-gudeg': 'gudeg jackfruit java',
  'lodeh-vegetable-stew': 'sayur lodeh vegetable stew',
  'rice-cake-with-vegetable-stew': 'lontong sayur rice cake',
  'ketoprak': 'ketoprak indonesian salad',
  'betawi-coconut-rice': 'nasi uduk coconut rice',
  'yellow-turmeric-rice': 'nasi kuning yellow rice',
  'cone-shaped-festive-rice': 'nasi tumpeng cone rice',
  'manado-porridge': 'bubur manado porridge',
  'brothers-soup': 'sop saudara indonesian soup',
  'tinutuan-porridge': 'tinutuan manado porridge',
  'klepon-rice-balls': 'klepon indonesian rice ball',
  'sesame-balls': 'onde onde sesame ball',
  'layer-cake': 'kue lapis indonesian layer cake',
  'mud-cake': 'kue lumpur indonesian cake',
  'bika-ambon-honeycomb-cake': 'bika ambon honeycomb cake',
  'snow-white-cookies': 'putri salju cookies',
  'cheese-stick-cookies': 'kastengel cheese cookie',
  'pineapple-tart-cookies': 'nastar pineapple tart',
  'bamboo-sticky-rice': 'lemang bamboo sticky rice',
  'sweet-sticky-rice-cake': 'wajik sticky rice cake',
  'doger-ice': 'es doger indonesian ice',
  'pletok-herbal-ice': 'bir pletok herbal drink',
  'uwuh-herbal-drink': 'wedang uwuh herbal drink',
  'ronde-ginger-drink': 'wedang ronde ginger drink',
  'bandrek-ginger-drink': 'bandrek ginger drink',
  'sekoteng-ginger-drink': 'sekoteng ginger drink',
  'palm-sap-drink': 'lahang palm sap drink',
  'gempol-ice': 'es gempol indonesian ice',
  'cendol-jelly-drink': 'cendol green jelly drink',
  'kopyor-coconut-ice': 'es kopyor coconut ice',
  'betutu-slow-cooked-chicken': 'ayam betutu balinese chicken',
  'smashed-fried-chicken': 'ayam geprek smashed chicken',
  'pop-chicken': 'ayam pop indonesian chicken',
  'jengkol-rendang': 'rendang jengkol indonesian',
  'beaten-smoked-beef': 'dendeng batokok indonesian beef',
  'intestine-curry': 'gulai tambusu curry',
  'kalio-beef-curry': 'kalio beef curry indonesian',
  'patin-fish-sour-soup': 'pindang patin fish soup',
  'fermented-durian-fish': 'tempoyak durian fish',
  'aceh-curry-noodles': 'mie aceh indonesian noodles',
  'beulangong-curry-soup': 'kuah beulangong curry soup',
  'goat-meat-soup': 'sop kambing goat soup',
  'solo-timlo-soup': 'timlo solo soup',
  'tongseng-stir-fry': 'tongseng indonesian stir fry',
  'oncom-rice': 'tutug oncom rice',
  'rice-cake-with-tofu': 'kupat tahu rice cake tofu',
  'serabi-coconut-pancake': 'serabi indonesian pancake',
  'rolled-coconut-crepe': 'dadar gulung indonesian crepe',
  'lemper-sticky-rice-roll': 'lemper sticky rice roll',
  'arem-arem-rice-roll': 'arem arem rice roll',
  'putu-steamed-cake': 'kue putu steamed cake',
  'cenil-tapioca-balls': 'cenil indonesian dessert',
  'gethuk-cassava-cake': 'gethuk cassava cake',
  'mochi-rice-cake': 'mochi indonesian rice cake',
  'cubit-pinch-cake': 'kue cubit indonesian cake',
  'pukis-half-moon-cake': 'pukis indonesian cake',
  'bakpia-sweet-roll': 'bakpia indonesian sweet roll',
  'wingko-coconut-cake': 'wingko coconut cake',
  'talam-steamed-cake': 'kue talam steamed cake',
  'butung-banana-ice': 'es palu butung banana ice',
  'young-coconut-ice': 'es kelapa muda young coconut ice',
  'sugarcane-ice': 'es tebu sugarcane juice',
  'shaved-cucumber-ice': 'es timun cucumber ice',
  'red-bean-ice': 'es kacang merah red bean ice',
};

async function searchPexels(query) {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    const response = await fetch(url, {
      headers: { 'Authorization': PEXELS_KEY }
    });
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.large2x || data.photos[0].src.large;
    }
    return null;
  } catch (error) {
    console.error(`Error searching: ${error.message}`);
    return null;
  }
}

async function updateRecipes() {
  let content = fs.readFileSync('/home/liveuser/nusantaraeats/src/data/recipes.ts', 'utf8');
  
  let updatedCount = 0;
  let failedCount = 0;
  
  for (const [slug, searchTerm] of Object.entries(searchTerms)) {
    const slugIndex = content.indexOf(`slug: "${slug}"`);
    if (slugIndex === -1) {
      console.log(`❌ Slug not found: ${slug}`);
      failedCount++;
      continue;
    }
    
    const imageIndex = content.indexOf('image:', slugIndex);
    if (imageIndex === -1) continue;
    
    const lineEnd = content.indexOf('\n', imageIndex);
    const oldLine = content.substring(imageIndex, lineEnd);
    
    console.log(`🔍 Searching: ${searchTerm}`);
    const imageUrl = await searchPexels(searchTerm);
    
    if (imageUrl) {
      const newLine = `    image: "${imageUrl}"`;
      content = content.replace(oldLine, newLine);
      updatedCount++;
      console.log(`✅ Updated: ${slug}`);
    } else {
      console.log(`❌ No image: ${slug}`);
      failedCount++;
    }
    
    // Rate limit - 200 requests/hour, so ~3 per second max
    await new Promise(resolve => setTimeout(resolve, 400));
  }
  
  fs.writeFileSync('/home/liveuser/nusantaraeats/src/data/recipes.ts', content);
  console.log(`\n✅ Updated ${updatedCount} images from Pexels`);
  console.log(`❌ Failed ${failedCount} images`);
}

updateRecipes().catch(console.error);
