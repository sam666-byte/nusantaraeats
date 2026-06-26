// ─── Supabase Config & Data Load ───
const SB_URL = "https://xdnhywlbibaniwefdsuz.supabase.co";
const SB_KEY = "sb_publishable_HM6YJ8A372MPKvufkCoAxA_kYerAP0u";

window.recipes = [];
window.supabaseReady = false;

// ─── API Functions ───
window.apiFetch = async function () {
  const r = await fetch(`${SB_URL}/rest/v1/recipes?order=id.asc`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  });
  return r.json();
};

window.apiInsert = async function (recipe) {
  const r = await fetch(`${SB_URL}/rest/v1/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, Prefer: "return=minimal" },
    body: JSON.stringify(recipe),
  });
  return r.ok;
};

window.apiUpdate = async function (id, data) {
  const r = await fetch(`${SB_URL}/rest/v1/recipes?id=eq.${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, Prefer: "return=minimal" },
    body: JSON.stringify(data),
  });
  return r.ok;
};

window.apiDelete = async function (id) {
  const r = await fetch(`${SB_URL}/rest/v1/recipes?id=eq.${id}`, {
    method: "DELETE",
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, Prefer: "return=minimal" },
  });
  return r.ok;
};

// ─── Load Data ───
async function loadData() {
  try {
    window.recipes = await window.apiFetch();
  } catch (e) {
    try {
      const local = localStorage.getItem("resepKitaRecipesV2");
      window.recipes = local ? JSON.parse(local) : [];
    } catch (_) { window.recipes = []; }
  }
  window.supabaseReady = true;
  // Trigger re-render via polling (more reliable than events)
  if (window._onReady) window._onReady();
}
loadData();
