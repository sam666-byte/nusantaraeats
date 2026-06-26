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

// Retry render every second until data arrives (for race condition)
const retryInterval = setInterval(() => {
  if (recipes.length > 0) {
    if (typeof renderRecipes === "function") {
      document.getElementById("recipeGrid") && renderRecipes();
    }
    if (typeof renderAdmin === "function") renderAdmin();
    clearInterval(retryInterval);
  }
}, 500);
