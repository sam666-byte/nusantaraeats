import { afterEach, vi } from "vitest";

// Mirrors the ids/classes of index.html that script.js queries on load.
const MARKUP = `
<canvas id="particleCanvas"></canvas>
<header id="header"></header>
<input id="searchInput" />
<button id="searchBtn"></button>
<div class="filter-bar">
    <button class="filter-btn active" data-filter="all"></button>
    <button class="filter-btn" data-filter="makanan-berat"></button>
    <button class="filter-btn" data-filter="minuman"></button>
</div>
<div class="category-card" data-kategori="makanan-berat"></div>
<div class="category-card" data-kategori="tidak-ada"></div>
<section id="recipes">
    <div id="recipeGrid"></div>
    <div id="noResults"></div>
</section>
<div id="statRecipes"></div>
<span id="visitorCount"></span>
<div id="recipeModal">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
        <button id="modalClose"></button>
        <img id="modalImage" />
        <h2 id="modalTitle"></h2>
        <div id="modalMeta"></div>
        <div id="modalRating"></div>
        <ul id="modalIngredients"></ul>
        <ol id="modalSteps"></ol>
    </div>
</div>
<div id="toast"></div>
`;

// script.js polls with setTimeout forever; track the ids so each test can stop it
// before the jsdom environment goes away.
let trackedTimeouts = null;
let originalSetTimeout = null;

function trackTimeouts() {
    stopTimeouts();
    trackedTimeouts = [];
    originalSetTimeout = globalThis.setTimeout;
    globalThis.setTimeout = (...args) => {
        const id = originalSetTimeout(...args);
        trackedTimeouts.push(id);
        return id;
    };
}

function stopTimeouts() {
    if (!trackedTimeouts) return;
    globalThis.setTimeout = originalSetTimeout;
    trackedTimeouts.forEach((id) => globalThis.clearTimeout(id));
    trackedTimeouts = null;
    originalSetTimeout = null;
}

afterEach(stopTimeouts);

export function makeRecipe(overrides = {}) {
    return {
        id: 1,
        nama: "Nasi Goreng Jawa",
        kategori: "makanan-berat",
        waktu: 30,
        porsi: "2 orang",
        kesulitan: "Mudah",
        rating: 4.8,
        gambar: "https://example.com/nasi-goreng.jpg",
        bahan: ["nasi putih", "telur"],
        langkah: ["Tumis bumbu.", "Masukkan nasi."],
        ...overrides,
    };
}

/**
 * Builds the fixture DOM plus the browser APIs jsdom lacks, then loads script.js
 * fresh so its load-time listeners bind to this DOM.
 */
export async function loadScript({ recipes = [makeRecipe()] } = {}) {
    document.body.innerHTML = MARKUP;
    window.recipes = recipes;
    window.supabaseReady = false;

    const canvasCtx = {
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        clearRect: vi.fn(),
        fillStyle: "",
    };
    document.getElementById("particleCanvas").getContext = () => canvasCtx;

    const frames = [];
    vi.stubGlobal("requestAnimationFrame", (cb) => frames.push(cb));
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ value: 1234 }) })));
    localStorage.clear();

    trackTimeouts();
    vi.resetModules();
    const api = await import("../../script.js");

    return {
        ...(api.default ?? api),
        canvasCtx,
        // Runs one animation frame of the particle system.
        tick: () => frames.splice(0).forEach((cb) => cb()),
        $: (sel) => document.querySelector(sel),
        id: (elementId) => document.getElementById(elementId),
    };
}
