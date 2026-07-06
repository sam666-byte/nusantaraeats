const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Cloudflare API config
const CF_API_TOKEN = 'cfat_30WwxWSazNdtuL82R1Mn6XG0u7IAcrqNSwpMh2gEd69ea728';
const CF_ACCOUNT_ID = '243dd09cf194815c3fce5ce09528167c';
const CF_AI_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`;

// 100 NEW unique Indonesian recipes (not in existing 262)
const newRecipes = [
  // ===== MAIN DISHES (Makanan Berat) =====
  {
    id: 263, slug: "nasi-kunig-medes", title: "Nasi Kunig Medes Recipe: Medan's Turmeric Coconut Rice",
    shortTitle: "Nasi Kunig Medes", description: "Aromatic turmeric rice from Medan cooked with coconut milk, lemongrass, and pandan leaves, served with various side dishes.",
    kategori: "makanan-berat", waktu: 45, porsi: "4-6 servings", kesulitan: "Medium", rating: 4.6, origin: "Medan, North Sumatra",
    ingredients: ["2 cups jasmine rice", "400ml coconut milk", "2 turmeric fingers (grated)", "3 lemongrass stalks (bruised)", "4 pandan leaves", "2 bay leaves", "1 tsp salt", "1/2 tsp pepper", "2 cups water"],
    instructions: ["Rinse rice until water runs clear", "Grate fresh turmeric and squeeze to extract juice", "Combine rice, coconut milk, water, turmeric juice, lemongrass, pandan leaves, bay leaves, salt and pepper in rice cooker", "Cook until done and let rest for 10 minutes", "Fluff with fork and remove aromatics", "Serve hot with fried chicken, sambal, and emping crackers"]
  },
  {
    id: 264, slug: "ayam-bakar-kecombrang", title: "Ayam Bakar Kecombrang Recipe: Torch Ginger Grilled Chicken",
    shortTitle: "Ayam Bakar Kecombrang", description: "Fragrant grilled chicken marinated with kecombrang (torch ginger flower), a unique Balinese aromatic herb.",
    kategori: "makanan-berat", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.7, origin: "Bali",
    ingredients: ["1 whole chicken (cut into pieces)", "5 kecombrang flowers (sliced)", "6 shallots", "4 garlic cloves", "3 candlenuts", "2 cm ginger", "2 cm galangal", "1 tsp turmeric powder", "2 tbsp sweet soy sauce", "1 tbsp tamarind water", "Salt to taste", "2 tbsp coconut oil"],
    instructions: ["Grind shallots, garlic, candlenuts, ginger, galangal, and turmeric into smooth paste", "Mix paste with sliced kecombrang, sweet soy sauce, tamarind water, and salt", "Marinate chicken pieces for at least 2 hours", "Grill over medium charcoal heat, basting with leftover marinade", "Turn frequently until charred and cooked through", "Serve with steamed rice and fresh vegetables"]
  },
  {
    id: 265, slug: "daging-masak- Hitam", title: "Daging Masak Hitam Recipe: Malaccan Black Beef Curry",
    shortTitle: "Daging Masak Hitam", description: "Rich dark beef curry from Malacca cooked with soy sauce, star anise, and cinnamon until deeply caramelized.",
    kategori: "makanan-berat", waktu: 120, porsi: "6 servings", kesulitan: "Hard", rating: 4.8, origin: "Malacca",
    ingredients: ["1 kg beef brisket (cubed)", "4 tbsp sweet soy sauce", "2 tbsp dark soy sauce", "3 star anise", "2 cinnamon sticks", "4 cardamom pods", "5 cloves", "2 lemongrass stalks", "6 shallots", "4 garlic cloves", "1 tsp black pepper", "2 cups water", "2 tbsp oil", "Salt to taste"],
    instructions: ["Heat oil and fry whole spices until fragrant", "Add blended shallots and garlic, cook until golden", "Add beef and stir until browned on all sides", "Pour in sweet and dark soy sauce, mix well", "Add water and bring to boil", "Reduce heat and simmer for 1.5 hours until tender", "Adjust seasoning and serve with white rice"]
  },
  {
    id: 266, slug: "ikan-patin-tempoyak", title: "Ikan Patin Tempoyak Recipe: Catfish in Fermented Durian Sauce",
    shortTitle: "Ikan Patin Tempoyak", description: "Freshwater catfish cooked in spicy fermented durian sauce, a signature Palembang delicacy.",
    kategori: "makanan-berat", waktu: 45, porsi: "4 servings", kesulitan: "Medium", rating: 4.5, origin: "Palembang, South Sumatra",
    ingredients: ["500g catfish (patin) slices", "200g tempoyak (fermented durian)", "5 red chilies", "3 bird's eye chilies", "4 shallots", "2 garlic cloves", "2 cm turmeric", "1 tsp shrimp paste", "2 tbsp cooking oil", "1 cup water", "Salt and sugar to taste"],
    instructions: ["Grind chilies, shallots, garlic, turmeric, and shrimp paste into paste", "Heat oil and sauté paste until fragrant", "Add tempoyak and stir well", "Pour in water and bring to simmer", "Add catfish slices and cook gently for 15 minutes", "Season with salt and sugar", "Serve hot with steamed rice"]
  },
  {
    id: 267, slug: "sate-babi-buleleng", title: "Sate Babi Buleleng Recipe: Balinese Pork Satay",
    shortTitle: "Sate Babi Buleleng", description: "Tender pork satay from Buleleng, Bali, marinated in a rich spice paste and grilled over coconut husk charcoal.",
    kategori: "sate-panggang", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.7, origin: "Buleleng, Bali",
    ingredients: ["500g pork shoulder (cubed)", "6 shallots", "4 garlic cloves", "3 candlenuts", "2 cm turmeric", "2 cm ginger", "1 lemongrass stalk", "1 tsp coriander", "1/2 tsp pepper", "2 tbsp sweet soy sauce", "1 tbsp cooking oil", "Bamboo skewers"],
    instructions: ["Grind shallots, garlic, candlenuts, turmeric, ginger, lemongrass, coriander, and pepper", "Mix spice paste with sweet soy sauce and oil", "Marinate pork cubes for at least 3 hours", "Thread onto bamboo skewers", "Grill over hot charcoal, turning frequently", "Serve with peanut sauce, rice cakes, and sambal matah"]
  },
  {
    id: 268, slug: "tongkol-bumbu-rica", title: "Tongkol Bumbu Rica Recipe: Mackerel Tuna in Manado Chili Sauce",
    shortTitle: "Tongkol Bumbu Rica", description: "Spicy grilled mackerel tuna from Manado coated in fiery rica-rica chili paste.",
    kategori: "makanan-berat", waktu: 40, porsi: "4 servings", kesulitan: "Easy", rating: 4.6, origin: "Manado, North Sulawesi",
    ingredients: ["4 tongkol (mackerel tuna) fish", "10 red chilies", "8 bird's eye chilies", "6 shallots", "4 garlic cloves", "2 cm ginger", "3 kaffir lime leaves", "2 tbsp lime juice", "Salt to taste", "3 tbsp cooking oil"],
    instructions: ["Grill tongkol fish until half cooked, set aside", "Grind chilies, shallots, garlic, and ginger into coarse paste", "Heat oil and sauté paste with kaffir lime leaves", "Add grilled fish and toss to coat", "Season with lime juice and salt", "Cook for 5 more minutes until sauce thickens", "Serve with steamed rice and fresh herbs"]
  },
  {
    id: 269, slug: "ayam-goreng-kremes", title: "Ayam Goreng Kremes Recipe: Crispy Fried Chicken with Crunchy Bits",
    shortTitle: "Ayam Goreng Kremes", description: "Traditional Javanese fried chicken served with crispy spiced batter bits (kremes) for extra crunch.",
    kategori: "makanan-berat", waktu: 75, porsi: "4 servings", kesulitan: "Medium", rating: 4.8, origin: "Yogyakarta",
    ingredients: ["1 whole chicken", "500ml coconut milk", "3 bay leaves", "2 lemongrass stalks", "2 cm galangal", "1 tsp coriander", "1 tsp turmeric powder", "Salt to taste", "200g rice flour", "1 tsp baking powder", "Water as needed", "Oil for deep frying"],
    instructions: ["Boil chicken in spiced coconut milk until tender", "Remove chicken and let cool slightly", "Mix rice flour, baking powder, coriander, turmeric, and water into thin batter", "Deep fry chicken until golden and crispy", "Drizzle batter into hot oil to create crispy kremes bits", "Drain kremes and scatter over chicken", "Serve with steamed rice and sambal"]
  },
  {
    id: 270, slug: "babi-guling-bumbu-basa-genep", title: "Babi Guling Bumbu Basa Genep Recipe: Balinese Roast Pig",
    shortTitle: "Babi Guling Basa Genep", description: "Authentic Balinese roast pig stuffed with traditional basa genep spice paste and roasted to perfection.",
    kategori: "makanan-berat", waktu: 360, porsi: "10 servings", kesulitan: "Hard", rating: 4.9, origin: "Gianyar, Bali",
    ingredients: ["1 whole suckling pig", "10 shallots", "8 garlic cloves", "10 candlenuts", "5 red chilies", "3 cm turmeric", "3 cm ginger", "3 cm galangal", "2 lemongrass stalks", "5 kaffir lime leaves", "1 tsp coriander", "1 tsp pepper", "Lemongrass stalks for stuffing", "Banana leaves"],
    instructions: ["Grind all spices into fine paste (basa genep)", "Clean pig thoroughly and pat dry", "Stuff cavity with spice paste and lemongrass stalks", "Sew shut and cover with banana leaves", "Roast on spit over coconut husk fire for 4-6 hours", "Turn regularly until skin is crispy and golden", "Carve and serve with lawar, steamed rice, and sambal"]
  },
  {
    id: 271, slug: "bebek-bumbu-merah", title: "Becek Bumbu Merah Recipe: Duck in Red Spice Paste",
    shortTitle: "Bebek Bumbu Merah", description: "Duck pieces braised in a vibrant red spice paste made from chilies, tomatoes, and aromatic herbs.",
    kategori: "makanan-berat", waktu: 90, porsi: "4 servings", kesulitan: "Medium", rating: 4.6, origin: "East Java",
    ingredients: ["1 whole duck (cut into pieces)", "10 red chilies", "5 shallots", "4 garlic cloves", "3 tomatoes", "2 cm ginger", "2 cm galangal", "2 lemongrass stalks", "3 kaffir lime leaves", "1 tsp shrimp paste", "2 tbsp cooking oil", "Salt and sugar to taste"],
    instructions: ["Boil duck pieces until half tender, drain", "Grind chilies, shallots, garlic, tomatoes, ginger, and shrimp paste", "Heat oil and sauté paste with galangal, lemongrass, and kaffir lime leaves", "Add duck pieces and stir to coat", "Add 1 cup water and simmer until duck is tender", "Season with salt and sugar", "Serve with steamed rice and vegetables"]
  },
  {
    id: 272, slug: "sop-konro-bakso", title: "Sop Konro Bakso Recipe: Makassar Beef Rib Soup with Meatballs",
    shortTitle: "Sop Konro Bakso", description: "Rich Makassar beef rib soup with meatballs, flavored with kluwek nut giving it a distinctive black color.",
    kategori: "sup-soto", waktu: 120, porsi: "6 servings", kesulitan: "Hard", rating: 4.7, origin: "Makassar, South Sulawesi",
    ingredients: ["1 kg beef ribs", "500g ground beef (for bakso)", "10 kluwek nuts (soaked)", "6 shallots", "4 garlic cloves", "3 cm ginger", "2 cm galangal", "2 lemongrass stalks", "3 bay leaves", "1 tsp coriander", "Salt and pepper", "Fried shallots for garnish", "Rice vermicelli", "Chopped scallions"],
    instructions: ["Soak kluwek nuts in hot water, extract black paste", "Grind shallots, garlic, ginger, and coriander", "Make bakso: mix ground beef with garlic, salt, and baking powder, form balls", "Boil beef ribs with aromatics for 1.5 hours until tender", "Add kluwek paste and spice paste to broth", "Cook bakso balls in soup until they float", "Serve with rice vermicelli, scallions, and fried shallots"]
  },
  {
    id: 273, slug: "ikan-bakar-parape", title: "Ikan Bakar Parape Recipe: Makassar Grilled Fish with Sour Sauce",
    shortTitle: "Ikan Bakar Parape", description: "Grilled fish from Makassar served with parape, a tangy and spicy sauce made from tomatoes and chili.",
    kategori: "sate-panggang", waktu: 45, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "Makassar, South Sulawesi",
    ingredients: ["4 whole red snapper", "4 tomatoes (chopped)", "8 red chilies", "4 shallots", "2 garlic cloves", "3 tbsp lime juice", "1 tbsp palm sugar", "Salt to taste", "Banana leaves", "Oil for grilling"],
    instructions: ["Score fish and rub with salt and turmeric", "Grill fish on banana leaves over medium heat", "For parape: blend tomatoes, chilies, shallots, and garlic coarsely", "Season parape with lime juice, palm sugar, and salt", "Serve grilled fish with parape sauce on top", "Garnish with fresh herbs and lime wedges"]
  },
  {
    id: 274, slug: "kambing-guling-mataram", title: "Kambing Guling Mataram Recipe: Lombok Roast Lamb",
    shortTitle: "Kambing Guling Mataram", description: "Whole lamb roasted with traditional Lombok spice paste, a specialty of Mataram for special celebrations.",
    kategori: "sate-panggang", waktu: 240, porsi: "8 servings", kesulitan: "Hard", rating: 4.8, origin: "Mataram, Lombok",
    ingredients: ["1 whole lamb (cleaned)", "15 shallots", "10 garlic cloves", "10 red chilies", "5 candlenuts", "3 cm turmeric", "3 cm ginger", "3 cm galangal", "3 lemongrass stalks", "5 kaffir lime leaves", "2 tbsp coriander seeds", "1 tsp pepper", "Salt to taste", "Coconut husk for grilling"],
    instructions: ["Grind all spices into smooth paste", "Rub paste all over lamb inside and out", "Let marinate for 4 hours minimum", "Roast on spit over coconut husk fire", "Baste with spiced coconut oil regularly", "Roast for 3-4 hours until meat is tender", "Carve and serve with sambal, steamed rice, and plecing kangkung"]
  },
  {
    id: 275, slug: "ayam-bakar-manuk-lauk", title: "Ayam Bakar Manuk Lauk Recipe: Papuan Grilled Chicken",
    shortTitle: "Ayam Bakar Manuk Lauk", description: "Traditional Papuan grilled chicken cooked with simple spices and banana leaf wrapping.",
    kategori: "sate-panggang", waktu: 60, porsi: "4 servings", kesulitan: "Easy", rating: 4.4, origin: "Papua",
    ingredients: ["1 whole free-range chicken", "4 shallots", "3 garlic cloves", "2 cm ginger", "1 tsp turmeric", "Salt to taste", "Banana leaves", "Lemongrass stalks"],
    instructions: ["Grind shallots, garlic, ginger, and turmeric", "Rub chicken with spice paste and salt", "Wrap in banana leaves and tie with bamboo strips", "Grill over medium heat for 45 minutes", "Turn occasionally until cooked through", "Unwrap and serve with papeda or steamed rice"]
  },
  {
    id: 276, slug: "sapi-bumbu-bali", title: "Sapi Bumbu Bali Recipe: Balinese Spiced Beef",
    shortTitle: "Sapi Bumbu Bali", description: "Beef chunks cooked in rich Balinese spice paste with coconut milk until tender and fragrant.",
    kategori: "makanan-berat", waktu: 90, porsi: "6 servings", kesulitan: "Medium", rating: 4.7, origin: "Denpasar, Bali",
    ingredients: ["750g beef chuck (cubed)", "200ml coconut milk", "8 shallots", "6 garlic cloves", "5 red chilies", "3 candlenuts", "2 cm turmeric", "2 cm ginger", "2 cm galangal", "2 lemongrass stalks", "3 kaffir lime leaves", "1 tsp coriander", "Salt and sugar to taste"],
    instructions: ["Grind all spices into smooth paste", "Heat oil and sauté paste until fragrant", "Add beef and brown on all sides", "Pour in coconut milk and bring to simmer", "Add kaffir lime leaves and lemongrass", "Cook on low heat for 1.5 hours until beef is tender", "Season and serve with steamed rice"]
  },
  {
    id: 277, slug: "ikan-tuna-woku", title: "Ikan Tuna Woku Recipe: Minahasan Tuna in Turmeric Herb Sauce",
    shortTitle: "Ikan Tuna Woku", description: "Fresh tuna cooked in aromatic Minahasan woku spice paste with abundant herbs and chilies.",
    kategori: "makanan-berat", waktu: 45, porsi: "4 servings", kesulitan: "Medium", rating: 4.6, origin: "Manado, North Sulawesi",
    ingredients: ["500g fresh tuna steaks", "10 red chilies", "8 shallots", "6 garlic cloves", "3 cm ginger", "3 cm turmeric", "2 lemongrass stalks", "5 kaffir lime leaves", "3 tomato (chopped)", "2 tbsp lime juice", "Salt to taste", "3 tbsp coconut oil"],
    instructions: ["Grind chilies, shallots, garlic, ginger, and turmeric", "Heat oil and sauté paste with lemongrass and kaffir lime leaves", "Add chopped tomatoes and cook until soft", "Place tuna steaks in pan and spoon sauce over", "Cover and cook for 10 minutes each side", "Season with lime juice and salt", "Serve with steamed rice and fresh vegetables"]
  },
  {
    id: 278, slug: "bebek-bumbu-rawe", title: "Bebek Bumbu Rawe Recipe: Duck in Acehnese Chili Gravy",
    shortTitle: "Bebek Bumbu Rawe", description: "Duck simmered in rich Acehnese chili gravy with spices and herbs, a fiery delicacy from Banda Aceh.",
    kategori: "makanan-berat", waktu: 90, porsi: "4 servings", kesulitan: "Medium", rating: 4.5, origin: "Banda Aceh",
    ingredients: ["1 whole duck (cut into pieces)", "15 red chilies", "8 shallots", "6 garlic cloves", "3 cm ginger", "2 cm turmeric", "2 lemongrass stalks", "3 bay leaves", "1 tsp coriander", "1 tsp cumin", "1 tbsp tamarind water", "Salt to taste", "3 tbsp cooking oil"],
    instructions: ["Boil duck pieces until half tender, drain and set aside", "Grind chilies, shallots, garlic, ginger, turmeric, coriander, and cumin", "Heat oil and sauté paste with lemongrass and bay leaves", "Add duck pieces and stir to coat", "Add 2 cups water and tamarind water", "Simmer for 45 minutes until duck is tender", "Serve with steamed rice and emping crackers"]
  },
  {
    id: 279, slug: "ayam-goreng-kalasan", title: "Ayam Goreng Kalasan Premium Recipe: Yogyakarta Fried Chicken",
    shortTitle: "Ayam Goreng Kalasan Premium", description: "Free-range chicken from Kalasan, Yogyakarta, simmered in spiced coconut milk then fried until golden.",
    kategori: "makanan-berat", waktu: 75, porsi: "4 servings", kesulitan: "Medium", rating: 4.8, origin: "Kalasan, Yogyakarta",
    ingredients: ["1 whole ayam kampung (free-range chicken)", "500ml thin coconut milk", "3 bay leaves", "2 lemongrass stalks", "2 cm galangal", "1 tsp coriander", "1 tsp turmeric", "Salt to taste", "Oil for deep frying", "Kremes batter (optional)"],
    instructions: ["Cut chicken into serving pieces", "Simmer chicken in coconut milk with bay leaves, lemongrass, galangal, coriander, turmeric, and salt", "Cook until liquid reduces and chicken is tender", "Remove chicken and let cool slightly", "Deep fry until golden brown and crispy", "Serve with steamed rice, sambal, and fresh vegetables"]
  },
  {
    id: 280, slug: "ikan-mujair-goreng", title: "Ikan Mujair Goreng Recipe: Crispy Fried Tilapia",
    shortTitle: "Ikan Mujair Goreng", description: "Whole tilapia fish marinated in turmeric and coriander, deep fried until crispy and golden.",
    kategori: "makanan-berat", waktu: 30, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "East Java",
    ingredients: ["4 whole mujair (tilapia) fish", "2 cm turmeric", "1 tsp coriander", "1 tsp pepper", "3 garlic cloves", "Salt to taste", "Oil for deep frying", "Lime wedges"],
    instructions: ["Clean and score fish", "Grind turmeric, coriander, pepper, garlic, and salt into paste", "Rub paste all over fish", "Let marinate for 30 minutes", "Deep fry in hot oil until crispy", "Drain and serve with lime wedges and sambal"]
  },

  // ===== SOUPS & SOTO =====
  {
    id: 281, slug: "soto-betawi-santan", title: "Soto Betawi Santan Recipe: Jakarta Coconut Beef Soup",
    shortTitle: "Soto Betawi Santan", description: "Rich Betawi beef soup with thick coconut milk, potatoes, and aromatic spices from Jakarta.",
    kategori: "sup-soto", waktu: 90, porsi: "6 servings", kesulitan: "Medium", rating: 4.7, origin: "Jakarta",
    ingredients: ["500g beef (cubed)", "400ml coconut milk", "3 potatoes (cubed)", "3 tomatoes (quartered)", "5 shallots", "3 garlic cloves", "2 cm ginger", "2 cm galangal", "2 lemongrass stalks", "3 bay leaves", "1 tsp pepper", "Salt to taste", "Fried shallots", "Chopped scallions"],
    instructions: ["Boil beef until tender, reserve broth", "Grind shallots, garlic, and ginger", "Sauté paste with galangal, lemongrass, and bay leaves", "Add to beef broth with potatoes", "Cook until potatoes are tender", "Add coconut milk and tomatoes", "Season and serve with fried shallots and scallions"]
  },
  {
    id: 282, slug: "soto-ayam-kuah-bening", title: "Soto Ayam Kuah Bening Recipe: Clear Chicken Turmeric Soup",
    shortTitle: "Soto Ayam Bening", description: "Clear turmeric chicken soup with vermicelli noodles, hard-boiled eggs, and fresh herbs.",
    kategori: "sup-soto", waktu: 60, porsi: "6 servings", kesulitan: "Easy", rating: 4.6, origin: "Surabaya, East Java",
    ingredients: ["500g chicken pieces", "2 liters water", "3 cm turmeric", "3 lemongrass stalks", "3 bay leaves", "5 shallots", "3 garlic cloves", "1 tsp pepper", "Salt to taste", "Vermicelli noodles", "Hard-boiled eggs", "Bean sprouts", "Fried shallots", "Chopped scallions", "Lime wedges"],
    instructions: ["Boil chicken with turmeric, lemongrass, bay leaves, shallots, garlic, and pepper", "Skim foam and cook until chicken is tender", "Remove chicken and shred meat", "Strain broth and return to pot", "Add salt to taste", "Serve broth over vermicelli, bean sprouts, shredded chicken, and egg", "Garnish with fried shallots, scallions, and lime"]
  },
  {
    id: 283, slug: "sop-iler-madura", title: "Sop Iler Madura Recipe: Madurese Green Bean Soup",
    shortTitle: "Sop Iler Madura", description: "Traditional Madurese soup with young cassava leaves, corn, and smoked fish in coconut broth.",
    kategori: "sup-soto", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.4, origin: "Madura",
    ingredients: ["200g young cassava leaves", "2 ears corn (cut into rounds)", "200g smoked fish", "400ml coconut milk", "3 shallots", "2 garlic cloves", "2 cm turmeric", "1 tsp shrimp paste", "Salt to taste", "Water as needed"],
    instructions: ["Boil cassava leaves and corn in water until tender", "Grind shallots, garlic, turmeric, and shrimp paste", "Add spice paste to pot", "Add smoked fish and coconut milk", "Simmer for 15 minutes", "Season with salt", "Serve hot with steamed rice"]
  },
  {
    id: 284, slug: "pindang-patik", title: "Pindang Patik Recipe: Sour and Spicy Mackerel Soup",
    shortTitle: "Pindang Patik", description: "Fresh mackerel cooked in tangy tamarind broth with chilies and aromatic herbs.",
    kategori: "sup-soto", waktu: 40, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "Palembang, South Sumatra",
    ingredients: ["4 whole mackerel", "2 liters water", "3 tbsp tamarind paste", "5 red chilies", "3 shallots", "2 garlic cloves", "2 cm turmeric", "2 lemongrass stalks", "3 bay leaves", "Salt to taste", "Chopped scallions"],
    instructions: ["Boil water with tamarind, turmeric, lemongrass, and bay leaves", "Add whole mackerel fish", "Add sliced chilies, shallots, and garlic", "Cook for 15 minutes until fish is done", "Season with salt", "Serve hot with steamed rice and fresh vegetables"]
  },
  {
    id: 285, slug: "sup-iga-panggang", title: "Sup Iga Panggang Recipe: Grilled Beef Rib Soup",
    shortTitle: "Sup Iga Panggang", description: "Rich beef rib soup with grilled ribs that add smoky flavor, served with carrots and potatoes.",
    kategori: "sup-soto", waktu: 120, porsi: "6 servings", kesulitan: "Medium", rating: 4.7, origin: "Jakarta",
    ingredients: ["1 kg beef ribs", "3 potatoes (cubed)", "2 carrots (sliced)", "3 tomatoes (quartered)", "5 shallots", "3 garlic cloves", "2 cm ginger", "1 tsp pepper", "1 tsp nutmeg", "Salt to taste", "Fried shallots", "Chopped celery"],
    instructions: ["Grill beef ribs until charred on outside", "Boil ribs in water with shallots, garlic, ginger, pepper, and nutmeg", "Cook for 1.5 hours until tender", "Add potatoes and carrots", "Cook until vegetables are tender", "Add tomatoes and season with salt", "Serve with fried shallots and celery"]
  },
  {
    id: 286, slug: "soto-medan", title: "Soto Medan Recipe: Medan Yellow Turmeric Soup",
    shortTitle: "Soto Medan", description: "Aromatic yellow soup from Medan with chicken, vermicelli, and hard-boiled eggs in coconut broth.",
    kategori: "sup-soto", waktu: 60, porsi: "6 servings", kesulitan: "Medium", rating: 4.6, origin: "Medan, North Sumatra",
    ingredients: ["500g chicken pieces", "400ml coconut milk", "3 cm turmeric", "3 lemongrass stalks", "3 bay leaves", "5 shallots", "3 garlic cloves", "1 tsp coriander", "1 tsp pepper", "Vermicelli noodles", "Hard-boiled eggs", "Fried shallots", "Chopped scallions", "Lime wedges"],
    instructions: ["Grind turmeric, shallots, garlic, coriander, and pepper", "Sauté paste with lemongrass and bay leaves", "Add chicken and cook until no longer pink", "Pour in water and bring to boil", "Add coconut milk and simmer", "Serve over vermicelli with halved egg", "Garnish with fried shallots, scallions, and lime"]
  },
  {
    id: 287, slug: "sayur-asem-sundanese", title: "Sayur Asem Sundanese Recipe: Sundanese Sour Vegetable Soup",
    shortTitle: "Sayur Asem Sundanese", description: "Refreshing sour vegetable soup with corn, long beans, chayote, and tamarind from Sundanese cuisine.",
    kategori: "sup-soto", waktu: 45, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "West Java",
    ingredients: ["200g long beans (cut)", "1 chayote (cubed)", "2 ears corn (cut)", "100g peanuts", "5 shallots", "3 garlic cloves", "3 red chilies", "3 tbsp tamarind paste", "2 tbsp palm sugar", "Salt to taste", "2 liters water"],
    instructions: ["Boil water with tamarind paste", "Grind shallots, garlic, and chilies", "Add ground paste to boiling water", "Add peanuts and corn, cook 10 minutes", "Add long beans and chayote", "Cook until vegetables are tender", "Season with palm sugar and salt", "Serve hot with steamed rice"]
  },

  // ===== SNACKS & JAJANAN =====
  {
    id: 288, slug: "kue-kipo", title: "Kue Kipo Recipe: Traditional Javanese Glutinous Rice Cake",
    shortTitle: "Kue Kipo", description: "Small glutinous rice dumplings filled with sweet coconut, cooked in boiling water until they float.",
    kategori: "jajanan", waktu: 45, porsi: "20 pieces", kesulitan: "Medium", rating: 4.3, origin: "Kebumen, Central Java",
    ingredients: ["200g glutinous rice flour", "100g rice flour", "150ml pandan water", "Green food coloring", "Filling: 150g grated coconut, 100g palm sugar, pinch of salt"],
    instructions: ["Cook filling: mix grated coconut, palm sugar, and salt until dry", "Mix flours with pandan water and coloring into smooth dough", "Take small balls of dough, flatten and fill with coconut mixture", "Seal and shape into small ovals", "Boil in water until they float", "Remove and serve warm"]
  },
  {
    id: 289, slug: "lemper-ayam", title: "Lemper Ayam Recipe: Sticky Rice with Chicken Filling",
    shortTitle: "Lemper Ayam", description: "Glutinous rice wrapped around spiced shredded chicken, wrapped in banana leaves and steamed.",
    kategori: "jajanan", waktu: 90, porsi: "20 pieces", kesulitan: "Medium", rating: 4.6, origin: "Java",
    ingredients: ["500g glutinous rice", "400ml coconut milk", "2 pandan leaves", "Filling: 300g chicken breast", "5 shallots", "3 garlic cloves", "2 cm galangal", "1 tsp coriander", "Salt to taste", "Banana leaves", "Toothpicks"],
    instructions: ["Soak glutinous rice for 4 hours, drain", "Steam rice with coconut milk and pandan leaves until cooked", "Cook chicken with spices, shred when cool", "Cut banana leaves into rectangles", "Flatten rice, add chicken filling, roll and wrap", "Secure with toothpicks", "Steam for 15 minutes to set"]
  },
  {
    id: 290, slug: "kue-lupis", title: "Kue Lupis Recipe: Glutinous Rice Triangle in Palm Sugar",
    shortTitle: "Kue Lupis", description: "Triangular glutinous rice cakes wrapped in banana leaves, served with grated coconut and palm sugar syrup.",
    kategori: "jajanan", waktu: 60, porsi: "15 pieces", kesulitan: "Medium", rating: 4.4, origin: "Java",
    ingredients: ["500g glutinous rice (soaked 4 hours)", "Banana leaves", "200g grated coconut (steamed)", "200g palm sugar", "100ml water", "1/4 tsp salt", "Pandan leaf"],
    instructions: ["Cut banana leaves into strips", "Fold into triangle shape and fill with rice", "Wrap tightly and secure with toothpick", "Boil for 2 hours until cooked through", "Make palm sugar syrup: melt sugar with water and pandan", "Unwrap and dip in grated coconut", "Drizzle with palm sugar syrup"]
  },
  {
    id: 291, slug: "gepuk-sapi", title: "Gepuk Sapi Recipe: Sweet Smashed Beef Jerky",
    shortTitle: "Gepuk Sapi", description: "Thinly sliced beef simmered in sweet coconut milk sauce, then smashed and fried until crispy.",
    kategori: "jajanan", waktu: 120, porsi: "6 servings", kesulitan: "Hard", rating: 4.7, origin: "West Java",
    ingredients: ["500g beef eye round (sliced thin)", "400ml coconut milk", "10 shallots", "6 garlic cloves", "3 cm galangal", "3 cm ginger", "3 cm turmeric", "3 lemongrass stalks", "2 tbsp palm sugar", "1 tsp pepper", "Salt to taste", "Oil for frying"],
    instructions: ["Grind shallots, garlic, galangal, ginger, and turmeric", "Simmer beef slices with spice paste and coconut milk", "Add lemongrass, palm sugar, pepper, and salt", "Cook until liquid reduces and beef absorbs flavors", "Let cool, then smash with meat mallet", "Deep fry until crispy", "Serve with steamed rice and sambal"]
  },
  {
    id: 292, slug: "cireng-bumbu-rujak", title: "Cireng Bumbu Rujak Recipe: Fried Tapioca with Spicy Sauce",
    shortTitle: "Cireng Bumbu Rujak", description: "Crispy fried tapioca dough served with spicy rujak sauce, a popular Sundanese snack.",
    kategori: "jajanan", waktu: 30, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "West Java",
    ingredients: ["200g tapioca flour", "50g rice flour", "200ml hot water", "2 garlic cloves (minced)", "Salt to taste", "Oil for frying", "Rujak sauce: 5 red chilies, 3 shallots, 2 tbsp palm sugar, 2 tbsp tamarind water, salt"],
    instructions: ["Mix tapioca flour, rice flour, garlic, and salt", "Pour hot water and mix into pliable dough", "Form into small flat rounds", "Deep fry until puffed and crispy", "For rujak sauce: grind chilies, shallots, palm sugar, tamarind, and salt", "Serve cireng with rujak sauce"]
  },
  {
    id: 293, slug: "klepon", title: "Klepon Recipe: Green Rice Cake Balls with Palm Sugar",
    shortTitle: "Klepon", description: "Bright green glutinous rice balls filled with liquid palm sugar, coated in grated coconut.",
    kategori: "jajanan", waktu: 45, porsi: "30 pieces", kesulitan: "Medium", rating: 4.7, origin: "Java",
    ingredients: ["250g glutinous rice flour", "100ml pandan juice", "Green food coloring", "200g palm sugar (chopped)", "150g grated coconut (steamed)", "1/4 tsp salt", "Water for boiling"],
    instructions: ["Mix glutinous rice flour with pandan juice into smooth dough", "Take small balls, flatten and fill with chopped palm sugar", "Seal and shape into balls", "Boil in water until they float", "Remove and roll in steamed grated coconut", "Serve immediately while warm"]
  },
  {
    id: 294, slug: "onde-onde-kacang", title: "Onde-Onde Kacang Recipe: Sesame-Coated Mung Bean Balls",
    shortTitle: "Onde-Onde Kacang", description: "Crispy sesame-coated balls filled with sweet mung bean paste, a popular Chinese-Indonesian snack.",
    kategori: "jajanan", waktu: 60, porsi: "25 pieces", kesulitan: "Medium", rating: 4.6, origin: "Jakarta",
    ingredients: ["250g glutinous rice flour", "50g rice flour", "100ml warm water", "Filling: 200g mung beans (boiled and mashed)", "100g sugar", "2 tbsp sesame seeds", "Oil for deep frying"],
    instructions: ["Boil mung beans until soft, mash with sugar into paste", "Form paste into small balls", "Mix flours with warm water into dough", "Flatten dough, wrap around mung bean filling", "Roll in sesame seeds", "Deep fry on low heat until golden and crispy", "Drain and serve warm"]
  },
  {
    id: 295, slug: "nagasari", title: "Nagasari Recipe: Steamed Banana Rice Flour Cake",
    shortTitle: "Nagasari", description: "Soft rice flour cake with banana filling, wrapped in banana leaves and steamed to perfection.",
    kategori: "jajanan", waktu: 45, porsi: "15 pieces", kesulitan: "Easy", rating: 4.4, origin: "Java",
    ingredients: ["200g rice flour", "200ml coconut milk", "100g sugar", "1/4 tsp salt", "2 pandan leaves", "Bananas (sliced)", "Banana leaves for wrapping"],
    instructions: ["Cook rice flour, coconut milk, sugar, salt, and pandan into thick paste", "Cut banana leaves into squares", "Spread paste, add banana slice, fold and wrap", "Steam for 20 minutes", "Let cool before unwrapping", "Serve at room temperature"]
  },
  {
    id: 296, slug: "bakwan-jagung", title: "Bakwan Jagung Recipe: Crispy Corn Fritters",
    shortTitle: "Bakwan Jagung", description: "Crunchy fritters made from fresh corn kernels, flour, and aromatic spices, deep fried to golden perfection.",
    kategori: "jajanan", waktu: 30, porsi: "20 pieces", kesulitan: "Easy", rating: 4.5, origin: "Java",
    ingredients: ["4 ears corn (kernels stripped)", "100g rice flour", "50g wheat flour", "2 eggs", "3 shallots (minced)", "2 garlic cloves (minced)", "3 scallions (chopped)", "1 tsp pepper", "Salt to taste", "Oil for deep frying"],
    instructions: ["Mix corn kernels with flours, eggs, shallots, garlic, scallions, pepper, and salt", "Heat oil in wok", "Drop spoonfuls of batter into hot oil", "Fry until golden brown on both sides", "Drain on paper towels", "Serve hot as snack or side dish"]
  },
  {
    id: 297, slug: "martabak-telur", title: "Martabak Telur Recipe: Stuffed Savory Pancake",
    shortTitle: "Martabak Telur", description: "Thin crispy pancake filled with spiced meat and egg mixture, a beloved Indonesian street food.",
    kategori: "jajanan", waktu: 45, porsi: "4 servings", kesulitan: "Medium", rating: 4.7, origin: "Jakarta",
    ingredients: ["250g wheat flour", "150ml water", "1/2 tsp salt", "Filling: 200g minced beef", "4 eggs", "3 shallots (minced)", "2 garlic cloves (minced)", "3 scallions (chopped)", "1 tsp pepper", "1 tsp curry powder", "Oil for pan-frying"],
    instructions: ["Make dough: mix flour, water, and salt, knead until elastic", "Rest dough for 30 minutes", "Cook minced beef with shallots, garlic, pepper, and curry powder", "Beat eggs with cooked meat and scallions", "Stretch dough paper-thin on oiled surface", "Add filling in center, fold sides over", "Pan-fry until golden and crispy on both sides", "Serve with pickled cucumber and chili sauce"]
  },
  {
    id: 298, slug: "risol-bandung", title: "Risol Bandung Recipe: Bandung-Style Crepe Rolls",
    shortTitle: "Risol Bandung", description: "Thin crepe rolls filled with vegetables and chicken, breaded and deep fried until crispy.",
    kategori: "jajanan", waktu: 60, porsi: "20 pieces", kesulitan: "Medium", rating: 4.5, origin: "Bandung, West Java",
    ingredients: ["Crepe: 200g flour, 2 eggs, 300ml milk, salt", "Filling: 150g minced chicken", "100g carrots (diced)", "100g potatoes (diced)", "50g peas", "2 shallots", "1 garlic clove", "Breading: breadcrumbs, beaten eggs"],
    instructions: ["Make thin crepes and set aside", "Cook filling: sauté shallots and garlic, add chicken, then vegetables", "Season filling and let cool", "Place filling on crepes, roll tightly", "Dip in beaten egg, coat in breadcrumbs", "Deep fry until golden brown", "Serve with chili sauce"]
  },
  {
    id: 299, slug: "pempek-palembang", title: "Pempek Palembang Recipe: Palembang Fish Cake",
    shortTitle: "Pempek Palembang", description: "Classic Palembang fish cake made from fish and tapioca, served with sweet and sour cuko sauce.",
    kategori: "jajanan", waktu: 60, porsi: "20 pieces", kesulitan: "Medium", rating: 4.8, origin: "Palembang, South Sumatra",
    ingredients: ["500g fish meat (ground)", "250g tapioca flour", "2 eggs", "3 garlic cloves", "1 tsp salt", "1/2 tsp pepper", "100ml water", "Cuko: 200g palm sugar", "100ml vinegar", "5 red chilies", "3 garlic cloves", "1 liter water"],
    instructions: ["Grind fish with garlic until smooth", "Mix with tapioca flour, eggs, salt, pepper, and water", "Knead into pliable dough", "Shape into balls or logs, some filled with egg", "Boil until they float, then fry", "For cuko: boil palm sugar, vinegar, chilies, and garlic", "Serve pempek with cuko sauce, noodles, and cucumber"]
  },
  {
    id: 300, slug: "tahu-gejrot", title: "Tahu Gejrot Recipe: Fried Tofu in Sweet Spicy Sauce",
    shortTitle: "Tahu Gejrot", description: "Crispy fried tofu pieces drenched in sweet, sour, and spicy sauce, a popular Cirebon street snack.",
    kategori: "jajanan", waktu: 25, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "Cirebon, West Java",
    ingredients: ["10 pieces firm tofu (fried and quartered)", "5 red chilies", "3 shallots", "2 garlic cloves", "3 tbsp palm sugar", "2 tbsp vinegar", "100ml water", "Salt to taste"],
    instructions: ["Fry tofu until crispy, cut into pieces", "Grind chilies, shallots, and garlic coarsely", "Dissolve palm sugar in water with vinegar", "Add ground spices to sauce", "Pour sauce over fried tofu", "Serve immediately as a snack"]
  },
  {
    id: 301, slug: "lontong-balap", title: "Lontong Balap Recipe: Surabaya Rice Cake Salad",
    shortTitle: "Lontong Balap", description: "Rice cakes with bean sprouts, fried tofu, and sweet soy sauce, a signature Surabaya street food.",
    kategori: "jajanan", waktu: 30, porsi: "4 servings", kesulitan: "Easy", rating: 4.4, origin: "Surabaya, East Java",
    ingredients: ["4 lontong (rice cakes, cubed)", "200g bean sprouts (blanched)", "100g fried tofu (cubed)", "Sweet soy sauce", "Fried shallots", "Sambal", "Lime wedges"],
    instructions: ["Cut lontong into cubes", "Blanch bean sprouts briefly", "Arrange lontong, sprouts, and tofu on plate", "Drizzle generously with sweet soy sauce", "Top with fried shallots and sambal", "Serve with lime wedges"]
  },
  {
    id: 302, slug: "kerupuk-udang", title: "Kerupuk Udang Recipe: Homemade Prawn Crackers",
    shortTitle: "Kerupuk Udang", description: "Crunchy prawn crackers made from fresh shrimp and tapioca, sun-dried then deep fried.",
    kategori: "jajanan", waktu: 180, porsi: "30 pieces", kesulitan: "Hard", rating: 4.5, origin: "Java",
    ingredients: ["300g fresh prawns (ground)", "200g tapioca flour", "2 garlic cloves", "1 tsp salt", "1/2 tsp pepper", "150ml water", "Oil for deep frying"],
    instructions: ["Grind prawns with garlic until smooth", "Mix with tapioca flour, salt, pepper, and water", "Knead into dough", "Shape into logs and wrap in banana leaves", "Steam for 30 minutes", "Let cool completely, refrigerate overnight", "Slice thinly and sun-dry until hard", "Deep fry until they puff up"]
  },

  // ===== DRINKS & MINUMAN =====
  {
    id: 303, slug: "wedang-jahe", title: "Wedang Jahe Recipe: Traditional Ginger Drink",
    shortTitle: "Wedang Jahe", description: "Warming ginger drink with palm sugar and spices, a traditional Javanese beverage for cold weather.",
    kategori: "minuman", waktu: 20, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "Yogyakarta",
    ingredients: ["100g fresh ginger (crushed)", "100g palm sugar", "2 pandan leaves", "1 cinnamon stick", "3 cloves", "1 liter water", "1/4 tsp salt"],
    instructions: ["Crush ginger to release juices", "Boil water with ginger, pandan, cinnamon, and cloves", "Add palm sugar and stir until dissolved", "Simmer for 10 minutes", "Strain and serve hot", "Adjust sweetness to taste"]
  },
  {
    id: 304, slug: "es-kelapa-muda-sirup", title: "Es Kelapa Muda Sirup Recipe: Young Coconut Ice with Syrup",
    shortTitle: "Es Kelapa Muda Sirup", description: "Refreshing young coconut drink with colorful syrup, a perfect tropical cooler.",
    kategori: "minuman", waktu: 10, porsi: "2 servings", kesulitan: "Easy", rating: 4.4, origin: "Nationwide",
    ingredients: ["2 young coconuts", "2 tbsp rose syrup", "2 tbsp simple syrup", "Ice cubes", "Mint leaves"],
    instructions: ["Open coconuts and scoop out flesh", "Pour coconut water into glass", "Add coconut flesh", "Drizzle with rose and simple syrup", "Add ice cubes", "Garnish with mint leaves"]
  },
  {
    id: 305, slug: "jamu-kunyit-asam", title: "Jamu Kunyit Asam Recipe: Turmeric Tamarind Herbal Drink",
    shortTitle: "Jamu Kunyit Asam", description: "Traditional Javanese herbal drink with turmeric and tamarind, known for health benefits.",
    kategori: "minuman", waktu: 25, porsi: "4 servings", kesulitan: "Easy", rating: 4.3, origin: "Yogyakarta",
    ingredients: ["200g fresh turmeric (grated)", "3 tbsp tamarind paste", "100g palm sugar", "1 liter water", "1/4 tsp salt"],
    instructions: ["Grate turmeric and squeeze to extract juice", "Boil water with tamarind paste", "Add turmeric juice and palm sugar", "Stir until sugar dissolves", "Strain and serve warm or chilled", "Store in refrigerator for up to 3 days"]
  },
  {
    id: 306, slug: "es-sinom", title: "Es Sinom Recipe: Young Tamarind Leaf Ice",
    shortTitle: "Es Sinom", description: "Refreshing drink made from young tamarind leaves with palm sugar, a traditional Javanese cooler.",
    kategori: "minuman", waktu: 20, porsi: "4 servings", kesulitan: "Easy", rating: 4.2, origin: "East Java",
    ingredients: ["100g young tamarind leaves", "100g palm sugar", "1 liter water", "Ice cubes", "Mint leaves"],
    instructions: ["Boil tamarind leaves in water for 10 minutes", "Strain and add palm sugar", "Stir until sugar dissolves", "Let cool completely", "Serve over ice with mint garnish"]
  },
  {
    id: 307, slug: "teh-talua", title: "Teh Talua Recipe: Padang Tea with Egg",
    shortTitle: "Teh Talua", description: "Unique Padang beverage made with tea, egg yolk, and condensed milk, frothed until creamy.",
    kategori: "minuman", waktu: 10, porsi: "2 servings", kesulitan: "Easy", rating: 4.5, origin: "Padang, West Sumatra",
    ingredients: ["2 strong black tea bags", "2 egg yolks", "3 tbsp condensed milk", "Sugar to taste", "Hot water", "Ice cubes (optional)"],
    instructions: ["Brew strong tea with hot water", "In separate bowl, beat egg yolks with condensed milk until thick", "Pour hot tea into egg mixture while stirring", "Pour back and forth between two glasses to froth", "Add sugar to taste", "Serve hot or over ice"]
  },
  {
    id: 308, slug: "es-rujak-buah", title: "Es Rujak Buah Recipe: Fruit Salad with Spicy Palm Sugar",
    shortTitle: "Es Rujak Buah", description: "Mixed tropical fruits served with spicy palm sugar sauce, a refreshing and tangy snack.",
    kategori: "minuman", waktu: 15, porsi: "4 servings", kesulitan: "Easy", rating: 4.6, origin: "Jakarta",
    ingredients: ["1 mango (sliced)", "1 pineapple (sliced)", "2 cucumbers (sliced)", "5 unripe mangoes (sliced)", "100g palm sugar", "2 red chilies", "2 tbsp tamarind water", "100ml water", "Salt to taste"],
    instructions: ["Prepare and slice all fruits", "Grind chilies coarsely", "Melt palm sugar with water and tamarind", "Add chilies and salt to sauce", "Arrange fruits on plate", "Drizzle with spicy palm sugar sauce", "Serve immediately"]
  },
  {
    id: 309, slug: "es-kepiting", title: "Es Kepiting Recipe: Crab Ice Dessert",
    shortTitle: "Es Kepiting", description: "Unique Makassar dessert with crab meat, jackfruit, and coconut milk over ice.",
    kategori: "minuman", waktu: 30, porsi: "4 servings", kesulitan: "Medium", rating: 4.3, origin: "Makassar, South Sulawesi",
    ingredients: ["200g crab meat (cooked)", "100g jackfruit (diced)", "200ml coconut milk", "3 tbsp palm sugar", "Ice cubes", "Condensed milk"],
    instructions: ["Boil crab and extract meat", "Cook palm sugar with a little water", "Assemble: ice, crab meat, jackfruit", "Drizzle with coconut milk and palm sugar", "Add condensed milk", "Serve immediately"]
  },
  {
    id: 310, slug: "kopi-tubruk", title: "Kopi Tubruk Recipe: Traditional Indonesian Coffee",
    shortTitle: "Kopi Tubruk", description: "Classic Indonesian coffee made with coarse ground coffee and hot water, served unfiltered.",
    kategori: "minuman", waktu: 5, porsi: "1 serving", kesulitan: "Easy", rating: 4.4, origin: "Java",
    ingredients: ["2 tbsp coarse ground coffee", "1 tbsp sugar", "200ml boiling water"],
    instructions: ["Place ground coffee and sugar in glass", "Pour boiling water directly over grounds", "Stir briefly", "Let grounds settle for 1 minute", "Sip carefully from the top"]
  },
  {
    id: 311, slug: "es-cincau-hijau", title: "Es Cincau Hijau Recipe: Green Grass Jelly Ice",
    shortTitle: "Es Cincau Hijau", description: "Cooling drink with fresh green grass jelly, coconut milk, and palm sugar syrup.",
    kategori: "minuman", waktu: 20, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "West Java",
    ingredients: ["200g green grass jelly (cubed)", "200ml coconut milk", "100g palm sugar", "100ml water", "Ice cubes", "Pandan leaf"],
    instructions: ["Make palm sugar syrup: melt sugar with water and pandan", "Cut grass jelly into small cubes", "Fill glasses with ice and grass jelly", "Pour coconut milk over", "Drizzle with palm sugar syrup", "Stir and serve"]
  },
  {
    id: 312, slug: "es-sirup-malam-minggu", title: "Es Sirup Malam Minggu Recipe: Saturday Night Special Ice",
    shortTitle: "Es Sirup Malam Minggu", description: "Colorful layered ice drink with various syrups, fruits, and condensed milk from Bandung.",
    kategori: "minuman", waktu: 15, porsi: "2 servings", kesulitan: "Easy", rating: 4.4, origin: "Bandung, West Java",
    ingredients: ["2 tbsp cocopandan syrup", "2 tbsp orange syrup", "100ml condensed milk", "Nata de coco", "Fruit cocktail", "Ice cubes", "Soda water"],
    instructions: ["Layer ice in tall glass", "Add nata de coco and fruit cocktail", "Drizzle with cocopandan and orange syrup", "Pour condensed milk over the top", "Top with soda water", "Serve with a long spoon"]
  },

  // ===== MORE MAIN DISHES =====
  {
    id: 313, slug: "nasi-tempong", title: "Nasi Tempong Recipe: Spicy Banyuwangi Rice Set",
    shortTitle: "Nasi Tempong", description: "Banyuwangi-style rice with various spicy side dishes including fried chicken, tempeh, and fiery sambal.",
    kategori: "makanan-berat", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.6, origin: "Banyuwangi, East Java",
    ingredients: ["4 portions steamed rice", "4 chicken thighs (fried)", "200g tempeh (fried)", "200g tofu (fried)", "Kangkung (stir-fried)", "Sambal tempong: 20 red chilies, 10 bird's eye chilies, 5 shallots, 3 garlic cloves, shrimp paste, salt", "Fresh vegetables"],
    instructions: ["Fry chicken until crispy", "Fry tempeh and tofu until golden", "Stir-fry kangkung with garlic", "Make sambal: grind chilies, shallots, garlic, shrimp paste, and salt", "Arrange rice with all side dishes", "Serve with generous sambal and fresh vegetables"]
  },
  {
    id: 314, slug: "ayam-bakar-madu", title: "Ayam Bakar Madu Recipe: Honey Grilled Chicken",
    shortTitle: "Ayam Bakar Madu", description: "Juicy grilled chicken glazed with honey and sweet soy sauce, caramelized to perfection.",
    kategori: "sate-panggang", waktu: 45, porsi: "4 servings", kesulitan: "Easy", rating: 4.7, origin: "Java",
    ingredients: ["1 whole chicken (cut into pieces)", "4 tbsp honey", "3 tbsp sweet soy sauce", "2 tbsp lime juice", "3 garlic cloves (minced)", "1 tsp pepper", "1 tsp paprika", "2 tbsp cooking oil", "Salt to taste"],
    instructions: ["Marinate chicken with honey, sweet soy sauce, lime juice, garlic, pepper, paprika, and oil", "Refrigerate for at least 2 hours", "Grill over medium heat, basting frequently", "Turn and baste until chicken is cooked through", "Serve with steamed rice and sambal"]
  },
  {
    id: 315, slug: "ikan-bakar-bumbu-taliwang", title: "Ikan Bakar Bumbu Taliwang Recipe: Lombok-Style Grilled Fish",
    shortTitle: "Ikan Bakar Taliwang", description: "Grilled fish coated in spicy Lombok-style chili paste, smoky and flavorful.",
    kategori: "sate-panggang", waktu: 40, porsi: "4 servings", kesulitan: "Easy", rating: 4.6, origin: "Lombok, West Nusa Tenggara",
    ingredients: ["4 whole fish (red snapper or similar)", "10 red chilies", "5 shallots", "3 garlic cloves", "2 tbsp shrimp paste", "2 tbsp lime juice", "Salt to taste", "Banana leaves for grilling"],
    instructions: ["Score fish and rub with salt", "Grind chilies, shallots, garlic, and shrimp paste into paste", "Rub paste generously over fish", "Wrap in banana leaves and grill", "Turn once and cook until done", "Serve with plecing kangkung and steamed rice"]
  },
  {
    id: 316, slug: "bebek-bakar-bumbu-rica", title: "Bebek Bakar Bumbu Rica Recipe: Grilled Duck in Chili Sauce",
    shortTitle: "Bebek Bakar Rica", description: "Duck marinated in Manado rica-rica spice paste and grilled until smoky and tender.",
    kategori: "sate-panggang", waktu: 90, porsi: "4 servings", kesulitan: "Medium", rating: 4.7, origin: "Manado, North Sulawesi",
    ingredients: ["1 whole duck (cut into pieces)", "15 red chilies", "8 shallots", "5 garlic cloves", "3 cm ginger", "2 tbsp lime juice", "3 kaffir lime leaves", "Salt to taste", "Oil for cooking"],
    instructions: ["Parboil duck pieces until half tender", "Grind chilies, shallots, garlic, and ginger", "Sauté paste with kaffir lime leaves", "Add duck and cook in paste for 20 minutes", "Grill duck pieces until charred", "Serve with steamed rice and fresh vegetables"]
  },
  {
    id: 317, slug: "sop-buntut-bakar", title: "Sop Buntut Bakar Recipe: Smoky Grilled Oxtail Soup",
    shortTitle: "Sop Buntut Bakar", description: "Rich oxtail soup with grilled oxtail pieces adding smoky flavor, served with vegetables.",
    kategori: "sup-soto", waktu: 150, porsi: "6 servings", kesulitan: "Hard", rating: 4.8, origin: "Jakarta",
    ingredients: ["1 kg oxtail pieces", "3 potatoes (cubed)", "2 carrots (sliced)", "3 tomatoes (quartered)", "5 shallots", "3 garlic cloves", "2 cm ginger", "1 tsp pepper", "1 tsp nutmeg", "Sweet soy sauce for grilling", "Fried shallots", "Chopped scallions"],
    instructions: ["Boil oxtail for 2 hours until tender, reserve broth", "Grill oxtail pieces with sweet soy sauce until charred", "Strain broth and return to pot", "Add potatoes and carrots, cook until tender", "Add tomatoes and season", "Place grilled oxtail in bowls, ladle soup over", "Garnish with fried shallots and scallions"]
  },
  {
    id: 318, slug: "ayam-goreng-mentega", title: "Ayam Goreng Mentega Recipe: Butter Fried Chicken",
    shortTitle: "Ayam Goreng Mentega", description: "Chicken pieces fried in butter with soy sauce and Worcestershire, a Peranakan-style dish.",
    kategori: "makanan-berat", waktu: 40, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "Jakarta",
    ingredients: ["1 whole chicken (cut into pieces)", "3 tbsp butter", "3 tbsp sweet soy sauce", "2 tbsp Worcestershire sauce", "3 garlic cloves (minced)", "1 tsp pepper", "1 onion (sliced)", "Salt to taste"],
    instructions: ["Season chicken with salt and pepper", "Fry chicken in butter until golden", "Remove chicken, sauté garlic and onion", "Return chicken, add soy sauces", "Toss until chicken is well coated", "Serve with steamed rice"]
  },
  {
    id: 319, slug: "sate-lilit-ayam", title: "Sate Lilit Ayam Recipe: Minced Chicken Satay Balinese Style",
    shortTitle: "Sate Lilit Ayam", description: "Balinese-style satay made from minced chicken mixed with grated coconut and spices, wrapped around lemongrass.",
    kategori: "sate-panggang", waktu: 45, porsi: "4 servings", kesulitan: "Medium", rating: 4.7, origin: "Bali",
    ingredients: ["500g minced chicken", "100g grated coconut", "5 shallots", "3 garlic cloves", "2 cm ginger", "2 cm galangal", "2 cm turmeric", "2 kaffir lime leaves (minced)", "1 tsp coriander", "Salt to taste", "Lemongrass stalks for wrapping"],
    instructions: ["Grind shallots, garlic, ginger, galangal, and turmeric", "Mix minced chicken with spice paste, coconut, kaffir lime leaves, coriander, and salt", "Take portions and wrap around lemongrass stalks", "Grill over charcoal until cooked through", "Serve with steamed rice and sambal matah"]
  },
  {
    id: 320, slug: "gulai-tambusu", title: "Gulai Tambusu Recipe: Beef Intestine Curry",
    shortTitle: "Gulai Tambusu", description: "Rich Minangkabau curry made with beef intestines and offal in spiced coconut milk.",
    kategori: "makanan-berat", waktu: 90, porsi: "6 servings", kesulitan: "Medium", rating: 4.5, origin: "West Sumatra",
    ingredients: ["500g beef intestines (cleaned)", "400ml coconut milk", "8 shallots", "5 garlic cloves", "3 cm ginger", "2 cm turmeric", "3 red chilies", "1 tsp coriander", "2 lemongrass stalks", "3 kaffir lime leaves", "Salt and sugar to taste"],
    instructions: ["Clean and boil intestines until tender, cut into pieces", "Grind shallots, garlic, ginger, turmeric, chilies, and coriander", "Sauté paste with lemongrass and kaffir lime leaves", "Add intestines and stir", "Pour in coconut milk and simmer", "Cook until sauce thickens", "Season and serve with steamed rice"]
  },

  // ===== MORE SNACKS =====
  {
    id: 321, slug: "tahu-sumedang", title: "Tahu Sumedang Recipe: Sumedang Fried Tofu",
    shortTitle: "Tahu Sumedang", description: "Hollow fried tofu from Sumedang with crispy skin and soft interior, served with peanut sauce.",
    kategori: "jajanan", waktu: 30, porsi: "20 pieces", kesulitan: "Easy", rating: 4.5, origin: "Sumedang, West Java",
    ingredients: ["20 pieces firm tofu", "Oil for deep frying", "Peanut sauce: 100g peanuts, 3 red chilies, 2 garlic cloves, 2 tbsp sweet soy sauce", "Salt water solution"],
    instructions: ["Soak tofu in salt water solution for 10 minutes", "Drain and pat dry", "Deep fry until puffed and crispy", "Make peanut sauce: grind peanuts, chilies, garlic", "Mix with sweet soy sauce and water", "Serve tofu with peanut sauce"]
  },
  {
    id: 322, slug: "serabi-notosuman", title: "Serabi Notosuman Recipe: Solo Coconut Pancake",
    shortTitle: "Serabi Notosuman", description: "Thin coconut milk pancakes from Solo, crispy on edges and soft in center, served with sweet sauce.",
    kategori: "jajanan", waktu: 45, porsi: "15 pieces", kesulitan: "Medium", rating: 4.4, origin: "Solo, Central Java",
    ingredients: ["200g rice flour", "150ml coconut milk", "100ml water", "1 tsp yeast", "1 tbsp sugar", "Pinch of salt", "1/2 tsp baking powder", "Coconut milk topping", "Palm sugar sauce"],
    instructions: ["Mix rice flour, coconut milk, water, yeast, sugar, salt, and baking powder", "Let batter rest for 1 hour", "Heat clay pan and lightly oil", "Pour small ladles of batter", "Cook until edges are crispy and center is set", "Top with coconut milk", "Serve with palm sugar sauce"]
  },
  {
    id: 323, slug: "onde-onde", title: "Onde-Onde Ketawa Recipe: Laughing Sesame Balls",
    shortTitle: "Onde-Onde Ketawa", description: "Crispy sesame balls that crack open when fried, filled with sweet mung bean paste.",
    kategori: "jajanan", waktu: 60, porsi: "25 pieces", kesulitan: "Medium", rating: 4.5, origin: "Bandung, West Java",
    ingredients: ["250g glutinous rice flour", "50g rice flour", "100ml warm water", "Filling: 200g mung beans, 100g sugar", "Sesame seeds", "Oil for deep frying"],
    instructions: ["Boil and mash mung beans with sugar", "Form filling into small balls", "Mix flours with warm water into dough", "Wrap filling in dough, roll in sesame seeds", "Deep fry on low heat until they crack open", "Drain and serve"]
  },
  {
    id: 324, slug: "getas-ketan", title: "Getas Ketan Recipe: Fried Glutinous Rice Cake",
    shortTitle: "Getas Ketan", description: "Deep-fried glutinous rice cakes coated in sugar, crispy outside and chewy inside.",
    kategori: "jajanan", waktu: 45, porsi: "20 pieces", kesulitan: "Easy", rating: 4.3, origin: "Java",
    ingredients: ["300g glutinous rice flour", "150ml warm water", "100g sugar", "1/4 tsp salt", "Oil for deep frying"],
    instructions: ["Mix glutinous rice flour with warm water and salt", "Knead into smooth dough", "Form into small oval shapes", "Deep fry until golden", "While hot, roll in sugar", "Let cool and serve"]
  },
  {
    id: 325, slug: "combro-misro", title: "Combro Misro Recipe: Sundanese Stuffed Cassava Balls",
    shortTitle: "Combro Misro", description: "Cassava balls filled with spicy oncom (Combro) or palm sugar (Misro), deep fried until golden.",
    kategori: "jajanan", waktu: 60, porsi: "20 pieces", kesulitan: "Medium", rating: 4.5, origin: "West Java",
    ingredients: ["500g cassava (grated)", "Filling 1 (Combro): 200g oncom, 5 shallots, 3 garlic cloves, 5 red chilies, salt", "Filling 2 (Misro): 200g palm sugar (chopped)", "Oil for deep frying"],
    instructions: ["Grate cassava and squeeze out excess water", "For combro filling: crumble oncom, sauté with ground spices", "For misro filling: use chopped palm sugar", "Take cassava, flatten, fill with either filling", "Shape into balls and deep fry until golden", "Drain and serve"]
  },
  {
    id: 326, slug: "pisang-molen", title: "Pisang Molen Recipe: Banana Pastry Puffs",
    shortTitle: "Pisang Molen", description: "Banana pieces wrapped in flaky pastry dough and deep fried until crispy and golden.",
    kategori: "jajanan", waktu: 45, porsi: "15 pieces", kesulitan: "Medium", rating: 4.5, origin: "Bandung, West Java",
    ingredients: ["5 ripe bananas (cut into pieces)", "200g flour", "50g margarine", "1 egg yolk", "50ml cold water", "1/4 tsp salt", "Oil for deep frying"],
    instructions: ["Make dough: mix flour, margarine, egg yolk, water, and salt", "Rest dough for 30 minutes", "Roll out and cut into rectangles", "Wrap each banana piece in dough", "Seal edges with fork", "Deep fry until golden brown", "Drain and serve warm"]
  },
  {
    id: 327, slug: "kue-cucur", title: "Kue Cucur Recipe: Sweet Rice Flour Cake",
    shortTitle: "Kue Cucur", description: "Deep-fried rice flour cake with a distinctive hat shape, sweet and spongy inside.",
    kategori: "jajanan", waktu: 40, porsi: "15 pieces", kesulitan: "Medium", rating: 4.3, origin: "Java",
    ingredients: ["200g rice flour", "150g sugar", "200ml water", "1/4 tsp salt", "Oil for deep frying"],
    instructions: ["Dissolve sugar in water", "Mix with rice flour and salt into smooth batter", "Let batter rest for 1 hour", "Heat oil in wok", "Pour small ladles of batter into center", "Fry until edges are crispy and center rises", "Drain and serve"]
  },
  {
    id: 328, slug: "bakpia-pathok", title: "Bakpia Pathok Recipe: Yogyakarta Mung Bean Pastry",
    shortTitle: "Bakpia Pathok", description: "Flaky pastry filled with sweet mung bean paste, a signature snack from Yogyakarta.",
    kategori: "jajanan", waktu: 90, porsi: "20 pieces", kesulitan: "Hard", rating: 4.7, origin: "Yogyakarta",
    ingredients: ["Pastry: 200g flour, 50g margarine, 50ml water", "Filling: 200g mung beans (boiled and mashed), 100g sugar, 2 tbsp coconut oil"],
    instructions: ["Boil mung beans until soft, mash with sugar and coconut oil", "Make dough: mix flour, margarine, and water", "Rest dough for 30 minutes", "Divide dough, flatten, wrap filling", "Shape into small rounds", "Bake at 180°C for 25 minutes until golden", "Cool before serving"]
  },
  {
    id: 329, slug: "kue-putu-ayu", title: "Kue Putu Ayu Recipe: Steamed Coconut Cake",
    shortTitle: "Kue Putu Ayu", description: "Soft steamed cake with grated coconut topping and pandan-flavored sponge.",
    kategori: "jajanan", waktu: 30, porsi: "15 pieces", kesulitan: "Easy", rating: 4.4, origin: "Java",
    ingredients: ["200g flour", "150g sugar", "3 eggs", "100ml coconut milk", "1 tsp emulsifier", "Green food coloring", "Grated coconut (steamed with salt)"],
    instructions: ["Beat eggs, sugar, and emulsifier until thick", "Fold in flour and coconut milk alternately", "Add green coloring", "Steam grated coconut in molds", "Pour batter over coconut", "Steam for 20 minutes", "Unmold and serve"]
  },
  {
    id: 330, slug: "kue-mochi", title: "Kue Mochi Bandung Recipe: Bandung-Style Mochi",
    shortTitle: "Kue Mochi Bandung", description: "Soft and chewy mochi filled with peanut paste, coated in tapioca flour.",
    kategori: "jajanan", waktu: 60, porsi: "20 pieces", kesulitan: "Medium", rating: 4.5, origin: "Bandung, West Java",
    ingredients: ["200g glutinous rice flour", "100g sugar", "150ml water", "1 tbsp cornstarch", "Filling: 150g roasted peanuts (ground), 100g sugar", "Tapioca flour for dusting"],
    instructions: ["Roast and grind peanuts with sugar for filling", "Mix glutinous rice flour, sugar, and water", "Steam batter for 20 minutes", "Dust work surface with tapioca", "Divide dough, flatten, add filling", "Wrap and shape into balls", "Dust with tapioca flour"]
  },

  // ===== MORE DRINKS =====
  {
    id: 331, slug: "es-pisang-ior-premium", title: "Es Pisang Ior Premium Recipe: Bandung Banana Ice",
    shortTitle: "Es Pisang Ior Premium", description: "Premium version of Bandung's es pisang ijo with matcha and red bean.",
    kategori: "minuman", waktu: 30, porsi: "4 servings", kesulitan: "Medium", rating: 4.6, origin: "Bandung, West Java",
    ingredients: ["4 ripe bananas", "100g glutinous rice flour", "Green food coloring", "200ml coconut milk", "100g red beans (cooked)", "2 tbsp matcha powder", "Condensed milk", "Ice cubes"],
    instructions: ["Wrap bananas in green-tinted glutinous rice batter", "Steam for 15 minutes", "Slice into rounds", "Make matcha coconut milk: mix coconut milk with matcha", "Assemble: ice, banana slices, red beans", "Drizzle with matcha coconut milk and condensed milk"]
  },
  {
    id: 332, slug: "wedang-ronde-jahe", title: "Wedang Ronde Jahe Recipe: Ginger Glutinous Rice Ball Drink",
    shortTitle: "Wedang Ronde Jahe", description: "Warm ginger soup with chewy glutinous rice balls filled with peanut paste.",
    kategori: "minuman", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.5, origin: "Yogyakarta",
    ingredients: ["Rice balls: 200g glutinous rice flour, 100ml warm water, food coloring", "Filling: 100g peanuts (ground), 80g sugar", "Ginger broth: 100g ginger (crushed), 100g palm sugar, 1 liter water, pandan leaves"],
    instructions: ["Make filling: mix ground peanuts and sugar", "Make dough: mix glutinous rice flour with warm water", "Fill dough with peanut mixture, shape into balls", "Cook balls in boiling water until they float", "Make ginger broth: boil ginger, palm sugar, and pandan", "Serve balls in warm ginger broth"]
  },
  {
    id: 333, slug: "es-teler-durian", title: "Es Teler Durian Recipe: Durian Fruit Cocktail Ice",
    shortTitle: "Es Teler Durian", description: "Luxurious fruit ice with durian flesh, jackfruit, coconut, and condensed milk.",
    kategori: "minuman", waktu: 15, porsi: "2 servings", kesulitan: "Easy", rating: 4.7, origin: "Jakarta",
    ingredients: ["100g durian flesh", "50g jackfruit (diced)", "100g young coconut flesh", "200ml coconut milk", "Condensed milk", "Ice cubes", "Palm sugar syrup"],
    instructions: ["Prepare all fruits", "Fill glass with ice", "Add durian, jackfruit, and coconut", "Pour coconut milk over", "Drizzle with condensed milk and palm sugar syrup", "Serve immediately"]
  },
  {
    id: 334, slug: "susu-jahe-merah", title: "Susu Jahe Merah Recipe: Red Ginger Milk",
    shortTitle: "Susu Jahe Merah", description: "Warming milk drink infused with red ginger, palm sugar, and a hint of turmeric.",
    kategori: "minuman", waktu: 15, porsi: "2 servings", kesulitan: "Easy", rating: 4.4, origin: "Java",
    ingredients: ["50g red ginger (sliced)", "400ml milk", "2 tbsp palm sugar", "1/4 tsp turmeric", "Pinch of cinnamon"],
    instructions: ["Simmer ginger in milk for 10 minutes", "Add palm sugar, turmeric, and cinnamon", "Strain into cups", "Serve warm"]
  },
  {
    id: 335, slug: "es-jeruk-peras", title: "Es Jeruk Peras Recipe: Fresh Squeezed Orange Ice",
    shortTitle: "Es Jeruk Peras", description: "Fresh squeezed orange juice with ice, a refreshing Indonesian street drink.",
    kategori: "minuman", waktu: 10, porsi: "2 servings", kesulitan: "Easy", rating: 4.3, origin: "Nationwide",
    ingredients: ["6 oranges", "Sugar syrup to taste", "Ice cubes", "Salt pinch"],
    instructions: ["Squeeze oranges to extract juice", "Strain to remove pulp", "Add sugar syrup and a pinch of salt", "Serve over ice", "Stir before drinking"]
  },
  {
    id: 336, slug: "kopi-luwak", title: "Kopi Luwak Recipe: Civet Coffee Preparation",
    shortTitle: "Kopi Luwak", description: "Premium Indonesian coffee made from civet-processed beans, known for smooth flavor.",
    kategori: "minuman", waktu: 15, porsi: "2 servings", kesulitan: "Easy", rating: 4.6, origin: "Sumatra/Bali",
    ingredients: ["2 tbsp kopi luwak beans (ground)", "200ml hot water", "Sugar to taste"],
    instructions: ["Grind beans to medium-coarse", "Place in French press or filter", "Pour hot water and steep for 4 minutes", "Press or filter", "Add sugar if desired", "Serve black for best flavor"]
  },
  {
    id: 337, slug: "es-sop-buah-nangka", title: "Es Sop Buah Nangka Recipe: Jackfruit Fruit Soup Ice",
    shortTitle: "Es Sop Buah Nangka", description: "Refreshing fruit soup with fresh jackfruit, melon, and coconut in sweet syrup.",
    kategori: "minuman", waktu: 15, porsi: "4 servings", kesulitan: "Easy", rating: 4.4, origin: "Jakarta",
    ingredients: ["200g jackfruit (diced)", "200g melon (diced)", "100g nata de coco", "200ml coconut milk", "3 tbsp sugar", "Ice cubes", "Pandan syrup"],
    instructions: ["Dice all fruits", "Mix fruits with nata de coco", "Add coconut milk and sugar", "Pour over ice", "Drizzle with pandan syrup", "Serve chilled"]
  },
  {
    id: 338, slug: "wedang-secang", title: "Wedang Secang Recipe: Sappanwood Herbal Drink",
    shortTitle: "Wedang Secang", description: "Ruby-red herbal drink from secang wood with cinnamon and cloves, believed to have health benefits.",
    kategori: "minuman", waktu: 20, porsi: "4 servings", kesulitan: "Easy", rating: 4.3, origin: "Java",
    ingredients: ["50g secang wood shavings", "100g palm sugar", "1 cinnamon stick", "5 cloves", "1 liter water", "2 pandan leaves"],
    instructions: ["Boil water with secang wood, cinnamon, cloves, and pandan", "Simmer for 15 minutes until deep red", "Add palm sugar and stir until dissolved", "Strain and serve warm or chilled"]
  },

  // ===== ADDITIONAL UNIQUE RECIPES =====
  {
    id: 339, slug: "ayam-goreng-menthok", title: "Ayam Goreng Menthok Recipe: Duck Fat Fried Chicken",
    shortTitle: "Ayam Goreng Menthok", description: "Fried chicken cooked in duck fat for extra richness, a Madurese specialty.",
    kategori: "makanan-berat", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.5, origin: "Madura",
    ingredients: ["1 whole chicken", "200g duck fat", "3 bay leaves", "2 lemongrass stalks", "2 cm galangal", "1 tsp coriander", "1 tsp turmeric", "Salt to taste"],
    instructions: ["Melt duck fat in wok", "Add bay leaves, lemongrass, galangal", "Add chicken pieces", "Fry slowly until golden and crispy", "Season with coriander, turmeric, and salt", "Serve with sambal and steamed rice"]
  },
  {
    id: 340, slug: "ikan-mujair-bakar", title: "Ikan Mujair Bakar Recipe: Charcoal-Grilled Tilapia",
    shortTitle: "Ikan Mujair Bakar", description: "Whole tilapia marinated in turmeric and lemongrass, grilled over charcoal until smoky.",
    kategori: "sate-panggang", waktu: 40, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "East Java",
    ingredients: ["4 whole mujair fish", "2 cm turmeric", "3 shallots", "2 garlic cloves", "1 lemongrass stalk", "1 tsp salt", "Banana leaves", "Oil for grilling"],
    instructions: ["Clean and score fish", "Grind turmeric, shallots, garlic, lemongrass, and salt", "Rub paste all over fish", "Wrap in banana leaves", "Grill over charcoal for 15 minutes each side", "Serve with sambal and fresh vegetables"]
  },
  {
    id: 341, slug: "sate-padang", title: "Sate Padang Recipe: Padang Beef Satay",
    shortTitle: "Sate Padang", description: "Beef satay from Padang served with thick spicy rice flour sauce, a Minangkabau specialty.",
    kategori: "sate-panggang", waktu: 90, porsi: "6 servings", kesulitan: "Medium", rating: 4.8, origin: "Padang, West Sumatra",
    ingredients: ["500g beef (cubed)", "Rice flour batter: 3 tbsp rice flour, 500ml beef broth", "Spice paste: 10 red chilies, 5 shallots, 3 garlic cloves, 1 cm ginger, 1 cm galangal, 1 tsp turmeric", "1 tsp pepper", "Salt to taste", "Bamboo skewers", "Ketupat rice cakes"],
    instructions: ["Boil beef until tender, reserve broth", "Grill beef skewers until charred", "Grind spice paste and fry in oil", "Add rice flour dissolved in broth", "Cook until thick, season with salt and pepper", "Serve grilled satay with thick sauce over rice cakes"]
  },
  {
    id: 342, slug: "tahu-gejrot-cirebon", title: "Tahu Gejrot Cirebon Recipe: Cirebon Tofu in Spicy Sauce",
    shortTitle: "Tahu Gejrot Cirebon", description: "Crispy fried tofu pieces drenched in sweet and spicy tamarind sauce from Cirebon.",
    kategori: "jajanan", waktu: 25, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "Cirebon, West Java",
    ingredients: ["15 pieces firm tofu (fried and quartered)", "5 red chilies", "3 shallots", "2 garlic cloves", "3 tbsp palm sugar", "2 tbsp tamarind water", "100ml water", "Salt to taste"],
    instructions: ["Fry tofu until crispy, cut into quarters", "Grind chilies, shallots, and garlic coarsely", "Dissolve palm sugar in water with tamarind", "Add ground spices to sauce", "Pour sauce over fried tofu", "Serve immediately"]
  },
  {
    id: 343, slug: "kue-cenil", title: "Kue Cenil Recipe: Colorful Chewy Rice Cake Snack",
    shortTitle: "Kue Cenil", description: "Colorful chewy rice flour cakes coated in grated coconut and palm sugar.",
    kategori: "jajanan", waktu: 40, porsi: "20 pieces", kesulitan: "Easy", rating: 4.3, origin: "Java",
    ingredients: ["200g tapioca flour", "100g rice flour", "150ml warm water", "Food coloring (red, green, pink)", "Grated coconut (steamed)", "Palm sugar (grated)"],
    instructions: ["Divide flours into portions, add different colors", "Mix each with warm water into dough", "Form into small logs", "Boil until they float", "Remove and coat in steamed grated coconut", "Sprinkle with grated palm sugar", "Serve as snack"]
  },
  {
    id: 344, slug: "es-kelepon", title: "Es Kelepon Recipe: Coconut Milk Ice with Rice Balls",
    shortTitle: "Es Kelepon", description: "Refreshing ice drink with colorful glutinous rice balls in coconut milk and palm sugar.",
    kategori: "minuman", waktu: 45, porsi: "4 servings", kesulitan: "Medium", rating: 4.4, origin: "Java",
    ingredients: ["Rice balls: 200g glutinous rice flour, pandan juice, food coloring", "Filling: palm sugar cubes", "200ml coconut milk", "Ice cubes", "Grated coconut"],
    instructions: ["Make dough with glutinous rice flour and pandan juice", "Fill with palm sugar cubes, shape into balls", "Boil until they float", "Assemble: ice, rice balls, grated coconut", "Pour coconut milk over", "Serve immediately"]
  },
  {
    id: 345, slug: "sate-usus", title: "Sate Usus Ayam Recipe: Chicken Intestine Satay",
    shortTitle: "Sate Usus", description: "Grilled chicken intestines marinated in turmeric and spices, a popular Jakarta street food.",
    kategori: "sate-panggang", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.3, origin: "Jakarta",
    ingredients: ["500g chicken intestines (cleaned)", "3 cm turmeric", "5 shallots", "3 garlic cloves", "1 tsp coriander", "Salt to taste", "Bamboo skewers", "Peanut sauce"],
    instructions: ["Clean intestines thoroughly, boil until tender", "Grind turmeric, shallots, garlic, and coriander", "Marinate intestines in spice paste", "Thread onto bamboo skewers", "Grill over charcoal until charred", "Serve with peanut sauce and rice cakes"]
  },
  {
    id: 346, slug: "nasi-empal", title: "Nasi Empal Recipe: Sweet Fried Beef with Rice",
    shortTitle: "Nasi Empal", description: "Sweet and savory fried beef served with steamed rice, a Javanese specialty.",
    kategori: "makanan-berat", waktu: 90, porsi: "4 servings", kesulitan: "Medium", rating: 4.6, origin: "Yogyakarta",
    ingredients: ["500g beef shank", "400ml coconut milk", "5 shallots", "3 garlic cloves", "2 cm galangal", "1 tsp coriander", "2 tbsp palm sugar", "Salt to taste", "Oil for frying"],
    instructions: ["Boil beef with spices until tender", "Remove and let cool slightly", "Shred beef with mortar and pestle", "Simmer shredded beef in coconut milk with palm sugar", "Fry until crispy and caramelized", "Serve with steamed rice and sambal"]
  },
  {
    id: 347, slug: "bakso-mercon", title: "Bakso Mercon Recipe: Firecracker Meatballs",
    shortTitle: "Bakso Mercon", description: "Extremely spicy beef meatballs stuffed with chili paste, a fiery Yogyakarta specialty.",
    kategori: "makanan-berat", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.6, origin: "Yogyakarta",
    ingredients: ["500g ground beef", "3 tapioca flour", "3 garlic cloves", "1 tsp pepper", "Salt to taste", "Filling: 20 bird's eye chilies, 5 shallots, 3 garlic cloves", "Beef broth", "Fried shallots", "Chopped scallions"],
    instructions: ["Grind filling ingredients into coarse paste", "Mix ground beef with tapioca, garlic, pepper, and salt", "Flatten meat, add chili filling, form into balls", "Boil in beef broth until they float", "Serve in hot broth with fried shallots and scallions"]
  },
  {
    id: 348, slug: "soto-lamongan", title: "Soto Lamongan Recipe: Lamongan Chicken Soup",
    shortTitle: "Soto Lamongan", description: "Fragrant chicken soup from Lamongan with koya powder and bright yellow turmeric broth.",
    kategori: "sup-soto", waktu: 60, porsi: "6 servings", kesulitan: "Medium", rating: 4.7, origin: "Lamongan, East Java",
    ingredients: ["500g chicken pieces", "3 cm turmeric", "3 lemongrass stalks", "3 bay leaves", "5 shallots", "3 garlic cloves", "1 tsp pepper", "Vermicelli", "Hard-boiled eggs", "Koya powder (crushed fried garlic and crackers)", "Fried shallots", "Scallions"],
    instructions: ["Boil chicken with turmeric, lemongrass, bay leaves, shallots, garlic, and pepper", "Remove chicken and shred", "Strain broth", "Serve broth over vermicelli and shredded chicken", "Add halved egg", "Top with koya powder, fried shallots, and scallions"]
  },
  {
    id: 349, slug: "gudeg-manggar", title: "Gudeg Manggar Recipe: Yogyakarta Jackfruit Stew with Coconut Blossom",
    shortTitle: "Gudeg Manggar", description: "Traditional Yogyakarta gudeg with added manggar (coconut blossom) for extra texture.",
    kategori: "makanan-berat", waktu: 180, porsi: "6 servings", kesulitan: "Hard", rating: 4.7, origin: "Yogyakarta",
    ingredients: ["500g young jackfruit", "200g manggar (coconut blossom)", "200g chicken skin", "400ml coconut milk", "100g palm sugar", "3 bay leaves", "2 lemongrass stalks", "2 cm galangal", "Teak leaves for color", "Salt to taste"],
    instructions: ["Boil jackfruit and manggar until tender", "Combine with chicken skin in pot", "Add coconut milk, palm sugar, bay leaves, lemongrass, and galangal", "Add teak leaves for color", "Simmer for 2 hours until liquid reduces", "Season with salt", "Serve with steamed rice, boiled egg, and sambal krechek"]
  },
  {
    id: 350, slug: "pecel-lele-bledegan", title: "Pecel Lele Bledegan Recipe: Fried Catfish with Special Sambal",
    shortTitle: "Pecel Lele Bledegan", description: "Deep-fried catfish served with special bledegan sambal from Lamongan.",
    kategori: "makanan-berat", waktu: 30, porsi: "4 servings", kesulitan: "Easy", rating: 4.5, origin: "Lamongan, East Java",
    ingredients: ["4 whole catfish", "1 tsp turmeric", "Salt to taste", "Oil for deep frying", "Sambal: 10 red chilies, 5 shallots, 3 garlic cloves, 2 tbsp shrimp paste, 1 tomato", "Fresh vegetables"],
    instructions: ["Clean catfish, rub with turmeric and salt", "Deep fry until crispy", "Make sambal: grind chilies, shallots, garlic, shrimp paste, and tomato", "Fry sambal until fragrant", "Serve catfish with sambal and fresh vegetables"]
  },
  {
    id: 351, slug: "sop-konro", title: "Sop Konro Recipe: Makassar Beef Rib Soup",
    shortTitle: "Sop Konro", description: "Rich dark beef rib soup from Makassar flavored with kluwek nut, giving it distinctive color.",
    kategori: "sup-soto", waktu: 120, porsi: "6 servings", kesulitan: "Hard", rating: 4.7, origin: "Makassar, South Sulawesi",
    ingredients: ["1 kg beef ribs", "10 kluwek nuts (soaked)", "6 shallots", "4 garlic cloves", "3 cm ginger", "2 cm galangal", "2 lemongrass stalks", "3 bay leaves", "1 tsp coriander", "Salt and pepper", "Rice", "Fried shallots"],
    instructions: ["Soak kluwek in hot water, extract black paste", "Grind shallots, garlic, ginger, and coriander", "Boil ribs with aromatics for 1.5 hours", "Add kluwek paste and spice paste", "Simmer until ribs are very tender", "Season with salt and pepper", "Serve with rice and fried shallots"]
  },
  {
    id: 352, slug: "ayam-bakar-madura", title: "Ayam Bakar Madura Recipe: Madurese Grilled Chicken",
    shortTitle: "Ayam Bakar Madura", description: "Sweet and spicy grilled chicken from Madura, known for its caramelized sweet soy glaze.",
    kategori: "sate-panggang", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.6, origin: "Madura",
    ingredients: ["1 whole chicken", "100ml sweet soy sauce", "3 tbsp tamarind water", "2 tbsp palm sugar", "5 shallots", "3 garlic cloves", "1 tsp coriander", "1 tsp pepper", "Banana leaves", "Charcoal for grilling"],
    instructions: ["Grind shallots, garlic, coriander, and pepper", "Marinate chicken with spice paste, sweet soy sauce, tamarind, and palm sugar", "Let rest for 2 hours", "Grill over charcoal, basting frequently", "Turn until chicken is charred and glazed", "Serve with steamed rice and sambal"]
  },
  {
    id: 353, slug: "tahu-petis", title: "Tahu Petis Recipe: Tofu in Shrimp Paste Sauce",
    shortTitle: "Tahu Petis", description: "Fried tofu served with rich petis (shrimp paste) sauce, a popular Surabaya street food.",
    kategori: "jajanan", waktu: 25, porsi: "4 servings", kesulitan: "Easy", rating: 4.4, origin: "Surabaya, East Java",
    ingredients: ["10 pieces firm tofu (fried)", "3 tbsp petis udang (shrimp paste)", "100ml water", "2 garlic cloves (minced)", "1 tsp sugar", "Ketupat rice cakes", "Bean sprouts", "Fried shallots"],
    instructions: ["Fry tofu until crispy", "Sauté garlic, add petis and water", "Cook until sauce thickens", "Arrange tofu, rice cakes, and bean sprouts", "Pour petis sauce over", "Garnish with fried shallots"]
  },
  {
    id: 354, slug: "kue-mendut", title: "Kue Mendut Recipe: Javanese Coconut Rice Dumpling",
    shortTitle: "Kue Mendut", description: "Soft rice flour dumpling filled with sweet coconut, served in warm coconut milk.",
    kategori: "jajanan", waktu: 45, porsi: "15 pieces", kesulitan: "Medium", rating: 4.3, origin: "Central Java",
    ingredients: ["200g rice flour", "200ml coconut milk", "1/4 tsp salt", "Green food coloring", "Filling: 150g grated coconut, 100g palm sugar", "Coconut milk sauce: 400ml coconut milk, 2 pandan leaves, salt"],
    instructions: ["Cook filling until dry and sweet", "Mix rice flour, coconut milk, salt, and coloring into dough", "Form balls, fill with coconut mixture", "Boil in water until they float", "Make coconut milk sauce", "Serve dumplings warm in coconut milk sauce"]
  },
  {
    id: 355, slug: "es-sop-duren", title: "Es Sop Duren Recipe: Durian Fruit Soup Ice",
    shortTitle: "Es Sop Duren", description: "Rich durian dessert soup with coconut milk, jackfruit, and tapioca pearls over ice.",
    kategori: "minuman", waktu: 30, porsi: "4 servings", kesulitan: "Medium", rating: 4.6, origin: "Jakarta",
    ingredients: ["200g durian flesh", "100g jackfruit (diced)", "50g tapioca pearls (cooked)", "200ml coconut milk", "Condensed milk", "Ice cubes", "Palm sugar syrup"],
    instructions: ["Cook tapioca pearls until translucent", "Mash durian with a little coconut milk", "Assemble: ice, durian paste, jackfruit, tapioca", "Pour coconut milk over", "Drizzle with condensed milk and palm sugar syrup", "Serve immediately"]
  },
  {
    id: 356, slug: "bika-ambon", title: "Bika Ambon Recipe: Honeycomb Cake",
    shortTitle: "Bika Ambon", description: "Fragrant honeycomb-textured cake made from tapioca, yeast, and aromatic pandan and lime.",
    kategori: "jajanan", waktu: 120, porsi: "12 slices", kesulitan: "Hard", rating: 4.7, origin: "Medan, North Sumatra",
    ingredients: ["200g tapioca flour", "100g sugar", "3 eggs", "200ml coconut milk", "1 tsp yeast", "2 pandan leaves", "2 kaffir lime leaves", "1/4 tsp salt", "Yellow food coloring"],
    instructions: ["Dissolve sugar in warm coconut milk with pandan and lime leaves", "Cool and add yeast, let ferment for 1 hour", "Mix with tapioca flour, eggs, salt, and coloring", "Let batter ferment for 3 hours", "Pour into greased pan", "Bake at 180°C for 40 minutes", "Cool before slicing to reveal honeycomb texture"]
  },
  {
    id: 357, slug: "kue-apem", title: "Kue Apem Recipe: Traditional Fermented Rice Cake",
    shortTitle: "Kue Apem", description: "Soft fermented rice flour cake with palm sugar, steamed until fluffy.",
    kategori: "jajanan", waktu: 60, porsi: "15 pieces", kesulitan: "Medium", rating: 4.3, origin: "Java",
    ingredients: ["200g rice flour", "100g palm sugar", "200ml coconut milk", "1 tsp yeast", "1/4 tsp salt", "2 pandan leaves"],
    instructions: ["Dissolve palm sugar in warm coconut milk", "Cool and add yeast", "Mix with rice flour and salt", "Let batter rest for 2 hours", "Pour into molds", "Steam for 20 minutes", "Serve warm"]
  },
  {
    id: 358, slug: "gulai-otak", title: "Gulai Otak Recipe: Brain Curry",
    shortTitle: "Gulai Otak", description: "Beef brain simmered in rich spiced coconut curry, a delicacy in Padang cuisine.",
    kategori: "makanan-berat", waktu: 45, porsi: "4 servings", kesulitan: "Medium", rating: 4.4, origin: "Padang, West Sumatra",
    ingredients: ["500g beef brain", "400ml coconut milk", "5 shallots", "3 garlic cloves", "2 cm ginger", "2 cm turmeric", "3 red chilies", "1 tsp coriander", "2 lemongrass stalks", "3 kaffir lime leaves", "Salt and sugar to taste"],
    instructions: ["Clean beef brain, blanch in boiling water", "Grind shallots, garlic, ginger, turmeric, chilies, and coriander", "Sauté paste with lemongrass and kaffir lime leaves", "Add coconut milk and bring to simmer", "Gently add brain pieces", "Cook for 15 minutes without stirring too much", "Season and serve with steamed rice"]
  },
  {
    id: 359, slug: "sate-kuda", title: "Sate Kuda Recipe: Horse Meat Satay",
    shortTitle: "Sate Kuda", description: "Tender horse meat satay from Lombok, marinated in spices and grilled over charcoal.",
    kategori: "sate-panggang", waktu: 60, porsi: "4 servings", kesulitan: "Medium", rating: 4.3, origin: "Lombok, West Nusa Tenggara",
    ingredients: ["500g horse meat (cubed)", "5 shallots", "3 garlic cloves", "2 cm turmeric", "1 tsp coriander", "1 tsp pepper", "Salt to taste", "Sweet soy sauce", "Bamboo skewers"],
    instructions: ["Grind shallots, garlic, turmeric, coriander, and pepper", "Marinate horse meat cubes for 2 hours", "Thread onto bamboo skewers", "Grill over charcoal, basting with sweet soy sauce", "Cook until medium-well", "Serve with peanut sauce and rice cakes"]
  },
  {
    id: 360, slug: "kue-kemplang", title: "Kue Kemplang Recipe: Palembang Fish Crackers",
    shortTitle: "Kue Kemplang", description: "Crispy fish crackers from Palembang, grilled or fried, served with peanut dipping sauce.",
    kategori: "jajanan", waktu: 90, porsi: "30 pieces", kesulitan: "Hard", rating: 4.4, origin: "Palembang, South Sumatra",
    ingredients: ["300g fish meat (ground)", "200g tapioca flour", "2 garlic cloves", "1 tsp salt", "1/2 tsp pepper", "100ml water", "Oil for deep frying", "Peanut sauce for dipping"],
    instructions: ["Grind fish with garlic until smooth", "Mix with tapioca flour, salt, pepper, and water", "Knead into dough", "Shape into thin rounds", "Sun-dry until hard", "Deep fry until they puff up", "Serve with peanut sauce"]
  },
  {
    id: 361, slug: "sop-saudara", title: "Sop Saudara Recipe: Makassar Beef Soup",
    shortTitle: "Sop Saudara", description: "Rich beef soup from Makassar with rice vermicelli, fried shallots, and spicy sambal.",
    kategori: "sup-soto", waktu: 90, porsi: "6 servings", kesulitan: "Medium", rating: 4.6, origin: "Makassar, South Sulawesi",
    ingredients: ["500g beef (cubed)", "3 potatoes (cubed)", "200g rice vermicelli", "3 tomatoes (quartered)", "5 shallots", "3 garlic cloves", "2 cm ginger", "1 tsp pepper", "Fried shallots", "Chopped scallions", "Sambal"],
    instructions: ["Boil beef until tender, reserve broth", "Sauté shallots, garlic, and ginger", "Add to broth with potatoes", "Cook until potatoes are tender", "Add tomatoes", "Serve over vermicelli with fried shallots and scallions", "Offer sambal on the side"]
  },
  {
    id: 362, slug: "ayam-goreng-kalasan-premium", title: "Ayam Goreng Kalasan Premium Recipe: Premium Yogyakarta Fried Chicken",
    shortTitle: "Ayam Goreng Kalasan Premium", description: "Premium free-range chicken simmered in spiced coconut milk then deep fried with crispy kremes.",
    kategori: "makanan-berat", waktu: 75, porsi: "4 servings", kesulitan: "Medium", rating: 4.8, origin: "Kalasan, Yogyakarta",
    ingredients: ["1 whole ayam kampung", "500ml coconut milk", "3 bay leaves", "2 lemongrass stalks", "2 cm galangal", "1 tsp coriander", "1 tsp turmeric", "Salt to taste", "Rice flour batter for kremes", "Oil for deep frying"],
    instructions: ["Simmer chicken in spiced coconut milk until tender", "Remove and cool slightly", "Make thin rice flour batter with turmeric", "Deep fry chicken until golden", "Drizzle batter into oil for crispy kremes", "Serve with steamed rice, sambal, and fresh vegetables"]
  },
  {
    id: 363, slug: "ikan-mujair-bakar-premium", title: "Ikan Mujair Bakar Premium Recipe: Premium Grilled Tilapia",
    shortTitle: "Ikan Mujair Bakar Premium", description: "Premium whole tilapia grilled with special spice paste and kecombrang for aromatic flavor.",
    kategori: "sate-panggang", waktu: 40, porsi: "4 servings", kesulitan: "Easy", rating: 4.6, origin: "East Java",
    ingredients: ["4 whole mujair fish", "2 cm turmeric", "3 shallots", "2 garlic cloves", "1 kecombrang flower (sliced)", "1 tsp salt", "Banana leaves", "Oil for grilling"],
    instructions: ["Clean and score fish", "Grind turmeric, shallots, and garlic", "Add sliced kecombrang", "Rub paste all over fish", "Wrap in banana leaves", "Grill over charcoal for 15 minutes each side", "Serve with sambal and fresh vegetables"]
  }
];

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Generate image using Cloudflare AI
async function generateImage(slug, prompt) {
  const outputPath = path.join(__dirname, 'public/images', `${slug}.jpg`);
  
  // Skip if image exists
  if (fs.existsSync(outputPath)) {
    console.log(`Image exists: ${slug}.jpg`);
    return true;
  }

  const fullPrompt = `Close-up food photography of ${prompt}, professional food styling, clean background, no people, studio lighting, appetizing, 4k`;
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ prompt: fullPrompt });
    
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        // Check if it's JSON (error) or image data
        try {
          const json = JSON.parse(buffer.toString());
          if (json.success === false) {
            console.error(`Error for ${slug}:`, json.errors);
            reject(new Error(json.errors?.[0]?.message || 'API error'));
            return;
          }
        } catch (e) {
          // It's image data, save it
          fs.writeFileSync(outputPath, buffer);
          console.log(`Generated: ${slug}.jpg`);
          resolve(true);
          return;
        }
        reject(new Error('Unexpected response'));
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Add recipes to recipes.ts
function addRecipesToTS(recipes) {
  const tsPath = path.join(__dirname, 'src/data/recipes.ts');
  let content = fs.readFileSync(tsPath, 'utf8');
  
  // Find the closing bracket
  const closingIndex = content.lastIndexOf('];');
  
  if (closingIndex === -1) {
    console.error('Could not find closing bracket in recipes.ts');
    return false;
  }

  // Generate TypeScript code for new recipes
  let newRecipesCode = '';
  
  for (const recipe of recipes) {
    newRecipesCode += `  {
    id: ${recipe.id},
    slug: "${recipe.slug}",
    title: "${recipe.title}",
    shortTitle: "${recipe.shortTitle}",
    description: "${recipe.description}",
    image: "/images/${recipe.slug}.jpg",
    kategori: "${recipe.kategori}",
    waktu: ${recipe.waktu},
    porsi: "${recipe.porsi}",
    kesulitan: "${recipe.kesulitan}",
    rating: ${recipe.rating},
    origin: "${recipe.origin}",
    ingredients: ${JSON.stringify(recipe.ingredients)},
    instructions: ${JSON.stringify(recipe.instructions)},
  },
