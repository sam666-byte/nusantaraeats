const https = require('https');
const fs = require('fs');
const path = require('path');

// Cloudflare Workers AI Config
const CF_API_TOKEN = 'cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728';
const CF_ACCOUNT_ID = '243dd09cf194815c3fce5ce09528167c';
const CF_AI_ENDPOINT = `/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`;

// Image output directory
const IMAGES_DIR = path.join(__dirname, 'public/images');

// Recipe slug to detailed prompt mapping
const recipePrompts = {
  // Main Dishes
  "ayam-betutu": "Close-up food photography of ayam betutu, Balinese whole chicken stuffed with rich spice paste wrapped in banana leaves, traditional Balinese cuisine, professional food styling, clean background, studio lighting, appetizing, 4k",
  
  "pempek-palembang": "Close-up food photography of pempek Palembang, Indonesian fish cake with dark sweet vinegar sauce called cuko, served with cucumber slices, traditional South Sumatra dish, professional food styling, clean background, 4k",
  
  "gudeg": "Close-up food photography of gudeg, Javanese young jackfruit stew in coconut milk with reddish-brown color from teak leaves, served with rice and chicken opor, traditional Yogyakarta dish, professional food styling, 4k",
  
  "coto-makassar": "Close-up food photography of Coto Makassar, rich dark beef soup with peanuts from South Sulawesi, served with ketupat rice cake, traditional Indonesian soup, professional food styling, clean background, 4k",
  
  "mie-aceh": "Close-up food photography of Mie Aceh, thick yellow spicy noodles with curry-like broth and seafood or meat, Acehnese noodle dish, professional food styling, clean background, studio lighting, 4k",
  
  "sate-lilit": "Close-up food photography of sate lilit, Balinese minced fish satay wrapped around lemongrass stalks with grated coconut, traditional Balinese satay, professional food styling, clean background, 4k",
  
  "tinutuan": "Close-up food photography of tinutuan, Manado mixed porridge with rice, corn, pumpkin, sweet potato and vegetables, healthy Indonesian breakfast, professional food styling, clean background, 4k",
  
  "nasi-jinggo": "Close-up food photography of nasi jinggo, small Balinese rice packet wrapped in banana leaf with shredded chicken and sambal matah, traditional Balinese street food, professional food styling, 4k",
  
  "ikan-bakar-woku": "Close-up food photography of ikan bakar woku, North Sulawesi grilled fish wrapped in banana leaves with woku spice paste, Manado style grilled fish, professional food styling, clean background, 4k",
  
  "karedok": "Close-up food photography of karedok, Sundanese raw vegetable salad with spicy peanut sauce dressing, fresh bean sprouts and long beans, traditional West Java dish, professional food styling, 4k",
  
  "kambing-guling": "Close-up food photography of kambing guling, whole roasted lamb with crispy golden skin, Indonesian ceremonial dish, professional food styling, clean background, studio lighting, 4k",
  
  "nasi-kunyit": "Close-up food photography of nasi kunyit, Indonesian turmeric yellow rice with aromatic spices, festive rice dish, professional food styling, clean background, studio lighting, appetizing, 4k",
  
  "babi-guling": "Close-up food photography of babi guling, Balinese roast suckling pig with incredibly crispy skin, stuffed with spice paste, traditional Balinese ceremonial dish, professional food styling, 4k",
  
  "lawar": "Close-up food photography of lawar, traditional Balinese mixed vegetable dish with minced meat and grated coconut, colorful Balinese side dish, professional food styling, clean background, 4k",
  
  "sop-konro": "Close-up food photography of sop konro, Makassar dark beef rib soup with kluwek nuts, rich aromatic broth, South Sulawesi traditional soup, professional food styling, clean background, 4k",
  
  "nasi-padang": "Close-up food photography of nasi padang, steamed rice served with various Minangkabau dishes including rendang and gulai on banana leaf, West Sumatra rice plate, professional food styling, 4k",
  
  "ayam-taliwang": "Close-up food photography of ayam taliwang, Lombok spicy grilled chicken with fiery red chili paste coating, charcoal grilled, traditional Lombok dish, professional food styling, clean background, 4k",
  
  "papeda": "Close-up food photography of papeda, translucent sago porridge from Eastern Indonesia served with yellow fish soup, traditional Papuan food, professional food styling, clean background, 4k",
  
  "nasi-kucing": "Close-up food photography of nasi kucing, small Javanese rice portion with various side dishes on banana leaf, Indonesian street food, professional food styling, clean background, 4k",
  
  // Satay & Grilled
  "sate-padang": "Close-up food photography of sate padang, West Sumatran satay with thick yellow curry-like rice cake sauce, traditional Padang satay, professional food styling, clean background, studio lighting, 4k",
  
  "sate-klatak": "Close-up food photography of sate klatak, Yogyakarta goat satay on iron bicycle spoke skewers, simple seasoned grilled meat, traditional Jogja satay, professional food styling, 4k",
  
  "sate-madura": "Close-up food photography of sate madura, Madurese chicken satay skewers with rich sweet peanut sauce, charcoal grilled, most famous Indonesian satay, professional food styling, 4k",
  
  // Snacks
  "bakso-mercon": "Close-up food photography of bakso mercon, Indonesian meatball filled with spicy chili mixture, firecracker meatballs in beef broth, professional food styling, clean background, 4k",
  
  "martabak-manis": "Close-up food photography of martabak manis, thick fluffy Indonesian sweet pancake filled with chocolate sprinkles and cheese, street food dessert, professional food styling, clean background, 4k",
  
  "tahu-gejrot": "Close-up food photography of tahu gejrot, Cirebon fried tofu pieces with sweet sour spicy palm sugar sauce, traditional Cirebon street snack, professional food styling, clean background, 4k",
  
  "kerak-telor": "Close-up food photography of kerak telor, traditional Betawi egg crepe with glutinous rice and dried shrimp, Jakarta traditional snack, professional food styling, clean background, 4k",
  
  "kue-dadar-gulung": "Close-up food photography of dadar gulung, green pandan crêpes filled with sweet grated coconut and palm sugar, traditional Indonesian kue, professional food styling, clean background, 4k",
  
  "klepon": "Close-up foodography of klepon, green pandan rice balls filled with liquid palm sugar and coated in grated coconut, traditional Javanese sweet, professional food styling, 4k",
  
  "onde-onde": "Close-up food photography of onde-onde, sesame seed coated glutinous rice balls filled with sweet mung bean paste, deep fried golden, traditional Indonesian dessert, professional food styling, 4k",
  
  "nasi-uduk": "Close-up food photography of nasi uduk, fragrant Betawi coconut rice cooked with pandan leaves, Jakarta specialty rice, professional food styling, clean background, studio lighting, 4k",
  
  "empal-gentong": "Close-up food photography of empal gentong, Cirebon beef soup with thick curry-like broth from clay pot, traditional Cirebon dish, professional food styling, clean background, 4k",
  
  "tahu-sumedang": "Close-up food photography of tahu sumedang, famous West Javanese fried tofu with crispy golden skin and soft interior, Sumedang specialty, professional food styling, clean background, 4k",
  
  "martabak-telur": "Close-up food photography of martabak telur, Indonesian savory egg stuffed pancake with minced meat filling, crispy golden, professional food styling, clean background, 4k",
  
  // Drinks
  "es-cendol": "Close-up food photography of es cendol, Indonesian iced dessert drink with green pandan jelly noodles in coconut milk and palm sugar syrup, refreshing tropical drink, professional food styling, 4k",
  
  "wedang-ronde": "Close-up food photography of wedang ronde, Javanese warm ginger drink with glutinous rice balls filled with peanuts, traditional night market drink, professional food styling, 4k",
  
  "jamu-kunyit-asam": "Close-up food photography of jamu kunyit asam, traditional Indonesian turmeric tamarind herbal drink, yellow-orange healthy beverage, professional food styling, clean background, 4k",
  
  // More dishes
  "bakmi-goreng": "Close-up food photography of bakmi goreng, Indonesian fried noodles with vegetables and sweet soy sauce, classic Indonesian noodle dish, professional food styling, clean background, 4k",
  
  "nasi-goreng-kampung": "Close-up food photography of nasi goreng kampung, traditional village-style Indonesian fried rice with bold spices, rustic fried rice, professional food styling, clean background, 4k",
  
  "bakso-sapi": "Close-up food photography of bakso sapi, springy Indonesian beef meatballs in clear broth with noodles, most popular Indonesian comfort food, professional food styling, clean background, 4k",
  
  "soto-ayam": "Close-up food photography of soto ayam, aromatic yellow Indonesian chicken soup with turmeric broth and shredded chicken, traditional comfort soup, professional food styling, 4k",
  
  "gado-gado": "Close-up food photography of gado-gado, Indonesian vegetable salad with rich peanut sauce dressing, blanched vegetables with tofu and tempeh, professional food styling, clean background, 4k",
  
  "opor-ayam": "Close-up food photography of opor ayam, Javanese chicken in white coconut milk curry, traditional Lebaran dish, professional food styling, clean background, studio lighting, 4k",
  
  "ayam-goreng": "Close-up food photography of ayam goreng, Indonesian deep-fried chicken with golden crispy skin, marinated in turmeric and spices, professional food styling, clean background, 4k",
  
  "tempeh-goreng": "Close-up food photography of tempeh goreng, Indonesian deep-fried tempeh slices golden and crispy, traditional soybean cake, professional food styling, clean background, 4k",
  
  "tahu-goreng": "Close-up food photography of tahu goreng, golden deep-fried Indonesian tofu, crispy outside soft inside, professional food styling, clean background, 4k",
  
  "sambal-terasi": "Close-up food photography of sambal terasi, Indonesian chili sauce with shrimp paste, fiery red condiment in mortar, professional food styling, clean background, 4k",
  
  "nasi-pecel": "Close-up food photography of nasi pecel, Javanese rice topped with blanched vegetables and spicy peanut sauce, traditional East Java dish, professional food styling, 4k",
  
  "bakso-ayam": "Close-up food photography of bakso ayam, Indonesian chicken meatballs in clear broth with noodles and vegetables, lighter version of bakso, professional food styling, 4k",
};

