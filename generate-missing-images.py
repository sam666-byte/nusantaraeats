#!/usr/bin/env python3
"""Generate missing recipe images using Cloudflare AI API"""
import re
import os
import sys
import time
import json
import urllib.request
import urllib.error
from PIL import Image
from io import BytesIO

API_URL = "https://api.cloudflare.com/client/v4/accounts/243dd09cf194815c3fce5ce09528167c/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0"
API_TOKEN = "cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728"
PROMPT_TEMPLATE = "Close-up food photography of {dish_name}, Indonesian traditional food, professional food styling, clean background, no people, studio lighting, appetizing, 4k"

def get_dish_name(slug):
    """Convert slug to readable dish name"""
    return slug.replace('-', ' ').title()

def generate_image(slug, max_retries=3):
    """Generate image for a recipe slug"""
    dish_name = get_dish_name(slug)
    prompt = PROMPT_TEMPLATE.format(dish_name=dish_name)
    
    output_path = f"public/images/{slug}.jpg"
    
    for attempt in range(max_retries):
        try:
            data = json.dumps({"prompt": prompt}).encode('utf-8')
            req = urllib.request.Request(
                API_URL,
                data=data,
                headers={
                    'Authorization': f'Bearer {API_TOKEN}',
                    'Content-Type': 'application/json'
                }
            )
            
            with urllib.request.urlopen(req, timeout=120) as response:
                png_data = response.read()
            
            # Convert PNG to JPG
            img = Image.open(BytesIO(png_data))
            img = img.convert('RGB')
            img.save(output_path, 'JPEG', quality=85)
            
            return True
            
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait_time = 30 * (attempt + 1)
                print(f"  Rate limited, waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"  HTTP Error {e.code}: {e.reason}")
                time.sleep(5)
        except Exception as e:
            print(f"  Error: {e}")
            time.sleep(5)
    
    return False

def main():
    # Get all slugs from recipes.ts
    with open('src/data/recipes.ts', 'r') as f:
        content = f.read()
    
    slugs = re.findall(r'slug:\s*"([^"]+)"', content)
    unique_slugs = list(dict.fromkeys(slugs))
    
    # Find missing images
    missing = [s for s in unique_slugs if not os.path.exists(f'public/images/{s}.jpg')]
    
    print(f"Total unique slugs: {len(unique_slugs)}")
    print(f"Missing images: {len(missing)}")
    print()
    
    # Generate missing images
    success = 0
    failed = 0
    
    for i, slug in enumerate(missing):
        print(f"[{i+1}/{len(missing)}] Generating: {slug}")
        
        if generate_image(slug):
            print(f"  ✓ Success")
            success += 1
        else:
            print(f"  ✗ Failed")
            failed += 1
        
        # Small delay between requests to avoid rate limiting
        if i < len(missing) - 1:
            time.sleep(2)
    
    print()
    print(f"Results: {success} success, {failed} failed out of {len(missing)}")

if __name__ == '__main__':
    main()
