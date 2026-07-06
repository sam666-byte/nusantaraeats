#!/usr/bin/env python3
"""Scrape all recipes from live nusantaraeats.com and reconstruct recipes.ts"""
import urllib.request
import json
import re
import sys
import time

BASE = "https://nusantaraeats.com"

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode('utf-8', errors='replace')

def extract_recipe(html, slug):
    """Extract recipe data from HTML page"""
    # Extract JSON-LD
    match = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
    if not match:
        return None
    
    ld = json.loads(match.group(1))
    
    # Extract basic fields from page
    title_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
    title = title_match.group(1).strip() if title_match else ld.get('name', slug)
    
    desc_match = re.search(r'<p class="[^"]*text-gray[^"]*">(.*?)</p>', html, re.DOTALL)
    desc = desc_match.group(1).strip() if desc_match else ld.get('description', '')
    
    # Extract category
    cat_match = re.search(r'kategori:\s*["\']([^"\']+)["\']', html)
    kategori = cat_match.group(1) if cat_match else 'makanan-berat'
    
    # Extract origin
    origin_match = re.search(r'origin:\s*["\']([^"\']+)["\']', html)
    origin = origin_match.group(1) if origin_match else 'Indonesia'
    
    # Extract waktu
    waktu_match = re.search(r'waktu:\s*(\d+)', html)
    waktu = int(waktu_match.group(1)) if waktu_match else 30
    
    # Extract porsi
    porsi_match = re.search(r'porsi:\s*["\']([^"\']+)["\']', html)
    porsi = porsi_match.group(1) if porsi_match else '4 porsi'
    
    # Extract kesulitan
    kes_match = re.search(r'kesulitan:\s*["\']([^"\']+)["\']', html)
    kesulitan = kes_match.group(1) if kes_match else 'Medium'
    
    # Extract rating
    rating_match = re.search(r'rating:\s*([\d.]+)', html)
    rating = float(rating_match.group(1)) if rating_match else 4.5
    
    # Get ingredients from JSON-LD
    ingredients = ld.get('recipeIngredient', [])
    
    # Get instructions from JSON-LD
    instructions_raw = ld.get('recipeInstructions', [])
    instructions = []
    for inst in instructions_raw:
        if isinstance(inst, dict):
            instructions.append(inst.get('text', ''))
        elif isinstance(inst, str):
            instructions.append(inst)
    
    # Extract tips
    tips_match = re.search(r'tips["\']?\s*:\s*["\']([^"\']+)', html)
    tips = tips_match.group(1) if tips_match else ''
    
    # Extract image
    images = ld.get('image', [])
    image = images[0] if images else f'/images/{slug}.jpg'
    # Fix image URL to be relative
    if image.startswith('http'):
        image = f'/images/{slug}.jpg'
    
    # Extract ID
    id_match = re.search(r'id:\s*(\d+)', html)
    recipe_id = int(id_match.group(1)) if id_match else 0
    
    return {
        'id': recipe_id,
        'slug': slug,
        'title': title,
        'shortTitle': title.split(' Recipe:')[0] if ' Recipe:' in title else title,
        'description': desc,
        'image': image,
        'kategori': kategori,
        'waktu': waktu,
        'porsi': porsi,
        'kesulitan': kesulitan,
        'rating': rating,
        'origin': origin,
        'ingredients': ingredients,
        'instructions': instructions,
        'tips': tips,
    }

def recipe_to_ts(r):
    def s(v):
        if isinstance(v, str):
            return v.replace('\\', '\\\\').replace('"', '\\"')
        return str(v)
    
    lines = ['  {']
    lines.append(f'    id: {r["id"]},')
    lines.append(f'    slug: "{s(r["slug"])}",')
    lines.append(f'    title: "{s(r["title"])}",')
    lines.append(f'    shortTitle: "{s(r.get("shortTitle", r["slug"]))}",')
    lines.append(f'    description: "{s(r["description"])}",')
    lines.append(f'    image: "{s(r["image"])}",')
    lines.append(f'    kategori: "{r["kategori"]}",')
    lines.append(f'    waktu: {r["waktu"]},')
    lines.append(f'    porsi: "{s(r["porsi"])}",')
    lines.append(f'    kesulitan: "{r["kesulitan"]}",')
    lines.append(f'    rating: {r["rating"]},')
    lines.append(f'    origin: "{s(r["origin"])}",')
    lines.append(f'    ingredients: [')
    for i in r.get('ingredients', []):
        lines.append(f'      "{s(i)}",')
    lines.append(f'    ],')
    lines.append(f'    instructions: [')
    for i in r.get('instructions', []):
        lines.append(f'      "{s(i)}",')
    lines.append(f'    ],')
    if r.get('tips'):
        lines.append(f'    tips: "{s(r["tips"])}",')
    lines.append('  }')
    return '\n'.join(lines)

def main():
    # Get all recipe URLs from sitemap
    print("Fetching sitemap...")
    sitemap = fetch(f"{BASE}/sitemap.xml")
    urls = re.findall(r'<loc>([^<]*)</loc>', sitemap)
    recipe_urls = [u for u in urls if '/recipes/' in u and u != f'{BASE}/recipes']
    
    print(f"Found {len(recipe_urls)} recipe URLs")
    
    recipes = []
    failed = []
    
    for i, url in enumerate(recipe_urls):
        slug = url.split('/recipes/')[-1]
        print(f"[{i+1}/{len(recipe_urls)}] {slug}", end=" ")
        
        try:
            html = fetch(url)
            recipe = extract_recipe(html, slug)
            if recipe:
                recipes.append(recipe)
                print("✓")
            else:
                failed.append(slug)
                print("✗ (no data)")
        except Exception as e:
            failed.append(slug)
            print(f"✗ ({e})")
        
        if i < len(recipe_urls) - 1:
            time.sleep(0.5)
    
    print(f"\nScraped: {len(recipes)} recipes, Failed: {len(failed)}")
    if failed:
        print(f"Failed slugs: {failed[:10]}...")
    
    # Sort by ID
    recipes.sort(key=lambda r: r['id'])
    
    # Write recipes.ts
    header = '''import { Recipe } from "@/types";

export const recipes: Recipe[] = [
'''
    footer = '''];

export const getRecipeBySlug = (slug: string): Recipe | undefined =>
  recipes.find((r) => r.slug === slug);

export const getRecipeById = (id: number): Recipe | undefined =>
  recipes.find((r) => r.id === id);

export const searchRecipes = (query: string): Recipe[] => {
  const q = query.toLowerCase();
  return recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.ingredients.some((i) => i.toLowerCase().includes(q))
  );
};

export const filterByKategori = (kategori: string): Recipe[] => {
  if (kategori === "all") return recipes;
  return recipes.filter((r) => r.kategori === kategori);
};
'''
    
    ts_recipes = [recipe_to_ts(r) for r in recipes]
    content = header + ',\n'.join(ts_recipes) + ',\n' + footer
    
    with open('src/data/recipes.ts', 'w') as f:
        f.write(content)
    
    print(f"\nWrote {len(recipes)} recipes to src/data/recipes.ts")
    
    # Also save raw JSON for reference
    with open('scraped-recipes.json', 'w') as f:
        json.dump(recipes, f, indent=2, ensure_ascii=False)
    print(f"Saved raw JSON to scraped-recipes.json")

if __name__ == '__main__':
    main()
