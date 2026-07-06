const fs = require('fs');

// Read the old data
const raw = fs.readFileSync('/home/liveuser/nusantaraeats-site/supabase-config.js', 'utf8');
const match = raw.match(/window\.recipes\s*=\s*(\[[\s\S]*?\]);/);
if (!match) { console.error('No recipes found'); process.exit(1); }
const recipes = JSON.parse(match[1]);

// Translation maps
const difficultyMap = { 'Mudah': 'Easy', 'Sedang': 'Medium', 'Sulit': 'Hard' };

const kategoriMap = {
  'makanan-berat': 'makanan-berat',
  'sup-soto': 'sup-soto',
  'sate-panggang': 'sate-panggang',
  'jajanan': 'jajanan',
  'minuman': 'minuman',
};

const nameTranslations = {
  'Nasi Goreng Jawa': 'Javanese Fried Rice',
  'Rendang Daging Sapi Padang': 'Padang Beef Rendang',
  'Sate Ayam Madura': 'Madura Chicken Satay',
  'Soto Ayam Lamongan': 'Lamongan Chicken Soto',
  'Gado-Gado Betawi': 'Betawi Gado-Gado',
  'Bakso Malang Komplit': 'Complete Malang Meatballs',
  'Martabak Manis Bangka': 'Bangka Sweet Martabak',
  'Es Cendol Dawet Ayu': 'Cendol Dawet Ayu Ice',
  'Pempek Kapal Selam Palembang': 'Palembang Submarine Pempek',
  'Es Teler Nusantara': 'Nusantara Es Teler',
  'Ayam Goreng Lengkuas': 'Galangal Fried Chicken',
  'Tumis Kangkung Belacan': 'Stir-Fried Water Spinach with Shrimp Paste',
  'Ikan Bakar Jimbaran': 'Jimbaran Grilled Fish',
  'Sop Buntut Sapi': 'Indonesian Oxtail Soup',
  'Mie Goreng Jawa': 'Javanese Fried Noodles',
  'Sambal Goreng Kentang Ati': 'Spicy Fried Potatoes with Liver',
  'Capcay Kuah Kental': 'Thick Gravy Mixed Vegetables',
  'Pepes Ikan Mas': 'Steamed Spiced Goldfish',
  'Sop Iga Sapi': 'Beef Rib Soup',
  'Nasi Liwet Solo': 'Solo Liwet Rice',
  'Ayam Bakar Taliwang': 'Taliwang Grilled Chicken',
  'Gudeg Nangka Muda': 'Young Jackfruit Gudeg',
  'Pisang Goreng Crispy': 'Crispy Fried Banana',
  'Tahu Gejrot': 'Gejrot Tofu',
  'Es Campur Khas Surabaya': 'Surabaya Mixed Ice',
  'Perkedel Kentang': 'Potato Fritters',
  'Ikan Nila Bakar': 'Grilled Tilapia',
  'Bubur Ayam Jakarta': 'Jakarta Chicken Porridge',
  'Tempe Mendoan': 'Mendoan Tempeh',
  'Sop Ayam Pak Min Klaten': 'Pak Min Klaten Chicken Soup',
  'Pallubasa': 'Pallubasa Soup',
  'Sate Padang': 'Padang Satay',
  'Sate Lilit Bali': 'Balinese Minced Satay',
  'Sate Pusut': 'Pusut Satay',
  'Sate Klatak': 'Klatak Iron Skewer Satay',
  'Sate Maranggi': 'Maranggi Beef Satay',
  'Gudeg Jogja': 'Yogyakarta Gudeg',
  'Sayur Lodeh': 'Lodeh Vegetable Stew',
  'Lontong Sayur': 'Rice Cake with Vegetable Stew',
  'Ketoprak': 'Ketoprak',
  'Nasi Uduk Betawi': 'Betawi Coconut Rice',
  'Nasi Kuning': 'Yellow Turmeric Rice',
  'Nasi Tumpeng': 'Cone-Shaped Festive Rice',
  'Bubur Manado': 'Manado Porridge',
  'Sop Saudara': 'Brother\'s Soup',
  'Tinutuan': 'Tinutuan Porridge',
  'Klepon': 'Klepon Rice Balls',
  'Onde-Onde': 'Sesame Balls',
  'Kue Lapis': 'Layer Cake',
  'Kue Lumpur': 'Mud Cake',
  'Bika Ambon': 'Bika Ambon Honeycomb Cake',
  'Putri Salju': 'Snow White Cookies',
  'Kastengel': 'Cheese Stick Cookies',
  'Nastar': 'Pineapple Tart Cookies',
  'Lemang': 'Bamboo Sticky Rice',
  'Wajik': 'Sweet Sticky Rice Cake',
  'Es Doger': 'Doger Ice',
  'Es Bir Pletok': 'Pletok Herbal Ice',
  'Wedang Uwuh': 'Uwuh Herbal Drink',
  'Wedang Ronde': 'Ronde Ginger Drink',
  'Bandrek': 'Bandrek Ginger Drink',
  'Sekoteng': 'Sekoteng Ginger Drink',
  'Lahang': 'Palm Sap Drink',
  'Es Gempol': 'Gempol Ice',
  'Cendol': 'Cendol Jelly Drink',
  'Es Kopyor': 'Kopyor Coconut Ice',
  'Ayam Betutu': 'Betutu Slow-Cooked Chicken',
  'Ayam Geprek': 'Smashed Fried Chicken',
  'Ayam Pop': 'Pop Chicken',
  'Rendang Jengkol': 'Jengkol Rendang',
  'Dendeng Batokok': 'Beaten Smoked Beef',
  'Gulai Tambusu': 'Intestine Curry',
  'Kalio': 'Kalio Beef Curry',
  'Pindang Patin': 'Patin Fish Sour Soup',
  'Tempoyak': 'Fermented Durian Fish',
  'Mie Aceh': 'Aceh Curry Noodles',
  'Kuah Beulangong': 'Beulangong Curry Soup',
  'Sop Kambing': 'Goat Meat Soup',
  'Timlo Solo': 'Solo Timlo Soup',
  'Tongseng': 'Tongseng Stir-Fry',
  'Tutug Oncom': 'Oncom Rice',
  'Kupat Tahu': 'Rice Cake with Tofu',
  'Serabi': 'Serabi Coconut Pancake',
  'Dadar Gulung': 'Rolled Coconut Crepe',
  'Lemper': 'Lemper Sticky Rice Roll',
  'Arem-Arem': 'Arem-Arem Rice Roll',
  'Kue Putu': 'Putu Steamed Cake',
  'Cenil': 'Cenil Tapioca Balls',
  'Gethuk': 'Gethuk Cassava Cake',
  'Mochi': 'Mochi Rice Cake',
  'Kue Cubit': 'Cubit Pinch Cake',
  'Pukis': 'Pukis Half-Moon Cake',
  'Bakpia': 'Bakpia Sweet Roll',
  'Wingko': 'Wingko Coconut Cake',
  'Kue Talam': 'Talam Steamed Cake',
  'Es Palu Butung': 'Butung Banana Ice',
  'Es Kelapa Muda': 'Young Coconut Ice',
  'Es Tebu': 'Sugarcane Ice',
  'Es Timun Serut': 'Shaved Cucumber Ice',
  'Es Kacang Merah': 'Red Bean Ice',
  'Lontong Cap Go Meh': 'Cap Go Meh Rice Cake',
  'Kerak Telor': 'Betawi Egg Crust Rice',
  'Nasi Timbel': 'Timbel Wrapped Rice',
  'Lotek': 'Lotek Vegetable Salad',
  'Karedok': 'Karedok Raw Vegetable Salad',
  'Sayur Asem': 'Sour Tamarind Vegetable Soup',
  'Sop Konro': 'Konro Rib Soup',
  'Coto Medan': 'Medan Beef Soup',
  'Ikan Kuah Asam': 'Sour Fish Soup',
  'Telur Balado': 'Spicy Fried Eggs',
  'Tumis Terasi': 'Stir-Fried Shrimp Paste Vegetables',
  'Sambal Terasi': 'Shrimp Paste Chili Sauce',
  'Sambal Matah': 'Raw Shallot Sambal',
  'Sambal Dabu-Dabu': 'Dabu-Dabu Fresh Sambal',
  'Kerupuk Udang': 'Prawn Crackers',
  'Emping Melinjo': 'Melinjo Nut Crackers',
  'Rujak Cingur': 'Cingur Nose Salad',
  'Es Campur': 'Mixed Ice',
  'Syrup Cocopandan': 'Cocopandan Syrup',
};

