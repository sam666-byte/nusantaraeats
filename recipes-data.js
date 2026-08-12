// ─── Backward compatibility ───
// Data now loads via supabase-config.js
function saveRecipes() {
  try {
    localStorage.setItem("resepKitaRecipesV2", JSON.stringify(window.recipes || []));
    return true;
  } catch (e) {
    console.error("Failed to save recipes to localStorage:", e);
    return false;
  }
}
