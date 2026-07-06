const https = require('https');

// ============================================
// CONFIG - PINTEREST API TOKEN
// ============================================
const PINTEREST_API_TOKEN = process.env.PINTEREST_API_TOKEN || 'YOUR_PINTEREST_API_TOKEN_HERE';

// ============================================
// 25 PINS YANG MENARIK + INFORMATIF
// ============================================
const pins = [
  // === MAIN DISHES ===
  {
    title: "Rendang Recipe - World's #1 Most Delicious Food",
    description: "Authentic Minangkabau Rendang - slow-cooked beef in coconut milk for 4 hours. Voted world's best food by CNN! Full recipe with step-by-step photos. #Rendang #IndonesianFood #BeefRecipe #WorldBestFood #CookingRecipe",
    link: "https://nusantaraeats.com/recipes/rendang",
    image_url: "https://nusantaraeats.com/images/rendang.jpg"
  },
  {
    title: "Nasi Goreng - Indonesia's National Dish",
    description: "Make authentic Nasi Goreng at home in 15 minutes! Easy recipe with simple ingredients. The ultimate Indonesian fried rice. #NasiGoreng #IndonesianFood #FriedRice #EasyRecipe #QuickMeal",
    link: "https://nusantaraeats.com/recipes/nasi-goreng-kampung",
    image_url: "https://nusantaraeats.com/images/nasi-goreng-kampung.jpg"
  },
  {
    title: "Gudeg - 8 Hours Slow-Cooked Jackfruit Stew",
    description: "Yogyakarta's iconic dish! Sweet young jackfruit stewed in coconut milk and palm sugar. Takes time but worth every minute! #Gudeg #IndonesianFood #TraditionalRecipe #JavaFood",
    link: "https://nusantaraeats.com/recipes/gudeg",
    image_url: "https://nusantaraeats.com/images/gudeg.jpg"
  },
  {
    title: "Ayam Betutu - Traditional Balinese Chicken",
    description: "Authentic Balinese ceremonial chicken stuffed with rich spice paste, wrapped in banana leaves, and slow-cooked for 6 hours. #AyamBetutu #BalineseFood #IndonesianFood #CeremonialDish",
    link: "https://nusantaraeats.com/recipes/ayam-betutu",
    image_url: "https://nusantaraeats.com/images/ayam-betutu.jpg"
  },
  {
    title: "Nasi Padang - The Famous Minang Rice Plate",
    description: "Experience the authentic Nasi Padang dining style! Steamed rice served with rendang, gulai, and spicy sambal. #NasiPadang #WestSumatra #IndonesianFood #RicePlate",
    link: "https://nusantaraeats.com/recipes/nasi-padang",
    image_url: "https://nusantaraeats.com/images/nasi-padang.jpg"
  },

  // === SATAY & GRILLED ===
  {
    title: "Sate Madura - The Best Satay in Indonesia",
    description: "Charcoal-grilled chicken skewers with rich, sweet peanut sauce. Madura island's most famous export! #SateMadura #Satay #IndonesianFood #BBQ #GrilledChicken",
    link: "https://nusantaraeats.com/recipes/sate-madura",
    image_url: "https://nusantaraeats.com/images/sate-madura.jpg"
  },
  {
    title: "Ayam Taliwang - Lombok's Spicy Grilled Chicken",
    description: "Fiery grilled chicken from Lombok island! Marinated in a spicy chili paste and grilled over charcoal. #AyamTaliwang #Lombok #SpicyFood #GrilledChicken #IndonesianFood",
    link: "https://nusantaraeats.com/recipes/ayam-taliwang",
    image_url: "https://nusantaraeats.com/images/ayam-taliwang.jpg"
  },
  {
    title: "Sate Lilit - Balinese Fish Satay on Lemongrass",
    description: "Unique Balinese satay! Minced fish wrapped around lemongrass stalks with aromatic spices. #SateLilit #BaliFood #IndonesianFood #FishRecipe #GrilledFood",
    link: "https://nusantaraeats.com/recipes/sate-lilit",
    image_url: "https://nusantaraeats.com/images/sate-lilit.jpg"
  },
  {
    title: "Babi Guling - Bali's Famous Roast Suckling Pig",
    description: "The most famous Balinese dish! Whole suckling pig stuffed with spices and roasted over coconut husks until crispy. #BabiGuling #BalineseFood #IndonesianFood #RoastPig",
    link: "https://nusantaraeats.com/recipes/babi-guling",
    image_url: "https://nusantaraeats.com/images/babi-guling.jpg"
  },

  // === SOUPS ===
  {
    title: "Soto Ayam - Indonesia's Comfort Chicken Soup",
    description: "Aromatic yellow chicken soup with turmeric, lemongrass, and fresh garnishes. The ultimate comfort food! #SotoAyam #ChickenSoup #IndonesianFood #ComfortFood #SoupRecipe",
    link: "https://nusantaraeats.com/recipes/soto-ayam",
    image_url: "https://nusantaraeats.com/images/soto-ayam.jpg"
  },
  {
    title: "Coto Makassar - Rich Beef Soup from South Sulawesi",
    description: "Authentic Makassar beef soup with roasted peanuts and aromatic spices. A beloved breakfast dish! #CotoMakassar #IndonesianFood #BeefSoup #Makassar #Breakfast",
    link: "https://nusantaraeats.com/recipes/coto-makassar",
    image_url: "https://nusantaraeats.com/images/coto-makassar.jpg"
  },
  {
    title: "Sop Konro - Dark Beef Rib Soup with Kluwek",
    description: "Unique Makassar soup! Beef ribs in a dark broth flavored with kluwek nuts. Rich and flavorful! #SopKonro #IndonesianFood #BeefRibs #Makassar #UniqueFood",
    link: "https://nusantaraeats.com/recipes/sop-konro",
    image_url: "https://nusantaraeats.com/images/sop-konro.jpg"
  },

  // === SNACKS & STREET FOOD ===
  {
    title: "Bakso - Indonesia's Most Popular Meatball Soup",
    description: "Springy beef meatballs in clear broth! Indonesia's #1 street food. Easy recipe for home cooks. #Bakso #Meatballs #IndonesianFood #StreetFood #ComfortFood",
    link: "https://nusantaraeats.com/recipes/bakso-sapi",
    image_url: "https://nusantaraeats.com/images/bakso-sapi.jpg"
  },
  {
    title: "Pempek - Palembang's Famous Fish Cake",
    description: "Savory fish cake from Palembang served with sweet & sour vinegar sauce. A 500-year-old recipe! #Pempek #FishCake #IndonesianFood #Palembang #TraditionalFood",
    link: "https://nusantaraeats.com/recipes/pempek-palembang",
    image_url: "https://nusantaraeats.com/images/pempek.jpg"
  },
  {
    title: "Martabak Manis - The Ultimate Sweet Pancake",
    description: "Thick, fluffy Indonesian pancake filled with chocolate, cheese, and condensed milk. Pure dessert heaven! #MartabakManis #IndonesianDessert #SweetPancake #StreetFood",
    link: "https://nusantaraeats.com/recipes/martabak-manis",
    image_url: "https://nusantaraeats.com/images/martabak-manis-premium.jpg"
  },
  {
    title: "Tahu Gejrot - Cirebon's Spicy Tofu Snack",
    description: "Crispy fried tofu drenched in sweet, sour & spicy palm sugar sauce. Addictive street food! #TahuGejrot #Cirebon #IndonesianFood #StreetFood #TofuRecipe",
    link: "https://nusantaraeats.com/recipes/tahu-gejrot",
    image_url: "https://nusantaraeats.com/images/tahu-gejrot.jpg"
  },

  // === DRINKS ===
  {
    title: "Es Cendol - Refreshing Indonesian Dessert Drink",
    description: "Green pandan jelly noodles in coconut milk with palm sugar syrup over ice. The perfect tropical treat! #EsCendol #IndonesianDrink #DessertDrink #CoconutMilk #TropicalDrink",
    link: "https://nusantaraeats.com/recipes/es-cendol",
    image_url: "https://nusantaraeats.com/images/es-cendol-premium.jpg"
  },
  {
    title: "Wedang Ronde - Warm Ginger Rice Ball Drink",
    description: "Traditional Javanese drink! Glutinous rice balls with peanut filling in spicy ginger broth. #WedangRonde #JavaneseFood #IndonesianDrink #GingerDrink #ComfortDrink",
    link: "https://nusantaraeats.com/recipes/wedang-ronde",
    image_url: "https://nusantaraeats.com/images/wedang-ronde.jpg"
  },

  // === CAKES & DESSERTS ===
  {
    title: "Klepon - Green Rice Balls with Palm Sugar",
    description: "Pandan-flavored rice balls filled with liquid palm sugar and coated in grated coconut. Burst of sweetness! #Klepon #IndonesianCake #TraditionalCake #Pandan #Dessert",
    link: "https://nusantaraeats.com/recipes/klepon",
    image_url: "https://nusantaraeats.com/images/klepon.jpg"
  },
  {
    title: "Dadar Gulung - Green Coconut Crêpes",
    description: "Vibrant green crêpes filled with sweet coconut and palm sugar. A classic Indonesian kue! #DadarGulung #IndonesianCake #CoconutDessert #TraditionalCake",
    link: "https://nusantaraeats.com/recipes/kue-dadar-gulung",
    image_url: "https://nusantaraeats.com/images/dadar-gulung.jpg"
  },

  // === FOOD GUIDES ===
  {
    title: "50+ Indonesian Dishes You MUST Try!",
    description: "Ultimate guide to Indonesian cuisine! From Rendang to Papeda - discover 17,000 islands of flavor. #IndonesianFood #FoodGuide #AsianFood #WorldCuisine #TravelFood",
    link: "https://nusantaraeats.com/blog/ultimate-indonesian-food-guide",
    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
  },
  {
    title: "Indonesian Street Food Tour - 30 Must-Try Eats",
    description: "Experience the vibrant street food culture of Indonesia! From Bakso carts to Martabak vendors. #IndonesianStreetFood #StreetFoodTour #FoodTour #AsianStreetFood",
    link: "https://nusantaraeats.com/blog/indonesian-street-food-guide",
    image_url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80"
  },
  {
    title: "Essential Indonesian Spice Guide",
    description: "Master the aromatic world of Indonesian spices! Lemongrass, galangal, turmeric & more. #IndonesianSpices #CookingTips #AsianCooking #SpiceGuide #CookingBasics",
    link: "https://nusantaraeats.com/blog/indonesian-spice-guide",
    image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80"
  }
];

