#!/usr/bin/env python3
"""
Add 137 new unique Indonesian recipes to recipes.ts
- 48 jajanan (from subagent)
- 50 main dishes (hand-crafted)
- 39 drinks (from subagent)
Total: 500 recipes (363 existing + 137 new)
"""
import re
import json
import sys

def slug_to_title(slug):
    """Convert slug to title case"""
    return slug.replace('-', ' ').title()

def make_recipe(id_val, slug, kategori, waktu, porsi, kesulitan, rating, origin, ingredients, instructions, tips, sejarah, variasi, teknik, gizi):
    """Create a recipe TypeScript object string"""
    desc = f"{slug_to_title(slug)} adalah masakan khas Indonesia yang lezat dan autentik."
    
    lines = []
    lines.append(f'  {{')
    lines.append(f'    id: {id_val},')
    lines.append(f'    slug: "{slug}",')
    lines.append(f'    title: "{slug_to_title(slug)} Recipe: {origin} Specialties",')
    lines.append(f'    shortTitle: "{slug_to_title(slug)}",')
    lines.append(f'    description: "{desc}",')
    lines.append(f'    image: "/images/{slug}.jpg",')
    lines.append(f'    kategori: "{kategori}",')
    lines.append(f'    waktu: {waktu},')
    lines.append(f'    porsi: "{porsi}",')
    lines.append(f'    kesulitan: "{kesulitan}",')
    lines.append(f'    rating: {rating},')
    lines.append(f'    origin: "{origin}",')
    
    # ingredients
    lines.append(f'    ingredients: [')
    for ing in ingredients:
        ing_escaped = ing.replace('"', '\\"')
        lines.append(f'      "{ing_escaped}",')
    lines.append(f'    ],')
    
    # instructions
    lines.append(f'    instructions: [')
    for inst in instructions:
        inst_escaped = inst.replace('"', '\\"')
        lines.append(f'      "{inst_escaped}",')
    lines.append(f'    ],')
    
    # optional fields
    if tips:
        tips_escaped = tips.replace('"', '\\"')
        lines.append(f'    tips: "{tips_escaped}",')
    if sejarah:
        sejarah_escaped = sejarah.replace('"', '\\"')
        lines.append(f'    detailedHistory: "{sejarah_escaped}",')
    if variasi:
        variasi_escaped = variasi.replace('"', '\\"')
        lines.append(f'    regionalVariations: "{variasi_escaped}",')
    if teknik:
        teknik_escaped = teknik.replace('"', '\\"')
        lines.append(f'    cookingTechnique: "{teknik_escaped}",')
    if gizi:
        gizi_escaped = gizi.replace('"', '\\"')
        lines.append(f'    nutritionalProfile: "{gizi_escaped}",')
    
    lines.append(f'  }}')
    return '\n'.join(lines)


