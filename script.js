// ============================================================
// RESEPKITA — JavaScript Aplikasi
// ============================================================

// --- DATA ---
let currentFilter = 'all';

function saveRecipes() {
    localStorage.setItem('resepKitaRecipesV2', JSON.stringify(window.recipes || []));
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

// --- RENDER RECIPES ---
function renderRecipes(filter = 'all', searchQuery = '') {
    const grid = document.getElementById('recipeGrid');
    const noResults = document.getElementById('noResults');
    let data = window.recipes || [];

    // Filter by category
    if (filter !== 'all') {
        data = data.filter(r => r.kategori === filter);
    }

    // Filter by search
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        data = data.filter(r =>
            r.nama.toLowerCase().includes(q) ||
            r.kategori.includes(q) ||
            r.bahan.some(b => b.toLowerCase().includes(q))
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
                <span class="recipe-card-badge">${recipe.kesulitan}</span>
            </div>
            <div class="recipe-card-body">
                <h3>${recipe.nama}</h3>
                <div class="recipe-card-rating">${stars} <small style="color:#A8A29A; font-family:Inter,sans-serif;">${recipe.rating}</small></div>
                <div class="recipe-card-meta">
                    <span>⏱ ${recipe.waktu} mnt</span>
                    <span>👥 ${recipe.porsi}</span>
                    <span>📊 ${recipe.kesulitan}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openRecipeModal(recipe));
        grid.appendChild(card);
    });
}

// --- SEARCH ---
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    currentFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
    renderRecipes('all', query);
    document.getElementById('recipes').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

// --- FILTER BAR ---
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        document.getElementById('searchInput').value = '';
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
        document.getElementById('searchInput').value = '';
        renderRecipes(kat);
        document.getElementById('recipes').scrollIntoView({ behavior: 'smooth' });
    });
});

// --- MODAL DETAIL ---
const recipeModal = document.getElementById('recipeModal');
const modalClose = document.getElementById('modalClose');

function openRecipeModal(recipe) {
    document.getElementById('modalImage').src = recipe.gambar;
    document.getElementById('modalImage').onerror = function() {
        this.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80';
    };
    document.getElementById('modalTitle').textContent = recipe.nama;
    document.getElementById('modalMeta').innerHTML = `
        ⏱️ ${recipe.waktu} menit &nbsp;|&nbsp; 👥 ${recipe.porsi} &nbsp;|&nbsp; 📊 ${recipe.kesulitan}
    `;
    const stars = '★'.repeat(Math.floor(recipe.rating)) + '☆'.repeat(5 - Math.floor(recipe.rating));
    document.getElementById('modalRating').textContent = stars;

    document.getElementById('modalIngredients').innerHTML = recipe.bahan
        .map(b => `<li>${b}</li>`)
        .join('');

    document.getElementById('modalSteps').innerHTML = recipe.langkah
        .map((l, i) => `<li>${l}</li>`)
        .join('');

    recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    recipeModal.querySelector('.modal-content').scrollTop = 0;
}

function closeRecipeModal() {
    recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeRecipeModal);
recipeModal.querySelector('.modal-backdrop').addEventListener('click', closeRecipeModal);



// --- TOAST ---
function showToast(message) {
    const toast = document.getElementById('toast');
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
    .then(r => r.json())
    .then(d => {
      const el = document.getElementById("visitorCount");
      if (el) el.textContent = (d.value || 0).toLocaleString();
    })
    .catch(() => {});
})();

// --- READY CHECK ---
window._onReady = function () {
  const el = document.getElementById("statRecipes");
  if (el) el.textContent = (window.recipes || []).length;
  renderRecipes();
};

// Poll until data loaded (handles any race condition)
(function poll() {
  if (window.supabaseReady && window.recipes.length > 0) {
    window._onReady();
  } else {
    setTimeout(poll, 150);
  }
})();
