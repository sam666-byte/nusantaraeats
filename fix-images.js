const fs = require('fs');
const https = require('https');
const path = require('path');

const PEXELS_KEY = 'cbdG0RojUuXsiSiSDunBWz5N1B16uVq6vaH2O1DVt3C4dF8oq5ftYtQD';
const OUT_DIR = path.join(__dirname, 'public/images');

// Only the ones that were wrong or NO_RESULTS - with better queries
const fixes = {
  // Wrong image - better queries
  'gudeg': 'gudeg nangka yogyakarta nasi jack fruit cooked',
  'coto-makassar': 'coto makassar bowl soup beef indonesian dark',
  'papeda': 'papeda sago white porridge fish yellow soup plate',
  'es-teler-77': 'es teler avocado coconut indonesian mixed ice dessert',
  'es-buah': 'es buah indonesian mixed fruit cocktail sweet ice',
  'pisang-epe': 'grilled banana sweet brown caramelized dessert',
  'tahu-bulat': 'fried tofu ball round crispy street food',
  'bubur-ketan-hitam': 'black glutinous rice porridge coconut milk purple',
  'es-dawet': 'cendol dawet green jelly coconut milk palm sugar drink',
  'kue-cucur': 'kue cucur fried brown sugar cake traditional round',
  'es-pisang-ior': 'banana milk ice sweet cold drink',
  'es-dawet-ayu': 'es cendol green jelly ice drink coconut',
  'nasi-bebek-bengil': 'crispy duck rice bali indonesian roasted',
  'ikan-bakar-woku': 'grilled fish spicy herb sauce whole fish plate',
  'es-sop-buah': 'fresh fruit salad mix colorful bowl ice dessert',
  'soto-betawi-original': 'soto betawi coconut milk soup bowl beef',
  'kue-lemper-ayam': 'lemper ayam sticky rice chicken banana leaf wrapped',
  'es-alpukat-kopi': 'avocado coffee drink layered green brown iced',
  'nasi-goreng-petai-stink': 'nasi goreng stink bean petai green fried rice',
  'kue-cara-birambi': 'indonesian traditional cake snack sweet colorful',
  'martabak-mie': 'martabak savory egg filled pancake crispy street food',
  'tahu-tek-tek': 'tahu tek peanut sauce tofu lontong egg plate java',
  'es-rujak': 'rujak buah spicy fruit salad peanut sauce indonesian',
  // NO_RESULTS - broader queries
  'ayam-rica-rica-premium': 'rica rica spicy red chicken manado indonesian',
  'sop-saffron': 'saffron golden broth soup bowl chicken premium',
  'nasi-kuning-premium': 'nasi kuning yellow rice turmeric cone festive',
  'rendang-wagyu': 'rendang dry beef curry dark rich spices premium',
  'bakso-wagyu': 'bakso meatball soup clear broth noodle premium beef',
  'es-matcha-alpukat': 'matcha green tea avocado ice cream layered drink',
  'ayam-bakar-truffle': 'grilled chicken premium gourmet restaurant plated',
  'sop-buntut-truffle': 'oxtail soup premium dark rich broth restaurant',
  'nasi-goreng-truffle': 'fried rice black truffle gourmet premium egg',
  'martabak-tiramisu': 'tiramisu pancake cream chocolate dessert sweet',
};

function pexelsSearch(query) {
  return new Promise((resolve) => {
    const opts = {
      hostname: 'api.pexels.com',
      path: '/v1/search?query=' + encodeURIComponent(query) + '&per_page=5&orientation=landscape',
      headers: { Authorization: PEXELS_KEY }
    };
    https.get(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data).photos || []); }
        catch(e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); try { fs.unlinkSync(dest); } catch(e) {}
        return reject(new Error('HTTP ' + res.statusCode));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', e => { try { fs.unlinkSync(dest); } catch(_){} reject(e); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const slugs = Object.keys(fixes);
  let done = 0, failed = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const query = fixes[slug];
    const dest = path.join(OUT_DIR, slug + '.jpg');

    process.stdout.write('[' + (i+1) + '/' + slugs.length + '] ' + slug + ' ... ');

    try {
      const photos = await pexelsSearch(query);
      if (!photos.length) throw new Error('no results');

      // pick best photo - prefer one with relevant alt text
      let picked = photos[0];
      for (const p of photos) {
        const alt = (p.alt || '').toLowerCase();
        const slugWords = slug.replace(/-/g,' ').split(' ');
        if (slugWords.some(w => w.length > 3 && alt.includes(w))) {
          picked = p; break;
        }
      }

      await download(picked.src.large, dest);
      const size = fs.statSync(dest).size;
      if (size < 5000) { fs.unlinkSync(dest); throw new Error('too small'); }
      console.log('OK (' + Math.round(size/1024) + 'KB) - ' + (picked.alt||'').substring(0,50));
      done++;
    } catch(e) {
      console.log('FAIL: ' + e.message);
      failed.push(slug);
    }
    await sleep(300);
  }

  console.log('\n=== DONE ===');
  console.log('Fixed:', done, '| Failed:', failed.length);
  if (failed.length) console.log('Failed:', failed);
}

main().catch(console.error);