// Origin map based on recipe name/type
const originMap = {
  'Nasi Goreng Jawa': 'Central Java',
  'Rendang Daging Sapi Padang': 'West Sumatra',
  'Sate Ayam Madura': 'East Java (Madura)',
  'Soto Ayam Lamongan': 'East Java',
  'Gado-Gado Betawi': 'Jakarta',
  'Bakso Malang Komplit': 'East Java (Malang)',
  'Martabak Manis Bangka': 'Bangka Belitung',
  'Es Cendol Dawet Ayu': 'Central Java',
  'Pempek Kapal Selam Palembang': 'South Sumatra',
  'Es Teler Nusantara': 'West Java',
  'Ayam Goreng Lengkuas': 'West Java',
  'Tumis Kangkung Belacan': 'East Java',
  'Ikan Bakar Jimbaran': 'Bali',
  'Sop Buntut Sapi': 'Jakarta',
  'Mie Goreng Jawa': 'Central Java',
  'Sambal Goreng Kentang Ati': 'Jakarta',
  'Capcay Kuah Kental': 'Chinese-Indonesian',
  'Pepes Ikan Mas': 'West Java',
  'Sop Iga Sapi': 'Jakarta',
  'Nasi Liwet Solo': 'Central Java (Solo)',
  'Ayam Bakar Taliwang': 'West Nusa Tenggara (Lombok)',
  'Gudeg Nangka Muda': 'Yogyakarta',
  'Pisang Goreng Crispy': 'Indonesia',
  'Tahu Gejrot': 'West Java (Cirebon)',
  'Es Campur Khas Surabaya': 'East Java (Surabaya)',
  'Perkedel Kentang': 'Indonesia',
  'Ikan Nila Bakar': 'Indonesia',
  'Bubur Ayam Jakarta': 'Jakarta',
  'Tempe Mendoan': 'Central Java',
  'Sop Ayam Pak Min Klaten': 'Central Java (Klaten)',
  'Pallubasa': 'South Sulawesi',
  'Sate Padang': 'West Sumatra',
  'Sate Lilit Bali': 'Bali',
  'Sate Pusut': 'Bali (Lombok)',
  'Sate Klatak': 'Yogyakarta',
  'Sate Maranggi': 'West Java',
  'Gudeg Jogja': 'Yogyakarta',
  'Sayur Lodeh': 'Java',
  'Lontong Sayur': 'Jakarta',
  'Ketoprak': 'Jakarta',
  'Nasi Uduk Betawi': 'Jakarta',
  'Nasi Kuning': 'Indonesia',
  'Nasi Tumpeng': 'Java',
  'Bubur Manado': 'North Sulawesi',
  'Sop Saudara': 'South Sulawesi',
  'Tinutuan': 'North Sulawesi',
  'Klepon': 'Java',
  'Onde-Onde': 'Java',
  'Kue Lapis': 'Indonesia',
  'Kue Lumpur': 'Java',
  'Bika Ambon': 'Medan',
  'Putri Salju': 'Indonesia',
  'Kastengel': 'Indonesia',
  'Nastar': 'Indonesia',
  'Lemang': 'Minangkabau',
  'Wajik': 'Java',
  'Es Doger': 'Betawi (Jakarta)',
  'Es Bir Pletok': 'Betawi (Jakarta)',
  'Wedang Uwuh': 'Yogyakarta',
  'Wedang Ronde': 'Java',
  'Bandrek': 'West Java (Sunda)',
  'Sekoteng': 'Java',
  'Lahang': 'West Java',
  'Es Gempol': 'Indonesia',
  'Cendol': 'Java',
  'Es Kopyor': 'Java',
  'Ayam Betutu': 'Bali',
  'Ayam Geprek': 'Yogyakarta',
  'Ayam Pop': 'West Sumatra',
  'Rendang Jengkol': 'West Sumatra',
  'Dendeng Batokok': 'West Sumatra',
  'Gulai Tambusu': 'West Sumatra',
  'Kalio': 'West Sumatra',
  'Pindang Patin': 'South Sumatra',
  'Tempoyak': 'South Sumatra',
  'Mie Aceh': 'Aceh',
  'Kuah Beulangong': 'Aceh',
  'Sop Kambing': 'Jakarta',
  'Timlo Solo': 'Central Java (Solo)',
  'Tongseng': 'Central Java',
  'Tutug Oncom': 'West Java (Tasikmalaya)',
  'Kupat Tahu': 'West Java (Bandung)',
  'Serabi': 'Java',
  'Dadar Gulung': 'Java',
  'Lemper': 'Java',
  'Arem-Arem': 'Java',
  'Kue Putu': 'Java',
  'Cenil': 'Java',
  'Gethuk': 'Central Java',
  'Mochi': 'Indonesia',
  'Kue Cubit': 'Jakarta',
  'Pukis': 'Java',
  'Bakpia': 'Yogyakarta',
  'Wingko': 'Central Java (Semarang)',
  'Kue Talam': 'Indonesia',
  'Es Palu Butung': 'Makassar',
  'Es Kelapa Muda': 'Indonesia',
  'Es Tebu': 'Java',
  'Es Timun Serut': 'Indonesia',
  'Es Kacang Merah': 'Indonesia',
};