`;
  }

  // Insert before closing bracket
  content = content.slice(0, closingIndex) + newRecipesCode + content.slice(closingIndex);
  
  fs.writeFileSync(tsPath, content);
  console.log(`Added ${recipes.length} recipes to recipes.ts`);
  return true;
}

// Main execution
async function main() {
  console.log('=== NusantaraEats Recipe Generator ===');
  console.log(`Total new recipes: ${newRecipes.length}`);
  
  // Step 1: Add recipes to TypeScript file
  console.log('\n--- Adding recipes to recipes.ts ---');
  addRecipesToTS(newRecipes);
  
  // Step 2: Generate images (first 5 as test)
  console.log('\n--- Generating images (first 5) ---');
  for (let i = 0; i < Math.min(5, newRecipes.length); i++) {
    const recipe = newRecipes[i];
    const prompt = `${recipe.title.replace(' Recipe:', '').replace(/ Recipe:.*/, '')}, ${recipe.description.substring(0, 100)}`;
    
    try {
      await generateImage(recipe.slug, prompt);
      // Wait 1 second between API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`Failed to generate image for ${recipe.slug}:`, err.message);
    }
  }
  
  console.log('\n=== Done! ===');
  console.log('Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Deploy to Cloudflare Pages');
  console.log('3. Generate remaining images');
}

main().catch(console.error);
