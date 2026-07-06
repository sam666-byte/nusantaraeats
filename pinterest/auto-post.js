const fs = require('fs');
const https = require('https');

// ============================================
// CONFIG - MASUKIN API TOKEN LO DI SINI
// ============================================
const PINTEREST_API_TOKEN = process.env.PINTEREST_API_TOKEN || 'MASUKIN_API_TOKEN_LO_DISINI';
const PINTEREST_BOARD_ID = process.env.PINTEREST_BOARD_ID || 'MASUKIN_BOARD_ID_DISINI';

// ============================================
// DATA PINS - SEMUA PIN YANG MAU DIPOST
// ============================================
const pins = [
  {
    title: "Authentic Rendang Recipe - World's Best Food",
    description: "Learn how to make authentic Minangkabau Rendang - slow-cooked beef in coconut milk. This recipe has been passed down for generations. Full step-by-step guide with ingredients list. #IndonesianFood #Rendang #FoodRecipe #AsianFood #CookingRecipe #BeefRecipe #SpicyFood #TraditionalFood",
    link: "https://nusantaraeats.com/recipes/rendang",
    image_url: "https://nusantaraeats.com/images/rendang.jpg",
    board_id: PINTEREST_BOARD_ID
  },
  {
    title: "Nasi Goreng Recipe - Indonesia's National Dish",
    description: "Make restaurant-quality Nasi Goreng at home! This authentic Indonesian fried rice recipe uses simple ingredients for incredible flavor. Easy to follow recipe. #NasiGoreng #IndonesianFood #FriedRice #EasyRecipe #AsianFood #QuickMeal",
    link: "https://nusantaraeats.com/recipes/nasi-goreng-kampung",
    image_url: "https://nusantaraeats.com/images/nasi-goreng-kampung.jpg",
    board_id: PINTEREST_BOARD_ID
  },
  {
    title: "Sate Madura Recipe - Best Indonesian Satay",
    description: "Grilled chicken skewers with rich peanut sauce - the most famous satay in Indonesia. Perfect for BBQ parties! #Satay #IndonesianFood #BBQ #ChickenRecipe #GrilledFood #PeanutSauce",
    link: "https://nusantaraeats.com/recipes/sate-madura",
    image_url: "https://nusantaraeats.com/images/sate-madura.jpg",
    board_id: PINTEREST_BOARD_ID
  },
  {
    title: "Gudeg Recipe - Yogyakarta's Signature Dish",
    description: "Sweet jackfruit stew from Java - a traditional dish that takes 8 hours to make but it's worth every minute! #Gudeg #IndonesianFood #TraditionalRecipe #JavaFood #SweetDish",
    link: "https://nusantaraeats.com/recipes/gudeg",
    image_url: "https://nusantaraeats.com/images/gudeg.jpg",
    board_id: PINTEREST_BOARD_ID
  },
  {
    title: "Soto Ayam Recipe - Traditional Chicken Soup",
    description: "Indonesia's most popular chicken soup - aromatic yellow broth with shredded chicken and fresh garnishes. Perfect comfort food! #SotoAyam #ChickenSoup #IndonesianFood #ComfortFood #SoupRecipe",
    link: "https://nusantaraeats.com/recipes/soto-ayam",
    image_url: "https://nusantaraeats.com/images/soto-ayam.jpg",
    board_id: PINTEREST_BOARD_ID
  },
  {
    title: "Bakso Recipe - Indonesian Meatballs",
    description: "Springy, bouncy beef meatballs in clear broth - Indonesia's most popular comfort food! #Bakso #Meatballs #IndonesianFood #ComfortFood #StreetFood",
    link: "https://nusantaraeats.com/recipes/bakso-sapi",
    image_url: "https://nusantaraeats.com/images/bakso-sapi.jpg",
    board_id: PINTEREST_BOARD_ID
  },
  {
    title: "Pempek Recipe - Palembang Fish Cake",
    description: "Savory fish cake from Palembang served with sweet and sour vinegar sauce. A must-try Indonesian delicacy! #Pempek #FishCake #IndonesianFood #Palembang #Seafood",
    link: "https://nusantaraeats.com/recipes/pempek-palembang",
    image_url: "https://nusantaraeats.com/images/pempek.jpg",
    board_id: PINTEREST_BOARD_ID
  },
  {
    title: "Martabak Manis - Sweet Indonesian Pancake",
    description: "Thick, fluffy sweet pancake filled with chocolate, cheese, and peanuts. Indonesia's favorite dessert! #Martabak #IndonesianFood #Dessert #SweetPancake #StreetFood",
    link: "https://nusantaraeats.com/recipes/martabak-manis",
    image_url: "https://nusantaraeats.com/images/martabak-manis-premium.jpg",
    board_id: PINTEREST_BOARD_ID
  },
  {
    title: "Es Cendol - Refreshing Indonesian Dessert Drink",
    description: "Green pandan jelly noodles in coconut milk with palm sugar syrup. The perfect tropical refreshment! #EsCendol #IndonesianDrink #CoconutMilk #DessertDrink #TropicalDrink",
    link: "https://nusantaraeats.com/recipes/es-cendol",
    image_url: "https://nusantaraeats.com/images/es-cendol-premium.jpg",
    board_id: PINTEREST_BOARD_ID
  },
  {
    title: "50+ Indonesian Dishes You Must Try",
    description: "Complete guide to Indonesian cuisine! From Rendang to Papeda, discover the diverse flavors of 17,000 islands. #IndonesianFood #FoodGuide #AsianFood #WorldCuisine #TravelFood",
    link: "https://nusantaraeats.com/blog/ultimate-indonesian-food-guide",
    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    board_id: PINTEREST_BOARD_ID
  }
];