// Description generator based on category
function generateDescription(name, kategori, origin) {
  const descriptions = {
    'makanan-berat': `A beloved main dish from ${origin || 'Indonesia'}, featuring authentic flavors passed down through generations.`,
    'sup-soto': `A comforting soup from ${origin || 'Indonesia'}, rich with traditional spices and aromatic herbs.`,
    'sate-panggang': `A grilled delicacy from ${origin || 'Indonesia'}, expertly seasoned and cooked over charcoal.`,
    'jajanan': `A traditional snack from ${origin || 'Indonesia'}, offering a perfect balance of sweet and savory flavors.`,
    'minuman': `A refreshing traditional drink from ${origin || 'Indonesia'}, perfect for any occasion.`,
  };
  return descriptions[kategori] || `An authentic recipe from ${origin || 'Indonesia'}.`;
}

// Generate slug from English name
function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Translate ingredient (basic mapping)
function translateIngredient(ing) {
  // Already translated or keep original if too complex
  const translations = {
    'daging sapi': 'beef',
    'ayam kampung': 'free-range chicken',
    'santan kental': 'thick coconut milk',
    'bawang merah': 'shallots',
    'bawang putih': 'garlic',
    'cabe merah': 'red chili',
    'cabe rawit': 'bird\'s eye chili',
    'kunyit': 'turmeric',
    'jahe': 'ginger',
    'lengkuas': 'galangal',
    'serai': 'lemongrass',
    'daun jeruk': 'kaffir lime leaves',
    'daun salam': 'Indonesian bay leaf',
    'ketumbar': 'coriander',
    'merica': 'pepper',
    'garam': 'salt',
    'gula merah': 'palm sugar',
    'gula pasir': 'sugar',
    'minyak goreng': 'cooking oil',
    'tepung terigu': 'all-purpose flour',
    'tepung beras': 'rice flour',
    'tepung tapioka': 'tapioca flour',
    'tepung ketan': 'glutinous rice flour',
    'telur': 'egg',
    'nasi putih': 'steamed rice',
    'kentang': 'potato',
    'wortel': 'carrot',
    'kol': 'cabbage',
    'kangkung': 'water spinach',
    'tauge': 'bean sprouts',
    'tomat': 'tomato',
    'daun bawang': 'spring onion',
    'seledri': 'celery',
    'daun kemangi': 'lemon basil',
    'kemiri': 'candlenut',
    'jintan': 'cumin',
    'lada hitam': 'black pepper',
    'kecap manis': 'sweet soy sauce',
    'kecap asin': 'soy sauce',
    'air jeruk nipis': 'lime juice',
    'asam jawa': 'tamarind',
    'terasi': 'shrimp paste',
    'belacan': 'fermented shrimp paste',
    'kacang tanah': 'peanuts',
    'kacang hijau': 'mung beans',
    'kelapa parut': 'grated coconut',
    'daun pandan': 'pandan leaves',
    'gula aren': 'palm sugar',
    'tepung sagu': 'sago flour',
    'tepung maizena': 'cornstarch',
    'susu cair': 'milk',
    'susu kental manis': 'sweetened condensed milk',
    'vanili': 'vanilla',
    'ragi': 'yeast',
    'baking powder': 'baking powder',
    'soda kue': 'baking soda',
    'telur rebus': 'boiled egg',
    'tahu': 'tofu',
    'tempe': 'tempeh',
    'mie': 'noodles',
    'bihun': 'rice vermicelli',
    'soun': 'glass noodles',
    'kerupuk': 'crackers',
    'emping': 'melinjo nut crackers',
    'lontong': 'compressed rice cake',
    'ketupat': 'woven rice cake',
    'nangka': 'jackfruit',
    'alpukat': 'avocado',
    'pisang': 'banana',
    'singkong': 'cassava',
    'ubi': 'sweet potato',
    'jengkol': 'dog fruit/stink bean',
    'oncom': 'fermented soybean cake',
    'kolang kaling': 'sugar palm fruit',
    'nira': 'palm sap',
    'bambu': 'bamboo',
    'daun pisang': 'banana leaf',
    'batako': 'brick',
    'lidi': 'coconut leaf spine',
    'tusuk sate': 'bamboo skewers',
    'air es': 'ice water',
    'es batu': 'ice cubes',
    'es serut': 'shaved ice',
    'minyak kelapa': 'coconut oil',
    'kaldu sapi': 'beef broth',
    'kaldu ayam': 'chicken broth',
    'air': 'water',
    'baking soda': 'baking soda',
    'soda kue': 'baking soda',
    'kismis': 'raisins',
    'selasih': 'basil seeds',
    'wijen': 'sesame seeds',
    'maizena': 'cornstarch',
  };
  
  let result = ing;
  for (const [indo, eng] of Object.entries(translations)) {
    if (result.toLowerCase().includes(indo.toLowerCase())) {
      result = result.replace(new RegExp(indo, 'gi'), eng);
    }
  }
  return result;
}

