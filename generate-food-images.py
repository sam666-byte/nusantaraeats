#!/usr/bin/env python3
"""
Generate unique food images for each recipe using Pexels API
"""
import requests
import json
import os
from pathlib import Path

# Pexels API Key (free tier: 200 requests/hour)
PEXELS_API_KEY = os.environ.get('PEXELS_API_KEY', '')

# Create images directory
IMAGES_DIR = Path('./public/images/food')
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Recipe to search query mapping
# Each recipe gets a UNIQUE search query for its image
recipe_queries = {
    # Main Dishes
    "ayam-betutu": "balinese chicken wrapped banana leaf",
    "pempek-palembang": "indonesian fish cake",
    "gudeg": "jackfruit stew indonesian",
    "coto-makassar": "indonesian beef soup bowl",
    "mie-aceh": "aceh spicy noodles bowl",
    "sate-lilit": "balinese satay lemongrass",
    "tinutuan": "manado porridge bowl",
    "nasi-jinggo": "indonesian rice packet banana leaf",
    "ikan-bakar-woku": "manado grilled fish banana leaf",
    "karedok": "indonesian raw vegetable salad peanut sauce",
    "kambing-guling": "indonesian roast whole lamb",
    "nasi-kunyit": "indonesian yellow rice turmeric",
    "babi-guling": "balinese roast suckling pig",
    "lawar": "balinese mixed vegetable dish",
    "sop-konro": "makassar beef rib soup dark",
    "nasi-padang": "minangkabau rice plate rendang",
    "ayam-taliwang": "lombok spicy grilled chicken",
    "papeda": "sago porridge eastern indonesia",
    "nasi-kucing": "small indonesian rice portion",
    
    # Satay & Grilled
    "sate-padang": "padang satay thick sauce",
    "sate-klatak": "yogyakarta goat satay iron skewer",
    "sate-madura": "madurese chicken satay peanut sauce",
    
    # Snacks
    "bakso-mercon": "indonesian chili meatball",
    "martabak-manis": "indonesian thick sweet pancake chocolate",
    "tahu-gejrot": "cirebon fried tofu spicy sauce",
    "kerak-telor": "betawi egg crepe traditional",
    "kue-dadar-gulung": "green coconut crepe indonesian",
    "klepon": "green rice ball palm sugar coconut",
    "onde-onde": "sesame ball indonesian dessert",
    "nasi-uduk": "coconut rice betawi jakarta",
    "empal-gentong": "cirebon beef soup clay pot",
    "tahu-sumedang": "sumedang fried tofu crispy",
    "martabak-telur": "indonesian savory egg pancake",
    
    # Drinks
    "es-cendol": "indonesian iced cendol coconut milk",
    "wedang-ronde": "javanese ginger rice ball drink",
    "jamu-kunyit-asam": "indonesian turmeric tamarind drink",
    
    # More dishes
    "bakmi-goreng": "indonesian fried noodles",
    "nasi-goreng-kampung": "village style indonesian fried rice",
    "bakso-sapi": "indonesian beef meatball soup",
    "soto-ayam": "indonesian chicken soup yellow turmeric",
    "gado-gado": "indonesian vegetable salad peanut dressing",
    "opor-ayam": "javanese chicken coconut curry",
    "ayam-goreng": "indonesian fried chicken crispy",
    "tempeh-goreng": "indonesian fried tempeh",
    "tahu-goreng": "indonesian fried tofu golden",
    "sambal-terasi": "indonesian chili shrimp paste sauce",
    "nasi-pecel": "javanese rice peanut sauce vegetables",
    "bakso-ayam": "indonesian chicken meatball soup",
}

def search_pexels(query, per_page=1):
    """Search Pexels for food images"""
    if not PEXELS_API_KEY:
        print("⚠️  No PEXELS_API_KEY set. Using placeholder images.")
        return None
    
    headers = {
        'Authorization': PEXELS_API_KEY
    }
    params = {
        'query': query,
        'per_page': per_page,
        'orientation': 'landscape'
    }
    
    try:
        response = requests.get(
            'https://api.pexels.com/v1/search',
            headers=headers,
            params=params,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            if data.get('photos'):
                return data['photos'][0]['src']['large']
    except Exception as e:
        print(f"  Error searching: {e}")
    
    return None

def download_image(url, filename):
    """Download image from URL"""
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            filepath = IMAGES_DIR / filename
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"  Error downloading: {e}")
    return False

def generate_placeholder_image(slug, query):
    """Generate a simple placeholder SVG"""
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <rect fill="#1a1a1a" width="800" height="600"/>
  <text fill="#f59e0b" font-family="Georgia, serif" font-size="36" text-anchor="middle" x="400" y="280">{query.title()}</text>
  <text fill="#666" font-family="Arial" font-size="18" text-anchor="middle" x="400" y="340">nusantaraeats.com</text>
</svg>'''
    filepath = IMAGES_DIR / f'{slug}.svg'
    filepath.write_text(svg_content)
    return True

def main():
    print("=" * 60)
    print("🍳 NusantaraEats Food Image Generator")
    print("=" * 60)
    print(f"\n📸 Generating {len(recipe_queries)} unique food images...\n")
    
    results = {
        'success': [],
        'failed': [],
        'placeholder': []
    }
    
    for i, (slug, query) in enumerate(recipe_queries.items(), 1):
        print(f"[{i}/{len(recipe_queries)}] {slug}")
        print(f"  Query: {query}")
        
        # Try Pexels first
        image_url = search_pexels(query)
        
        if image_url:
            filename = f'{slug}.jpg'
            if download_image(image_url, filename):
                print(f"  ✅ Downloaded: {filename}")
                results['success'].append(slug)
            else:
                print(f"  ⚠️  Download failed, using placeholder")
                generate_placeholder_image(slug, query)
                results['placeholder'].append(slug)
        else:
            # Use placeholder
            generate_placeholder_image(slug, query)
            print(f"  📝 Generated placeholder SVG")
            results['placeholder'].append(slug)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    print(f"✅ Downloaded: {len(results['success'])}")
    print(f"📝 Placeholder: {len(results['placeholder'])}")
    print(f"❌ Failed: {len(results['failed'])}")
    print("=" * 60)
    
    # Save mapping for later use
    mapping = {}
    for slug in recipe_queries:
        if f'{slug}.jpg' in [f.name for f in IMAGES_DIR.glob('*.jpg')]:
            mapping[slug] = f'/images/food/{slug}.jpg'
        else:
            mapping[slug] = f'/images/food/{slug}.svg'
    
    with open('./public/images/food-mapping.json', 'w') as f:
        json.dump(mapping, f, indent=2)
    
    print(f"\n📁 Images saved to: {IMAGES_DIR}")
    print(f"📋 Mapping saved to: public/images/food-mapping.json")

if __name__ == '__main__':
    main()
