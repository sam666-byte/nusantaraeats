// ─── Loaded from Supabase ───
let recipes = [];
let supabaseReady = false;

async function loadRecipes() {
  try {
    recipes = await fetchRecipes();
    supabaseReady = true;
    // Trigger re-render if already loaded
    if (typeof renderRecipes === "function") renderRecipes();
    if (typeof renderAdmin === "function") renderAdmin();
  } catch (e) {
    console.warn("Supabase gagal, fallback ke localStorage", e);
    const local = localStorage.getItem("resepKitaRecipesV2");
    recipes = local ? JSON.parse(local) : [];
  }
}

// Backward compatibility for localStorage
function saveRecipes() {
  localStorage.setItem("resepKitaRecipesV2", JSON.stringify(recipes));
}

// Start loading immediately
loadRecipes();