// Transform recipes
const newRecipes = recipes.map(r => {
  const engName = nameTranslations[r.nama] || r.nama;
  const slug = slugify(engName);
  const origin = originMap[r.nama] || 'Indonesia';
  
  return {
    id: r.id,
    slug: slug,
    title: engName,
    description: generateDescription(engName, r.kategori, origin),
    image: r.gambar,
    kategori: r.kategori,
    waktu: r.waktu,
    porsi: r.porsi.replace('orang', 'people').replace('buah', 'pieces').replace('gelas', 'glasses').replace('loyang', 'pans').replace('potong', 'pieces'),
    kesulitan: difficultyMap[r.kesulitan] || r.kesulitan,
    rating: r.rating,
    origin: origin,
    ingredients: r.bahan.map(translateIngredient),
    instructions: r.langkah.map(translateIngredient),
    tips: `Enjoy this authentic ${engName} from ${origin}. Best served fresh and hot.`,
  };
});

// Generate TypeScript
let ts = `import { Recipe } from "@/types";\n\nexport const recipes: Recipe[] = [\n`;

newRecipes.forEach((r, i) => {
  ts += `  {\n`;
  ts += `    id: ${r.id},\n`;
  ts += `    slug: "${r.slug}",\n`;
  ts += `    title: "${r.title.replace(/"/g, '\\"')}",\n`;
  ts += `    description: "${r.description.replace(/"/g, '\\"')}",\n`;
  ts += `    image: "${r.image}",\n`;
  ts += `    kategori: "${r.kategori}",\n`;
  ts += `    waktu: ${r.waktu},\n`;
  ts += `    porsi: "${r.porsi.replace(/"/g, '\\"')}",\n`;
  ts += `    kesulitan: "${r.kesulitan}",\n`;
  ts += `    rating: ${r.rating},\n`;
  ts += `    origin: "${r.origin.replace(/"/g, '\\"')}",\n`;
  ts += `    ingredients: [\n`;
  r.ingredients.forEach(ing => {
    ts += `      "${ing.replace(/"/g, '\\"')}",\n`;
  });
  ts += `    ],\n`;
  ts += `    instructions: [\n`;
  r.instructions.forEach(inst => {
    ts += `      "${inst.replace(/"/g, '\\"')}",\n`;
  });
  ts += `    ],\n`;
  ts += `    tips: "${r.tips.replace(/"/g, '\\"')}",\n`;
  ts += `  },\n`;
});

