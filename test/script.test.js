import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadScript, makeRecipe } from "./helpers/fixture.js";

describe("translation helpers", () => {
    let s;
    beforeEach(async () => {
        s = await loadScript();
    });
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("translates known difficulty levels and passes through unknown ones", () => {
        expect(s.tDiff("Mudah")).toBe("Easy");
        expect(s.tDiff("Sedang")).toBe("Medium");
        expect(s.tDiff("Sulit")).toBe("Hard");
        expect(s.tDiff("Extreme")).toBe("Extreme");
        expect(s.tDiff(undefined)).toBe(undefined);
    });

    it("translates every serving unit occurrence", () => {
        expect(s.tPorsi("2 orang")).toBe("2 servings");
        expect(s.tPorsi("6 gelas")).toBe("6 glasses");
        expect(s.tPorsi("4 porsi")).toBe("4 servings");
        expect(s.tPorsi("1 orang / 2 orang")).toBe("1 servings / 2 servings");
        expect(s.tPorsi("20 buah")).toBe("20 buah");
    });

    it("formats cooking time in minutes", () => {
        expect(s.tWaktu(30)).toBe("30 mins");
        expect(s.tWaktu(0)).toBe("0 mins");
    });
});

describe("saveRecipes", () => {
    it("persists window.recipes under the versioned localStorage key", async () => {
        const recipes = [makeRecipe(), makeRecipe({ id: 2, nama: "Rendang" })];
        const s = await loadScript({ recipes });
        s.saveRecipes();
        expect(JSON.parse(localStorage.getItem("resepKitaRecipesV2"))).toEqual(recipes);
    });

    it("persists an empty array when no recipes are loaded", async () => {
        const s = await loadScript({ recipes: [] });
        window.recipes = undefined;
        s.saveRecipes();
        expect(localStorage.getItem("resepKitaRecipesV2")).toBe("[]");
    });
});

describe("renderRecipes", () => {
    const recipes = [
        makeRecipe({ id: 1, nama: "Nasi Goreng", kategori: "makanan-berat", bahan: ["nasi", "telur"] }),
        makeRecipe({ id: 2, nama: "Es Cendol", kategori: "minuman", bahan: ["santan", "gula merah"], rating: 4.2 }),
        makeRecipe({ id: 3, nama: "Soto Ayam", kategori: "sup-soto", bahan: ["ayam kampung"], kesulitan: "Sedang" }),
    ];
    let s;
    beforeEach(async () => {
        s = await loadScript({ recipes });
    });

    it("renders every recipe as a card by default", () => {
        s.renderRecipes();
        const cards = document.querySelectorAll("#recipeGrid .recipe-card");
        expect(cards).toHaveLength(3);
        expect([...cards].map((c) => c.getAttribute("data-id"))).toEqual(["1", "2", "3"]);
        expect(s.id("noResults").style.display).toBe("none");
    });

    it("staggers the reveal animation per card", () => {
        s.renderRecipes();
        const delays = [...document.querySelectorAll(".recipe-card")].map((c) => c.style.animationDelay);
        expect(delays).toEqual(["0s", "0.06s", "0.12s"]);
    });

    it("filters by category", () => {
        s.renderRecipes("minuman");
        const cards = document.querySelectorAll(".recipe-card");
        expect(cards).toHaveLength(1);
        expect(cards[0].querySelector("h3").textContent).toBe("Es Cendol");
    });

    it("matches the search query against name, category and ingredients", () => {
        s.renderRecipes("all", "nasi");
        expect(document.querySelectorAll(".recipe-card")).toHaveLength(1);

        s.renderRecipes("all", "sup-soto");
        expect(document.querySelectorAll(".recipe-card")).toHaveLength(1);

        s.renderRecipes("all", "GULA MERAH");
        expect(document.querySelectorAll(".recipe-card")).toHaveLength(1);
    });

    it("ignores a whitespace-only search query", () => {
        s.renderRecipes("all", "   ");
        expect(document.querySelectorAll(".recipe-card")).toHaveLength(3);
    });

    it("combines category and search filters", () => {
        s.renderRecipes("minuman", "nasi");
        expect(document.querySelectorAll(".recipe-card")).toHaveLength(0);
        expect(s.id("noResults").style.display).toBe("block");
    });

    it("shows the empty state and clears the grid when nothing matches", () => {
        s.renderRecipes();
        s.renderRecipes("all", "pizza");
        expect(s.id("recipeGrid").innerHTML).toBe("");
        expect(s.id("noResults").style.display).toBe("block");
    });

    it("renders stars floored from the rating, plus translated meta", () => {
        s.renderRecipes("minuman");
        const card = document.querySelector(".recipe-card");
        expect(card.querySelector(".recipe-card-rating").textContent).toContain("★★★★☆");
        expect(card.querySelector(".recipe-card-meta").textContent).toContain("30 mins");
        expect(card.querySelector(".recipe-card-meta").textContent).toContain("2 servings");
        expect(card.querySelector(".recipe-card-badge").textContent).toBe("Easy");
    });

    it("opens the detail modal when a card is clicked", () => {
        s.renderRecipes();
        document.querySelector('.recipe-card[data-id="3"]').click();
        expect(s.id("modalTitle").textContent).toBe("Soto Ayam");
        expect(s.id("recipeModal").classList.contains("active")).toBe(true);
    });

    it("tolerates an unset window.recipes", () => {
        window.recipes = undefined;
        s.renderRecipes();
        expect(document.querySelectorAll(".recipe-card")).toHaveLength(0);
        expect(s.id("noResults").style.display).toBe("block");
    });
});

