const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const PEXELS_KEY = 'cbdG0RojUuXsiSiSDunBWz5N1B16uVq6vaH2O1DVt3C4dF8oq5ftYtQD';
const OUT_DIR = path.join(__dirname, 'public/images');

// Search terms per slug — specific enough to get the right food
const searchTerms = {
  'rendang': 'rendang beef indonesian',
  'soto-betawi': 'soto betawi coconut soup indonesia',
  'rawon': 'rawon black soup beef java',
  'pempek': 'pempek palembang fish cake',
  'gudeg': 'gudeg jackfruit yogyakarta',
  'coto-makassar': 'coto makassar beef soup',
  'ayam-taliwang': 'ayam taliwang grilled chicken lombok',
  'papeda': 'papeda sago porridge maluku',
  'sate-madura': 'sate ayam satay chicken indonesia',
  'mie-aceh': 'mie aceh noodle spicy',
  'soto-betawi-asli': 'soto betawi indonesian soup',
  'nasi-goreng-kampung-malaysia': 'nasi goreng fried rice wok',
  'ayam-bakar-bumbu-rica': 'ayam rica rica grilled chicken spicy',
  'soto-lamongan': 'soto lamongan chicken soup yellow',
  'tahu-tek-tek': 'tahu tofu peanut sauce indonesia',
  'sop-iga-bakar': 'sop iga bakar beef rib soup',
  'kue-bolu-mekar': 'kue bolu steamed sponge cake',
  'nasi-goreng-kambing': 'nasi goreng kambing goat fried rice',
  'es-sop-kelapa': 'young coconut drink ice',
  'ayam-bakar-wangi': 'ayam bakar grilled chicken aromatic',
  'soto-lamongan-asli': 'soto lamongan chicken broth noodle',
  'tahu-tek': 'tahu telur egg tofu peanut java',
  'soto-banjar': 'soto banjar chicken soup borneo',
  'mie-goreng-seafood': 'mie goreng seafood fried noodle',
  'tempe-goreng-tepung': 'tempe mendoan fried tempeh crispy',
  'es-alpukat-kocok': 'es alpukat avocado ice drink',
  'nasi-goreng-seafood': 'nasi goreng seafood fried rice shrimp',
  'ayam-bakar-honey': 'honey grilled chicken glazed',
  'bakso-ayam': 'bakso ayam chicken meatball soup',
  'sate-lilit-ikan': 'sate lilit bali fish satay',
  'gado-gado-bali': 'gado gado peanut sauce salad bali',
  'nasi-goreng-kampung': 'nasi goreng kampung village fried rice',
  'es-teler-77': 'es teler coconut avocado mixed ice',
  'rawon-setan': 'rawon black beef soup dark',
  'nasi-campur-bali': 'nasi campur bali mixed rice',
  'es-buah': 'es buah mixed fruit ice indonesia',
  'sop-kaki-sapi': 'sop kaki sapi beef leg soup',
  'gado-gado-jakarta': 'gado gado jakarta peanut vegetable',
  'soto-mie': 'soto mie noodle soup bogor',
  'pisang-epe': 'pisang epe grilled banana makassar',
  'nasi-goreng-mawut': 'nasi goreng mie egg fried rice noodle',
  'es-martabak': 'martabak manis sweet pancake chocolate',
  'sop-buntut-bakar': 'sop buntut bakar grilled oxtail soup',
  'tahu-bulat': 'tahu bulat round fried tofu crispy',
  'es-cendol-jelly': 'es cendol coconut milk jelly drink',
  'sate-padang-kuah': 'sate padang satay yellow sauce minang',
  'nasi-goreng-petai': 'nasi goreng petai stink bean fried rice',
  'es-sop-buah': 'es sop buah mixed fruit soup ice',
  'ayam-bakar-padang': 'ayam bakar padang minang grilled chicken',
  'soto-ayam-bening': 'soto ayam clear chicken soup indonesia',
  'tahu-sumedang': 'tahu sumedang deep fried tofu crispy',
  'es-rujak': 'es rujak mixed spicy fruit ice',
  'bubur-ketan-hitam': 'bubur ketan hitam black rice porridge',
  'nasi-ayam-penyet': 'nasi ayam penyet smashed chicken rice',
  'sop-iga-sapi-bakar': 'sop iga sapi beef rib soup',
  'es-dawet': 'es dawet cendol coconut palm sugar',
  'nasi-ulam': 'nasi ulam herbs rice betawi',
  'sup-kambing-madura': 'sup kambing goat soup madura',
  'kue-serabi-kinca': 'kue serabi rice pancake coconut',
  'ayam-geprek-sambal-matah': 'ayam geprek smashed chicken sambal',
  'nasi-tumpeng-mini': 'nasi tumpeng cone yellow rice',
  'babi-panggang-karo': 'babi panggang pork roasted batak',
  'tahu-geprek-sambal': 'tahu geprek fried tofu smashed sambal',
  'es-pisang-ior': 'es pisang ior banana ice makassar',
  'kue-putu-ayu': 'kue putu ayu green pandan steamed',
  'nasi-goreng-merah': 'nasi goreng merah red fried rice',
  'nasi-goreng-pedas': 'nasi goreng pedas spicy fried rice',
  'kue-cara-birambi': 'kue cara birambi aceh traditional cake',
  'nasi-goreng-kambing-gulai': 'nasi goreng gulai goat fried rice curry',
  'es-teh-pelangi': 'rainbow tea ice layered colorful drink',
  'ayam-goreng-mentega': 'ayam goreng mentega butter fried chicken',
  'sup-konro-bakar': 'sup konro bakar grilled rib soup makassar',
  'nasi-ayam-geprek': 'nasi ayam geprek smashed chicken rice bowl',
  'es-jus-alpukat': 'es jus alpukat avocado juice milk',
  'soto-betawi-original': 'soto betawi original coconut milk soup',
  'kue-kue-citul': 'kue traditional indonesian snack rice',
  'es-kelapa-muda': 'young coconut fresh ice drink',
  'nasi-goreng-petai-stink': 'nasi goreng petai stink bean wok',
  'es-dawet-ayu': 'es dawet ayu traditional cendol green',
  'lotek': 'lotek peanut sauce vegetable salad bandung',
  'nasi-timbel': 'nasi timbel banana leaf sundanese rice',
  'sop-konro': 'sop konro beef rib soup black makassar',
  'gohu-ikan': 'gohu ikan tuna salad maluku',
  'nasi-bebek-bengil': 'nasi bebek bengil crispy duck bali',
  'ikan-bakar-woku': 'ikan bakar woku spicy fish manado',
  'karedok': 'karedok raw vegetable peanut sauce sundanese',
  'sop-buntut-madu': 'sop buntut madu honey oxtail soup',
  'nasi-uduk-cream': 'nasi uduk coconut rice jakarta betawi',
  'ayam-bakar-kecap': 'ayam bakar kecap sweet soy grilled chicken',
  'sop-buntut-bakar-premium': 'oxtail soup grilled beef premium',
  'nasi-goreng-seafood-premium': 'nasi goreng seafood premium shrimp squid',
  'ayam-betutu-premium': 'ayam betutu bali spiced chicken roasted',
  'sate-lilit-udang': 'sate lilit udang shrimp satay bali',
  'nasi-ayam-bakar-madu': 'nasi ayam bakar madu honey grilled chicken rice',
  'sop-conro-premium': 'sop konro conro beef rib soup premium',
  'gado-gado-premium': 'gado gado peanut sauce vegetable egg',
  'martabak-manis-premium': 'martabak manis sweet stuffed pancake',
  'es-cendol-premium': 'es cendol premium green jelly coconut milk',
  'nasi-tumpeng-premium': 'nasi tumpeng cone rice ceremony festive',
  'sate-padang-premium': 'sate padang minangkabau satay turmeric',
  'ayam-rica-rica-premium': 'ayam rica rica spicy chicken manado',
  'sop-saffron': 'saffron soup chicken broth premium',
  'nasi-kuning-premium': 'nasi kuning yellow turmeric rice festive',
  'rendang-wagyu': 'wagyu beef rendang dry curry premium',
  'bakso-wagyu': 'wagyu meatball soup premium beef',
  'es-matcha-alpukat': 'matcha green tea avocado ice drink',
  'ayam-bakar-truffle': 'truffle grilled chicken gourmet',
  'sop-buntut-truffle': 'truffle oxtail soup premium',
  'nasi-goreng-truffle': 'truffle fried rice gourmet premium',
  'martabak-tiramisu': 'martabak tiramisu sweet pancake cream',
  // already downloaded ones (will be skipped)
  'sop-konro-makassar': 'sop konro makassar beef rib black soup',
  'kue-lemper-ayam': 'lemper ayam chicken sticky rice',
  'sop-ayam-bening': 'sop ayam bening clear chicken soup',
  'ayam-bakar-hoisin': 'ayam bakar hoisin grilled chicken',
  'es-kacang-hijau': 'es kacang hijau mung bean ice',
  'sate-usus': 'sate usus intestine satay crispy',
  'es-alpukat-kopi': 'es alpukat kopi avocado coffee ice',
  'kue-cucur': 'kue cucur brown sugar cake fried',
  'martabak-mie': 'martabak mie noodle savory',
  'ayam-bakar-bumbu-rujak': 'ayam bakar bumbu rujak spicy chicken',
  'soto-betawi-kuah-susu': 'soto betawi milk coconut broth',
  'kue-mochi-ubi': 'mochi ubi purple yam rice cake',
  'ayam-penyet': 'ayam penyet smashed fried chicken sambal',
  'martabak-telur': 'martabak telur savory egg pancake',
  'ayam-bakar-bumbu-bali': 'ayam bakar bumbu bali balinese chicken',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch(e) {}
        return reject(new Error('HTTP ' + res.statusCode));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    });
    req.on('error', e => { try { fs.unlinkSync(dest); } catch(_){} reject(e); });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function pexelsSearch(query) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.pexels.com',
      path: '/v1/search?query=' + encodeURIComponent(query) + '&per_page=5&orientation=landscape',
      headers: { Authorization: PEXELS_KEY }
    };
    https.get(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const photos = json.photos || [];
          if (photos.length === 0) return resolve(null);
          resolve(photos[0].src.large);
        } catch(e) { resolve(null); }
      });
    }).on('error', reject);
  });
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const content = fs.readFileSync('src/data/recipes.ts', 'utf8');
  const blocks = content.split(/(?=\s*{\s*id:\s*\d+)/);
  const slugs = [];
  for (const block of blocks) {
    const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
    if (slug) slugs.push(slug);
  }

  let done = 0, skipped = 0, failed = [];

  for (const slug of slugs) {
    const dest = path.join(OUT_DIR, slug + '.jpg');
    if (fs.existsSync(dest)) {
      skipped++;
      continue;
    }

    const query = searchTerms[slug] || slug.replace(/-/g, ' ') + ' indonesian food';
    process.stdout.write('[' + (done+skipped+1) + '/' + slugs.length + '] ' + slug + ' ... ');

    try {
      const url = await pexelsSearch(query);
      if (!url) throw new Error('no results');
      await download(url, dest);
      const size = fs.statSync(dest).size;
      if (size < 5000) { fs.unlinkSync(dest); throw new Error('file too small'); }
      console.log('OK (' + Math.round(size/1024) + 'KB)');
      done++;
    } catch(e) {
      console.log('FAIL: ' + e.message);
      failed.push(slug);
    }

    await sleep(300); // respect rate limit
  }

  console.log('\n=== DONE ===');
  console.log('Downloaded:', done);
  console.log('Skipped (existed):', skipped);
  console.log('Failed:', failed.length, failed.length ? failed : '');
}

main().catch(console.error);