// ============================================
// FUNCTION: POST PIN KE PINTEREST
// ============================================
async function postPin(pin) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      board_id: pin.board_id,
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
          if (res.statusCode === 201) {
            resolve({ success: true, id: result.id, pin: pin.title });
          } else {
            resolve({ success: false, error: result.message || 'Unknown error', pin: pin.title });
          }
        } catch (e) {
          resolve({ success: false, error: data, pin: pin.title });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ success: false, error: e.message, pin: pin.title });
    });

    req.write(postData);
    req.end();
  });
}

// ============================================
// FUNCTION: GET BOARD ID DARI USERNAME
// ============================================
async function getBoardId(username, boardName) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.pinterest.com',
      path: `/v5/boards/${username}/${boardName}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PINTEREST_API_TOKEN}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.id);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', (e) => resolve(null));
    req.end();
  });
}

// ============================================
// MAIN: POST SEMUA PINS
// ============================================
async function main() {
  console.log('========================================');
  console.log('🍳 NusantaraEats Pinterest Auto Poster');
  console.log('========================================\n');

  if (PINTEREST_API_TOKEN === 'MASUKIN_API_TOKEN_LO_DISINI') {
    console.log('❌ API Token belum diisi!');
    console.log('\nCara dapat API Token:');
    console.log('1. Buka https://developers.pinterest.com/');
    console.log('2. Login pakai akun Pinterest lo');
    console.log('3. Klik My apps → Create app');
    console.log('4. Isi app name: NusantaraEats');
    console.log('5. Website: nusantaraeats.com');
    console.log('6. Copy Access Token');
    console.log('\nSetelah dapat token, jalankan:');
    console.log('PINTEREST_API_TOKEN=token_lo node pinterest/auto-post.js');
    return;
  }

  console.log(`📤 Posting ${pins.length} pins ke Pinterest...\n`);

  const results = [];
  for (let i = 0; i < pins.length; i++) {
    const pin = pins[i];
    console.log(`[${i + 1}/${pins.length}] Posting: ${pin.title}...`);
    
    const result = await postPin(pin);
    results.push(result);
    
    if (result.success) {
      console.log(`  ✅ Success! Pin ID: ${result.id}`);
    } else {
      console.log(`  ❌ Failed: ${result.error}`);
    }

    // Delay 2 detik antar post biar ga kena rate limit
    if (i < pins.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Summary
  console.log('\n========================================');
  console.log('📊 SUMMARY');
  console.log('========================================');
  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('========================================\n');
}

// Run
main();
