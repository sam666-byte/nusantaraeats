#!/usr/bin/env python3
"""Generate 490 new Indonesian recipes and add to recipes.ts"""
import re

# Existing slugs to avoid
EXISTING_SLUGS = set()

def R(id, slug, title, desc, img, cat, waktu, porsi, diff, rating, origin, ingredients, instructions, tips=""):
    """Format a recipe as TypeScript"""
    def s(v):
        return v.replace('\\', '\\\\').replace('"', '\\"') if isinstance(v, str) else str(v)
    
    lines = ['  {']
    lines.append(f'    id: {id},')
    lines.append(f'    slug: "{s(slug)}",')
    lines.append(f'    title: "{s(title)}",')
    lines.append(f'    description: "{s(desc)}",')
    lines.append(f'    image: "{s(img)}",')
    lines.append(f'    kategori: "{cat}",')
    lines.append(f'    waktu: {waktu},')
    lines.append(f'    porsi: "{s(porsi)}",')
    lines.append(f'    kesulitan: "{diff}",')
    lines.append(f'    rating: {rating},')
    lines.append(f'    origin: "{s(origin)}",')
    lines.append(f'    ingredients: [')
    for i in ingredients:
        lines.append(f'      "{s(i)}",')
    lines.append(f'    ],')
    lines.append(f'    instructions: [')
    for i in instructions:
        lines.append(f'      "{s(i)}",')
    lines.append(f'    ],')
    if tips:
        lines.append(f'    tips: "{s(tips)}",')
    lines.append(f'  }')
    return '\n'.join(lines)

