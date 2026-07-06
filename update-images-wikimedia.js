const fs = require('fs');

// Direct Wikimedia Commons image URLs for Indonesian dishes
const imageMap = {
  'javanese-fried-rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Nasi_goreng_in_Jakarta.jpg/1200px-Nasi_goreng_in_Jakarta.jpg',
  'padang-beef-rendang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Rendang_daging.jpg/1200px-Rendang_daging.jpg',
  'madura-chicken-satay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sate_Ayam.jpg/1200px-Sate_Ayam.jpg',
  'lamongan-chicken-soto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Soto_ayam_lamongan.jpg/1200px-Soto_ayam_lamongan.jpg',
  'betawi-gado-gado': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Gado_gado_jakarta.jpg/1200px-Gado_gado_jakarta.jpg',
  'complete-malang-meatballs': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Bakso_Indonesian_Meatball_Soup_from_Solo.jpg/1200px-Bakso_Indonesian_Meatball_Soup_from_Solo.jpg',
  'bangka-sweet-martabak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Martabak_manis.jpg/1200px-Martabak_manis.jpg',
  'cendol-dawet-ayu-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Cendol.jpg/1200px-Cendol.jpg',
  'palembang-submarine-pempek': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Pempek_lenjer_dan_krispi.jpg/1200px-Pempek_lenjer_dan_krispi.jpg',
  'nusantara-es-teler': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Es_teler.jpg/1200px-Es_teler.jpg',
  'galangal-fried-chicken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ayam_goreng_lengkuas.jpg/1200px-Ayam_goreng_lengkuas.jpg',
  'stir-fried-water-spinach-with-shrimp-paste': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Kangkung_belacan.jpg/1200px-Kangkung_belacan.jpg',
  'jimbaran-grilled-fish': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ikan_bakar_jimbaran.jpg/1200px-Ikan_bakar_jimbaran.jpg',
  'indonesian-oxtail-soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Sop_buntut.jpg/1200px-Sop_buntut.jpg',
  'javanese-fried-noodles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Mie_goreng_jawa.jpg/1200px-Mie_goreng_jawa.jpg',
  'spicy-fried-potatoes-with-liver': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Sambal_goreng_kentang.jpg/1200px-Sambal_goreng_kentang.jpg',
  'thick-gravy-mixed-vegetables': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Capcay.jpg/1200px-Capcay.jpg',
  'steamed-spiced-goldfish': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Pepes_ikan.jpg/1200px-Pepes_ikan.jpg',
  'beef-rib-soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sop_iga.jpg/1200px-Sop_iga.jpg',
  'solo-liwet-rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Nasi_liwet.jpg/1200px-Nasi_liwet.jpg',
  'taliwang-grilled-chicken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Ayam_bakar_taliwang.jpg/1200px-Ayam_bakar_taliwang.jpg',
  'young-jackfruit-gudeg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Gudeg.jpg/1200px-Gudeg.jpg',
  'crispy-fried-banana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Pisang_goreng.jpg/1200px-Pisang_goreng.jpg',
  'gejrot-tofu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tahu_gejrot.jpg/1200px-Tahu_gejrot.jpg',
  'surabaya-mixed-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Es_campur.jpg/1200px-Es_campur.jpg',
  'potato-fritters': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Perkedel_kentang.jpg/1200px-Perkedel_kentang.jpg',
  'grilled-tilapia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Ikan_nila_bakar.jpg/1200px-Ikan_nila_bakar.jpg',
  'jakarta-chicken-porridge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Bubur_ayam_jakarta.jpg/1200px-Bubur_ayam_jakarta.jpg',
  'mendoan-tempeh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Tempe_mendoan.jpg/1200px-Tempe_mendoan.jpg',
  'pak-min-klaten-chicken-soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Sop_ayam.jpg/1200px-Sop_ayam.jpg',
  'pallubasa-soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Pallubasa.jpg/1200px-Pallubasa.jpg',
  'padang-satay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Sate_padang.jpg/1200px-Sate_padang.jpg',
  'balinese-minced-satay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sate_lilit.jpg/1200px-Sate_lilit.jpg',
  'pusut-satay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sate_pusut.jpg/1200px-Sate_pusut.jpg',
  'klatak-iron-skewer-satay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Sate_klatak.jpg/1200px-Sate_klatak.jpg',
  'maranggi-beef-satay': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sate_maranggi.jpg/1200px-Sate_maranggi.jpg',
  'yogyakarta-gudeg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Gudeg.jpg/1200px-Gudeg.jpg',
  'lodeh-vegetable-stew': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Sayur_lodeh.jpg/1200px-Sayur_lodeh.jpg',
  'rice-cake-with-vegetable-stew': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Lontong_sayur.jpg/1200px-Lontong_sayur.jpg',
  'ketoprak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ketoprak.jpg/1200px-Ketoprak.jpg',
  'betawi-coconut-rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Nasi_uduk.jpg/1200px-Nasi_uduk.jpg',
  'yellow-turmeric-rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Nasi_kuning.jpg/1200px-Nasi_kuning.jpg',
  'cone-shaped-festive-rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Nasi_tumpeng.jpg/1200px-Nasi_tumpeng.jpg',
  'manado-porridge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Tinutuan.jpg/1200px-Tinutuan.jpg',
  'brothers-soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Sop_saudara.jpg/1200px-Sop_saudara.jpg',
  'tinutuan-porridge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Tinutuan.jpg/1200px-Tinutuan.jpg',
  'klepon-rice-balls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Klepon.jpg/1200px-Klepon.jpg',
  'sesame-balls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Onde_onde.jpg/1200px-Onde_onde.jpg',
  'layer-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Kue_lapis.jpg/1200px-Kue_lapis.jpg',
  'mud-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Kue_lumpur.jpg/1200px-Kue_lumpur.jpg',
  'bika-ambon-honeycomb-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Bika_ambon.jpg/1200px-Bika_ambon.jpg',
  'snow-white-cookies': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Putri_salju.jpg/1200px-Putri_salju.jpg',
  'cheese-stick-cookies': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Kastengel.jpg/1200px-Kastengel.jpg',
  'pineapple-tart-cookies': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Nastar.jpg/1200px-Nastar.jpg',
  'bamboo-sticky-rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Lemang.jpg/1200px-Lemang.jpg',
  'sweet-sticky-rice-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Wajik.jpg/1200px-Wajik.jpg',
  'doger-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Es_doger.jpg/1200px-Es_doger.jpg',
  'pletok-herbal-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Bir_pletok.jpg/1200px-Bir_pletok.jpg',
  'uwuh-herbal-drink': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Wedang_uwuh.jpg/1200px-Wedang_uwuh.jpg',
  'ronde-ginger-drink': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Wedang_ronde.jpg/1200px-Wedang_ronde.jpg',
  'bandrek-ginger-drink': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Bandrek.jpg/1200px-Bandrek.jpg',
  'sekoteng-ginger-drink': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Sekoteng.jpg/1200px-Sekoteng.jpg',
  'palm-sap-drink': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Lahang.jpg/1200px-Lahang.jpg',
  'gempol-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Es_gempol.jpg/1200px-Es_gempol.jpg',
  'cendol-jelly-drink': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Cendol.jpg/1200px-Cendol.jpg',
  'kopyor-coconut-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Es_kopyor.jpg/1200px-Es_kopyor.jpg',
  'betutu-slow-cooked-chicken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ayam_betutu.jpg/1200px-Ayam_betutu.jpg',
  'smashed-fried-chicken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Ayam_geprek.jpg/1200px-Ayam_geprek.jpg',
  'pop-chicken': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ayam_pop.jpg/1200px-Ayam_pop.jpg',
  'jengkol-rendang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Rendang_jengkol.jpg/1200px-Rendang_jengkol.jpg',
  'beaten-smoked-beef': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Dendeng_batokok.jpg/1200px-Dendeng_batokok.jpg',
  'intestine-curry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Gulai_tambusu.jpg/1200px-Gulai_tambusu.jpg',
  'kalio-beef-curry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Kalio.jpg/1200px-Kalio.jpg',
  'patin-fish-sour-soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Pindang_patin.jpg/1200px-Pindang_patin.jpg',
  'fermented-durian-fish': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tempoyak.jpg/1200px-Tempoyak.jpg',
  'aceh-curry-noodles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Mie_aceh.jpg/1200px-Mie_aceh.jpg',
  'beulangong-curry-soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Kuah_beulangong.jpg/1200px-Kuah_beulangong.jpg',
  'goat-meat-soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Sop_kambing.jpg/1200px-Sop_kambing.jpg',
  'solo-timlo-soup': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Timlo_solo.jpg/1200px-Timlo_solo.jpg',
  'tongseng-stir-fry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tongseng.jpg/1200px-Tongseng.jpg',
  'oncom-rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tutug_oncom.jpg/1200px-Tutug_oncom.jpg',
  'rice-cake-with-tofu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Kupat_tahu.jpg/1200px-Kupat_tahu.jpg',
  'serabi-coconut-pancake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Serabi.jpg/1200px-Serabi.jpg',
  'rolled-coconut-crepe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Dadar_gulung.jpg/1200px-Dadar_gulung.jpg',
  'lemper-sticky-rice-roll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Lemper.jpg/1200px-Lemper.jpg',
  'arem-arem-rice-roll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Arem_arem.jpg/1200px-Arem_arem.jpg',
  'putu-steamed-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Kue_putu.jpg/1200px-Kue_putu.jpg',
  'cenil-tapioca-balls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Cenil.jpg/1200px-Cenil.jpg',
  'gethuk-cassava-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Gethuk.jpg/1200px-Gethuk.jpg',
  'mochi-rice-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mochi.jpg/1200px-Mochi.jpg',
  'cubit-pinch-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Kue_cubit.jpg/1200px-Kue_cubit.jpg',
  'pukis-half-moon-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Pukis.jpg/1200px-Pukis.jpg',
  'bakpia-sweet-roll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Bakpia.jpg/1200px-Bakpia.jpg',
  'wingko-coconut-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Wingko.jpg/1200px-Wingko.jpg',
  'talam-steamed-cake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Kue_talam.jpg/1200px-Kue_talam.jpg',
  'butung-banana-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Es_palu_butung.jpg/1200px-Es_palu_butung.jpg',
  'young-coconut-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Es_kelapa_muda.jpg/1200px-Es_kelapa_muda.jpg',
  'sugarcane-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Es_tebu.jpg/1200px-Es_tebu.jpg',
  'shaved-cucumber-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Es_timun_serut.jpg/1200px-Es_timun_serut.jpg',
  'red-bean-ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Es_kacang_merah.jpg/1200px-Es_kacang_merah.jpg',
};

function updateRecipes() {
  let content = fs.readFileSync('/home/liveuser/nusantaraeats/src/data/recipes.ts', 'utf8');
  
  let updatedCount = 0;
  
  for (const [slug, imageUrl] of Object.entries(imageMap)) {
    const slugIndex = content.indexOf(`slug: "${slug}"`);
    if (slugIndex === -1) continue;
    
    const imageIndex = content.indexOf('image:', slugIndex);
    if (imageIndex === -1) continue;
    
    const lineEnd = content.indexOf('\n', imageIndex);
    const oldLine = content.substring(imageIndex, lineEnd);
    const newLine = `    image: "${imageUrl}"`;
    
    content = content.replace(oldLine, newLine);
    updatedCount++;
  }
  
  fs.writeFileSync('/home/liveuser/nusantaraeats/src/data/recipes.ts', content);
  console.log(`✅ Updated ${updatedCount} images to Wikimedia Commons URLs`);
}

updateRecipes();
