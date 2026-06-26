// ─── Loaded from Supabase ───
window.recipes = [];
window.supabaseReady = false;

async function loadRecipes() {
  try {
    const res = await fetch(
      `${window.SUPABASE_URL}/rest/v1/recipes?order=id.asc`,
      {
        headers: {
          apikey: window.SUPABASE_KEY,
          Authorization: `Bearer ${window.SUPABASE_KEY}`,
        },
      }
    );
    window.recipes = await res.json();
    window.supabaseReady = true;
    document.dispatchEvent(new Event("supabaseReady"));
  } catch (e) {
    console.warn("Supabase fallback", e);
    const local = localStorage.getItem("resepKitaRecipesV2");
    window.recipes = local ? JSON.parse(local) : [];
    window.supabaseReady = true;
    document.dispatchEvent(new Event("supabaseReady"));
  }
}

function saveRecipes() {
  localStorage.setItem(
    "resepKitaRecipesV2",
    JSON.stringify(window.recipes || [])
  );
}

loadRecipes();
