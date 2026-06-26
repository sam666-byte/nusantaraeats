// ─── Supabase Config ───
window.SUPABASE_URL = "https://xdnhywlbibaniwefdsuz.supabase.co";
window.SUPABASE_KEY = "sb_publishable_HM6YJ8A372MPKvufkCoAxA_kYerAP0u";

async function fetchRecipes() {
  const res = await fetch(`${window.SUPABASE_URL}/rest/v1/recipes?order=id.asc`, {
    headers: {
      "apikey": window.SUPABASE_KEY,
      "Authorization": `Bearer ${window.SUPABASE_KEY}`
    }
  });
  return res.json();
}

async function supabaseInsert(recipe) {
  const res = await fetch(`${window.SUPABASE_URL}/rest/v1/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": window.SUPABASE_KEY,
      "Authorization": `Bearer ${window.SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(recipe)
  });
  return res.ok;
}

async function supabaseUpdate(id, data) {
  const res = await fetch(`${window.SUPABASE_URL}/rest/v1/recipes?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "apikey": window.SUPABASE_KEY,
      "Authorization": `Bearer ${window.SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(data)
  });
  return res.ok;
}

async function supabaseDelete(id) {
  const res = await fetch(`${window.SUPABASE_URL}/rest/v1/recipes?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      "apikey": window.SUPABASE_KEY,
      "Authorization": `Bearer ${window.SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    }
  });
  return res.ok;
}
