import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const SB_URL = "https://xdnhywlbibaniwefdsuz.supabase.co";

function ok(body) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
}

/**
 * Loads supabase-config.js fresh with a routed fetch mock. `routes` maps a
 * method (GET/POST/DELETE) to a handler receiving (url, init).
 */
async function loadSupabase(routes = {}) {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    delete window.recipes;
    delete window.supabaseReady;
    delete window._onReady;

    const calls = [];
    const fetchMock = vi.fn((url, init = {}) => {
        const method = init.method || "GET";
        calls.push({ url, method, init });
        const handler = routes[method];
        if (!handler) return ok([]);
        return handler(url, init);
    });
    vi.stubGlobal("fetch", fetchMock);

    vi.resetModules();
    await import("../supabase-config.js");
    await vi.waitFor(() => expect(window.supabaseReady).toBe(true));

    return { calls, fetchMock, get: () => calls.filter((c) => c.method === "GET") };
}

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("inline recipe data", () => {
    it("exposes a well-formed recipe catalogue with unique ids", async () => {
        await loadSupabase({ GET: () => Promise.resolve({ ok: false }) });

        expect(window.recipes.length).toBeGreaterThan(50);
        const ids = window.recipes.map((r) => r.id);
        expect(new Set(ids).size).toBe(ids.length);

        for (const r of window.recipes) {
            expect(typeof r.nama).toBe("string");
            expect(r.nama.length).toBeGreaterThan(0);
            expect(typeof r.waktu).toBe("number");
            expect(r.rating).toBeGreaterThan(0);
            expect(r.rating).toBeLessThanOrEqual(5);
            expect(Array.isArray(r.bahan)).toBe(true);
            expect(r.bahan.length).toBeGreaterThan(0);
            expect(Array.isArray(r.langkah)).toBe(true);
            expect(r.langkah.length).toBeGreaterThan(0);
            expect(r.gambar).toMatch(/^https:\/\//);
            expect(["Mudah", "Sedang", "Sulit"]).toContain(r.kesulitan);
        }
    });
});

describe("initFromSupabase", () => {
    it("uploads recipes missing from Supabase and then adopts the remote rows", async () => {
        const remote = [{ id: 1, nama: "Remote Only", kategori: "minuman", bahan: [], langkah: [] }];
        let selectAllCalled = false;
        const { calls } = await loadSupabase({
            GET: (url) => {
                if (url.includes("select=id")) return ok([{ id: 1 }, { id: 2 }]);
                selectAllCalled = true;
                expect(url).toContain("order=id.asc");
                return ok(remote);
            },
            POST: () => ok({}),
        });

        const inserted = calls.filter((c) => c.method === "POST");
        expect(inserted.length).toBeGreaterThan(0);
        expect(inserted.every((c) => c.url === SB_URL + "/rest/v1/recipes")).toBe(true);
        const insertedIds = inserted.map((c) => JSON.parse(c.init.body).id);
        expect(insertedIds).not.toContain(1);
        expect(insertedIds).not.toContain(2);

        expect(selectAllCalled).toBe(true);
        expect(window.recipes).toEqual(remote);
    });

    it("skips uploading when Supabase already has every recipe", async () => {
        let ids = [];
        const { calls } = await loadSupabase({
            GET: (url) => {
                if (url.includes("select=id")) {
                    // Supabase already holds exactly the inline catalogue.
                    ids = window.recipes.map((r) => ({ id: r.id }));
                    return ok(ids);
                }
                return ok([]);
            },
        });

        expect(calls.filter((c) => c.method === "POST")).toHaveLength(0);
    });

    it("keeps the inline catalogue when Supabase returns no rows", async () => {
        await loadSupabase({
            GET: (url) => ok(url.includes("select=id") ? window.recipes.map((r) => ({ id: r.id })) : []),
        });
        expect(window.recipes.length).toBeGreaterThan(50);
    });

    it("keeps the inline catalogue when the id query fails", async () => {
        const { calls } = await loadSupabase({ GET: () => Promise.resolve({ ok: false }) });
        expect(calls.filter((c) => c.method === "POST")).toHaveLength(0);
        expect(window.recipes.length).toBeGreaterThan(50);
    });

    it("falls back to the inline catalogue when the network is unavailable", async () => {
        await loadSupabase({ GET: () => Promise.reject(new Error("offline")) });
        expect(window.recipes.length).toBeGreaterThan(50);
        expect(window.supabaseReady).toBe(true);
    });

    it("sends the publishable key on the initial query", async () => {
        const { get } = await loadSupabase({ GET: () => Promise.resolve({ ok: false }) });
        expect(get()[0].init.headers.apikey).toMatch(/^sb_publishable_/);
        expect(get()[0].init.headers.Authorization).toContain("Bearer sb_publishable_");
    });

    it("notifies the page once data is ready", async () => {
        const onReady = vi.fn();
        window._onReady = onReady;
        // loadSupabase clears window._onReady, so re-register after the reset.
        document.head.innerHTML = "";
        delete window.recipes;
        delete window.supabaseReady;
        vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false })));
        window._onReady = onReady;
        vi.resetModules();
        await import("../supabase-config.js");

        await vi.waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    });
});

