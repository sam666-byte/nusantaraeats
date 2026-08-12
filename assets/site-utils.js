// Shared browser helpers used by the home page and the admin panel.
(function (global) {
  var RECIPES_STORAGE_KEY = 'resepKitaRecipesV2';
  var DIFFICULTY_LABELS = { Mudah: 'Easy', Sedang: 'Medium', Sulit: 'Hard' };
  var SERVING_LABELS = [
    [/orang/g, 'servings'],
    [/gelas/g, 'glasses'],
    [/porsi/g, 'servings']
  ];
  var TOAST_DURATION_MS = 2500;

  function renderStars(rating) {
    var filled = Math.floor(rating || 0);
    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
  }

  function translateDifficulty(difficulty) {
    return DIFFICULTY_LABELS[difficulty] || difficulty;
  }

  function translateServings(servings) {
    return SERVING_LABELS.reduce(function (text, pair) {
      return text.replace(pair[0], pair[1]);
    }, String(servings));
  }

  function formatDuration(minutes) {
    return minutes + ' mins';
  }

  // Time / servings / difficulty, in the order every recipe view shows them.
  function formatRecipeMeta(recipe) {
    return [
      '⏱ ' + formatDuration(recipe.waktu),
      '👥 ' + translateServings(recipe.porsi),
      '📊 ' + translateDifficulty(recipe.kesulitan)
    ];
  }

  function saveRecipes(recipes) {
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes || global.recipes || []));
  }

  function loadStoredRecipes() {
    try {
      return JSON.parse(localStorage.getItem(RECIPES_STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function showToast(message, elementId) {
    var toast = document.getElementById(elementId || 'toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove('show');
    }, TOAST_DURATION_MS);
  }

  global.SiteUtils = {
    RECIPES_STORAGE_KEY: RECIPES_STORAGE_KEY,
    renderStars: renderStars,
    translateDifficulty: translateDifficulty,
    translateServings: translateServings,
    formatDuration: formatDuration,
    formatRecipeMeta: formatRecipeMeta,
    saveRecipes: saveRecipes,
    loadStoredRecipes: loadStoredRecipes,
    showToast: showToast
  };
})(window);