// Generate image for a single recipe
function generateImage(slug, prompt) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(IMAGES_DIR, `${slug}.jpg`);
    
    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      if (stats.size > 10000) { // At least 10KB
        return resolve({ status: 'exists', slug });
      }
    }

    const data = JSON.stringify({ prompt });
    
    const options = {
      hostname: 'api.cloudflare.com',
      path: CF_AI_ENDPOINT,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 60000
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        try {
          const json = JSON.parse(buffer.toString());
          if (json.success === false) {
            reject(new Error(json.errors?.[0]?.message || 'API error'));
            return;
          }
        } catch (e) {
          // It's image data, save it
          fs.writeFileSync(outputPath, buffer);
          resolve({ status: 'generated', slug });
          return;
        }
        reject(new Error('Unexpected response'));
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.write(data);
    req.end();
  });
}

// Main
async function main() {
  console.log('========================================');
  console.log('🍳 NusantaraEats Recipe Image Generator');
  console.log('========================================\n');
  
  const slugs = Object.keys(recipePrompts);
  console.log(`📸 Generating ${slugs.length} unique food images...\n`);
  
  // Ensure images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  
  let success = 0;
  let exists = 0;
  let failed = 0;
  
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const prompt = recipePrompts[slug];
    
    console.log(`[${i + 1}/${slugs.length}] ${slug}`);
    console.log(`  Prompt: ${prompt.substring(0, 60)}...`);
    
    try {
      const result = await generateImage(slug, prompt);
      if (result.status === 'generated') {
        console.log(`  ✅ Generated!`);
        success++;
      } else {
        console.log(`  ⏭️  Already exists`);
        exists++;
      }
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      failed++;
    }
    
    // Wait 2 seconds between calls to avoid rate limiting
    if (i < slugs.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  // Summary
  console.log('\n========================================');
  console.log('📊 SUMMARY');
  console.log('========================================');
  console.log(`✅ Generated: ${success}`);
  console.log(`⏭️  Already existed: ${exists}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📁 Total images: ${success + exists}`);
  console.log('========================================\n');
  
  // List all generated images
  const images = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.endsWith('.jpg'))
    .map(f => f.replace('.jpg', ''));
  
  console.log('📋 All recipe images:');
  images.forEach(img => console.log(`  - ${img}.jpg`));
}

main().catch(console.error);