describe("apiInsert", () => {
    const recipe = { id: 999, nama: "Baru", kategori: "jajanan", bahan: ["a"], langkah: ["b"] };

    beforeEach(async () => {
        await loadSupabase({ GET: () => Promise.resolve({ ok: false }) });
    });

    it("upserts to Supabase and prepends the recipe locally", async () => {
        const before = window.recipes.length;
        await window.apiInsert(recipe);

        const post = fetch.mock.calls.find(([, init]) => init?.method === "POST");
        expect(post[0]).toBe(SB_URL + "/rest/v1/recipes");
        expect(post[1].headers.Prefer).toBe("resolution=merge-duplicates");
        expect(JSON.parse(post[1].body)).toEqual(recipe);
        expect(window.recipes[0]).toEqual(recipe);
        expect(window.recipes).toHaveLength(before + 1);
    });

    it("still updates local state when the request fails", async () => {
        fetch.mockRejectedValueOnce(new Error("offline"));
        await window.apiInsert(recipe);
        expect(window.recipes[0]).toEqual(recipe);
    });
});

describe("apiUpdate", () => {
    beforeEach(async () => {
        await loadSupabase({ GET: () => Promise.resolve({ ok: false }) });
    });

    it("replaces the matching recipe in place", async () => {
        const target = window.recipes[1];
        const updated = { ...target, nama: "Nama Baru" };
        await window.apiUpdate(target.id, updated);

        expect(window.recipes[1]).toEqual(updated);
        const post = fetch.mock.calls.find(([, init]) => init?.method === "POST");
        expect(JSON.parse(post[1].body)).toEqual(updated);
    });

    it("leaves local state untouched for an unknown id", async () => {
        const before = [...window.recipes];
        await window.apiUpdate(-1, { id: -1, nama: "Ghost" });
        expect(window.recipes).toEqual(before);
    });
});

describe("apiDelete", () => {
    beforeEach(async () => {
        await loadSupabase({ GET: () => Promise.resolve({ ok: false }) });
    });

    it("deletes remotely by id filter and drops the recipe locally", async () => {
        const { id } = window.recipes[0];
        const before = window.recipes.length;
        await window.apiDelete(id);

        const del = fetch.mock.calls.find(([, init]) => init?.method === "DELETE");
        expect(del[0]).toBe(`${SB_URL}/rest/v1/recipes?id=eq.${id}`);
        expect(del[1].headers.Prefer).toBe("return=minimal");
        expect(window.recipes).toHaveLength(before - 1);
        expect(window.recipes.some((r) => r.id === id)).toBe(false);
    });

    it("still removes the recipe locally when the request fails", async () => {
        fetch.mockRejectedValueOnce(new Error("offline"));
        const { id } = window.recipes[0];
        await window.apiDelete(id);
        expect(window.recipes.some((r) => r.id === id)).toBe(false);
    });
});

describe("apiFetch", () => {
    it("resolves with the recipes once Supabase init has finished", async () => {
        await loadSupabase({ GET: () => Promise.resolve({ ok: false }) });
        await expect(window.apiFetch()).resolves.toBe(window.recipes);
    });

    it("waits for supabaseReady before resolving", async () => {
        await loadSupabase({ GET: () => Promise.resolve({ ok: false }) });
        window.supabaseReady = false;

        let settled = false;
        const pending = window.apiFetch().then(() => (settled = true));
        await new Promise((r) => setTimeout(r, 150));
        expect(settled).toBe(false);

        window.supabaseReady = true;
        await pending;
        expect(settled).toBe(true);
    });
});

describe("injectSchema", () => {
    it("injects one valid Recipe JSON-LD block into the head", async () => {
        await loadSupabase({ GET: () => Promise.resolve({ ok: false }) });

        const tags = document.head.querySelectorAll('script[type="application/ld+json"]');
        expect(tags).toHaveLength(1);
        expect(tags[0].id).toBe("recipeSchema");

        const schema = JSON.parse(tags[0].textContent);
        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@graph"].length).toBeGreaterThan(0);
        expect(schema["@graph"].every((r) => r["@type"] === "Recipe")).toBe(true);
    });
});