describe("recipe modal", () => {
    let s;
    const recipe = makeRecipe({
        nama: "Rendang",
        rating: 4.9,
        waktu: 240,
        porsi: "8 orang",
        kesulitan: "Sulit",
        bahan: ["daging sapi", "santan"],
        langkah: ["Tumis bumbu.", "Masak 4 jam."],
    });
    beforeEach(async () => {
        s = await loadScript({ recipes: [recipe] });
    });

    it("fills the modal with recipe details and locks page scrolling", () => {
        s.openRecipeModal(recipe);
        expect(s.id("modalImage").src).toBe(recipe.gambar);
        expect(s.id("modalTitle").textContent).toBe("Rendang");
        expect(s.id("modalMeta").textContent).toContain("240 mins");
        expect(s.id("modalMeta").textContent).toContain("8 servings");
        expect(s.id("modalMeta").textContent).toContain("Hard");
        expect(s.id("modalRating").textContent).toBe("★★★★☆");
        expect(s.id("modalIngredients").querySelectorAll("li")).toHaveLength(2);
        expect(s.id("modalSteps").querySelectorAll("li")).toHaveLength(2);
        expect(document.body.style.overflow).toBe("hidden");
    });

    it("falls back to a placeholder photo when the image fails to load", () => {
        s.openRecipeModal(recipe);
        const img = s.id("modalImage");
        img.onerror();
        expect(img.src).toContain("images.unsplash.com");
    });

    it("closes on the close button, on backdrop click and on Escape", () => {
        const modal = s.id("recipeModal");

        s.openRecipeModal(recipe);
        s.id("modalClose").click();
        expect(modal.classList.contains("active")).toBe(false);
        expect(document.body.style.overflow).toBe("");

        s.openRecipeModal(recipe);
        s.$(".modal-backdrop").click();
        expect(modal.classList.contains("active")).toBe(false);

        s.openRecipeModal(recipe);
        document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape" }));
        expect(modal.classList.contains("active")).toBe(false);
    });

    it("leaves the modal closed for other keys", () => {
        s.openRecipeModal(recipe);
        document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "a" }));
        expect(s.id("recipeModal").classList.contains("active")).toBe(true);
    });
});

