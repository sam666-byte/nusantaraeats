const https = require('https');
const fs = require('fs');
const path = require('path');

const CF_API_TOKEN = 'cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728';
const CF_ACCOUNT_ID = '243dd09cf194815c3fce5ce09528167c';

// Get slugs of new recipes that need images
function getNewRecipeSlugs() {
  const content = fs.readFileSync('src/data/recipes.ts', 'utf8');
  const slugs = [];
  
  // Find all slugs with ID >= 263
  const regex = /id:\s*(\d+),[\s\S]*?slug:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = parseInt(match[1]);
    const slug = match[2];
    if (id >= 263) {
      slugs.push({ id, slug });
    }
  }
  return slugs;
}

// Generate image for a single recipe
async function generateImage(slug) {
  const outputPath = path.join(__dirname, 'public/images', `${slug}.jpg`);
  
  if (fs.existsSync(outputPath)) {
    return { status: 'exists', slug };
  }

  // Create a descriptive prompt based on slug
  const name = slug.replace(/-/g, ' ');
  const prompt = `Close-up food photography of ${name}, Indonesian traditional dish, professional food styling, clean background, no people, studio lighting, appetizing, 4k`;
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ prompt });
    
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 30000
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
          // It's image data
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
  const slugs = getNewRecipeSlugs();
  console.log(`Found ${slugs.length} new recipes needing images`);
  
  // Check which ones already have images
  const needImages = slugs.filter(s => !fs.existsSync(path.join(__dirname, 'public/images', `${s.slug}.jpg`)));
  console.log(`Need to generate: ${needImages.length} images`);
  
  // Generate first 10 as batch
  const batch = needImages.slice(0, 10);
  let success = 0;
  let failed = 0;
  
  for (const { slug } of batch) {
    try {
      await generateImage(slug);
      console.log(`✓ ${slug}`);
      success++;
      // Wait 2 seconds between calls
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`✗ ${slug}: ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\nBatch complete: ${success} generated, ${failed} failed`);
  console.log(`Remaining: ${needImages.length - batch.length} images to generate`);
}

main().catch(console.error);
