# ResepKita — Mahakarya Kuliner Nusantara ✨

Platform resep masakan Indonesia super mewah dengan foto 4K asli, desain premium dark-elegant, dan pengalaman browsing yang memukau. Dibangun sebagai versi Indonesia dari Allrecipes.com — tapi jauh lebih mewah.

## 🎯 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🖼️ **Foto 4K Asli** | Semua resep menggunakan foto asli dari Unsplash resolusi tinggi (1200px+) |
| 🎨 **Desain Mewah** | Tema dark elegan + aksen emas, tipografi Playfair Display & Inter |
| ✨ **Partikel Emas** | Animasi subtle gold dust di background untuk kesan premium |
| 🔍 **Pencarian Cepat** | Cari berdasarkan nama, kategori, atau bahan resep |
| 🏷️ **Filter Kategori** | 5 kategori: Makanan Berat, Sup & Soto, Sate & Panggang, Jajanan, Minuman |
| 📋 **Detail Lengkap** | Modal dengan foto besar, rating, bahan, langkah, waktu, porsi, kesulitan |
| ➕ **Tambah Resep** | Form premium untuk menambahkan resep sendiri (tersimpan di localStorage) |
| 📱 **Responsif** | Tampilan optimal di desktop, tablet, dan mobile |
| 🎭 **Animasi Halus** | Reveal animations, hover effects, smooth scrolling |

## 🍽️ 10 Resep Bawaan

1. **Nasi Goreng Jawa** — ⏱ 30 mnt | ⭐ 4.8
2. **Rendang Daging Sapi Padang** — ⏱ 240 mnt | ⭐ 4.9
3. **Sate Ayam Madura** — ⏱ 75 mnt | ⭐ 4.7
4. **Soto Ayam Lamongan** — ⏱ 100 mnt | ⭐ 4.8
5. **Gado-Gado Betawi** — ⏱ 50 mnt | ⭐ 4.5
6. **Bakso Malang Komplit** — ⏱ 120 mnt | ⭐ 4.6
7. **Martabak Manis Bangka** — ⏱ 90 mnt | ⭐ 4.9
8. **Es Cendol Dawet Ayu** — ⏱ 50 mnt | ⭐ 4.7
9. **Pempek Kapal Selam Palembang** — ⏱ 100 mnt | ⭐ 4.8
10. **Es Teler Nusantara** — ⏱ 25 mnt | ⭐ 4.6

## 🚀 Cara Menjalankan

1. **Ekstrak ZIP** ke folder manapun
2. **Buka `index.html`** di browser modern (Chrome/Firefox/Safari/Edge)
3. **Tidak perlu server** — berjalan 100% client-side
4. **Optional**: Untuk development, gunakan Live Server di VS Code

## 📁 Struktur File

```

resepkita-mewah/
├── index.html          # Halaman utama dengan semua section
├── style.css           # Stylesheet premium (CSS variables, animations)
├── script.js           # Logika interaktif + particle system
├── recipes-data.js     # 10 resep bawaan + localStorage persistence
└── README.md           # Dokumentasi ini

```

## 🎨 Palet Warna

| Warna | Hex | Penggunaan |
|-------|-----|------------|
| Gold Primary | `#D4AF37` | Aksen, button, hover |
| Gold Light | `#FCD34D` | Teks emas, gradient |
| Black Base | `#0A0A0A` | Background utama |
| Dark Surface | `#1A1A1A` | Card, modal |
| Text Primary | `#F0ECE6` | Teks utama |
| Text Muted | `#6B6560` | Teks sekunder |

## 🖼️ Sumber Foto

Semua foto resep menggunakan gambar asli dari [Unsplash](https://unsplash.com) — platform foto gratis berkualitas tinggi. Setiap foto diambil oleh fotografer profesional dalam resolusi tinggi.

Untuk mengganti foto:
- Edit properti `gambar` di `recipes-data.js`
- Atau gunakan form "Tambah Resep" dan masukkan URL gambar
- Disarankan menggunakan gambar dengan rasio 3:2 atau 16:10

## 🔧 Kustomisasi

- **Tambah resep default**: Edit array `defaultRecipes` di `recipes-data.js`, lalu hapus key `resepKitaRecipesV2` dari localStorage browser
- **Ubah warna**: Edit CSS variables di `:root` pada `style.css`
- **Ganti font**: Update Google Fonts link di `index.html` dan CSS variables

## 📄 Lisensi

Bebas digunakan untuk keperluan pribadi maupun komersial. Foto dari Unsplash memiliki lisensi gratis penggunaan.

---

Dibuat dengan ❤️ untuk Indonesia — *ResepKita, menjaga warisan rasa Nusantara.*
