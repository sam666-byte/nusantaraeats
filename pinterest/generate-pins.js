const fs = require('fs');

// Pinterest Pin Data
const pins = [
  {
    title: "Authentic Rendang Recipe",
    subtitle: "World's Best Food • Slow-Cooked Beef",
    image: "https://nusantaraeats.com/images/rendang.jpg",
    link: "https://nusantaraeats.com/recipes/rendang",
    color: "#D97706"
  },
  {
    title: "Nasi Goreng Recipe",
    subtitle: "Indonesia's National Dish • Easy to Make",
    image: "https://nusantaraeats.com/images/nasi-goreng-kampung.jpg",
    link: "https://nusantaraeats.com/recipes/nasi-goreng-kampung",
    color: "#DC2626"
  },
  {
    title: "Sate Madura Recipe",
    subtitle: "Best Indonesian Satay • Grilled Chicken",
    image: "https://nusantaraeats.com/images/sate-madura.jpg",
    link: "https://nusantaraeats.com/recipes/sate-madura",
    color: "#B45309"
  },
  {
    title: "Gudeg Recipe",
    subtitle: "Yogyakarta's Signature Dish • Sweet Jackfruit",
    image: "https://nusantaraeats.com/images/gudeg.jpg",
    link: "https://nusantaraeats.com/recipes/gudeg",
    color: "#92400E"
  },
  {
    title: "Soto Ayam Recipe",
    subtitle: "Traditional Chicken Soup • Aromatic Spices",
    image: "https://nusantaraeats.com/images/soto-ayam.jpg",
    link: "https://nusantaraeats.com/recipes/soto-ayam",
    color: "#CA8A04"
  },
  {
    title: "Bakso Recipe",
    subtitle: "Indonesian Meatballs • Comfort Food",
    image: "https://nusantaraeats.com/images/bakso-sapi.jpg",
    link: "https://nusantaraeats.com/recipes/bakso-sapi",
    color: "#7C2D12"
  },
  {
    title: "Pempek Recipe",
    subtitle: "Palembang Fish Cake • Sweet & Sour",
    image: "https://nusantaraeats.com/images/pempek.jpg",
    link: "https://nusantaraeats.com/recipes/pempek-palembang",
    color: "#1D4ED8"
  },
  {
    title: "Martabak Manis",
    subtitle: "Sweet Stuffed Pancake • Chocolate & Cheese",
    image: "https://nusantaraeats.com/images/martabak-manis-premium.jpg",
    link: "https://nusantaraeats.com/recipes/martabak-manis",
    color: "#7C3AED"
  },
  {
    title: "Es Cendol Recipe",
    subtitle: "Refreshing Dessert Drink • Coconut Milk",
    image: "https://nusantaraeats.com/images/es-cendol-premium.jpg",
    link: "https://nusantaraeats.com/recipes/es-cendol",
    color: "#059669"
  },
  {
    title: "50+ Indonesian Dishes",
    subtitle: "Ultimate Food Guide • From Sabang to Merauke",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    link: "https://nusantaraeats.com/blog/ultimate-indonesian-food-guide",
    color: "#DC2626"
  }
];

// Generate HTML for Pinterest Pins
function generatePinHTML(pin, index) {
  return `
<!-- Pin ${index + 1}: ${pin.title} -->
<div class="pin-card" style="background: ${pin.color};">
  <img src="${pin.image}" alt="${pin.title}" />
  <div class="overlay">
    <h2>${pin.title}</h2>
    <p>${pin.subtitle}</p>
    <a href="${pin.link}" target="_blank">Get Recipe →</a>
  </div>
</div>`;
}

// Generate all pins HTML
let pinsHTML = pins.map((pin, i) => generatePinHTML(pin, i)).join('\n');

const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <title>NusantaraEats Pinterest Pins</title>
  <style>
    body { font-family: Arial, sans-serif; background: #111; padding: 20px; }
    .pin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .pin-card { border-radius: 16px; overflow: hidden; position: relative; aspect-ratio: 2/3; }
    .pin-card img { width: 100%; height: 100%; object-fit: cover; }
    .pin-card .overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(transparent, rgba(0,0,0,0.9)); }
    .pin-card h2 { color: white; font-size: 24px; margin: 0; }
    .pin-card p { color: #ccc; font-size: 14px; margin: 8px 0; }
    .pin-card a { color: #F59E0B; text-decoration: none; font-weight: bold; }
    h1 { color: white; text-align: center; }
    .info { color: #888; text-align: center; margin-bottom: 30px; }
  </style>
</head>
<body>
  <h1>🍳 NusantaraEats Pinterest Pins</h1>
  <p class="info">Click on any pin to visit the recipe page</p>
  <div class="pin-grid">
    ${pinsHTML}
  </div>
</body>
</html>`;

fs.writeFileSync('./pinterest/pins-preview.html', fullHTML);
console.log('Generated 10 Pinterest pin previews!');

// Also generate pin descriptions as JSON for easy copy-paste
const pinDescriptions = pins.map(pin => ({
  title: pin.title,
  description: `${pin.title} - ${pin.subtitle}. Get the full recipe at ${pin.link} #IndonesianFood #Recipe #Cooking`,
  link: pin.link,
  board: pin.title.includes('Guide') ? 'Indonesian Food Guides' : 'Indonesian Recipes'
}));

fs.writeFileSync('./pinterest/pin-descriptions.json', JSON.stringify(pinDescriptions, null, 2));
console.log('Generated pin descriptions JSON!');
