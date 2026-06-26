// ─── Backward compatibility ───
// Data now loads via supabase-config.js
function saveRecipes() {
  localStorage.setItem("resepKitaRecipesV2", JSON.stringify(window.recipes || []));
}
