export async function onRequest(context) {
  const { params } = context;
  const slug = params.slug?.[0] || "home";

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const kv = context.env.VIEWS_KV;
  if (!kv) {
    return new Response(JSON.stringify({ count: 0, error: "KV not configured" }), { status: 200, headers });
  }

  try {
    if (context.request.method === "POST") {
      const current = parseInt((await kv.get(slug)) || "0", 10);
      const next = current + 1;
      await kv.put(slug, String(next));
      return new Response(JSON.stringify({ count: next }), { status: 200, headers });
    }

    const count = parseInt((await kv.get(slug)) || "0", 10);
    return new Response(JSON.stringify({ count }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ count: 0, error: e.message }), { status: 200, headers });
  }
}
