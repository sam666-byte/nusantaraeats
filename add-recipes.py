#!/usr/bin/env python3
"""Convert JSON recipes to TypeScript and add to recipes.ts"""
import re
import json
import os
import sys

def json_recipe_to_ts(recipe):
    """Convert a JSON recipe dict to TypeScript object string"""
    fields = []
    
    # Required fields in order
    field_order = [
        'id', 'slug', 'title', 'shortTitle', 'description', 'image', 'kategori',
        'waktu', 'porsi', 'kesulitan', 'rating', 'origin'
    ]
    
    for key in field_order:
        if key in recipe:
            val = recipe[key]
            if isinstance(val, str):
                # Escape quotes in strings
                val_escaped = val.replace('\\', '\\\\').replace('"', '\\"')
                fields.append(f'    {key}: "{val_escaped}"')
            elif isinstance(val, (int, float)):
                fields.append(f'    {key}: {val}')
    
    # Array fields
    for key in ['ingredients', 'instructions', 'bahan', 'cara_buat']:
        if key in recipe and isinstance(recipe[key], list):
            ts_key = 'ingredients' if key == 'bahan' else 'instructions' if key == 'cara_buat' else key
            items = []
            for item in recipe[key]:
                item_escaped = item.replace('\\', '\\\\').replace('"', '\\"')
                items.append(f'      "{item_escaped}"')
            fields.append(f'    {ts_key}: [\n' + ',\n'.join(items) + '\n    ]')
    
    # String fields (optional)
    string_fields = [
        'tips', 'sejarah', 'variasi_daerah', 'teknik_memasak', 'profil_gizi',
        'detailedHistory', 'culturalSignificance', 'regionalVariations',
        'cookingTechnique', 'nutritionalProfile'
    ]
    
    # Map Indonesian names to English
    field_map = {
        'sejarah': 'detailedHistory',
        'variasi_daerah': 'regionalVariations', 
        'teknik_memasak': 'cookingTechnique',
        'profil_gizi': 'nutritionalProfile'
    }
    
    for key in string_fields:
        actual_key = field_map.get(key, key)
        if key in recipe and isinstance(recipe[key], str) and recipe[key]:
            val_escaped = recipe[key].replace('\\', '\\\\').replace('"', '\\"')
            fields.append(f'    {actual_key}: "{val_escaped}"')
    
    return '  {\n' + ',\n'.join(fields) + ',\n  }'


def main():
    # Read existing recipes
    with open('src/data/recipes.ts', 'r') as f:
        content = f.read()
    
    existing_slugs = set(re.findall(r'slug:\s*"([^"]+)"', content))
    existing_ids = set(int(x) for x in re.findall(r'id:\s*(\d+)', content))
    max_id = max(existing_ids) if existing_ids else 0
    
    print(f"Existing: {len(existing_slugs)} unique slugs, max ID: {max_id}")
    
    # Load jajanan recipes from subagent file
    with open('/home/liveuser/indonesian_recipes_414_463.json', 'r') as f:
        jajanan_raw = json.load(f)
    
    # Filter out duplicates
    new_recipes = []
    seen_slugs = set(existing_slugs)
    next_id = max_id + 1
    
    for recipe in jajanan_raw:
        slug = recipe.get('slug', '')
        if slug and slug not in seen_slugs:
            recipe['id'] = next_id
            # Fix image path
            if 'image' in recipe:
                recipe['image'] = f'/images/{slug}.jpg'
            new_recipes.append(recipe)
            seen_slugs.add(slug)
            next_id += 1
    
    print(f"Added {len(new_recipes)} unique jajanan recipes (IDs {new_recipes[0]['id']}-{new_recipes[-1]['id']})")
    
    # Convert to TypeScript
    ts_recipes = []
    for recipe in new_recipes:
        ts_recipes.append(json_recipe_to_ts(recipe))
    
    # Find insertion point - insert before the closing ];
    # The last recipe ends with "  }," then "];"
    # Find the position of "];" that closes the recipes array
    arr_end = content.rfind('];')
    if arr_end == -1:
        print("ERROR: Could not find ]; in recipes.ts")
        sys.exit(1)
    
    # Insert new recipes just before "];"
    new_ts = ',\n'.join(ts_recipes)
    new_content = content[:arr_end] + new_ts + ',\n' + content[arr_end:]

    with open('src/data/recipes.ts', 'w') as f:
        f.write(new_content)

    print(f"Successfully added {len(new_recipes)} recipes to recipes.ts")

    # Verify
    with open('src/data/recipes.ts', 'r') as f:
        verify_content = f.read()
    verify_slugs = set(re.findall(r'slug:\s*"([^"]+)"', verify_content))
    verify_ids = set(int(x) for x in re.findall(r'id:\s*(\d+)', verify_content))
    print(f"Verified: {len(verify_slugs)} unique slugs, {len(verify_ids)} total recipes")


if __name__ == '__main__':
    main()
