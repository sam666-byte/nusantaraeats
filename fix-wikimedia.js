const https = require('https');
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'public/images');

// Direct Wikimedia URLs for specific Indonesian foods
// Using known good Wikimedia Commons images
const wikiImages = {
  'kue-cucur':            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kue_cucur.jpg/800px-Kue_cucur.jpg',
  'es-pisang-ior':        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Pisang_ijo.jpg/800px-Pisang_ijo.jpg',
  'nasi-bebek-bengil':    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Bebek_goreng_crispy.jpg/800px-Bebek_goreng_crispy.jpg',
  'ikan-bakar-woku':      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Woku_ikan_nike.JPG/800px-Woku_ikan_nike.JPG',
  'es-sop-buah':          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sop_buah.jpg/800px-Sop_buah.jpg',
  'soto-betawi-original': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Soto_betawi.jpg/800px-Soto_betawi.jpg',
  'kue-lemper-ayam':      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Lemper_ayam.jpg/800px-Lemper_ayam.jpg',
  'es-alpukat-kopi':      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Alpukat_kopi.jpg/800px-Alpukat_kopi.jpg',
  'nasi-goreng-petai-stink': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Nasi_goreng_petai.jpg/800px-Nasi_goreng_petai.jpg',
  'kue-cara-birambi':     'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Kue_cara_bikang.jpg/800px-Kue_cara_bikang.jpg',
  'martabak-mie':         'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Martabak_telor.jpg/800px-Martabak_telor.jpg',
  'tahu-tek-tek':         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Tahu_tek.jpg/800px-Tahu_tek.jpg',
  'es-rujak':             'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Rujak_cingur.jpg/800px-Rujak_cingur.jpg',
  'ayam-rica-rica-premium': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Rica-rica_ayam.jpg/800px-Rica-rica_ayam.jpg',
  'nasi-kuning-premium':  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Nasi_kuning.jpg/800px-Nasi_kuning.jpg',
  'rendang-wagyu':        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Beef_Rendang.jpg/800px-Beef_Rendang.jpg',
  'bakso-wagyu':          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Bakso_kuah.jpg/800px-Bakso_kuah.jpg',
  'es-matcha-alpukat':    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Matcha_latte.jpg/800px-Matcha_latte.jpg',
  'sop-buntut-truffle':   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Sop_buntut.jpg/800px-Sop_buntut.jpg',
  'nasi-goreng-truffle':  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nasi_goreng_Indonesia.jpg/800px-Nasi_goreng_Indonesia.jpg',
  'martabak-tiramisu':    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Martabak_manis.jpg/800px-Martabak_manis.jpg',
};

// Fallback: search Wikimedia for food image if direct URL 404s
function wikiSearch(term) {
  return new Promise(resolve => {
    const q = encodeURIComponent(term);
    const opts = {
      hostname: 'en.wikipedia.org',
      path: `/w/api.php?action=query&list=search&srsearch=${q}+food+indonesian&format=json&srlimit=1`,
    };
    https.get(opts, res => {
      let d = ''; res.on('data', x => d+=x);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function dl(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const mod = url.startsWith('https') ? https : require('http');
    mod.get(url, { headers: { 'User-Agent': 'NusantaraEats/1.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); try { fs.unlinkSync(dest); } catch(e) {}
        return dl(res.headers.location, dest).then(resolve).catch(reject);
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
  const slugs = Object.keys(wikiImages);
  let done = 0, failed = [];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const dest = path.join(OUT, slug + '.jpg');
    const url = wikiImages[slug];

    process.stdout.write('[' + (i+1) + '/' + slugs.length + '] ' + slug + ' ... ');
    try {
      await dl(url, dest);
      const size = fs.statSync(dest).size;
      if (size < 5000) { fs.unlinkSync(dest); throw new Error('too small'); }
      console.log('OK (' + Math.round(size/1024) + 'KB)');
      done++;
    } catch(e) {
      console.log('FAIL: ' + e.message);
      failed.push(slug);
    }
    await sleep(200);
  }

  console.log('\nDone:', done, '| Failed:', failed.length);
  if (failed.length) console.log('Failed:', failed);
}

main().catch(console.error);
