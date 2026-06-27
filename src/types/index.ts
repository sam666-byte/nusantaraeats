export type Kategori = "makanan-berat" | "sup-soto" | "sate-panggang" | "jajanan" | "minuman";

export interface Recipe {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  kategori: Kategori;
  waktu: number;
  porsi: string;
  kesulitan: "Easy" | "Medium" | "Hard";
  rating: number;
  origin: string;
  ingredients: string[];
  instructions: string[];
  tips?: string;
}

export interface KategoriInfo {
  id: Kategori;
  name: string;
  icon: string;
  desc: string;
}

export const KATEGORI_LIST: KategoriInfo[] = [
  { id: "makanan-berat", name: "Main Dishes", icon: "🍛", desc: "Hearty dishes that nourish the soul" },
  { id: "sup-soto", name: "Soups & Soto", icon: "🍜", desc: "Warm broths rich with spices" },
  { id: "sate-panggang", name: "Satay & Grilled", icon: "🍢", desc: "Authentic Indonesian grilled fare" },
  { id: "jajanan", name: "Snacks", icon: "🍡", desc: "Sweet & savory traditional bites" },
  { id: "minuman", name: "Drinks", icon: "🍹", desc: "Tropical thirst-quenchers" },
];
