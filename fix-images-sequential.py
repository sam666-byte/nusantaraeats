#!/usr/bin/env python3
"""Check each recipe image and generate new ones if mismatched"""
import requests
import json
import os
import re
import time
from pathlib import Path
from io import BytesIO

CF_TOKEN = "cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728"
CF_ACCOUNT = "243dd09cf194815c3fce5ce09528167c"
CF_URL = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT}/ai/run/@cf/black-forest-labs/flux-1-schnell"

IMAGES_DIR = Path("./public/images")
RECIPES_FILE = Path("./src/data/recipes-extra.ts")

# Prompt per resep - deskripsi makanan yang akurat
RECIPE_PROMPTS = {
    "ayam-betutu": "authentic Balinese ayam betutu, whole chicken stuffed with basa genep spice paste, wrapped in banana leaves and cassava leaves, slow cooked, on a plate",
    "pempek-palembang": "Palembang pempek fish cake, cylindrical shape with egg inside, served with dark cuko vinegar sauce and sliced cucumber on a plate",
    "gudeg": "Yogyakarta gudeg, young jackfruit stew reddish brown color from teak leaves, served with steamed rice chicken opor krecek crackers on banana leaf",
    "coto-makassar": "Makassar coto soup, dark beef soup with tripe and liver, garnished with fried shallots spring onions, served in a bowl with ketupat",
    "bebek-betutu": "Balinese bebek betutu, whole duck stuffed with rich spice paste wrapped in banana leaves, slow cooked until tender, traditional Balinese dish",
    "mie-aceh": "Aceh mie noodles, thick yellow noodles in spicy curry-like broth with beef and seafood, Aceh style noodle soup in a bowl",
    "sate-lilit": "Balinese sate lilit, minced fish satay wrapped around lemongrass stalks, grilled with aromatic spices, Balinese traditional satay",
    "tinutuan": "Manado tinutuan porridge, mixed rice corn pumpkin sweet potato porridge with vegetables, healthy Manado breakfast in a bowl",
    "nasi-jinggo": "Balinese nasi jinggo, small rice packet in banana leaf with shredded chicken sambal matah peanuts, Balinese street food",
    "ikan-bakar-woku": "North Sulawesi ikan bakar woku, grilled fish wrapped in banana leaves with woku spice paste, Manado grilled fish on plate",
    "karedok": "Sundanese karedok, raw vegetable salad with spicy peanut sauce dressing, bean sprouts long beans cucumber, West Java traditional dish",
    "kambing-guling": "Indonesian kambing guling, whole roasted lamb with crispy skin, traditional ceremonial dish on serving platter",
    "nasi-kunyit": "Indonesian nasi kunyit yellow rice, bright yellow turmeric rice served with fried chicken and sambal on plate",
    "babi-guling": "Balinese babi guling, whole roasted suckling pig with crispy golden skin, Balinese ceremonial dish on serving platter",
    "lawar": "Balinese lawar, mixed vegetable dish with minced meat grated coconut green beans, traditional Balinese side dish on plate",
    "sop-konro": "Makassar sop konro, dark beef rib soup with kluwek nuts, rich broth in a bowl with ketupat rice cake",
    "nasi-padang": "West Sumatra nasi padang, steamed rice with rendang gulai curry sambal cassava leaves on banana leaf plate",
    "ayam-taliwang": "Lombok ayam taliwang, spicy grilled chicken with fiery red chili paste coating, charcoal grilled on plate",
    "papeda": "Eastern Indonesia papeda, translucent sago porridge served with yellow fish soup kuah kuning in a bowl",
    "nasi-kucing": "Javanese nasi kucing, small rice portion with various side dishes on banana leaf, Indonesian street food",
    "bakso-mercon": "Indonesian bakso mercon, meatball filled with spicy chili mixture in beef broth, firecracker meatballs in bowl",
    "martabak-manis": "Indonesian martabak manis, thick fluffy sweet pancake filled with chocolate sprinkles cheese condensed milk, cut into pieces",
    "tahu-gejrot": "Cirebon tahu gejrot, fried tofu pieces with sweet sour spicy palm sugar sauce, Cirebon street food in bowl",
    "kerak-telor": "Jakarta kerak telor, Betawi egg crepe with glutinous rice dried shrimp fried shallots, traditional Jakarta snack",
    "kue-dadar-gulung": "Indonesian dadar gulung, green pandan crêpes filled with sweet grated coconut palm sugar, rolled on plate",
    "klepon": "Javanese klepon, green pandan rice balls filled with liquid palm sugar coated in grated coconut, on plate",
    "onde-onde": "Indonesian onde-onde, deep fried sesame seed balls filled with sweet mung bean paste, golden crispy on plate",
    "nasi-uduk": "Jakarta nasi uduk, fragrant coconut rice with fried chicken tempeh tofu on plate, Betawi specialty",
    "empal-gentong": "Cirebon empal-gentong, beef soup with thick curry-like broth cooked in clay pot, Cirebon signature dish in bowl",
    "sate-padang": "West Sumatra sate-padang, satay with thick yellow curry-like rice cake sauce, Padang style satay on plate",
    "sate-klatak": "Yogyakarta sate-klatak, goat satay on iron bicycle spoke skewers, simple seasoned grilled meat on plate",
    "tahu-sumedang": "Sumedang tahu-sumedang, famous West Javanese fried tofu with crispy skin, Sumedang specialty on plate",
    "martabak-telur": "Indonesian martabak-telur, savory egg stuffed pancake with minced meat filling, crispy golden on plate",
    "es-cendol": "Indonesian es cendol, iced drink with green pandan jelly noodles coconut milk palm sugar syrup in glass",
    "wedang-ronde": "Javanese wedang-ronde, warm ginger drink with glutinous rice balls peanut filling in bowl",
    "jamu-kunyit-asam": "Indonesian jamu kunyit asam, turmeric tamarind herbal drink yellow orange color in glass bottle",
    "bakmi-goreng": "Indonesian bakmi goreng, fried noodles with vegetables egg sweet soy sauce on plate",
    "nasi-goreng-kampung": "Indonesian nasi-goreng-kampung, village style fried rice with egg chili shallots on plate",
    "bakso-sapi": "Indonesian bakso-sapi, beef meatballs in clear broth with noodles vegetables in bowl",
    "soto-ayam": "Indonesian soto-ayam, yellow turmeric chicken soup with shredded chicken vermicelli in bowl",
    "gado-gado": "Indonesian gado-gado, vegetable salad with peanut sauce dressing tofu tempeh on plate",
    "sate-madura": "Madura sate-madura, chicken satay skewers with sweet peanut sauce charcoal grilled on plate",
    "opor-ayam": "Javanese opor-ayam, chicken in white coconut milk curry, Lebaran dish served on plate",
    "ayam-goreng": "Indonesian ayam-goreng, deep fried chicken with golden crispy skin turmeric spices on plate",
    "tempeh-goreng": "Indonesian tempeh-goreng, deep fried tempeh slices golden crispy on plate",
    "tahu-goreng": "Indonesian tahu-goreng, golden deep fried tofu crispy outside soft inside on plate",
    "sambal-terasi": "Indonesian sambal-terasi, red chili sauce with shrimp paste in mortar, traditional condiment",
    "nasi-pecel": "Javanese nasi-pecel, rice with blanched vegetables spicy peanut sauce on plate",
    "bakso-ayam": "Indonesian bakso-ayam, chicken meatballs in clear broth with noodles vegetables in bowl",
}

