const https = require('https');
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'public/images');

// Search terms for Wikimedia Commons
const wikiTerms = {
  'kue-cucur':               'kue cucur indonesia',
  'es-pisang-ior':           'pisang ijo makassar',
  'nasi-bebek-bengil':       'bebek goreng crispy bali',
  'ikan-bakar-woku':         'ikan woku manado',
  'es-sop-buah':             'sop buah indonesia',
  'soto-betawi-original':    'soto betawi indonesia',
  'kue-lemper-ayam':         'lemper ayam indonesia',
  'es-alpukat-kopi':         'es alpukat indonesia',
  'nasi-goreng-petai-stink': 'nasi goreng petai',
  'kue-cara-birambi':        'kue cara indonesia',
  'martabak-mie':            'martabak telor indonesia',
  'tahu-tek-tek':            'tahu tek surabaya',
  'es-rujak':                'rujak indonesia',
  'ayam-rica-rica-premium':  'rica rica ayam',
  'nasi-kuning-premium':     'nasi kuning indonesia',
  'rendang-wagyu':           'rendang daging indonesia',
  'bakso-wagyu':             'bakso indonesia',
  'es-matcha-alpukat':       'matcha drink',
  'sop-buntut-truffle':      'sop buntut indonesia',
  'nasi-goreng-truffle':     'nasi goreng indonesia',
  'martabak-tiramisu':       'martabak manis indonesia',
};

function apiGet(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'NusantaraEats/1.0' } }, res => {
      let d = ''; res.on('data', x => d += x);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    }).on('error', () => resolve(null));
  });
}

async function findWikiImage(searchTerm) {
  // Step 1: search Commons for matching files
  const searchUrl = 'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=' +
    encodeURIComponent(searchTerm) + '&srnamespace=6&format=json&srlimit=5';
  const searchRes = await apiGet(searchUrl);
  if (!searchRes?.query?.search?.length) return null;

  // Pick first result
  const title = searchRes.query.search[0].title;

  // Step 2: get image URL
  const infoUrl = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' +
    encodeURIComponent(title) + '&prop=imageinfo&iiprop=url&iilimit=1&format=json';
  const infoRes = await apiGet(infoUrl);
  if (!infoRes?.query?.pages) return null;

  const pages = Object.values(infoRes.query.pages);
  return pages[0]?.imageinfo?.[0]?.url || null;
}

function dl(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'NusantaraEats/1.0' } }, res => {
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
  const entries = Object.entries(wikiTerms);
  let done = 0, failed = [];

  for (let i = 0; i < entries.length; i++) {
    const [slug, term] = entries[i];
    const dest = path.join(OUT, slug + '.jpg');
    process.stdout.write('[' + (i+1) + '/' + entries.length + '] ' + slug + ' ... ');

    try {
      const imgUrl = await findWikiImage(term);
      if (!imgUrl) throw new Error('not found on Wikimedia');
      await dl(imgUrl, dest);
      const size = fs.statSync(dest).size;
      if (size < 5000) { fs.unlinkSync(dest); throw new Error('too small'); }
      console.log('OK (' + Math.round(size/1024) + 'KB) <- ' + imgUrl.split('/').pop().substring(0,40));
      done++;
    } catch(e) {
      console.log('FAIL: ' + e.message);
      failed.push(slug);
    }
    await sleep(500);
  }

  console.log('\nDone:', done, '| Failed:', failed.length);
  if (failed.length) console.log('Failed:', failed);
}

main().catch(console.error);
