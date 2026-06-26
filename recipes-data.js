// ============================================================
// RESEPKITA — Data Resep dengan Foto 4K Asli dari Unsplash
// ============================================================

const defaultRecipes = [
  {
    id: 1,
    nama: "Nasi Goreng Jawa",
    kategori: "makanan-berat",
    waktu: 30,
    porsi: "2 orang",
    kesulitan: "Mudah",
    rating: 4.8,
    gambar: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&q=80",
    bahan: [
      "2 piring nasi putih dingin (nasi semalam lebih baik)",
      "2 siung bawang putih, cincang halus",
      "3 siung bawang merah, iris tipis",
      "2 butir telur ayam kampung",
      "1 sdm kecap manis Bango",
      "1 sdt garam laut",
      "½ sdt merica putih bubuk",
      "Minyak kelapa secukupnya",
      "Pelengkap: kerupuk udang, acar mentimun, irisan tomat, daun bawang"
    ],
    langkah: [
      "Panaskan minyak kelapa di wajan besar dengan api sedang-tinggi.",
      "Tumis bawang merah dan bawang putih hingga harum dan keemasan.",
      "Sisihkan tumisan ke pinggir wajan, masukkan telur, orak-arik hingga matang.",
      "Masukkan nasi dingin, aduk rata dengan bumbu dan telur menggunakan api besar.",
      "Tambahkan kecap manis, garam, dan merica. Aduk cepat hingga warna merata dan nasi sedikit kering.",
      "Masak selama 3-5 menit hingga terdengar suara 'pletik-pletik' — tanda nasi goreng sempurna.",
      "Sajikan hangat dengan kerupuk, acar, irisan tomat, dan taburan daun bawang."
    ]
  },
  {
    id: 2,
    nama: "Rendang Daging Sapi Padang",
    kategori: "makanan-berat",
    waktu: 240,
    porsi: "8 orang",
    kesulitan: "Sulit",
    rating: 4.9,
    gambar: "https://images.unsplash.com/photo-1603073163308-9654c3f70f5e?w=1200&q=80",
    bahan: [
      "1 kg daging sapi has dalam, potong kotak 4x4 cm",
      "2 liter santan kental dari 2 butir kelapa tua",
      "5 lembar daun jeruk purut",
      "2 batang serai, memarkan bagian putihnya",
      "2 lembar daun kunyit, simpulkan",
      "1 lembar daun salam",
      "Bumbu halus: 12 siung bawang merah, 8 siung bawang putih, 150 gr cabe merah keriting, 50 gr cabe rawit (opsional), 4 cm jahe, 4 cm lengkuas, 3 cm kunyit bakar, 2 sdt ketumbar sangrai, 1 sdt jintan sangrai, ½ sdt pala bubuk, garam secukupnya"
    ],
    langkah: [
      "Sangrai ketumbar dan jintan hingga wangi, lalu haluskan bersama semua bumbu halus.",
      "Tumis bumbu halus dengan sedikit minyak, tambahkan daun jeruk, serai, daun kunyit, dan daun salam. Masak hingga bumbu benar-benar matang dan minyak terpisah (sekitar 15 menit).",
      "Masukkan daging sapi, aduk hingga berubah warna dan terbalut bumbu sempurna.",
      "Tuang santan, aduk rata. Masak dengan api sedang sambil terus diaduk perlahan.",
      "Setelah mendidih, kecilkan api. Masak selama 3-4 jam sambil sesekali diaduk agar tidak gosong di dasar wajan.",
      "Lanjutkan memasak hingga santan benar-benar menyusut, bumbu mengental, dan warna berubah menjadi cokelat gelap kehitaman — inilah rendang sejati.",
      "Rendang siap disajikan. Semakin lama disimpan, rasanya semakin meresap."
    ]
  },
  {
    id: 3,
    nama: "Sate Ayam Madura",
    kategori: "sate-panggang",
    waktu: 75,
    porsi: "5 orang",
    kesulitan: "Sedang",
    rating: 4.7,
    gambar: "https://images.unsplash.com/photo-1559825597-6ea0c737e3e4?w=1200&q=80",
    bahan: [
      "600 gr dada ayam fillet, potong dadu 2 cm",
      "Tusuk sate bambu, rendam air 30 menit",
      "4 sdm kecap manis",
      "2 sdm minyak kelapa",
      "1 sdm air jeruk nipis",
      "Bumbu kacang: 200 gr kacang tanah, goreng keemasan",
      "4 siung bawang putih, goreng",
      "8 cabe rawit merah (sesuai selera)",
      "3 sdm gula merah sisir",
      "1 sdt garam",
      "250 ml air panas",
      "2 sdm kecap manis (untuk bumbu kacang)",
      "Pelengkap: lontong/ketupat, bawang goreng, jeruk limau"
    ],
    langkah: [
      "Marinasi potongan ayam dengan kecap manis, minyak kelapa, dan air jeruk nipis. Diamkan minimal 45 menit agar meresap.",
      "Tusukkan ayam ke tusuk sate, masing-masing 4-5 potong per tusuk. Sisakan sedikit ruang di ujung.",
      "Bumbu kacang: haluskan/blender kacang tanah goreng, bawang putih goreng, cabe rawit, gula merah, dan garam.",
      "Tuang air panas sedikit demi sedikit ke bumbu kacang sambil diaduk hingga kekentalan yang diinginkan. Tambahkan kecap manis, koreksi rasa.",
      "Panggang sate di atas bara arang (bukan api) atau grill pan. Bolak-balik sambil sesekali dioles sisa bumbu marinasi.",
      "Panggang hingga kedua sisi kecoklatan dan daging matang sempurna (10-12 menit).",
      "Sajikan sate dengan bumbu kacang hangat, lontong, taburan bawang goreng, dan perasan jeruk limau."
    ]
  },
  {
    id: 4,
    nama: "Soto Ayam Lamongan",
    kategori: "sup-soto",
    waktu: 100,
    porsi: "6 orang",
    kesulitan: "Sedang",
    rating: 4.8,
    gambar: "https://images.unsplash.com/photo-1626804475297-410ac11f41c5?w=1200&q=80",
    bahan: [
      "1 ekor ayam kampung (sekitar 1,2 kg), potong 4 bagian",
      "2 batang serai, memarkan",
      "5 lembar daun jeruk",
      "3 cm lengkuas, memarkan",
      "2 lembar daun salam",
      "2,5 liter air bersih",
      "Bumbu halus: 10 siung bawang merah, 6 siung bawang putih, 5 cm kunyit bakar, 3 cm jahe, 4 butir kemiri sangrai, 1 sdm ketumbar sangrai, 1 sdt merica butir, garam dan gula merah secukupnya",
      "Pelengkap: soun seduh, telur rebus belah dua, kol iris halus, seledri cincang, daun bawang iris, bawang goreng, koya (kerupuk udang + bawang putih goreng, haluskan), jeruk nipis, sambal rebus"
    ],
    langkah: [
      "Rebus ayam dalam air dingin, buang busa yang muncul di permukaan. Tambahkan serai, daun jeruk, lengkuas, dan daun salam.",
      "Tumis bumbu halus dengan sedikit minyak hingga harum, matang, dan berwarna keemasan.",
      "Masukkan tumisan bumbu ke dalam rebusan ayam. Masak dengan api kecil-sedang hingga ayam empuk dan kaldu kaya rasa (sekitar 45-60 menit).",
      "Angkat ayam, tiriskan. Goreng ayam sebentar hingga kulit kecoklatan (opsional, bisa juga langsung disuwir tanpa digoreng). Suwir-suwir dagingnya.",
      "Saring kuah soto agar bening. Didihkan kembali, koreksi rasa dengan garam dan gula.",
      "Tata dalam mangkuk: nasi putih, soun, kol iris, suwiran ayam, telur rebus. Siram kuah panas.",
      "Taburi seledri, daun bawang, bawang goreng, dan koya. Sajikan dengan jeruk nipis dan sambal."
    ]
  },
  {
    id: 5,
    nama: "Gado-Gado Betawi",
    kategori: "makanan-berat",
    waktu: 50,
    porsi: "4 orang",
    kesulitan: "Mudah",
    rating: 4.5,
    gambar: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
    bahan: [
      "150 gr tauge, seduh air panas, tiriskan",
      "150 gr kangkung, petik daunnya, rebus sebentar",
      "2 buah kentang, rebus, potong dadu",
      "3 butir telur rebus, belah dua",
      "2 buah tahu putih, goreng keemasan, potong",
      "2 buah tempe, goreng keemasan, potong",
      "1 buah mentimun, iris",
      "Lontong atau ketupat, potong-potong",
      "Bumbu kacang: 250 gr kacang tanah goreng",
      "4 siung bawang putih goreng",
      "8 cabe rawit (sesuai selera)",
      "3 sdm gula merah sisir",
      "1 sdt garam",
      "2 sdm air asam jawa kental",
      "300 ml air hangat",
      "Pelengkap: kerupuk emping, bawang goreng"
    ],
    langkah: [
      "Siapkan semua sayuran dan bahan yang sudah direbus/digoreng. Tata di piring saji.",
      "Bumbu kacang: haluskan kacang tanah goreng, bawang putih, cabe rawit, gula merah, dan garam.",
      "Tambahkan air asam jawa, lalu tuang air hangat sedikit demi sedikit sambil diaduk hingga menjadi saus kental yang bisa dituang.",
      "Koreksi rasa bumbu kacang — harus seimbang antara manis, gurih, dan pedas.",
      "Siram bumbu kacang di atas tatanan sayur dan lauk. Jangan diaduk dulu — biarkan cantik.",
      "Taburi bawang goreng dan sajikan dengan kerupuk emping di sampingnya."
    ]
  },
  {
    id: 6,
    nama: "Bakso Malang Komplit",
    kategori: "sup-soto",
    waktu: 120,
    porsi: "8 orang",
    kesulitan: "Sedang",
    rating: 4.6,
    gambar: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200&q=80",
    bahan: [
      "600 gr daging sapi segar, giling halus",
      "150 gr tepung tapioka berkualitas",
      "3 putih telur",
      "6 siung bawang putih, haluskan & goreng",
      "1 sdm garam",
      "1 sdt merica putih bubuk",
      "1 sdt kaldu sapi bubuk (opsional)",
      "Es batu secukupnya untuk merendam",
      "Kuah: 3 liter air kaldu sapi",
      "5 siung bawang putih, goreng, memarkan",
      "Batang seledri, ikat simpul",
      "Garam & merica secukupnya",
      "Pelengkap: mi kuning rebus, bihun rebus, sawi hijau rebus, tahu goreng, pangsit goreng, sambal rebus, kecap manis, saus sambal"
    ],
    langkah: [
      "Campur daging giling dengan garam, merica, kaldu bubuk, dan bawang putih goreng halus. Uleni hingga lengket.",
      "Tambahkan putih telur satu per satu sambil terus diuleni. Masukkan tepung tapioka, uleni hingga kalis dan bisa dibentuk.",
      "Didihkan air dalam panci besar. Bentuk adonan menjadi bola-bola dengan tangan (basahi tangan agar tidak lengket).",
      "Masukkan bakso ke air mendidih. Masak hingga bakso mengapung — tanda sudah matang. Angkat dan rendam dalam air es agar kenyal.",
      "Kuah: didihkan kaldu sapi, masukkan bawang putih goreng dan seledri. Bumbui garam dan merica. Masak 20 menit dengan api kecil.",
      "Tata dalam mangkuk: mi, bihun, sawi, bakso, tahu goreng, dan pangsit. Siram kuah panas mendidih.",
      "Sajikan segera dengan sambal, kecap, dan saus sambal di sampingnya."
    ]
  },
  {
    id: 7,
    nama: "Martabak Manis Bangka",
    kategori: "jajanan",
    waktu: 90,
    porsi: "4 loyang",
    kesulitan: "Sedang",
    rating: 4.9,
    gambar: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
    bahan: [
      "300 gr tepung terigu protein sedang",
      "3 butir telur",
      "60 gr gula pasir",
      "½ sdt garam",
      "400 ml susu cair full cream",
      "1 sdt baking powder",
      "½ sdt soda kue",
      "1 sdt ragi instan",
      "Topping: meses cokelat premium, keju cheddar parut, kacang tanah sangrai cincang, susu kental manis, margarin/butter"
    ],
    langkah: [
      "Campur terigu, gula, garam, ragi, dan susu cair. Aduk rata dengan whisk. Tutup dan diamkan 45-60 menit hingga berbuih.",
      "Setelah mengembang, tambahkan telur, baking powder, dan soda kue. Aduk rata kembali.",
      "Panaskan wajan martabak/loyang khusus dengan api kecil. Tuang adonan secukupnya (sekitar 1 sendok sayur besar).",
      "Tunggu hingga muncul gelembung-gelembung di permukaan. Taburi sedikit gula pasir di atasnya.",
      "Tutup wajan dan masak dengan api paling kecil hingga permukaan kering dan matang merata.",
      "Angkat martabak, segera olesi margarin selagi panas. Taburi meses, keju, kacang, dan siram susu kental manis.",
      "Lipat martabak menjadi dua, olesi bagian luar dengan margarin. Potong-potong dan sajikan hangat."
    ]
  },
  {
    id: 8,
    nama: "Es Cendol Dawet Ayu",
    kategori: "minuman",
    waktu: 50,
    porsi: "6 gelas",
    kesulitan: "Mudah",
    rating: 4.7,
    gambar: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200&q=80",
    bahan: [
      "150 gr tepung beras",
      "75 gr tepung hunkwe",
      "800 ml air",
      "½ sdt garam",
      "2 sdm pasta pandan + pewarna hijau alami",
      "Es serut secukupnya",
      "Sirup gula merah: 300 gr gula aren asli, 150 ml air, 2 lembar daun pandan, ikat simpul",
      "Santan: 500 ml santan kental, ¼ sdt garam, 1 lembar daun pandan"
    ],
    langkah: [
      "Cendol: campur tepung beras, hunkwe, air, garam, dan pasta pandan dalam panci. Aduk hingga tidak bergerindil.",
      "Masak dengan api sedang sambil terus diaduk hingga mengental, meletup-letup, dan berwarna bening kehijauan (sekitar 15 menit).",
      "Siapkan baskom berisi air es. Tuang adonan ke cetakan cendol/saringan berlubang, tekan hingga jatuh ke air es. Tiriskan cendol.",
      "Sirup: rebus gula aren, air, dan daun pandan hingga gula larut dan mengental seperti sirup. Saring, dinginkan.",
      "Santan: rebus santan, garam, dan daun pandan dengan api kecil sambil terus diaduk. Jangan sampai mendidih agar santan tidak pecah. Dinginkan.",
      "Penyajian: masukkan cendol, es serut, sirup gula merah, dan santan ke gelas tinggi. Aduk dan nikmati segera."
    ]
  },
  {
    id: 9,
    nama: "Pempek Kapal Selam Palembang",
    kategori: "jajanan",
    waktu: 100,
    porsi: "8 buah",
    kesulitan: "Sedang",
    rating: 4.8,
    gambar: "https://images.unsplash.com/photo-1562967914-608f3c9e17e4?w=1200&q=80",
    bahan: [
      "600 gr daging ikan tenggiri giling (bisa campur ikan gabus)",
      "350 ml air es",
      "400 gr tepung sagu tani kualitas premium",
      "3 butir telur (2 untuk adonan, 1 untuk isian kapal selam)",
      "2 sdt garam",
      "1 sdt gula pasir",
      "1 sdt kaldu bubuk (opsional)",
      "Minyak untuk menggoreng",
      "Cuko: 400 gr gula aren, 8 siung bawang putih, 15 cabe rawit (sesuai selera), 4 sdm cuka masak, 600 ml air, 1 sdt garam, 1 sdm ebi sangrai halus (opsional)"
    ],
    langkah: [
      "Campur ikan giling, air es, garam, gula, kaldu bubuk, dan 2 butir telur. Uleni hingga lengket dan menyatu.",
      "Masukkan tepung sagu sedikit demi sedikit sambil terus diuleni. Jangan overmix — cukup hingga bisa dibentuk.",
      "Untuk kapal selam: ambil segenggam adonan, pipihkan, beri 1 sdm kocokan telur di tengahnya, tutup rapat bentuk oval.",
      "Untuk lenjer: bentuk adonan memanjang seperti silinder. Untuk adaan: bentuk bulat.",
      "Rebus semua pempek dalam air mendidih hingga mengapung (tanda matang). Angkat, tiriskan.",
      "Goreng pempek dalam minyak panas hingga kulitnya keemasan dan renyah. Tiriskan minyak berlebih.",
      "Cuko: haluskan bawang putih dan cabe. Rebus bersama gula aren, air, ebi, dan garam hingga mendidih. Matikan api, tambahkan cuka. Saring.",
      "Sajikan pempek hangat dengan cuko dan irisan mentimun segar."
    ]
  },
  {
    id: 10,
    nama: "Es Teler Nusantara",
    kategori: "minuman",
    waktu: 25,
    porsi: "4 gelas",
    kesulitan: "Mudah",
    rating: 4.6,
    gambar: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1200&q=80",
    bahan: [
      "2 buah alpukat mentega, keruk dagingnya",
      "150 gr nangka matang, potong dadu kecil",
      "2 buah kelapa muda, keruk dagingnya, simpan airnya",
      "Es serut secukupnya",
      "Sirup cocopandan atau sirup gula aren",
      "Susu kental manis putih",
      "Santan kental matang (opsional)",
      "Biji selasih rendam (opsional)"
    ],
    langkah: [
      "Siapkan gelas saji besar. Masukkan alpukat, nangka, dan daging kelapa muda di dasar gelas.",
      "Tambahkan biji selasih jika menggunakan.",
      "Isi gelas dengan es serut hingga penuh, padatkan sedikit.",
      "Tuang sirup cocopandan secukupnya (sekitar 2-3 sdm per gelas).",
      "Siram dengan susu kental manis secukupnya di atas es.",
      "Tambahkan sedikit air kelapa muda dan santan jika suka lebih creamy.",
      "Aduk rata semua bahan sebelum dinikmati. Sajikan segera selagi dingin!"
    ]
  }
];

// Load from localStorage or use defaults
if (!localStorage.getItem('resepKitaRecipesV2')) {
    localStorage.setItem('resepKitaRecipesV2', JSON.stringify(defaultRecipes));
}
