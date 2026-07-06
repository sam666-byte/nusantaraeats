import { redirect } from "next/navigation";
import { recipes } from "@/data/recipes";

export async function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export default async function RedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/recipes/${slug}`);
}
