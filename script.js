// ============================================================
// RESEPKITA — JavaScript Aplikasi
// ============================================================

// --- DATA ---
let currentFilter = 'all';

function saveRecipes() {
    try {
        localStorage.setItem('resepKitaRecipesV2', JSON.stringify(window.recipes || []));
        return true;
    } catch (e) {
        console.error('Failed to save recipes to localStorage:', e);
        return false;
    }
}

// --- PARTICLE CANVAS (Subtle Gold Dust) ---
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedY = Math.random() * 0.3 + 0.05;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.4 + 0.05;
            this.golden = Math.random() > 0.7;
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            if (this.golden) {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
            }
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = Array.from({ length: 60 }, () => new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
})();

// --- HEADER SCROLL ---
(function headerScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const now = window.scrollY;
        if (now > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = now;
    });
})();

// --- TRANSLATION HELPERS ---
function tDiff(d) { return {Mudah:"Easy",Sedang:"Medium",Sulit:"Hard"}[d]||d; }
function tPorsi(p) { return String(p || "").replace(/orang/g,"servings").replace(/gelas/g,"glasses").replace(/porsi/g,"servings"); }
function tWaktu(m) { return m+" mins"; }

// --- RENDER RECIPES ---
function renderRecipes(filter = 'all', searchQuery = '') {
    const grid = document.getElementById('recipeGrid');
    const noResults = document.getElementById('noResults');
    if (!grid || !noResults) {
        console.error('renderRecipes: #recipeGrid or #noResults is missing from the page');
        return;
    }
    let data = window.recipes || [];

    // Filter by category
    if (filter !== 'all') {
        data = data.filter(r => r.kategori === filter);
    }

    // Filter by search
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        data = data.filter(r =>
            (r.nama || '').toLowerCase().includes(q) ||
            (r.kategori || '').includes(q) ||
            (r.bahan || []).some(b => String(b).toLowerCase().includes(q))
        );
    }

    grid.innerHTML = '';

    if (data.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';

    data.forEach((recipe, index) => {
        const stars = '★'.repeat(Math.floor(recipe.rating)) + '☆'.repeat(5 - Math.floor(recipe.rating));
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.style.animationDelay = `${index * 0.06}s`;
        card.setAttribute('data-id', recipe.id);
        card.innerHTML = `
            <div class="recipe-card-img-wrap">
                <img class="recipe-card-img" 
                     src="${recipe.gambar}" 
                     alt="${recipe.nama}" 
                     loading="lazy"
                     onerror="this.onerror=null; this.parentElement.innerHTML='<div style=\\'height:240px;background:var(--black-600);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:14px;\\'>📷 Foto ${recipe.nama}</div>';">
                <span class="recipe-card-badge">${tDiff(recipe.kesulitan)}</span>
            </div>
            <div class="recipe-card-body">
                <h3>${recipe.nama}</h3>
                <div class="recipe-card-rating">${stars} <small style="color:#A8A29A; font-family:Inter,sans-serif;">${recipe.rating}</small></div>
                <div class="recipe-card-meta">
                    <span>⏱ ${tWaktu(recipe.waktu)}</span>
                    <span>👥 ${tPorsi(recipe.porsi)}</span>
                    <span>📊 ${tDiff(recipe.kesulitan)}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openRecipeModal(recipe));
        grid.appendChild(card);
    });
}

// --- SEARCH ---
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        currentFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('[data-filter="all"]');
        if (allBtn) allBtn.classList.add('active');
        renderRecipes('all', searchInput.value);
        scrollToRecipes();
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });
} else {
    console.error('Search controls are missing from the page; search is disabled');
}

function scrollToRecipes() {
    const section = document.getElementById('recipes');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

// --- FILTER BAR ---
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        if (searchInput) searchInput.value = '';
        renderRecipes(currentFilter);
    });
});

// --- CATEGORY CARDS ---
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const kat = card.getAttribute('data-kategori');
        currentFilter = kat;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${kat}"]`);
        if (targetBtn) targetBtn.classList.add('active');
        if (searchInput) searchInput.value = '';
        renderRecipes(kat);
        scrollToRecipes();
    });
});