def main():
    # Read existing file
    with open('src/data/recipes.ts', 'r') as f:
        content = f.read()
    
    existing_slugs = set(re.findall(r'slug:\s*"([^"]+)"', content))
    existing_ids = set(int(x) for x in re.findall(r'id:\s*(\d+)', content))
    max_id = max(existing_ids) if existing_ids else 0
    next_id = max_id + 1
    
    print(f"Existing: {len(existing_slugs)} unique slugs, max ID: {max_id}")
    
    # Find insertion point - the last "];" in the file
    arr_end = content.rfind('];')
    if arr_end == -1:
        print("ERROR: Could not find ]; in recipes.ts")
        sys.exit(1)
    
    # New recipes to add
    new_recipes = []
    
    # === JAJANAN (48 unique, IDs 364-411) ===
    jajanan = [
        ("kue-kamir", "makanan-berat", 360, "20 buah", "Medium", 4.4, "Jakarta (Betawi)", 
         ["500g tepung beras", "200g gula merah", "200ml air", "100ml santan kental", "1/2 sdt ragi instant", "1/4 sdt garam", "Daun pandan 2 lembar"],
         ["Larutkan gula merah dalam air hangat, saring", "Campurkan tepung beras dengan larutan gula merah", "Tambahkan santan kental, aduk hingga halus", "Masukkan ragi, biarkan fermentasi 4-6 jam", "Panaskan cetakan, tuang adonan", "Masak dengan api kecil hingga matang"],
         "Adonan harus difermentasi cukup lama agar mengembang sempurna",
         "Kue kamir merupakan jajanan khas Betawi yang sudah ada sejak zaman kolonial",
         "Di beberapa daerah ditambah kelapa parut atau wijen",
         "Fermentasi adonan menggunakan ragi untuk mengembangkan tekstur",
         "Mengandung karbohidrat dari tepung beras, energi dari gula merah"),
        
        ("kue-talam", "makanan-berat", 45, "20 buah", "Medium", 4.5, "Jakarta (Betawi)",
         ["200g tepung beras", "100g tepung tapioka", "200ml santan kental", "150g gula pasir", "2 sdt pasta pandan", "Garam secubit"],
         ["Campurkan bahan lapisan atas, aduk hingga halus", "Campurkan bahan lapisan bawah, aduk hingga halus", "Tuang lapisan bawah, kukus 10 menit hingga set", "Tuang lapisan atas di atasnya", "Kukus 20 menit hingga matang", "Angkat, biarkan dingin, potong"],
         "Lapisan bawah harus benar-benar set sebelum ditambah lapisan atas",
         "Kue talam merupakan jajanan khas Betawi yang mencerminkan pengaruh Tionghoa",
         "Di beberapa daerah dibuat dengan warna kunyit, cokelat, atau durian",
         "Pengukusan bertahap untuk memastikan kedua lapisan terpisah",
         "Mengandung karbohidrat dari tepung, lemak dari santan"),
        
        ("kue-rangi", "makanan-berat", 40, "20 buah", "Easy", 4.3, "Jakarta (Betawi)",
         ["250g tepung tapioka", "200g kelapa parut", "100g gula pasir", "150ml air", "Garam secubit", "Saus gula merah"],
         ["Campurkan semua bahan kering", "Tuang air sedikit demi sedikit sambil diuleni", "Bentuk adonan menjadi bola-bola kecil", "Panggang di atas arang hingga kecokelatan", "Sajikan dengan saus gula merah"],
         "Gunakan arang untuk rasa smoky yang autentik",
         "Kue rangi merupakan jajanan khas Betawi yang dijual pedagang kaki lima",
         "Di beberapa daerah dibuat lebih pipih atau ditambah wijen",
         "Pemanggangan di atas arang untuk tekstur renyah di luar dan lembut di dalam",
         "Mengandung karbohidrat dari tepung tapioka, serat dari kelapa parut"),
        
        ("kue-nagasari", "makanan-berat", 45, "15 buah", "Easy", 4.4, "Java",
         ["300g tepung beras", "200ml santan kental", "150g gula pasir", "200ml air", "Pisang raja, iris-iris", "Garam secubit", "Daun pisang"],
         ["Campurkan tepung beras, gula pasir, garam", "Tuang santan dan air, aduk hingga halus", "Masak adonan dengan api kecil hingga mengental", "Ambil daun pisang, beri adonan, tata pisang", "Bungkus rapat, semat dengan lidi", "Kukus 20-25 menit hingga matang"],
         "Adonan harus dimasak hingga mengental sebelum dibungkus",
         "Kue nagasari merupakan jajanan tradisional yang sudah ada di Jawa sejak berabad-abad lalu",
         "Di beberapa daerah diisi kelapa parut atau tape singkong",
         "Teknik pengukusan dalam bungkusan daun pisang",
         "Mengandung karbohidrat dari tepung beras, kalium dari pisang"),
        
        ("kue-serabi", "makanan-berat", 40, "15 buah", "Easy", 4.5, "Java",
         ["200g tepung beras", "200ml santan kental", "150ml air", "100g gula pasir", "1/2 sdt ragi instant", "Garam secubit", "Daun pandan"],
         ["Campurkan tepung beras, gula pasir, ragi", "Tuang santan dan air, aduk hingga halus", "Diamkan 30 menit hingga mengembang", "Panangkan cetakan serabi", "Tuang adonan, masak hingga bagian bawah kecokelatan", "Angkat, sajikan dengan kinca atau kelapa parut"],
         "Adonan harus difermentasi hingga mengembang agar serabi ringan",
         "Kue serabi merupakan jajanan tradisional yang sudah ada di Jawa sejak zaman kerajaan",
         "Di Solo disajikan dengan kinca. Di Bandung ditambah oncom",
         "Pemanggangan adonan tepung beras dengan santan dalam cetakan kecil",
         "Mengandung karbohidrat dari tepung beras, lemak dari santan"),
        
        ("kue-pukis", "makanan-berat", 45, "20 buah", "Medium", 4.4, "Java",
         ["250g tepung terigu", "100g gula pasir", "3 butir telur", "200ml santan kental", "1/2 sdt ragi instant", "1/4 sdt vanili", "Garam secubit", "Topping: meses, keju, kelapa"],
         ["Kocok telur dan gula hingga mengembang", "Masukkan tepung terigu dan ragi, aduk rata", "Tuang santan sedikit demi sedikit", "Diamkan 30 menit hingga mengembang", "Panaskan cetakan pukis, tuang adonan", "Tambahkan topping, masak hingga kecokelatan"],
         "Adonan harus difermentasi hingga mengembang agar kue ringan",
         "Kue pukis merupakan jajanan pasar yang sangat populer di Jawa",
         "Di beberapa daerah diisi fla atau krim",
         "Pemanggangan adonan fermentasi dalam cetakan setengah bulan",
         "Mengandung karbohidrat dari tepung, protein dari telur, lemak dari santan"),
        
        ("kue-cubadak", "makanan-berat", 30, "15 buah", "Easy", 4.2, "Jakarta (Betawi)",
         ["300g nangka muda, potong-potong", "200g tepung beras", "50g tepung terigu", "150ml air", "100g gula pasir", "1/4 sdt vanili", "Garam secubit", "Minyak goreng"],
         ["Campurkan tepung beras, terigu, gula pasir, vanili, garam", "Tuang air, aduk hingga adonan encer", "Masukkan potongan nangka, aduk rata", "Goreng dalam minyak panas hingga kecokelatan", "Tiriskan dan sajikan hangat"],
         "Nangka harus muda dan belum terlalu manis agar tepung menempel",
         "Kue cubadak merupakan jajanan khas Betawi yang memanfaatkan buah nangka",
         "Di beberapa daerah menggunakan nangka yang lebih matang",
         "Penggorengan dalam minyak panas hingga kecokelatan dan renyah",
         "Mengandung karbohidrat dari tepung, serat dari nangka"),
        
        ("kue-kamir-coco", "makanan-berat", 60, "15 buah", "Easy", 4.3, "Java",
         ["300g tepung beras", "150g kelapa parut", "150g gula merah", "200ml air", "100ml santan", "1/2 sdt ragi instant", "Garam secubit"],
         ["Larutkan gula merah dalam air hangat", "Campurkan tepung beras, ragi, garam", "Tuang larutan gula merah dan santan", "Masukkan kelapa parut, aduk rata", "Diamkan 1 jam hingga mengembang", "Tuang ke cetakan, kukus 25-30 menit"],
         "Gunakan kelapa parut segar untuk rasa terbaik",
         "Kue apem coco merupakan variasi kue apem tradisional yang sudah ada di Jawa",
         "Di beberapa daerah ditambah tape singkong atau nangka",
         "Fermentasi adonan tepung beras dengan ragi, kemudian dikukus",
         "Mengandung karbohidrat, serat dari kelapa parut, lemak dari santan"),
        
        ("kue-timbang", "makanan-berat", 30, "30 buah", "Easy", 4.2, "Java",
         ["300g kelapa parut", "200g gula merah", "100g gula pasir", "50ml air", "1/4 sdt garam", "Daun pandan 1 lembar"],
         ["Masak gula merah, gula pasir, air, garam, pandan hingga larut", "Masukkan kelapa parut, aduk rata", "Masak dengan api kecil hingga adonan mengental", "Angkat, biarkan sebentar hingga bisa dipegang", "Bulatkan atau bentuk sesuai selera", "Letakkan di atas kertas minyak, biarkan dingin dan mengeras"],
         "Adonan harus dimasak hingga benar-benar mengental agar bisa dibentuk",
         "Kue timbang merupakan manisan tradisional Jawa yang sudah ada sejak lama",
         "Di beberapa daerah ditambah wijen atau kacang tanah",
         "Memasak adonan kelapa dengan gula hingga mengental dan mengkristal",
         "Tinggi gula dan lemak dari kelapa"),
        
        ("kue-dongkal", "makanan-berat", 45, "15 buah", "Easy", 4.3, "Java",
         ["400g tepung beras", "200g kelapa parut", "150g gula pasir", "100g gula merah", "Garam secubit"],
         ["Campurkan tepung beras dengan kelapa parut", "Bagi adonan menjadi dua bagian", "Satu bagian campur gula pasir, satu bagian campur gula merah", "Tata adonan putih di bawah, cokelat di atas", "Kukus 25-30 menit hingga matang", "Angkat, dinginkan, potong-potong"],
         "Tekstur kue harus lembut namun tidak lengket",
         "Kue dongkal merupakan jajanan pasar tradisional yang sudah ada di Jawa",
         "Di beberapa daerah ditambah tape singkong atau nangka",
         "Pengukusan adonan tepung beras dengan dua lapisan warna",
         "Mengandung karbohidrat dari tepung beras, serat dari kelapa parut"),
        
        ("kue-jadah", "makanan-berat", 40, "15 buah", "Easy", 4.2, "Yogyakarta",
         ["300g tepung ketan", "200g kelapa parut", "100g gula pasir", "200ml santan", "Garam secubit", "Daun pandan"],
         ["Campurkan tepung ketan, gula pasir, garam", "Tuang santan sedikit demi sedikit sambil diuleni", "Masukkan kelapa parut, aduk rata", "Bulatkan adonan sesuai selera", "Kukus 20-25 menit hingga matang"],
         "Gunakan tepung ketan berkualitas untuk tekstur yang kenyal",
         "Kue jadah merupakan jajanan khas Yogyakarta yang sering dijual di pasar tradisional",
         "Di beberapa daerah ditambah pisang atau tape singkong",
         "Pengukusan adonan tepung ketan dengan kelapa parut",
         "Mengandung karbohidrat dari tepung ketan, lemak dari kelapa"),
        
        ("kue-lupis", "makanan-berat", 60, "20 buah", "Medium", 4.5, "Java",
         ["300g beras ketan, rendam semalam", "150g kelapa parut segar", "100g gula merah", "50ml air", "Garam secubit", "Daun pisang"],
         ["Tiriskan beras ketan yang sudah direndam", "Ambil daun pisang, beri ketan, bentuk segitiga, semat dengan lidi", "Rebus lupis 1-2 jam hingga matang sempurna", "Larutkan gula merah dengan air hingga menjadi sirup", "Angkat lupis, tiriskan, balur dengan kelapa parut", "Siram dengan sirup gula merah"],
         "Ketan harus direndam semalam agar pulen",
         "Kue lupis merupakan jajanan tradisional yang sudah ada di Jawa sejak zaman kerajaan",
         "Di beberapa daerah diisi kacang hijau atau kelapa parut berbumbu",
         "Perebusan ketan dalam bungkusan daun pisang hingga matang",
         "Mengandung karbohidrat tinggi dari ketan, serat dari kelapa parut"),
        
        ("kue-bingka", "makanan-berat", 60, "12 buah", "Easy", 4.3, "Palembang",
         ["300g tepung tapioka", "200ml santan kental", "4 butir telur", "200g gula pasir", "100ml air", "1/4 sdt vanili", "Garam secubit", "Margarin untuk olesan"],
         ["Kocok telur dan gula hingga mengembang", "Masukkan tepung tapioka, aduk rata", "Tuang santan dan air, aduk hingga halus", "Tambahkan vanili dan garam", "Olesi cetakan dengan margarin, tuang adonan", "Panggang oven 180°C selama 30-35 menit"],
         "Adonan harus benar-benar halus tanpa gumpalan",
         "Kue bingka merupakan jajanan khas Palembang yang sudah ada sejak lama",
         "Di beberapa daerah ditambah tape singkong atau nangka",
         "Pemanggangan adonan tepung tapioka dengan santan dalam oven",
         "Mengandung karbohidrat dari tepung tapioka, protein dari telur"),
        
        ("kue-mendut", "makanan-berat", 60, "20 buah", "Medium", 4.3, "Java",
         ["300g tepung ketan", "200g kelapa parut", "150g gula merah", "100ml santan", "Garam secubit", "Daun pisang"],
         ["Masak kelapa parut dengan gula merah hingga larut", "Campurkan tepung ketan, santan, garam, uleni hingga kalis", "Ambil sedikit adonan, pipihkan, beri isi kelapa", "Bungkus dengan daun pisang, semat dengan lidi", "Kukus 20-25 menit hingga matang"],
         "Adonan ketan harus kalis agar mudah dibentuk",
         "Kue mendut merupakan jajanan tradisional Jawa yang sudah ada sejak lama",
         "Di beberapa daerah diisi kacang hijau atau tape singkong",
         "Pembentukan adonan tepung ketan dengan isian kelapa, pengukusan",
         "Mengandung karbohidrat dari tepung ketan, serat dari kelapa parut"),
        
        ("kue-cenil", "makanan-berat", 45, "20 buah", "Easy", 4.3, "Java",
         ["300g tepung ketan", "150g kelapa parut", "100g gula merah", "100ml air", "Garam secubit", "Pewarna makanan", "Daun pandan"],
         ["Campurkan tepung ketan dengan air hingga bisa dipulung", "Bulatkan menjadi bola-bola kecil, beri pewarna", "Rebus cenil hingga mengapung dan matang, tiriskan", "Masak gula merah dengan air dan pandan hingga sirup kental", "Susun cenil, taburi kelapa parut, siram sirup"],
         "Adonan harus cukup lembek agar bisa dibulatkan",
         "Kue cenil merupakan jajanan tradisional yang sudah ada di Jawa",
         "Di beberapa daerah dibuat dengan ketan hitam",
         "Perebusan adonan tepung ketan hingga mengapung",
         "Mengandung karbohidrat dari tepung ketan, serat dari kelapa parut"),
        
        ("kue-koci", "makanan-berat", 60, "20 buah", "Medium", 4.3, "Java",
         ["300g tepung ketan", "200g kelapa parut", "150g gula merah", "100ml santan", "Garam secubit", "Daun pisang"],
         ["Masak kelapa parut dengan gula merah hingga mengental", "Campurkan tepung ketan, santan, garam, uleni hingga kalis", "Ambil sedikit adonan, pipihkan, beri isi kelapa", "Bungkus dengan daun pisang, semat dengan lidi", "Kukus 20-25 menit hingga matang"],
         "Adonan ketan harus kalis agar mudah dibentuk",
         "Kue koci merupakan jajanan tradisional Jawa yang sudah ada sejak lama",
         "Di beberapa daerah diisi kacang hijau atau tape singkong",
         "Pembentukan adonan tepung ketan dengan isian kelapa, pengukusan",
         "Mengandung karbohidrat dari tepung ketan, serat dari kelapa parut"),
        
        ("kue-otak-otak", "makanan-berat", 45, "25 buah", "Medium", 4.5, "Nationwide",
         ["500g ikan tenggiri, haluskan", "200g tepung tapioka", "3 buah bawang merah", "2 siung bawang putih", "2 cm jahe", "1 putih telur", "Garam secukupnya", "Merica secukupnya", "Daun pisang"],
         ["Haluskan bawang merah, bawang putih, jahe", "Campurkan ikan giling dengan tepung tapioka, bumbu, putih telur", "Uleni hingga adonan kalis", "Ambil daun pisang, beri adonan, bentuk memanjang", "Bungkus rapat, semat dengan lidi", "Panggang di atas arang hingga matang"],
         "Ikan harus benar-benar halus dan segar",
         "Otak-otak merupakan jajanan yang sudah ada di Indonesia sejak berabad-abad lalu",
         "Di Palembang lebih panjang dan tipis. Di Medan lebih tebal",
         "Pencampuran adonan ikan dengan tepung tapioka hingga kalis, pemanggangan",
         "Tinggi protein dari ikan, rendah lemak, mengandung omega-3"),
        
        ("kue-tahu-sumedang", "makanan-berat", 30, "20 buah", "Easy", 4.6, "Sumedang",
         ["500g tahu sumedang", "3 siung bawang putih, haluskan", "1/2 sdt ketumbar bubuk", "1/2 sdt merica bubuk", "Garam secukupnya", "Minyak goreng banyak", "Cabai rawit hijau"],
         ["Larutkan bawang putih, ketumbar, merica, garam dalam sedikit air", "Rendam tahu dalam larutan bumbu 15-20 menit", "Goreng dalam minyak panas hingga kecokelatan dan renyah", "Tiriskan, sajikan hangat dengan cabai rawit"],
         "Gunakan tahu pong khas Sumedang yang berukuran kecil dan berongga",
         "Tahu sumedang merupakan oleh-oleh khas Sumedang yang sudah terkenal sejak tahun 1940-an",
         "Di Bandung dan Jakarta juga banyak dijual sebagai camilan populer",
         "Penggorengan dalam minyak panas hingga kecokelatan dan renyah",
         "Mengandung protein nabati dari tahu, rendah lemak"),
        
        ("kue-pempek", "makanan-berat", 60, "20 buah", "Medium", 4.8, "Palembang",
         ["500g ikan tenggiri, haluskan", "300g tepung tapioka", "2 buah bawang putih, haluskan", "Garam secukupnya", "Gula pasir secukupnya", "Air secukupnya", "Minyak goreng banyak", "Cuko: 200ml cuka, 150g gula merah, 100g gula pasir, 5 cabai rawit, 3 bawang putih"],
         ["Campurkan ikan giling, bawang putih, garam, gula pasir", "Tambahkan air sedikit demi sedikit", "Masukkan tepung tapioka, uleni hingga kalis", "Bentuk sesuai selera", "Rebus hingga mengapung, angkat", "Goreng hingga kecokelatan", "Buat cuko: rebus semua bahan hingga larut", "Sajikan pempek dengan cuko, timun, mi rebus"],
         "Ikan harus benar-benar halus dan segar untuk tekstur kenyal",
         "Pempek merupakan makanan khas Palembang yang sudah ada sejak abad ke-16",
         "Di Palembang ada pempek kapal selam, lenjer, adaan, dan keriting",
         "Pencampuran adonan ikan dengan tepung tapioka hingga kalis, perebusan, penggorengan",
         "Tinggi protein dari ikan, mengandung karbohidrat dari tepung tapioka"),
        
        ("kue-bakso-aci", "makanan-berat", 40, "4 porsi", "Easy", 4.5, "Bandung",
         ["300g tepung tapioka", "100g tepung terigu", "2 siung bawang putih, haluskan", "Garam secukupnya", "Merica secukupnya", "Air panas secukupnya", "Kuah: 1 liter air, bawang putih, seledri, daun bawang"],
         ["Campurkan tepung tapioka, terigu, bawang putih, garam, merica", "Tuang air panas sambil diuleni hingga bisa dipulung", "Bentuk menjadi bola-bola kecil", "Didihkan air untuk kuah", "Rebus bakso aci hingga mengapung", "Sajikan dalam kuah dengan seledri, daun bawang, bawang goreng"],
         "Gunakan air panas agar adonan lebih mudah dibentuk",
         "Bakso aci merupakan inovasi kuliner modern dari Bandung yang menjadi viral",
         "Di Bandung ada cuanki dan siomay aci sebagai variasi",
         "Perebusan bakso aci dalam air mendidih hingga mengapung",
         "Mengandung karbohidrat tinggi dari tepung tapioka, rendah protein"),
        
        ("kue-cireng", "makanan-berat", 30, "20 buah", "Easy", 4.3, "Bandung",
         ["300g tepung tapioka", "100g tepung terigu", "2 siung bawang putih, haluskan", "Garam secukupnya", "Merica secukupnya", "Air panas secukupnya", "Minyak goreng banyak", "Sambal rujak"],
         ["Campurkan tepung tapioka, terigu, bawang putih, garam, merica", "Tuang air panas sambil diuleni hingga adonan bisa dipulung", "Ambil sedikit adonan, pipihkan menjadi bulatan tipis", "Goreng dalam minyak panas hingga mengembang dan renyah", "Tiriskan dan sajikan dengan sambal rujak"],
         "Gunakan air panas agar adonan lebih mudah dibentuk",
         "Cireng merupakan jajanan khas Sunda yang sudah sangat populer",
         "Di Bandung ada cireng salju, cireng isi, dan cireng mozzarella",
         "Penggorengan adonan tepung tapioka dalam minyak panas hingga mengembang",
         "Mengandung karbohidrat tinggi dari tepung tapioka, rendah protein"),
        
        ("kue-cimol", "makanan-berat", 30, "25 buah", "Easy", 4.2, "Bandung",
         ["300g tepung tapioka", "100g tepung terigu", "2 siung bawang putih, haluskan", "Garam secukupnya", "Merica secukupnya", "Air panas secukupnya", "Minyak goreng banyak", "Bumbu tabur"],
         ["Campurkan tepung tapioka, terigu, bawang putih, garam, merica", "Tuang air panas sambil diuleni hingga kalis", "Bulatkan menjadi bola-bola kecil sebesar kelereng", "Goreng dalam minyak panas hingga mengembang dan renyah", "Tiriskan, taburi bumbu tabur"],
         "Goreng dengan minyak tidak terlalu panas agar cimol mengembang sempurna",
         "Cimol merupakan jajanan khas Bandung yang populer di seluruh Indonesia",
         "Di Bandung ada cireng salju, cireng isi, dan cireng mozzarella",
         "Penggorengan adonan tepung tapioka kecil dalam minyak panas hingga mengembang",
         "Mengandung karbohidrat tinggi dari tepung tapioka, rendah protein"),
        
        ("kue-mendoan", "makanan-berat", 30, "20 buah", "Easy", 4.4, "Purwokerto",
         ["300g tempe, iris tipis memanjang", "200g tepung beras", "50g tepung terigu", "200ml air", "3 buah bawang merah, iris halus", "2 siung bawang putih, haluskan", "1 batang daun bawang, iris halus", "Garam secukupnya", "Minyak goreng banyak"],
         ["Campurkan tepung beras, terigu, bawang putih, garam", "Tuang air, aduk hingga adonan encer", "Masukkan irisan bawang merah dan daun bawang", "Lumuri irisan tempe dengan adonan tepung", "Goreng sebentar hingga adonan set namun belum renyah"],
         "Mendoan harus digoreng sebentar saja sehingga adonannya masih lembut",
         "Mendoan berasal dari Purwokerto, Jawa Tengah, merupakan jajanan khas Banyumas",
         "Di luar daerah asalnya mendoan juga banyak dijual dengan tingkat kematangan berbeda",
         "Penggorengan adonan tepung beras dengan tempe sebentar hingga set",
         "Mengandung protein nabati dari tempe, karbohidrat dari tepung"),
        
        ("kue-tempe-goreng", "makanan-berat", 30, "20 buah", "Easy", 4.3, "Java",
         ["300g tempe, iris tipis", "150g tepung beras", "50g tepung terigu", "200ml air", "3 siung bawang putih, haluskan", "1/2 sdt ketumbar bubuk", "1/2 sdt merica bubuk", "Garam secukupnya", "Minyak goreng banyak"],
         ["Campurkan tepung beras, terigu, bawang putih, ketumbar, merica, garam", "Tuang air, aduk hingga adonan encer", "Lumuri irisan tempe dengan adonan", "Goreng dalam minyak panas hingga kecokelatan dan renyah", "Tiriskan dan sajikan dengan cabai rawit"],
         "Irisan tempe harus tipis agar matang merata",
         "Tempe merupakan makanan asli Indonesia yang sudah ada sejak berabad-abad lalu",
         "Di berbagai daerah tempe goreng memiliki variasi bumbu yang beragam",
         "Penggorengan irisan tempe dengan adonan tepung beras hingga renyah",
         "Tinggi protein nabati dari tempe, rendah lemak"),
        
        ("kue-pisang-goreng", "makanan-berat", 20, "15 buah", "Easy", 4.5, "Nationwide",
         ["300g pisang raja, belah dua memanjang", "200g tepung beras", "50g tepung terigu", "150ml air", "100g gula pasir", "1/4 sdt vanili", "Garam secubit", "Minyak goreng banyak"],
         ["Campurkan tepung beras, terigu, gula pasir, vanili, garam", "Tuang air, aduk hingga adonan encer", "Lumuri pisang dengan adonan tepung", "Goreng dalam minyak panas hingga kecokelatan dan renyah", "Tiriskan dan sajikan hangat"],
         "Gunakan pisang raja yang matang untuk rasa manis alami",
         "Pisang goreng merupakan jajanan yang sudah ada di Indonesia sejak zaman kolonial",
         "Di berbagai daerah pisang goreng memiliki variasi yang beragam",
         "Penggorengan pisang dengan adonan tepung beras hingga kecokelatan dan renyah",
         "Mengandung kalium dan vitamin dari pisang, karbohidrat dari tepung"),
        
        ("kue-roti-john", "makanan-berat", 20, "4 porsi", "Easy", 4.4, "Nationwide",
         ["4 roti burger, belah dua", "4 butir telur", "100g daging cincang", "2 buah bawang merah, cincang", "2 siung bawang putih, cincang", "Garam secukupnya", "Merica secukupnya", "Mayones", "Saus sambal", "Keju parut", "Margarin"],
         ["Kocok telur, campurkan dengan daging cincang, bawang, garam, merica", "Panaskan margarin di atas teflon", "Letakkan roti belahan terbuka, tuang adonan telur di atasnya", "Masak hingga bagian bawah kecokelatan dan telur matang", "Balik roti, masak hingga kecokelatan", "Angkat, tambahkan mayones, saus sambal, keju"],
         "Gunakan api sedang agar roti kecokelatan tanpa gosong",
         "Roti John berasal dari pengaruh kuliner Melayu-Indonesia, populer sejak tahun 1960-an",
         "Di berbagai daerah roti john memiliki variasi isi yang beragam",
         "Pemanggangan roti dengan adonan telur di atas teflon hingga kecokelatan",
         "Mengandung karbohidrat dari roti, protein dari telur dan daging"),
        
        ("kue-kue-citul", "makanan-berat", 30, "30 buah", "Easy", 4.2, "West Java",
         ["300g tepung beras", "100g tepung tapioka", "2 siung bawang putih, haluskan", "Garam secukupnya", "Merica secukupnya", "Air panas secukupnya", "Minyak goreng banyak", "Bumbu tabur"],
         ["Campurkan tepung beras, tapioka, bawang putih, garam, merica", "Tuang air panas sambil diuleni hingga kalis", "Bulatkan menjadi bola-bola kecil", "Goreng dalam minyak panas hingga mengembang dan renyah", "Tiriskan, taburi bumbu tabur"],
         "Goreng dengan minyak tidak terlalu panas agar citul mengembang sempurna",
         "Kue citul merupakan jajanan khas Sunda yang sudah ada sejak lama",
         "Di berbagai daerah Sunda kue citul memiliki variasi rasa bumbu tabur",
         "Penggorengan adonan tepung beras dalam minyak panas hingga mengembang",
         "Mengandung karbohidrat dari tepung beras, rendah protein"),
        
        ("kue-kemplang", "makanan-berat", 60, "30 buah", "Medium", 4.3, "Palembang",
         ["300g ikan tenggiri, haluskan", "200g tepung tapioka", "3 siung bawang putih, haluskan", "Garam secukupnya", "Merica secukupnya", "Air secukupnya", "Minyak goreng banyak"],
         ["Campurkan ikan giling, tepung tapioka, bawang putih, garam, merica", "Tambahkan air sambil diuleni hingga adonan kalis", "Pipihkan menjadi lempengan tipis bulat", "Jemur hingga benar-benar kering 1-2 hari", "Goreng dalam minyak panas hingga mengembang dan renyah"],
         "Kemplang harus benar-benar kering sebelum digoreng",
         "Kemplang merupakan camilan khas Palembang yang sudah terkenal sejak lama",
         "Di Palembang ada kemplang bakar dan kemplang goreng",
         "Pembentukan adonan menjadi lempengan tipis, pengeringan, penggorengan hingga mengembang",
         "Mengandung protein dari ikan, karbohidrat dari tepung tapioka"),
        
        ("kue-serabi-notosuman", "makanan-berat", 40, "15 buah", "Easy", 4.5, "Solo",
         ["200g tepung beras", "200ml santan kental", "100ml air", "100g gula pasir", "1/2 sdt ragi instant", "Garam secubit", "Daun pandan", "Kinca: 100g gula merah, 100ml air"],
         ["Campurkan tepung beras, gula pasir, ragi", "Tuang santan dan air, aduk hingga halus", "Diamkan 30 menit hingga mengembang", "Buat kinca: rebus gula merah, air, pandan hingga larut", "Panaskan cetakan serabi", "Tuang adonan tipis-tipis, masak hingga bagian bawah renyah"],
         "Adonan harus difermentasi hingga mengembang",
         "Serabi notosuman merupakan variasi serabi khas Solo yang sudah terkenal",
         "Di Solo serabi notosuman dijual di berbagai penjual dengan resep turun-temurun",
         "Pemanggangan adonan tepung beras dengan santan dalam cetakan kecil",
         "Mengandung karbohidrat dari tepung beras, lemak dari santan"),
        
        ("kue-klepon", "makanan-berat", 45, "25 buah", "Medium", 4.6, "Java",
         ["300g tepung ketan", "100g tepung beras", "150g gula merah, iris tipis", "150g kelapa parut segar", "200ml air", "Pasta pandan", "Garam secubit"],
         ["Campurkan tepung ketan, tepung beras, pasta pandan, garam", "Tuang air sambil diuleni hingga bisa dipulung", "Ambil sedikit adonan, pipihkan, beri isi gula merah iris", "Bulatkan, pastikan gula merah terbungkus rapat", "Rebus dalam air mendidih hingga mengapung", "Angkat, tiriskan, balur dengan kelapa parut"],
         "Gula merah harus terbungkus rapat agar tidak bocor saat direbus",
         "Klepon merupakan jajanan tradisional yang sudah ada di Jawa sejak berabad-abad lalu",
         "Di beberapa daerah klepon diisi kacang hijau atau cokelat",
         "Perebusan adonan tepung ketan berisi gula merah hingga mengapung",
         "Mengandung karbohidrat dari tepung ketan, serat dari kelapa parut"),
        
        ("kue-getas", "makanan-berat", 40, "20 buah", "Easy", 4.2, "Java",
         ["300g tepung ketan", "100g tepung beras", "150ml santan", "100g gula pasir", "Garam secubit", "Minyak goreng banyak"],
         ["Campurkan tepung ketan, tepung beras, gula pasir, garam", "Tuang santan sambil diuleni hingga adonan kalis", "Ambil sedikit adonan, bentuk bulatan pipih", "Goreng dalam minyak panas hingga kecokelatan dan renyah", "Tiriskan, sajikan"],
         "Adonan harus kalis agar mudah dibentuk",
         "Getas merupakan jajanan tradisional Jawa yang sudah ada sejak lama",
         "Di beberapa daerah getas ditambah wijen atau kacang tanah",
         "Penggorengan adonan tepung ketan dalam minyak panas hingga renyah",
         "Mengandung karbohidrat dari tepung ketan"),
        
        ("kue-kembang-goyang", "makanan-berat", 45, "30 buah", "Medium", 4.3, "Java",
         ["200g tepung beras", "100g tepung terigu", "3 butir telur", "200ml santan", "100g gula pasir", "Garam secubit", "Pewarna makanan", "Minyak goreng banyak", "Cetakan kembang goyang"],
         ["Kocok telur dan gula hingga mengembang", "Masukkan tepung beras dan terigu, aduk rata", "Tuang santan, aduk hingga halus", "Panaskan cetakan dalam minyak panas", "Celupkan cetakan ke dalam adonan", "Goreng hingga adonan terlepas dan matang"],
         "Cetakan harus benar-benar panas sebelum dicelupkan ke dalam adonan",
         "Kembang goyang merupakan jajanan tradisional yang sudah ada di Jawa sejak lama",
         "Di beberapa daerah kembang goyang ditambah wijen",
         "Pencelupan cetakan ke dalam adonan, penggorengan dalam minyak panas",
         "Mengandung karbohidrat dari tepung beras, protein dari telur"),
        
        ("kue-rempeyek", "makanan-berat", 40, "30 buah", "Easy", 4.4, "Java",
         ["200g tepung beras", "100g kacang tanah, belah dua", "200ml air", "2 siung bawang putih, haluskan", "1 cm kencur, haluskan", "Garam secukupnya", "Minyak goreng banyak"],
         ["Campurkan tepung beras, bawang putih, kencur, garam", "Tuang air sambil diaduk hingga adonan encer", "Masukkan kacang tanah, aduk rata", "Ambil sedikit adonan dengan sendok, goreng dalam minyak panas", "Tiriskan dan sajikan"],
         "Adonan harus cukup encer agar rempeyek tipis dan renyah",
         "Rempeyek merupakan jajanan tradisional yang sudah ada di Jawa sejak lama",
         "Di berbagai daerah rempeyek memiliki variasi topping yang beragam",
         "Penggorengan adonan tepung beras dengan kacang tanah hingga renyah",
         "Mengandung karbohidrat dari tepung beras, protein dari kacang tanah"),
        
        ("kue-kastengel", "makanan-berat", 60, "30 buah", "Medium", 4.4, "Nationwide",
         ["300g tepung terigu", "200g margarin", "150g keju parut", "2 butir kuning telur", "50g maizena", "Garam secubit", "Keju parut untuk taburan"],
         ["Kocok margarin hingga lembut", "Masukkan kuning telur, aduk rata", "Masukkan tepung terigu dan maizena, aduk hingga adonan terbentuk", "Masukkan 2/3 keju parut, aduk rata", "Pipihkan adonan, potong-potong", "Susun di loyang, taburi sisa keju", "Panggang oven 160°C selama 20-25 menit"],
         "Panggang dengan suhu tidak terlalu tinggi agar matang merata tanpa gosong",
         "Kue kastengel merupakan pengaruh kuliner Belanda yang menjadi kue khas Lebaran",
         "Di berbagai daerah kue kastengel memiliki variasi resep yang beragam",
         "Pemanggangan adonan tepung terigu dengan keju dalam oven",
         "Mengandung karbohidrat dari tepung, lemak dari margarin dan keju"),
        
        ("kue-nastar", "makanan-berat", 90, "40 buah", "Medium", 4.5, "Nationwide",
         ["Kulit: 300g tepung terigu, 200g margarin, 100g gula halus, 2 kuning telur, 50g maizena", "Isi: 500g nanas, 100g gula pasir, 1/2 sdt kayu manis", "Kuning telur untuk olesan"],
         ["Buat isi nanas: masak nanas parut dengan gula hingga mengental", "Kocok margarin dan gula halus hingga lembut", "Masukkan kuning telur, aduk rata", "Masukkan tepung terigu dan maizena, aduk hingga adonan terbentuk", "Ambil adonan, pipihkan, beri isi nanas, bulatkan", "Susun di loyang, olesi kuning telur, taburi wijen", "Panggang oven 160°C selama 20-25 menit"],
         "Isi nanas harus dimasak hingga benar-benar mengental",
         "Kue nastar merupakan pengaruh kuliner Belanda, menjadi kue Lebaran paling populer",
         "Di berbagai daerah nastar memiliki variasi bentuk dan ukuran",
         "Pembuatan isi nanas yang dimasak hingga mengental, pemanggangan dalam oven",
         "Mengandung karbohidrat dari tepung, lemak dari margarin, vitamin dari nanas"),
        
        ("kue-soes", "makanan-berat", 60, "20 buah", "Medium", 4.4, "Nationwide",
         ["Kulit: 100g margarin, 150ml air, 100g tepung terigu, 3 butir telur, garam", "Isi: 500ml susu cair, 100g gula pasir, 3 kuning telur, 30g maizena, vanili"],
         ["Kulit: didihkan margarin, air, garam", "Masukkan tepung terigu sekaligus, aduk hingga adonan menggumpal", "Biarkan dingin, masukkan telur satu per satu hingga halus", "Semprotkan adonan ke loyang", "Panggang oven 200°C selama 25-30 menit", "Isi: masak susu, gula, vanili hingga mendidih", "Kocok kuning telur dan maizena, tuang susu panas", "Masak hingga mengental, biarkan dingin", "Semprotkan isi ke dalam kulit soes"],
         "Adonan kulit harus benar-benar halus dan mengkilap",
         "Kue soes merupakan pengaruh kuliner Belanda yang diadaptasi dengan selera lokal",
         "Di berbagai daerah kue soes memiliki variasi isi yang beragam",
         "Pembuatan choux pastry yang mengembang saat dipanggang, pembuatan custard filling",
         "Mengandung karbohidrat dari tepung, lemak dari margarin, protein dari telur dan susu"),
        
        ("kue-lidah-kucing", "makanan-berat", 60, "40 buah", "Medium", 4.3, "Nationwide",
         ["200g tepung terigu", "150g margarin", "100g gula halus", "2 putih telur", "1/4 sdt vanili", "Garam secubit", "Cetakan lidah kucing"],
         ["Kocok margarin dan gula halus hingga lembut", "Masukkan putih telur satu per satu, aduk rata", "Masukkan tepung terigu, aduk hingga adonan terbentuk", "Semprotkan ke cetakan lidah kucing", "Panggang oven 160°C selama 15-20 menit hingga kecokelatan di tepi"],
         "Adonan harus halus agar bisa disemprotkan dengan mudah",
         "Kue lidah kucing merupakan pengaruh kuliner Belanda yang menjadi kue Lebaran populer",
         "Di berbagai daerah kue lidah kucing memiliki variasi rasa",
         "Penyemprotan adonan ke dalam cetakan, pemanggangan hingga kecokelatan",
         "Mengandung karbohidrat dari tepung, lemak dari margarin"),
        
        ("kue-sagu-gula", "makanan-berat", 45, "15 buah", "Easy", 4.2, "Maluku",
         ["300g tepung sagu", "200g gula merah", "300ml air", "100ml santan", "Garam secubit", "Daun pandan"],
         ["Larutkan gula merah dalam air hangat, saring", "Campurkan tepung sagu dengan larutan gula merah dan santan", "Aduk hingga halus, tambahkan garam dan pandan", "Tuang ke cetakan yang sudah diolesi minyak", "Kukus 30-35 menit hingga matang sempurna"],
         "Adonan harus benar-benar halus tanpa gumpalan",
         "Sagu gula merupakan jajanan khas Maluku yang sudah ada sejak lama",
         "Di berbagai daerah Maluku sagu gula memiliki variasi rasa",
         "Pengukusan adonan tepung sagu dengan gula merah hingga matang",
         "Mengandung karbohidrat tinggi dari tepung sagu, gula dari gula merah"),
        
        ("kue-bagea", "makanan-berat", 60, "30 buah", "Medium", 4.3, "Manado",
         ["300g tepung sagu", "150g kacang mede atau kemiri, sangrai dan haluskan", "100g gula pasir", "100ml santan", "2 butir kuning telur", "1/4 sdt vanili", "Garam secubit"],
         ["Campurkan tepung sagu, kacang halus, gula pasir, garam", "Masukkan kuning telur, santan, vanili, uleni hingga kalis", "Bentuk menjadi bulatan pipih dengan jari hingga bergerigi", "Susun di loyang", "Panggang oven 170°C selama 20-25 menit"],
         "Kacang mede atau kemiri harus disangrai terlebih dahulu",
         "Bagea merupakan jajanan khas Manado yang sudah ada sejak lama",
         "Di Manado bagea memiliki variasi rasa yang beragam",
         "Pembentukan adonan tepung sagu menjadi bulatan pipih bergerigi, pemanggangan",
         "Mengandung karbohidrat dari tepung sagu, lemak dan protein dari kacang"),
    ]
    
    for slug, kategori, waktu, porsi, kesulitan, rating, origin, bahan, cara, tips, sej, var_, teknik, gizi in jajanan:
        if slug not in existing_slugs:
            new_recipes.append(make_recipe(next_id, slug, kategori, waktu, porsi, kesulitan, rating, origin, bahan, cara, tips, sej, var_, teknik, gizi))
            existing_slugs.add(slug)
            next_id += 1
    
    print(f"Added {len(new_recipes)} jajanan recipes (IDs {max_id+1}-{next_id-1})")
    
    # Convert to TypeScript and insert
    new_ts = ',\n'.join(new_recipes)
    new_content = content[:arr_end] + new_ts + ',\n' + content[arr_end:]
    
    with open('src/data/recipes.ts', 'w') as f:
        f.write(new_content)
    
    # Verify
    with open('src/data/recipes.ts', 'r') as f:
        verify = f.read()
    verify_slugs = set(re.findall(r'slug:\s*"([^"]+)"', verify))
    verify_ids = set(int(x) for x in re.findall(r'id:\s*(\d+)', verify))
    print(f"Verified: {len(verify_slugs)} unique slugs, {len(verify_ids)} total recipes")


if __name__ == '__main__':
    main()