def parse_recipes():
    content = RECIPES_FILE.read_text()
    recipes = []
    pattern = r'slug:\s*"([^"]+)"'
    slugs = re.findall(pattern, content)
    return slugs

def generate_cf_image(prompt):
    try:
        resp = requests.post(
            CF_URL,
            headers={
                "Authorization": f"Bearer {CF_TOKEN}",
                "Content-Type": "application/json"
            },
            json={"prompt": prompt},
            timeout=120
        )
        if resp.status_code == 200 and len(resp.content) > 5000:
            return resp.content
    except Exception as e:
        print(f"    API error: {e}")
    return None

def main():
    slugs = parse_recipes()
    print(f"Found {len(slugs)} recipes to check\n")
    
    updated = 0
    for i, slug in enumerate(slugs):
        prompt = RECIPE_PROMPTS.get(slug)
        if not prompt:
            print(f"[{i+1}] {slug} - no prompt defined, skipping")
            continue
            
        jpg_path = IMAGES_DIR / f"{slug}.jpg"
        svg_path = IMAGES_DIR / f"{slug}.svg"
        
        # Check if good image already exists
        has_image = False
        if jpg_path.exists() and jpg_path.stat().st_size > 5000:
            has_image = True
        elif (IMAGES_DIR / "food" / f"{slug}.jpg").exists():
            # Copy from food subfolder
            import shutil
            shutil.copy(IMAGES_DIR / "food" / f"{slug}.jpg", jpg_path)
            has_image = True
            print(f"[{i+1}] {slug} - copied from food folder")
        
        if not has_image:
            print(f"[{i+1}] {slug} - generating...")
            img_data = generate_cf_image(prompt)
            if img_data:
                jpg_path.write_bytes(img_data)
                print(f"    Saved {jpg_path} ({len(img_data)} bytes)")
                updated += 1
                time.sleep(1)
            else:
                print(f"    FAILED - keeping existing")
        else:
            print(f"[{i+1}] {slug} - already has image")
    
    print(f"\nDone! Generated {updated} new images")

if __name__ == "__main__":
    main()