// ============================================
// POST PIN KE PINTEREST
// ============================================
async function postPin(pin, index) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      title: pin.title,
      description: pin.description,
      link: pin.link,
      image_url: pin.image_url
    });

    const options = {
      hostname: 'api.pinterest.com',
      path: '/v5/pins',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINTEREST_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ 
            success: res.statusCode === 201, 
            status: res.statusCode,
            id: result.id || null,
            error: result.message || null,
            index: index 
          });
        } catch (e) {
          resolve({ success: false, status: res.statusCode, error: data, index });
        }
      });
    });

    req.on('error', (e) => resolve({ success: false, error: e.message, index }));
    req.write(postData);
    req.end();
  });
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('========================================');
  console.log('🍳 NusantaraEats Pinterest Auto Poster');
  console.log('========================================\n');
  console.log(`📤 Posting ${pins.length} pins to Pinterest...\n`);

  const results = [];
  
  for (let i = 0; i < pins.length; i++) {
    const pin = pins[i];
    console.log(`[${i + 1}/${pins.length}] ${pin.title.substring(0, 45)}...`);
    
    const result = await postPin(pin, i);
    results.push(result);
    
    if (result.success) {
      console.log(`  ✅ Posted! Pin ID: ${result.id}`);
    } else {
      console.log(`  ❌ Failed (${result.status}): ${result.error}`);
    }

    // Delay 1.5s antar post
    if (i < pins.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Summary
  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n========================================');
  console.log('📊 SUMMARY');
  console.log('========================================');
  console.log(`✅ Posted: ${success}/${pins.length}`);
  console.log(`❌ Failed: ${failed}/${pins.length}`);
  console.log('========================================\n');

  if (failed > 0) {
    console.log('Failed pins:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - Pin #${r.index + 1}: ${r.error}`);
    });
  }
}

main();