ts += `];\n\n`;
ts += `export const getRecipeBySlug = (slug: string): Recipe | undefined =>\n`;
ts += `  recipes.find((r) => r.slug === slug);\n\n`;
ts += `export const getRecipeById = (id: number): Recipe | undefined =>\n`;
ts += `  recipes.find((r) => r.id === id);\n\n`;
ts += `export const searchRecipes = (query: string): Recipe[] => {\n`;
ts += `  const q = query.toLowerCase();\n`;
ts += `  return recipes.filter(\n`;
ts += `    (r) =>\n`;
ts += `      r.title.toLowerCase().includes(q) ||\n`;
ts += `      r.description.toLowerCase().includes(q) ||\n`;
ts += `      r.origin.toLowerCase().includes(q) ||\n`;
ts += `      r.ingredients.some((i) => i.toLowerCase().includes(q))\n`;
ts += `  );\n`;
ts += `};\n\n`;
ts += `export const filterByKategori = (kategori: string): Recipe[] => {\n`;
ts += `  if (kategori === "all") return recipes;\n`;
ts += `  return recipes.filter((r) => r.kategori === kategori);\n`;
ts += `};\n`;

fs.writeFileSync('/home/liveuser/nusantaraeats/src/data/recipes.ts', ts);
console.log(`✅ Translated ${newRecipes.length} recipes to English`);
console.log(`📁 Saved to src/data/recipes.ts`);
