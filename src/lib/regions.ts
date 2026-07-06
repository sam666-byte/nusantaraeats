// Map origin strings to region page IDs
const regionKeywords: Record<string, string[]> = {
  "west-sumatra": ["West Sumatra", "Padang", "Minang", "Minangkabau", "Bukittinggi", "Pesisir Selatan", "Solok", "Tanah Datar", "Agam", "Lima Puluh Kota", "Sijunjung", "Kepulauan Mentawai", "Pasaman"],
  "java": ["Java", "Yogyakarta", "Surabaya", "Solo", "Central Java", "East Java", "West Java", "Sunda", "Jawa", "Jawa Tengah", "Jawa Timur", "Jawa Barat", "Madiun", "Semarang", "Bandung", "Cirebon", "Tegal", "Pekalongan", "Kedu", "Banyumas", "Ponorogo", "Malang", "Kediri", "Blitar", "Mojokerto", "Gresik", "Lamongan", "Tuban", "Bojonegoro", "Jombang", "Nganjuk", "Magetan", "Ngawi", "Karanganyar", "Wonogiri", "Sragen", "Grobogan", "Demak", "Kudus", "Jepara", "Pati", "Rembang", "Blora", "Purbalingga", "Banjarnegara", "Wonosobo", "Temanggung", "Magelang", "Sleman", "Bantul", "Gunung Kidul", "Kulon Progo", "Purwokerto", "Cilacap", "Banyumas"],
  "bali": ["Bali", "Ubud", "Denpasar", "Gianyar", "Tabanan", "Badung", "Klungkung", "Karangasem", "Buleleng"],
  "sulawesi": ["South Sulawesi", "Makassar", "North Sulawesi", "Manado", "Sulawesi", "Sulawesi Selatan", "Sulawesi Utara", "Gowa", "Takalar", "Jeneponto", "Bulukumba", "Sinjai", "Maros", "Pangkep", "Barru", "Soppeng", "Wajo", "Pinrang", "Enrekang", "Tana Toraja", "Toraja", "Palu", "Kendari", "Gorontalo", "Manado", "Bitung", "Tomohon", "Minahasa", "Bolaang Mongondow", "Palu", "Donggala", "Poso", "Morowali", "Banggai", "Luwuk"],
  "sumatra": ["Aceh", "Palembang", "South Sumatra", "North Sumatra", "Karo", "Sumatra", "Sumatera", "Medan", "Padang", "Lampung", "Riau", "Jambi", "Bengkulu", "Bangka", "Belitung", "Tapanuli", "Nias", "Mandailing", "Simalungun", "Pematang Siantar", "Binjai", "Tebing Tinggi", "Tanjung Balai", "Lhokseumawe", "Banda Aceh", "Sabang", "Meulaboh", "Sigli", "Bireuen", "Langsa", "Subulussalam", "Takengon", "Kutacane", "Blang Kejeren"],
  "kalimantan": ["South Kalimantan", "Banjar", "Kalimantan", "Banjarmasin", "Banjarbaru", "Martapura", "Barabai", "Amuntai", "Kandangan", "Rantau", "Tapin", "Hulu Sungai", "Tabalong", "Balangan", "Paser", "Kutai", "Berau", "Bulungan", "Malinau", "Nunukan", "Tana Tidung", "Tarakan", "Pontianak", "Singkawang", "Sambas", "Bengkayang", "Landak", "Mempawah", "Kayong Utara", "Kubu Raya", "Melawi", "Sekadau", "Sintang", "Kapuas Hulu", "Palangkaraya", "Kapuas", "Barito", "Kotawaringin", "Sukamara", "Lamandau", "Gunung Mas", "Pulang Pisau", "Murung Raya", "Barito Selatan", "Barito Timur", "Barito Utara", "Katingan", "Muntilan", "Seruyan"],
  "papua-maluku": ["Papua", "Maluku", "North Maluku", "Ternate", "Tidore", "Sorong", "Manokwari", "Jayapura", "Merauke", "Bintuni", "Fak-Fak", "Kaimana", "Teluk Wondama", "Teluk Bintuni", "Pegunungan Bintang", "Yahukimo", "Kepulauan Aru", "Buru", "Seram", "Ambon", "Tual", "Saumlaki", "Merauke", "Timika", "Nabire", "Puncak Jaya", "Lanny Jaya", "Yalimo", "Waropen", "Sarmi", "Keerom", "Mamberamo", "Dogiyai", "Deiyai", "Paniai", "Intan Jaya"],
  "jakarta": ["Jakarta", "Betawi", "Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Utara", "Jakarta Timur"],
};

// Additional specific mappings for common compound origins
const specificOriginMap: Record<string, string> = {
  "Betawi, Jakarta": "jakarta",
  "Palembang, Sumatera Selatan": "sumatra",
  "Madiun, Jawa Timur": "java",
  "Surabaya, Jawa Timur": "java",
  "Semarang, Jawa Tengah": "java",
  "Makassar, Sulawesi Selatan": "sulawesi",
  "Nasional (Dutch-Indonesian)": "java",
};

export function getRegionIdFromOrigin(origin: string, title?: string, description?: string): string | null {
  // Check specific mappings first
  if (specificOriginMap[origin]) {
    return specificOriginMap[origin];
  }

  // Check keyword matching on origin
  for (const [regionId, keywords] of Object.entries(regionKeywords)) {
    if (keywords.some((k) => origin.includes(k))) {
      return regionId;
    }
  }

  // If origin is generic (Indonesia, Nationwide, Nasional), try title and description
  const genericOrigins = ["Indonesia", "Nationwide", "Nasional", ""];
  if (genericOrigins.includes(origin) && (title || description)) {
    const searchText = `${title || ""} ${description || ""}`.toLowerCase();
    for (const [regionId, keywords] of Object.entries(regionKeywords)) {
      if (keywords.some((k) => searchText.includes(k.toLowerCase()))) {
        return regionId;
      }
    }
  }

  return null;
}
