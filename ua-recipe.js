/*!
 * Unprofessional Athletes — Recipe Card v2.0
 * https://github.com/YOUR_USERNAME/YOUR_REPO
 *
 * Host this file on GitHub and serve via jsDelivr:
 * https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/ua-recipe.js
 *
 * To update all recipes site-wide: edit this file and push to GitHub.
 * jsDelivr caches aggressively — append ?v=2 etc. to bust if needed.
 */

(function () {

  // ── INJECT CSS (once per page, even if multiple recipes) ──────────────────

  if (!document.getElementById('ua-recipe-styles')) {
    const style = document.createElement('style');
    style.id = 'ua-recipe-styles';
    style.textContent = `
      #ua-rc-root {
        --green:  #2d5a42;
        --border: #e0ddd6;
        --text:   #1a1a16;
        --muted:  #8a8880;
        max-width: 680px;
        margin: 2rem auto;
        color: var(--text);
      }
      .ua-rc-block { margin-top: 4rem; }
      .ua-rc-block:first-child { margin-top: 0; }

      /* PREP STATS */
      .ua-rc-stats { display: flex; gap: 2.5rem; flex-wrap: wrap; }
      .ua-rc-stat { display: flex; flex-direction: column; gap: 0.1rem; }
      .ua-rc-stat-val { font-weight: 600; }
      .ua-rc-stat-label {
        font-family: monospace; font-size: 0.72em; color: var(--muted);
        text-transform: uppercase; letter-spacing: 0.07em;
      }

      /* MACROS BOX */
      .ua-rc-macros-box {
        border: 1px solid var(--border); border-radius: 8px;
        padding: 1.25rem 1.5rem 1rem; margin-top: 2rem;
      }
      .ua-rc-macro-kcal {
        display: flex; flex-direction: column; margin-bottom: 0.9rem;
      }
      .ua-rc-macro-kcal-num {
        font-family: monospace; font-size: 2.4em; font-weight: 700;
        color: var(--green); line-height: 1;
      }
      .ua-rc-macro-kcal-label {
        font-family: monospace; font-size: 0.72em; color: var(--muted);
        text-transform: uppercase; letter-spacing: 0.07em;
      }
      .ua-rc-macros {
        display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: start;
      }
      .ua-rc-macro {
        display: flex; flex-direction: column; align-items: center !important;
        gap: 0.25rem !important; padding: 0.65rem 0.85rem !important;
        margin: 0 !important; text-align: center;
      }
      .ua-rc-macro--stepper { background: #f7f6f2; border-radius: 6px; }
      .ua-rc-macro-num {
        font-family: monospace; font-size: 1.2em; font-weight: 700;
        color: var(--text); line-height: 1;
      }
      .ua-rc-macro-label {
        font-family: monospace; font-size: 0.72em; color: var(--muted);
        text-transform: uppercase; letter-spacing: 0.07em;
      }

      /* STEPPER */
      .ua-rc-stepper {
        display: flex; align-items: center !important;
        justify-content: center !important; margin-top: 0 !important;
      }
      #ua-rc-root .ua-rc-stepper .ua-rc-step-btn:first-child { margin-right: 8px !important; }
      #ua-rc-root .ua-rc-stepper .ua-rc-step-btn:last-of-type { margin-left: 8px !important; }
      .ua-rc-stepper .ua-rc-macro-num { min-width: 2.5rem; text-align: center; }
      .ua-rc-step-btn {
        width: 24px; height: 24px; border: 1px solid var(--border);
        border-radius: 3px; background: none; color: var(--muted);
        cursor: pointer; font-size: 1em; line-height: 1; display: flex;
        align-items: center; justify-content: center;
        transition: border-color 0.15s, color 0.15s; padding: 0; flex-shrink: 0;
      }
      .ua-rc-step-btn:hover { border-color: var(--green); color: var(--green); }

      /* MODIFIED STATE */
      .ua-rc-macro-kcal-num.is-modified .ua-rc-kcal-original {
        text-decoration: line-through; color: var(--muted);
        font-size: 0.65em; margin-right: 0.3rem; vertical-align: middle;
      }
      .ua-rc-macro-kcal-num.is-modified .ua-rc-kcal-new { color: var(--green); }
      .ua-rc-macro-num.is-modified { color: var(--green); }
      .ua-rc-reset-icon {
        display: none; background: none; border: 1px solid var(--border);
        border-radius: 3px; cursor: pointer; color: var(--muted);
        font-size: 0.9em; width: 24px; height: 24px; padding: 0; line-height: 1;
        align-items: center; justify-content: center;
        transition: border-color 0.15s, color 0.15s; flex-shrink: 0;
      }
      .ua-rc-reset-icon:hover { border-color: var(--green); color: var(--green); }
      .ua-rc-reset-icon.visible { display: flex; }

      /* CONTROLS */
      .ua-rc-controls { display: flex; flex-direction: column; gap: 0.9rem; margin-top: 2rem; }
      .ua-rc-slider-row { display: flex; flex-direction: column; gap: 0.35rem; }
      .ua-rc-slider-header { display: flex; justify-content: space-between; align-items: baseline; }
      .ua-rc-slider-label {
        font-family: monospace; font-size: 0.72em; text-transform: uppercase;
        letter-spacing: 0.08em; color: var(--muted);
      }
      .ua-rc-slider-val { font-family: monospace; font-size: 0.85em; font-weight: 700; color: var(--green); }

      input[type=range].ua-range {
        -webkit-appearance: none; width: 100%; height: 2px;
        background: var(--border); border-radius: 2px; outline: none; cursor: pointer;
      }
      input[type=range].ua-range::-webkit-slider-thumb {
        -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%;
        background: var(--green); border: 2px solid #fff;
        box-shadow: 0 0 0 1px var(--green); transition: transform 0.12s;
      }
      input[type=range].ua-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
      input[type=range].ua-range::-moz-range-thumb {
        width: 14px; height: 14px; border-radius: 50%;
        background: var(--green); border: 2px solid #fff; cursor: pointer;
      }

      /* HEADINGS */
      #ua-rc-root h2 {
        font-size: calc(1.6em * var(--factor, 1)); letter-spacing: -0.02em;
        margin-top: calc(56px * var(--content-spacing-factor, 1)); margin-bottom: 0;
      }
      #ua-rc-root h3 {
        font-size: calc(1.3em * var(--factor, 1)); letter-spacing: -0.017em;
        margin-top: calc(28px * var(--content-spacing-factor, 1)); margin-bottom: 0;
      }
      #ua-rc-root h3 + .ua-rc-step,
      #ua-rc-root h3 + .ua-rc-ingredient {
        margin-top: calc(12px * var(--content-spacing-factor, 1));
      }

      /* INGREDIENTS */
      .ua-rc-ingredient {
        display: flex; justify-content: space-between; align-items: baseline;
        padding: 0.45rem 0; border-bottom: 1px solid var(--border);
      }
      .ua-rc-ingredient:last-child { border-bottom: none; }
      .ua-rc-ing-note { font-size: 0.82em; color: var(--muted); }
      .ua-rc-ing-amount {
        font-family: monospace; font-size: 0.88em; font-weight: 700;
        color: var(--text); white-space: nowrap; margin-left: 1rem; flex-shrink: 0;
      }

      /* METHOD */
      .ua-rc-step {
        display: grid; grid-template-columns: 1.4rem 1fr;
        gap: 0.75rem; margin-bottom: 0.85rem;
      }
      .ua-rc-step:last-child { margin-bottom: 0; }
      .ua-rc-step-num {
        font-family: monospace; font-size: 0.75em; font-weight: 700;
        color: var(--muted); padding-top: 0.3em;
      }
      .ua-rc-step-text { line-height: 1.65; }

      @media (max-width: 480px) {
        .ua-rc-stats { gap: 1.25rem; }
      }
    `;
    document.head.appendChild(style);
  }

  // ── EXPOSED INIT FUNCTION ─────────────────────────────────────────────────

  window.uaRecipeInit = function (RECIPE) {

    const B            = RECIPE.macros;
    const PROT_RATIO   = B.protein / B.kcal;
    const CARBS_RATIO  = B.carbs   / B.kcal;
    const FAT_RATIO    = B.fat     / B.kcal;

    let targetKcal = B.kcal;
    let servings   = RECIPE.baseServings;

    // Hide stepper if macro sliders disabled
    if (!RECIPE.showMacroSliders) {
      const stepper = document.querySelector('.ua-rc-stepper');
      if (stepper) stepper.style.display = 'none';
    }

    // Static content
    document.getElementById('ua-prep').textContent         = RECIPE.prepTime;
    document.getElementById('ua-cook').textContent         = RECIPE.cookTime;
    document.getElementById('ua-difficulty').textContent   = RECIPE.difficulty;
    document.getElementById('ua-unit-display').textContent = RECIPE.servingUnit + 's';
    document.querySelectorAll('.ua-unit-label').forEach(el => el.textContent = RECIPE.servingUnit);
    document.getElementById('ua-slider-servings').value    = RECIPE.baseServings;

    // Format ingredient amounts
    function fmtAmount(ing, scale) {
      const amt = ing.amount * scale;
      if (ing.unit === 'pinch') {
        const n = Math.max(1, Math.round(amt));
        return n === 1 ? '1 pinch' : n + ' pinches';
      }
      if (!ing.unit) {
        const r = Math.round(amt * 2) / 2;
        return r % 1 === 0 ? String(r) : r.toFixed(1);
      }
      if (ing.unit === 'tsp' || ing.unit === 'tbsp') {
        const r = Math.round(amt * 4) / 4;
        return (r % 1 === 0 ? r : r.toFixed(2)) + '\u202f' + ing.unit;
      }
      if (ing.unit === 'handful') {
        const r = Math.round(amt * 2) / 2;
        return (r % 1 === 0 ? r : r.toFixed(1)) + ' handful';
      }
      return Math.round(amt) + ing.unit;
    }

    function renderIngredients(scale) {
      document.getElementById('ua-ingredients').innerHTML =
        RECIPE.ingredients.map(sec => {
          const rows = sec.items.map(ing => `
            <div class="ua-rc-ingredient">
              <div>
                <div>${ing.name}</div>
                ${ing.note ? `<div class="ua-rc-ing-note">${ing.note}</div>` : ''}
              </div>
              <div class="ua-rc-ing-amount">${fmtAmount(ing, scale)}</div>
            </div>`).join('');
          return `${sec.section ? `<h3>${sec.section}</h3>` : ''}${rows}`;
        }).join('');
    }

    function renderMethod() {
      document.getElementById('ua-method').innerHTML =
        RECIPE.method.map(sec => {
          const steps = sec.steps.map((step, i) => `
            <div class="ua-rc-step">
              <div class="ua-rc-step-num">${i + 1}</div>
              <div class="ua-rc-step-text">${step}</div>
            </div>`).join('');
          return `${sec.section ? `<h3>${sec.section}</h3>` : ''}${steps}`;
        }).join('');
    }

    function render() {
      const scale    = targetKcal / B.kcal;
      const kcal     = Math.round(targetKcal);
      const protein  = Math.round(targetKcal * PROT_RATIO);
      const carbs    = Math.round(targetKcal * CARBS_RATIO);
      const fat      = Math.round(targetKcal * FAT_RATIO);
      const modified = Math.abs(targetKcal - B.kcal) > 0.5;

      const kcalEl = document.getElementById('ua-m-kcal');
      if (modified) {
        kcalEl.classList.add('is-modified');
        kcalEl.innerHTML = `<span class="ua-rc-kcal-original">${Math.round(B.kcal)}</span><span class="ua-rc-kcal-new">${kcal}</span>`;
      } else {
        kcalEl.classList.remove('is-modified');
        kcalEl.textContent = kcal;
      }

      const proteinEl = document.getElementById('ua-m-protein');
      proteinEl.textContent = protein + 'g';
      proteinEl.classList.toggle('is-modified', modified);

      document.getElementById('ua-reset-icon').classList.toggle('visible', modified);
      document.getElementById('ua-m-carbs').textContent = carbs + 'g';
      document.getElementById('ua-m-fat').textContent   = fat + 'g';

      document.getElementById('ua-val-servings').textContent =
        servings + '\u202f' + (servings === 1 ? RECIPE.servingUnit : RECIPE.servingUnit + 's');
      document.getElementById('ua-servings-display').textContent = servings;

      renderIngredients(scale * (servings / RECIPE.baseServings));
    }

    // Handlers — scoped to avoid conflicts if multiple recipes on one page
    window.uaStepProtein = function (delta) {
      const p = Math.min(60, Math.max(1, Math.round(targetKcal * PROT_RATIO) + delta));
      targetKcal = Math.min(1200, Math.max(100, p / PROT_RATIO));
      render();
    };
    window.uaStepServings = function (delta) {
      servings = Math.min(24, Math.max(1, servings + delta));
      document.getElementById('ua-slider-servings').value = servings;
      render();
    };
    window.uaReset = function () {
      targetKcal = B.kcal;
      servings   = RECIPE.baseServings;
      document.getElementById('ua-slider-servings').value = RECIPE.baseServings;
      render();
    };
    window.uaServings = function (val) {
      servings = parseInt(val);
      render();
    };

    // JSON-LD schema
    const ingList  = RECIPE.ingredients.flatMap(s =>
      s.items.map(i => [
        i.amount % 1 === 0 ? i.amount : i.amount.toFixed(1),
        i.unit || '', i.name, i.note
      ].filter(Boolean).join(' ').trim())
    );
    const stepList = RECIPE.method.flatMap(s =>
      s.steps.map((step, idx) => ({
        '@type': 'HowToStep',
        name: `${s.section || 'Step'} ${idx + 1}`,
        text: step.replace(/<[^>]+>/g, '')
      }))
    );
    const schemaTag = document.createElement('script');
    schemaTag.type = 'application/ld+json';
    schemaTag.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name:          RECIPE.name,
      url:           RECIPE.url,
      image:         RECIPE.image,
      author:        { '@type': 'Person', name: RECIPE.author },
      datePublished: RECIPE.datePublished,
      description:   RECIPE.description,
      prepTime:      RECIPE.totalTime,
      totalTime:     RECIPE.totalTime,
      recipeYield:   `${RECIPE.baseServings} ${RECIPE.servingUnit}s`,
      nutrition: {
        '@type': 'NutritionInformation',
        calories:            B.kcal + ' calories',
        proteinContent:      B.protein + 'g',
        carbohydrateContent: B.carbs + 'g',
        fatContent:          B.fat + 'g'
      },
      recipeIngredient:   ingList,
      recipeInstructions: stepList
    }, null, 2);
    document.head.appendChild(schemaTag);

    // Boot
    renderMethod();
    render();
  };

})();