describe("search, filter bar and category cards", () => {
    const recipes = [
        makeRecipe({ id: 1, nama: "Nasi Goreng", kategori: "makanan-berat" }),
        makeRecipe({ id: 2, nama: "Es Cendol", kategori: "minuman" }),
    ];
    let s;
    beforeEach(async () => {
        s = await loadScript({ recipes });
    });

    it("renders search results, resets the active filter and scrolls to the grid", () => {
        s.$('.filter-btn[data-filter="minuman"]').classList.add("active");
        s.id("searchInput").value = "cendol";
        s.id("searchBtn").click();

        expect(document.querySelectorAll(".recipe-card")).toHaveLength(1);
        expect(s.$(".filter-btn.active").getAttribute("data-filter")).toBe("all");
        expect(s.id("recipes").scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });

    it("submits the search on Enter only", () => {
        const searchBtn = s.id("searchBtn");
        const clicked = vi.spyOn(searchBtn, "click");
        const input = s.id("searchInput");

        input.dispatchEvent(new window.KeyboardEvent("keyup", { key: "a" }));
        expect(clicked).not.toHaveBeenCalled();

        input.dispatchEvent(new window.KeyboardEvent("keyup", { key: "Enter" }));
        expect(clicked).toHaveBeenCalledTimes(1);
    });

    it("filters and moves the active state when a filter button is clicked", () => {
        s.id("searchInput").value = "leftover query";
        s.$('.filter-btn[data-filter="minuman"]').click();

        expect(s.$(".filter-btn.active").getAttribute("data-filter")).toBe("minuman");
        expect(s.id("searchInput").value).toBe("");
        expect(document.querySelectorAll(".recipe-card")).toHaveLength(1);
    });

    it("filters from a category card and syncs the matching filter button", () => {
        s.$('.category-card[data-kategori="makanan-berat"]').click();

        expect(s.$(".filter-btn.active").getAttribute("data-filter")).toBe("makanan-berat");
        expect(document.querySelector(".recipe-card h3").textContent).toBe("Nasi Goreng");
        expect(s.id("recipes").scrollIntoView).toHaveBeenCalled();
    });

    it("leaves no filter button active for a category without one", () => {
        s.$('.category-card[data-kategori="tidak-ada"]').click();
        expect(s.$(".filter-btn.active")).toBeNull();
        expect(document.querySelectorAll(".recipe-card")).toHaveLength(0);
    });
});

describe("toast", () => {
    let s;
    beforeEach(async () => {
        vi.useFakeTimers();
        s = await loadScript();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("shows a message and hides it after 2.5s", () => {
        s.showToast("Resep disimpan");
        const toast = s.id("toast");
        expect(toast.textContent).toBe("Resep disimpan");
        expect(toast.classList.contains("show")).toBe(true);

        vi.advanceTimersByTime(2499);
        expect(toast.classList.contains("show")).toBe(true);
        vi.advanceTimersByTime(1);
        expect(toast.classList.contains("show")).toBe(false);
    });

    it("restarts the hide timer when a second toast arrives", () => {
        s.showToast("first");
        vi.advanceTimersByTime(2000);
        s.showToast("second");
        vi.advanceTimersByTime(2000);

        const toast = s.id("toast");
        expect(toast.textContent).toBe("second");
        expect(toast.classList.contains("show")).toBe(true);
        vi.advanceTimersByTime(500);
        expect(toast.classList.contains("show")).toBe(false);
    });
});

describe("header scroll state", () => {
    it("adds .scrolled past 80px and removes it above the fold", async () => {
        const s = await loadScript();
        const header = s.id("header");

        window.scrollY = 120;
        window.dispatchEvent(new window.Event("scroll"));
        expect(header.classList.contains("scrolled")).toBe(true);

        window.scrollY = 10;
        window.dispatchEvent(new window.Event("scroll"));
        expect(header.classList.contains("scrolled")).toBe(false);
    });
});

describe("particle canvas", () => {
    it("sizes the canvas to the viewport and redraws it on resize", async () => {
        const s = await loadScript();
        const canvas = s.id("particleCanvas");
        expect(canvas.width).toBe(window.innerWidth);
        expect(canvas.height).toBe(window.innerHeight);

        window.innerWidth = 500;
        window.innerHeight = 400;
        window.dispatchEvent(new window.Event("resize"));
        expect(canvas.width).toBe(500);
        expect(canvas.height).toBe(400);
    });

    it("recycles particles that drift outside the canvas", async () => {
        const s = await loadScript();
        const canvas = s.id("particleCanvas");

        window.innerWidth = 1;
        window.innerHeight = 1;
        window.dispatchEvent(new window.Event("resize"));
        s.tick();

        // Particles now past the right edge are re-seeded just below the canvas.
        const ys = s.canvasCtx.arc.mock.calls.map(([, y]) => y);
        expect(ys.filter((y) => y === canvas.height + 10).length).toBeGreaterThan(0);
    });

    it("draws 60 particles per animation frame", async () => {
        const s = await loadScript();
        s.canvasCtx.arc.mockClear();
        s.tick();
        expect(s.canvasCtx.clearRect).toHaveBeenCalled();
        expect(s.canvasCtx.arc).toHaveBeenCalledTimes(60);
    });
});

describe("visitor counter", () => {
    it("renders the hit count returned by the API", async () => {
        const s = await loadScript();
        await vi.waitFor(() => expect(s.id("visitorCount").textContent).toBe("1,234"));
        expect(fetch).toHaveBeenCalledWith("https://api.countapi.xyz/hit/nusantaraeats/visits");
    });
});

describe("_onReady", () => {
    it("publishes the recipe count and renders the grid", async () => {
        const s = await loadScript({ recipes: [makeRecipe(), makeRecipe({ id: 2 })] });
        window._onReady();
        expect(s.id("statRecipes").textContent).toBe("2");
        expect(document.querySelectorAll(".recipe-card")).toHaveLength(2);
    });

    it("is called by the poller once Supabase data has arrived", async () => {
        vi.useFakeTimers();
        try {
            const s = await loadScript({ recipes: [] });
            expect(s.id("statRecipes").textContent).toBe("");

            window.recipes = [makeRecipe()];
            window.supabaseReady = true;
            vi.advanceTimersByTime(150);

            expect(s.id("statRecipes").textContent).toBe("1");
        } finally {
            vi.useRealTimers();
        }
    });
});
