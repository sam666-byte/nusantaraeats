// ─── Loaded from Supabase ───
let recipes = [];
let supabaseReady = false;

async function loadRecipes() {
  try {
    recipes = await fetchRecipes();
    supabaseReady = true;
    // Re-render UI
    if (typeof renderRecipes === "function") renderRecipes();
    if (typeof renderAdmin === "function") renderAdmin();
  } catch (e) {
    console.warn("Supabase fallback", e);
    const local = localStorage.getItem("resepKitaRecipesV2");
    recipes = local ? JSON.parse(local) : [];
  }
  // Mark loaded — trigger any pending renders
  document.dispatchEvent(new Event("supabaseReady"));
}

// Backward compatibility
function saveRecipes() {
  localStorage.setItem("resepKitaRecipesV2", JSON.stringify(recipes));
}

// Start loading
loadRecipes();