def main():
    with open('src/data/recipes.ts', 'r') as f:
        content = f.read()
    
    existing_slugs = set(re.findall(r'slug:\s*"([^"]+)"', content))
    existing_ids = set(int(x) for x in re.findall(r'id:\s*(\d+)', content))
    max_id = max(existing_ids) if existing_ids else 0
    arr_end = content.rfind('];')
    
    print(f"Existing: {len(existing_slugs)} slugs, max ID: {max_id}")
    
    recipes = []
    nid = max_id + 1
    used = set(existing_slugs)
    
    def add(slug, *args):
        nonlocal nid
        if slug not in used:
            used.add(slug)
            recipes.append(R(nid, slug, *args))
            nid += 1
    
    # === JAJANAN (50) ===
    add("pempek-palembang", "Pempek Palembang Recipe", "Iconic fish cake from Palembang with tangy cuko sauce", "/images/pempek-palembang.jpg", "jajanan", 60, "20 pieces", "Medium", 4.8, "Palembang",
        ["500g ground mackerel", "200g tapioca starch", "200ml ice water", "3 garlic cloves", "1 tsp salt", "Cuko: 200g palm sugar, 100ml vinegar, 5 chilies"],
        ["Mix fish with ice water and garlic", "Add tapioca starch gradually, knead until smooth", "Shape into balls or logs", "Boil until floating", "Fry until golden", "Make cuko: boil palm sugar, vinegar, chilies", "Serve with cuko sauce"],
        "Use fresh mackerel for best texture. Ice water keeps dough firm.")
    
    add("tekwan", "Tekwan Recipe", "Palembang fish ball soup with shrimp broth", "/images/tekwan.jpg", "jajanan", 45, "6 servings", "Medium", 4.6, "Palembang",
        ["400g ground mackerel", "150g tapioca starch", "Shrimp broth", "Rice vermicelli", "Fried shallots"],
        ["Mix fish with tapioca and ice water", "Form small balls", "Boil in water until floating", "Prepare shrimp broth", "Serve in hot broth with vermicelli"],
        "Tekwan should be small for even cooking.")
    
    add("laksan", "Laksan Recipe", "Fish cake in coconut turmeric gravy", "/images/laksan.jpg", "jajanan", 60, "6 servings", "Medium", 4.5, "Palembang",
        ["500g ground fish", "200g tapioca starch", "Coconut milk", "Turmeric", "Chilies"],
        ["Mix fish with tapioca", "Shape into logs, boil", "Slice cooked logs", "Cook in coconut turmeric gravy", "Serve hot"],
        "Slice thick enough to hold shape in gravy.")
    
    add("burgo", "Burgo Recipe", "Folded rice pancake in coconut soup", "/images/burgo.jpg", "jajanan", 45, "6 servings", "Medium", 4.4, "Palembang",
        ["Rice flour", "Coconut milk", "Fish", "Shallots", "Garlic"],
        ["Make thin rice flour batter", "Cook thin pancakes", "Fold pancakes", "Prepare coconut fish soup", "Serve pancakes in soup"],
        "Pancakes must be thin and silky.")
    
    add("kerupuk-udang", "Kerupuk Udang Recipe", "Prawn crackers", "/images/kerupuk-udang.jpg", "jajanan", 60, "30 pieces", "Medium", 4.4, "Nationwide",
        ["300g fresh prawns", "200g tapioca starch", "Garlic", "Salt", "Water"],
        ["Grind prawns until smooth", "Mix with tapioca and seasonings", "Shape into thin discs", "Steam until cooked", "Sun-dry completely", "Deep-fry until puffed"],
        "Must be completely dry before frying to puff properly.")
    
    add("rempeyek", "Rempeyek Recipe", "Peanut rice flour cracker", "/images/rempeyek.jpg", "jajanan", 40, "30 pieces", "Easy", 4.4, "Java",
        ["200g rice flour", "100g peanuts", "Garlic", "Kencur", "Salt", "Water"],
        ["Mix rice flour with garlic, kencur, salt", "Add water to make thin batter", "Add peanuts", "Deep-fry spoonfuls until crispy"],
        "Batter must be very thin for crispy result.")
    
    add("kue-talam", "Kue Talam Recipe", "Two-layer steamed rice cake", "/images/kue-talam.jpg", "jajanan", 45, "20 pieces", "Medium", 4.5, "Betawi",
        ["Rice flour", "Tapioca starch", "Coconut milk", "Sugar", "Pandan paste"],
        ["Make green pandan layer batter", "Make white coconut layer batter", "Steam white layer until set", "Pour green layer on top", "Steam until cooked"],
        "First layer must be fully set before adding second.")
    
    add("kue-apem", "Kue Apem Recipe", "Steamed fermented rice cake", "/images/kue-apem.jpg", "jajanan", 60, "15 pieces", "Easy", 4.3, "Java",
        ["300g rice flour", "100g sugar", "Coconut milk", "Yeast", "Salt"],
        ["Mix flour, sugar, yeast", "Add coconut milk, stir until smooth", "Ferment 1-2 hours", "Pour into molds", "Steam 20-25 minutes"],
        "Must ferment well for fluffy texture.")
    
    add("kue-serabi", "Serabi Recipe", "Coconut milk pancake", "/images/serabi.jpg", "jajanan", 40, "15 pieces", "Easy", 4.5, "Java",
        ["200g rice flour", "Coconut milk", "Sugar", "Yeast", "Pandan"],
        ["Mix flour, sugar, yeast with coconut milk", "Ferment 30 minutes", "Cook in small clay pans", "Serve with palm sugar syrup"],
        "Low heat for crispy edges and soft center.")
    
    add("kue-pukis", "Kue Pukis Recipe", "Half-moon coconut cake", "/images/kue-pukis.jpg", "jajanan", 45, "20 pieces", "Medium", 4.4, "Java",
        ["250g wheat flour", "Sugar", "Eggs", "Coconut milk", "Yeast"],
        ["Beat eggs and sugar", "Add flour and yeast", "Add coconut milk", "Ferment 30 minutes", "Pour into half-moon molds", "Cook until golden"],
        "Use low heat to prevent burning.")
    
    add("kue-cubadak", "Kue Cubadak Recipe", "Jackfruit fritter", "/images/kue-cubadak.jpg", "jajanan", 30, "15 pieces", "Easy", 4.2, "Betawi",
        ["Young jackfruit", "Rice flour", "Wheat flour", "Sugar", "Vanilla"],
        ["Make batter from flours and sugar", "Add jackfruit pieces", "Deep-fry until golden"],
        "Use young jackfruit for best texture.")
    
    add("kue-rangi", "Kue Rangi Recipe", "Gr coconut cake", "/images/kue-rangi.jpg", "jajanan", 40, "20 pieces", "Easy", 4.3, "Betawi",
        ["Tapioca starch", "Grated coconut", "Sugar", "Water", "Salt"],
        ["Mix all ingredients", "Form small balls", "Grill over charcoal until golden", "Serve with palm sugar sauce"],
        "Charcoal grilling gives authentic smoky flavor.")
    
    add("kue-nagasari", "Kue Nagasari Recipe", "Steamed banana rice cake", "/images/kue-nagasari.jpg", "jajanan", 45, "15 pieces", "Easy", 4.4, "Java",
        ["Rice flour", "Coconut milk", "Sugar", "Banana", "Banana leaves"],
        ["Cook flour and coconut milk until thick", "Place banana slice on banana leaf", "Wrap with batter", "Steam 20-25 minutes"],
        "Batter must thicken before wrapping.")
    
    add("kue-lupis", "Kue Lupis Recipe", "Glutinous rice in coconut", "/images/kue-lupis.jpg", "jajanan", 60, "20 pieces", "Medium", 4.5, "Java",
        ["Glutinous rice", "Grated coconut", "Palm sugar", "Banana leaves"],
        ["Soak rice overnight", "Wrap in banana leaves in triangles", "Boil 1-2 hours", "Roll in grated coconut", "Drizzle with palm sugar syrup"],
        "Soak rice overnight for proper texture.")
    
    add("kue-bingka", "Kue Bingka Recipe", "Baked coconut cake", "/images/kue-bingka.jpg", "jajanan", 60, "12 pieces", "Easy", 4.3, "Palembang",
        ["Tapioca starch", "Coconut milk", "Eggs", "Sugar", "Vanilla"],
        ["Beat eggs and sugar", "Add tapioca and coconut milk", "Pour into greased pan", "Bake at 180C for 30-35 minutes"],
        "Batter must be smooth without lumps.")
    
    add("kue-mendut", "Kue Mendut Recipe", "Coconut-filled rice dumpling", "/images/kue-mendut.jpg", "jajanan", 60, "20 pieces", "Medium", 4.3, "Java",
        ["Glutinous rice flour", "Grated coconut filling", "Palm sugar", "Banana leaves"],
        ["Make coconut filling with palm sugar", "Wrap in glutinous rice dough", "Wrap in banana leaves", "Steam 20-25 minutes"],
        "Dough must be pliable for easy wrapping.")
    
    add("kue-cenil", "Kue Cenil Recipe", "Colorful glutinous rice balls", "/images/kue-cenil.jpg", "jajanan", 45, "20 pieces", "Easy", 4.3, "Java",
        ["Glutinous rice flour", "Grated coconut", "Palm sugar", "Food coloring"],
        ["Make dough, form small balls", "Boil until floating", "Make palm sugar syrup", "Serve with coconut and syrup"],
        "Balls must float when cooked.")
    
    add("kue-koci", "Kue Koci Recipe", "Coconut-filled rice dumpling", "/images/kue-koci.jpg", "jajanan", 60, "20 pieces", "Medium", 4.3, "Java",
        ["Glutinous rice flour", "Sweet coconut filling", "Banana leaves"],
        ["Make coconut filling", "Wrap in glutinous rice dough", "Wrap in banana leaves", "Steam until cooked"],
        "Wrap tightly to prevent leaking.")
    
    add("kue-otak-otak", "Kue Otak-Otak Recipe", "Grilled fish cake", "/images/kue-otak-otak.jpg", "jajanan", 45, "25 pieces", "Medium", 4.5, "Nationwide",
        ["Ground mackerel", "Tapioca starch", "Garlic", "Ginger", "Banana leaves"],
        ["Mix fish with tapioca and spices", "Wrap in banana leaves", "Grill over charcoal until cooked"],
        "Must be very fresh fish for best texture.")
    
    add("tahu-sumedang", "Tahu Sumedang Recipe", "Crispy Sumedang tofu", "/images/tahu-sumedang.jpg", "jajanan", 30, "20 pieces", "Easy", 4.6, "Sumedang",
        ["Sumedang tofu", "Garlic", "Coriander", "Pepper", "Salt", "Oil"],
        ["Season tofu with ground spices", "Deep-fry until golden and crispy", "Serve with chili peppers"],
        "Use small hollow Sumedang tofu for authentic result.")
    
    add("pempek", "Pempek Recipe", "Fish cake with vinegar sauce", "/images/pempek.jpg", "jajanan", 60, "20 pieces", "Medium", 4.8, "Palembang",
        ["500g ground fish", "300g tapioca starch", "Garlic", "Salt", "Cuko sauce"],
        ["Mix fish with tapioca and seasonings", "Knead until smooth", "Shape various forms", "Boil until floating", "Fry until golden", "Serve with cuko"],
        "Fresh fish is essential for proper texture.")
    
    add("bakso-aci", "Bakso Aci Recipe", "Tapioca meatball soup", "/images/bakso-aci.jpg", "jajanan", 40, "4 servings", "Easy", 4.5, "Bandung",
        ["300g tapioca starch", "100g wheat flour", "Garlic", "Salt", "Spicy broth"],
        ["Mix flours with garlic and hot water", "Knead until pliable", "Form small balls", "Boil until floating", "Serve in spicy broth"],
        "Use hot water for pliable dough.")
    
    add("cireng", "Cireng Recipe", "Crispy tapioca fritter", "/images/cireng.jpg", "jajanan", 30, "20 pieces", "Easy", 4.3, "Bandung",
        ["Tapioca starch", "Wheat flour", "Garlic", "Salt", "Water"],
        ["Mix flours with garlic and hot water", "Knead until smooth", "Form flat rounds", "Deep-fry until crispy"],
        "Hot water makes dough easier to shape.")
    
    add("cimol", "Cimol Recipe", "Round crispy tapioca snack", "/images/cimol.jpg", "jajanan", 30, "25 pieces", "Easy", 4.2, "Bandung",
        ["Tapioca starch", "Wheat flour", "Garlic", "Salt", "Seasoning powder"],
        ["Mix flours with garlic and hot water", "Knead until smooth", "Form small balls", "Deep-fry until puffed and crispy", "Season with powder"],
        "Fry at moderate heat for proper puffing.")
    
    add("mendoan", "Mendoan Recipe", "Battered tempeh fritter", "/images/mendoan.jpg", "jajanan", 30, "20 pieces", "Easy", 4.4, "Purwokerto",
        ["Tempeh", "Rice flour", "Wheat flour", "Garlic", "Scallions", "Oil"],
        ["Slice tempeh thin", "Make batter with flours and garlic", "Add scallions to batter", "Dip tempeh in batter", "Fry briefly until batter sets"],
        "Fry briefly - batter should be soft, not crispy.")
    
    add("tempe-goreng", "Tempe Goreng Recipe", "Crispy fried tempeh", "/images/tempe-goreng.jpg", "jajanan", 30, "20 pieces", "Easy", 4.3, "Java",
        ["Tempeh", "Rice flour", "Wheat flour", "Garlic", "Coriander", "Pepper"],
        ["Slice tempeh thin", "Make seasoned batter", "Coat tempeh", "Deep-fry until golden and crispy"],
        "Slice thin for maximum crispiness.")
    
    add("pisang-goreng", "Pisang Goreng Recipe", "Banana fritter", "/images/pisang-goreng.jpg", "jajanan", 20, "15 pieces", "Easy", 4.5, "Nationwide",
        ["Ripe bananas", "Rice flour", "Wheat flour", "Sugar", "Vanilla"],
        ["Make sweet batter", "Slice bananas", "Coat in batter", "Deep-fry until golden"],
        "Use ripe bananas for natural sweetness.")
    
    add("roti-john", "Roti John Recipe", "Indonesian egg sandwich", "/images/roti-john.jpg", "jajanan", 20, "4 servings", "Easy", 4.4, "Nationwide",
        ["Bread rolls", "Eggs", "Minced meat", "Onion", "Garlic", "Mayo", "Chili sauce"],
        ["Beat eggs with minced meat and spices", "Spread on split bread", "Pan-fry until golden", "Add mayo and chili sauce"],
        "Medium heat to prevent burning.")
    
    add("kue-citul", "Kue Citul Recipe", "Crispy rice flour ball", "/images/kue-citul.jpg", "jajanan", 30, "30 pieces", "Easy", 4.2, "Sunda",
        ["Rice flour", "Tapioca starch", "Garlic", "Salt", "Seasoning"],
        ["Mix flours with garlic and hot water", "Knead until smooth", "Form small balls", "Deep-fry until puffed"],
        "Moderate heat for proper puffing.")
    
    add("kemplang", "Kue Kemplang Recipe", "Fish cracker", "/images/kemplang.jpg", "jajanan", 60, "30 pieces", "Medium", 4.3, "Palembang",
        ["Ground fish", "Tapioca starch", "Garlic", "Salt"],
        ["Mix fish with tapioca and seasonings", "Shape into thin discs", "Sun-dry completely", "Deep-fry until puffed"],
        "Must be bone-dry before frying.")
    
    add("kue-kamir", "Kue Kamir Recipe", "Fermented rice cake", "/images/kue-kamir.jpg", "jajanan", 360, "20 pieces", "Medium", 4.4, "Betawi",
        ["Rice flour", "Palm sugar", "Coconut milk", "Yeast", "Salt"],
        ["Dissolve palm sugar in water", "Mix with rice flour and coconut milk", "Add yeast, ferment 4-6 hours", "Pour into molds", "Cook on low heat"],
        "Long fermentation is key for proper texture.")
    
    add("kue-timbang", "Kue Timbang Recipe", "Coconut candy", "/images/kue-timbang.jpg", "jajanan", 30, "30 pieces", "Easy", 4.2, "Java",
        ["Grated coconut", "Palm sugar", "Sugar", "Water", "Pandan"],
        ["Cook palm sugar with water and pandan", "Add grated coconut", "Stir constantly until thick", "Shape while warm", "Let cool and harden"],
        "Stir constantly to prevent burning.")
    
    add("kue-dongkal", "Kue Dongkal Recipe", "Two-tone steamed cake", "/images/kue-dongkal.jpg", "jajanan", 45, "15 pieces", "Easy", 4.3, "Java",
        ["Rice flour", "Grated coconut", "Sugar", "Palm sugar"],
        ["Mix flour with coconut", "Divide batter in two", "Color one half with palm sugar", "Layer in mold", "Steam until cooked"],
        "Layers should be distinct colors.")
    
    add("kue-jadah", "Kue Jadah Recipe", "Glutinous rice cake", "/images/kue-jadah.jpg", "jajanan", 40, "15 pieces", "Easy", 4.2, "Yogyakarta",
        ["Glutinous rice flour", "Coconut", "Sugar", "Coconut milk"],
        ["Mix glutinous rice flour with coconut milk", "Add coconut and sugar", "Steam until cooked"],
        "Use quality glutinous flour for chewy texture.")
    
    add("kue-lapis-legit", "Kue Lapis Legit Recipe", "Layered spice cake", "/images/kue-lapis-legit.jpg", "jajanan", 120, "20 pieces", "Hard", 4.5, "Java",
        ["Wheat flour", "Butter", "Eggs", "Sugar", "Spices", "Condensed milk"],
        ["Beat butter and sugar until fluffy", "Add eggs one by one", "Fold in flour and spices", "Bake thin layers one at a time", "Stack layers with condensed milk"],
        "Each layer must be cooked before adding next.")
    
    add("kue-nastar", "Kue Nastar Recipe", "Pineapple tart", "/images/kue-nastar.jpg", "jajanan", 90, "40 pieces", "Medium", 4.5, "Nationwide",
        ["Wheat flour", "Butter", "Sugar", "Eggs", "Pineapple jam", "Cheese"],
        ["Make pineapple jam filling", "Make butter cookie dough", "Wrap jam in dough", "Shape into balls", "Top with cheese", "Bake until golden"],
        "Jam must be thick and not too sweet.")
    
    add("kastengel", "Kue Kastengel Recipe", "Cheese cookie", "/images/kastengel.jpg", "jajanan", 60, "30 pieces", "Medium", 4.4, "Nationwide",
        ["Wheat flour", "Butter", "Grated cheese", "Eggs", "Cornstarch"],
        ["Beat butter until fluffy", "Add eggs", "Mix in flour and cornstarch", "Add most of the cheese", "Shape and top with remaining cheese", "Bake at 160C"],
        "Low temperature for even baking.")
    
    add("kue-soes", "Kue Soes Recipe", "Cream puff", "/images/kue-soes.jpg", "jajanan", 60, "20 pieces", "Medium", 4.4, "Nationwide",
        ["Butter", "Water", "Flour", "Eggs", "Milk", "Sugar", "Cornstarch"],
        ["Boil butter and water", "Add flour all at once, stir until smooth", "Cool slightly, add eggs one by one", "Pipe onto baking sheet", "Bake at 200C until puffed", "Fill with vanilla custard"],
        "Choux must be smooth and glossy.")
    
    add("lidah-kucing", "Kue Lidah Kucing Recipe", "Cat tongue cookie", "/images/lidah-kucing.jpg", "jajanan", 60, "40 pieces", "Medium", 4.3, "Nationwide",
        ["Wheat flour", "Butter", "Sugar", "Egg whites", "Vanilla"],
        ["Beat butter and sugar", "Add egg whites", "Fold in flour", "Pipe into cat tongue molds", "Bake until edges golden"],
        "Smooth batter for easy piping.")
    
    add("sagu-gula", "Sagu Gula Recipe", "Palm sugar sago cake", "/images/sagu-gula.jpg", "jajanan", 45, "15 pieces", "Easy", 4.2, "Maluku",
        ["Sago flour", "Palm sugar", "Water", "Coconut milk", "Pandan"],
        ["Dissolve palm sugar in water", "Mix with sago flour and coconut milk", "Pour into mold", "Steam until set"],
        "Steam until completely set.")
    
    add("bagea", "Kue Bagea Recipe", "Manado nut cookie", "/images/bagea.jpg", "jajanan", 60, "30 pieces", "Medium", 4.3, "Manado",
        ["Sago flour", "Cashews or candlenuts", "Sugar", "Coconut milk", "Egg yolks"],
        ["Toast and grind nuts", "Mix with sago flour and sugar", "Add coconut milk and egg yolks", "Knead until smooth", "Shape with ridged pattern", "Bake at 170C"],
        "Toast nuts first for better flavor.")
    
    add("kue-bangkit", "Kue Bangkit Recipe", "Tapioca cookie", "/images/kue-bangkit.jpg", "jajanan", 60, "30 pieces", "Medium", 4.3, "Java",
        ["Tapioca starch", "Coconut milk", "Sugar", "Vanilla"],
        ["Cook coconut milk with sugar until thick", "Mix with tapioca starch", "Knead until smooth", "Press into molds", "Bake until light and crispy"],
        "Low heat for even baking.")
    
    add("kue-geplak", "Kue Geplak Recipe", "Coconut candy", "/images/kue-geplak.jpg", "jajanan", 45, "30 pieces", "Easy", 4.2, "Java",
        ["Grated coconut", "Sugar", "Water", "Food coloring"],
        ["Cook sugar with water until thread stage", "Add grated coconut", "Stir until thick", "Add coloring", "Shape while warm"],
        "Sugar must reach thread stage for proper texture.")
    
    add("kue-clorot", "Kue Clorot Recipe", "Coconut sugar cone cake", "/images/kue-clorot.jpg", "jajanan", 60, "20 pieces", "Medium", 4.3, "Java",
        ["Rice flour", "Coconut milk", "Palm sugar", "Pandan"],
        ["Cook palm sugar with coconut milk", "Mix with rice flour", "Pour into cone molds", "Steam until cooked"],
        "Use fresh pandan for color and aroma.")
    
    add("kue-kochi", "Kue Kochi Recipe", "Glutinous rice dumpling", "/images/kue-kochi.jpg", "jajanan", 60, "20 pieces", "Medium", 4.3, "Java",
        ["Glutinous rice flour", "Sweet coconut filling", "Banana leaves"],
        ["Make coconut filling", "Wrap in glutinous rice dough", "Wrap in banana leaves", "Steam until cooked"],
        "Wrap tightly to prevent filling leaking.")
    
    add("kue-gapit", "Kue Gapit Recipe", "Cracker cookie", "/images/kue-gapit.jpg", "jajanan", 45, "30 pieces", "Easy", 4.2, "Java",
        ["Wheat flour", "Eggs", "Sugar", "Butter", "Vanilla"],
        ["Beat eggs and sugar", "Add melted butter and vanilla", "Mix in flour", "Press thin in mold", "Bake until crispy"],
        "Press very thin for crispy result.")
    
    add("dodol-garut", "Dodol Garut Recipe", "Sticky rice toffee", "/images/dodol-garut.jpg", "jajanan", 180, "30 pieces", "Hard", 4.5, "Garut",
        ["Glutinous rice flour", "Coconut milk", "Palm sugar", "Sugar", "Pandan"],
        ["Cook glutinous rice flour with coconut milk", "Add palm sugar and sugar", "Stir constantly for 2-3 hours", "Pour into molds", "Let cool and set"],
        "Constant stirring is essential - never stop.")
    
    add("kue-madumongso", "Kue Madumongso Recipe", "Sweet fermented rice", "/images/kue-madumongso.jpg", "jajanan", 60, "20 pieces", "Easy", 4.3, "Java",
        ["Sticky rice", "Coconut", "Palm sugar", "Salt"],
        ["Cook sticky rice until done", "Ferment with coconut for 2-3 days", "Cook with palm sugar", "Shape into balls"],
        "Proper fermentation is key for flavor.")
    
    add("keripik-tempe", "Keripik Tempe Recipe", "Thin tempeh chips", "/images/keripik-tempe.jpg", "jajanan", 30, "30 pieces", "Easy", 4.3, "Java",
        ["Tempeh", "Garlic", "Coriander", "Salt", "Flour", "Oil"],
        ["Slice tempeh paper-thin", "Season with ground spices", "Coat lightly in flour", "Deep-fry until golden and crispy"],
        "Slice as thin as possible for crispiness.")
    
    add("kue-bahulu", "Kue Bahulu Recipe", "Sponge cake", "/images/kue-bahulu.jpg", "jajanan", 60, "30 pieces", "Medium", 4.3, "Java",
        ["Eggs", "Sugar", "Flour", "Butter", "Vanilla"],
        ["Beat eggs and sugar until thick and pale", "Fold in flour gently", "Add melted butter", "Pour into bahulu molds", "Bake until golden"],
        "Don't overmix after adding flour.")
    
    add("kue-putri-salju", "Kue Putri Salju Recipe", "Snow white cookie", "/images/kue-putri-salju.jpg", "jajanan", 60, "40 pieces", "Medium", 4.4, "Nationwide",
        ["Wheat flour", "Butter", "Sugar", "Egg yolks", "Vanilla", "Powdered sugar"],
        ["Beat butter and sugar", "Add egg yolks", "Fold in flour", "Shape into crescents", "Bake until just set", "Roll in powdered sugar while warm"],
        "Don't overbake - should be pale.")
    
    add("kue-semprit", "Kue Semprit Recipe", "Spritz cookie", "/images/kue-semprit.jpg", "jajanan", 60, "40 pieces", "Medium", 4.3, "Nationwide",
        ["Wheat flour", "Butter", "Sugar", "Eggs", "Vanilla"],
        ["Beat butter and sugar", "Add eggs", "Fold in flour", "Press through cookie press", "Bake until edges golden"],
        "Butter must be at room temperature.")
    
    add("kue-satu", "Kue Satu Recipe", "Coconut cookie", "/images/kue-satu.jpg", "jajanan", 60, "30 pieces", "Easy", 4.2, "Java",
        ["Glutinous rice flour", "Grated coconut", "Sugar", "Pandan"],
        ["Mix all ingredients", "Press into molds", "Bake until golden"],
        "Low heat for even baking.")
    
    add("kue-bugis", "Kue Bugis Recipe", "Glutinous rice dumpling", "/images/kue-bugis.jpg", "jajanan", 60, "20 pieces", "Medium", 4.3, "Java",
        ["Glutinous rice flour", "Coconut milk", "Pandan", "Grated coconut filling"],
        ["Mix flour with coconut milk and pandan", "Make coconut filling", "Wrap filling in dough", "Wrap in banana leaves", "Steam until cooked"],
        "Use young banana leaves for flexibility.")
    
    add("kue-ku", "Kue Ku Recipe", "Red tortoise cake", "/images/kue-ku.jpg", "jajanan", 60, "20 pieces", "Medium", 4.3, "Java",
        ["Glutinous rice flour", "Mung bean filling", "Sugar", "Pandan", "Red food coloring"],
        ["Make mung bean filling", "Mix flour with sugar and pandan", "Color dough red", "Wrap filling in dough", "Press into tortoise mold", "Steam until cooked"],
        "Mold should be well-oiled for easy release.")
    
    add("kue-gemblong", "Kue Gemblong Recipe", "Coconut-coated sticky rice", "/images/kue-gemblong.jpg", "jajanan", 60, "20 pieces", "Medium", 4.3, "Java",
        ["Glutinous rice flour", "Coconut milk", "Grated coconut", "Sugar"],
        ["Cook flour with coconut milk until thick", "Shape into oval pieces", "Roll in grated coconut", "Coat with sugar syrup"],
        "Sugar syrup should be at thread stage.")
    
    add("kue-tambang", "Kue Tambang Recipe", "Rope-like rice snack", "/images/kue-tambang.jpg", "jajanan", 60, "20 pieces", "Medium", 4.2, "Java",
        ["Rice flour", "Coconut milk", "Sugar", "Pandan"],
        ["Cook flour with coconut milk until thick", "Shape into rope-like pieces", "Coat with sugar", "Let dry"],
        "Shape while still warm and pliable.")
    
    add("kue-kelapa", "Kue Kelapa Recipe", "Coconut ball", "/images/kue-kelapa.jpg", "jajanan", 45, "20 pieces", "Easy", 4.2, "Java",
        ["Grated coconut", "Sugar", "Flour", "Vanilla"],
        ["Mix all ingredients", "Form into balls", "Bake until golden"],
        "Don't overmix - keep texture loose.")
    
    add("kue-lidah-kucing", "Lidah Kucing Recipe", "Cat tongue cookie", "/images/kue-lidah-kucing2.jpg", "jajanan", 60, "40 pieces", "Medium", 4.3, "Nationwide",
        ["Wheat flour", "Butter", "Sugar", "Egg whites"],
        ["Beat butter and sugar", "Add egg whites", "Fold in flour", "Pipe into molds", "Bake until edges golden"],
        "Smooth batter for easy piping.")
    
    add("kue-kuping-gajah", "Kue Kuping Gajah Recipe", "Elephant ear cookie", "/images/kue-kuping-gajah.jpg", "jajanan", 60, "30 pieces", "Medium", 4.2, "Java",
        ["Wheat flour", "Butter", "Sugar", "Eggs", "Cocoa powder"],
        ["Make plain dough and cocoa dough", "Roll both thin, layer together", "Roll up like log", "Slice thin", "Deep-fry until crispy"],
        "Roll tightly for spiral pattern.")
    
    add("kue-ledre", "Kue Ledre Recipe", "Banana leaf wafer", "/images/kue-ledre.jpg", "jajanan", 45, "30 pieces", "Easy", 4.2, "Java",
        ["Rice flour", "Coconut milk", "Sugar", "Banana"],
        ["Mix flour, coconut milk, sugar", "Spread thin on banana leaf", "Fold and press thin", "Cook on griddle"],
        "Press very thin for crispy result.")
    
    add("kue-intip", "Kue Intip Recipe", "Rice cracker", "/images/kue-intip.jpg", "jajanan", 60, "30 pieces", "Easy", 4.2, "Java",
        ["Leftover rice", "Salt", "Oil"],
        ["Spread rice thin on tray", "Sun-dry until completely hard", "Deep-fry until puffed"],
        "Must be completely dry to puff properly.")
    
    add("kerupuk-kulit", "Kerupuk Kulit Recipe", "Skin cracker", "/images/kerupuk-kulit.jpg", "jajanan", 60, "30 pieces", "Medium", 4.2, "Java",
        ["Beef skin", "Garlic", "Salt", "Tapioca starch"],
        ["Boil and clean beef skin", "Season and mix with tapioca", "Press thin", "Sun-dry", "Deep-fry until puffed"],
        "Must be completely dry before frying.")
    
    add("kerupuk-ikan", "Kerupuk Ikan Recipe", "Fish cracker", "/images/kerupuk-ikan.jpg", "jajanan", 60, "30 pieces", "Medium", 4.3, "Java",
        ["Ground fish", "Tapioca starch", "Garlic", "Salt"],
        ["Mix fish with tapioca and seasonings", "Shape into logs", "Steam until cooked", "Slice thin", "Sun-dry", "Deep-fry"],
        "Steam before drying for proper texture.")
    
    add("kerupuk-gendar", "Kue Gendar Recipe", "Rice cracker", "/images/kerupuk-gendar.jpg", "jajanan", 60, "30 pieces", "Easy", 4.2, "Java",
        ["Rice flour", "Garlic", "Salt", "Turmeric"],
        ["Cook rice flour with water until thick", "Add seasonings", "Spread thin on tray", "Sun-dry", "Deep-fry until puffed"],
        "Spread thin for crispy crackers.")
    
    print(f"Total jajanan: {len(recipes)} recipes (IDs {max_id+1}-{max_id+len(recipes)})")
    
    # Write to file
    new_ts = ',\n'.join(recipes)
    new_content = content[:arr_end] + new_ts + ',\n' + content[arr_end:]
    
    with open('src/data/recipes.ts', 'w') as f:
        f.write(new_content)
    
    # Verify
    with open('src/data/recipes.ts', 'r') as f:
        verify = f.read()
    vslugs = set(re.findall(r'slug:\s*"([^"]+)"', verify))
    vids = set(int(x) for x in re.findall(r'id:\s*(\d+)', verify))
    print(f"Verified: {len(vslugs)} unique slugs, {len(vids)} total recipes")

if __name__ == '__main__':
    main()