// --- MODAL DETAIL ---
const recipeModal = document.getElementById('recipeModal');
const modalClose = document.getElementById('modalClose');

function openRecipeModal(recipe) {
    if (!recipeModal) {
        console.error('openRecipeModal: #recipeModal is missing from the page');
        return;
    }
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = recipe.gambar;
        modalImage.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80';
        };
    }
    setModalContent('modalTitle', 'textContent', recipe.nama);
    setModalContent('modalMeta', 'innerHTML', `
        ⏱️ ${tWaktu(recipe.waktu)} &nbsp;|&nbsp; 👥 ${tPorsi(recipe.porsi)} &nbsp;|&nbsp; 📊 ${tDiff(recipe.kesulitan)}
    `);
    const stars = '★'.repeat(Math.floor(recipe.rating)) + '☆'.repeat(5 - Math.floor(recipe.rating));
    setModalContent('modalRating', 'textContent', stars);
    setModalContent('modalIngredients', 'innerHTML', (recipe.bahan || []).map(b => `<li>${b}</li>`).join(''));
    setModalContent('modalSteps', 'innerHTML', (recipe.langkah || []).map(l => `<li>${l}</li>`).join(''));

    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const content = recipeModal.querySelector('.modal-content');
    if (content) content.scrollTop = 0;
}

function setModalContent(id, prop, value) {
    const el = document.getElementById(id);
    if (!el) {
        console.error(`Recipe modal element #${id} is missing from the page`);
        return;
    }
    el[prop] = value;
}

function closeRecipeModal() {
    if (!recipeModal) return;
    recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeRecipeModal);
const modalBackdrop = recipeModal && recipeModal.querySelector('.modal-backdrop');
if (modalBackdrop) modalBackdrop.addEventListener('click', closeRecipeModal);



// --- TOAST ---
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.warn('showToast: #toast is missing, message not shown:', message);
        return;
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// --- KEYBOARD ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeRecipeModal();
    }
});

// --- VISITOR COUNTER ---
(function () {
  fetch("https://api.countapi.xyz/hit/nusantaraeats/visits")
    .then(r => {
      if (!r.ok) throw new Error(`visitor counter responded ${r.status} ${r.statusText}`);
      return r.json();
    })
    .then(d => {
      const el = document.getElementById("visitorCount");
      if (el) el.textContent = (d.value || 0).toLocaleString();
    })
    .catch(e => {
      console.warn("Visitor counter unavailable:", e);
    });
})();

// --- READY CHECK ---
let renderedOnReady = false;

window._onReady = function () {
  renderedOnReady = true;
  const el = document.getElementById("statRecipes");
  if (el) el.textContent = (window.recipes || []).length;
  renderRecipes();
};

// Poll until data loaded (handles any race condition), but give up instead of
// polling forever when the data source never becomes available.
const DATA_POLL_INTERVAL_MS = 150;
const DATA_POLL_TIMEOUT_MS = 15000;

(function poll(waited = 0) {
  if (renderedOnReady) return;
  if (window.supabaseReady && (window.recipes || []).length > 0) {
    window._onReady();
    return;
  }
  if (waited >= DATA_POLL_TIMEOUT_MS) {
    console.error(`Recipe data unavailable after ${DATA_POLL_TIMEOUT_MS}ms`, {
      supabaseReady: !!window.supabaseReady,
      recipeCount: (window.recipes || []).length,
      syncError: window.recipeSyncError,
    });
    window._onReady();
    if ((window.recipes || []).length === 0) {
      const noResults = document.getElementById('noResults');
      if (noResults) {
        noResults.textContent = 'Gagal memuat resep. Coba muat ulang halaman.';
        noResults.style.display = 'block';
      }
      showToast('⚠️ Gagal memuat resep');
    }
    return;
  }
  setTimeout(() => poll(waited + DATA_POLL_INTERVAL_MS), DATA_POLL_INTERVAL_MS);
})();
