/*!
 * Unprofessional Athletes — Recipe Card v3.0
 * https://github.com/robbbino/unprofessional-athletes
 *
 * Reads semantic HTML from the post, transforms it into an interactive card.
 * No configuration needed in this file — all data lives in the post HTML.
 *
 * To update styles or behaviour across all recipes: edit this file, commit, push.
 */

(function () {

  // ── 1. INJECT CSS (once per page) ────────────────────────────────────────

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
        cursor: pointer; font-size: 1em; line-height: 1;
        display: flex; align-items: center; justify-content: center;
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
      .ua-rc-slider-val {
        font-family: monospace; font-size: 0.85em; font-weight: 700; color: var(--green);
      }
      .ua-rc-slider-wrap {
        display: flex; align-items: center; margin-top: 0.35rem;
      }
      #ua-rc-root .ua-rc-slider-wrap .ua-rc-step-btn:first-child { margin-right: 8px !important; }
      #ua-rc-root .ua-rc-slider-wrap .ua-rc-step-btn:last-child  { margin-left:  8px !important; }

      input[type=range].ua-range {
        -webkit-appearance: none; width: 100%; height: 2px;
        background: var(--border); border-radius: 2px; outline: none; cursor: pointer; flex: 1;
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

      /* HEADINGS — mirror Ghost's own spacing since their selectors don't reach nested elements */
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


  // ── 2. PARSE SEMANTIC HTML ────────────────────────────────────────────────

  function parseContent(root) {
    const ingredients = [];
    const method      = [];

    let mode                = null;
    let currentIngSection   = null;
    let currentMethSection  = null;

    for (const el of root.children) {
      const tag  = el.tagName;
      const text = el.textContent.trim().toLowerCase();

      // H2 sets mode
      if (tag === 'H2') {
        if (text === 'ingredients') {
          mode = 'ingredients';
          currentIngSection = { section: '', items: [] };
        } else if (text === 'method') {
          if (currentIngSection && currentIngSection.items.length)
            ingredients.push(currentIngSection);
          currentIngSection = null;
          mode = 'method';
          currentMethSection = { section: '', steps: [] };
        } else {
          mode = null;
        }
        continue;
      }

      // H3 starts a new sub-section
      if (tag === 'H3') {
        if (mode === 'ingredients') {
          if (currentIngSection && currentIngSection.items.length)
            ingredients.push(currentIngSection);
          currentIngSection = { section: el.textContent.trim(), items: [] };
        } else if (mode === 'method') {
          if (currentMethSection && currentMethSection.steps.length)
            method.push(currentMethSection);
          currentMethSection = { section: el.textContent.trim(), steps: [] };
        }
        continue;
      }

      // UL = ingredients list
      if (tag === 'UL' && mode === 'ingredients' && currentIngSection) {
        el.querySelectorAll('li').forEach(li => {
          currentIngSection.items.push({
            name:   li.textContent.trim(),
            note:   li.dataset.note   || '',
            amount: parseFloat(li.dataset.amount) || 0,
            unit:   li.dataset.unit   || '',
          });
        });
        continue;
      }

      // OL = method steps
      if (tag === 'OL' && mode === 'method' && currentMethSection) {
        el.querySelectorAll('li').forEach(li => {
          currentMethSection.steps.push(li.innerHTML.trim());
        });
        continue;
      }
    }

    // Push any trailing sections
    if (currentIngSection  && currentIngSection.items.length)  ingredients.push(currentIngSection);
    if (currentMethSection && currentMethSection.steps.length) method.push(currentMethSection);

    return { ingredients, method };
  }


  // ── 3. BUILD CARD HTML ────────────────────────────────────────────────────

  function buildCardHTML(R) {
    return `
      <div class="ua-rc-block">
        <div class="ua-rc-stats">
          <div class="ua-rc-stat">
            <span class="ua-rc-stat-label">Prep</span>
            <span class="ua-rc-stat-val">${R.prepTime}</span>
          </div>
          <div class="ua-rc-stat">
            <span class="ua-rc-stat-label">Cook</span>
            <span class="ua-rc-stat-val">${R.cookTime}</span>
          </div>
          <div class="ua-rc-stat">
            <span class="ua-rc-stat-label">Difficulty</span>
            <span class="ua-rc-stat-val">${R.difficulty}</span>
          </div>
          <div class="ua-rc-stat">
            <span class="ua-rc-stat-label">Makes</span>
            <span class="ua-rc-stat-val"><span id="ua-servings-display">${R.baseServings}</span> ${R.servingUnit}s</span>
          </div>
        </div>
      </div>

      <div class="ua-rc-block">
        <h2>Nutritional information</h2>
        <div class="ua-rc-macros-box">
          <div class="ua-rc-macro-kcal">
            <span class="ua-rc-macro-kcal-num" id="ua-m-kcal"></span>
            <span class="ua-rc-macro-kcal-label">kcal / <span class="ua-unit-label">${R.servingUnit}</span></span>
          </div>
          <div class="ua-rc-macros">
            <div class="ua-rc-macro ua-rc-macro--stepper">
              <span class="ua-rc-macro-label">protein</span>
              <div class="ua-rc-stepper">
                <button class="ua-rc-step-btn" onclick="uaStepProtein(-5)">−</button>
                <span class="ua-rc-macro-num" id="ua-m-protein"></span>
                <button class="ua-rc-step-btn" onclick="uaStepProtein(5)">+</button>
                <button class="ua-rc-reset-icon" id="ua-reset-icon" onclick="uaReset()" title="Reset to default">↺</button>
              </div>
            </div>
            <div class="ua-rc-macro">
              <span class="ua-rc-macro-label">carbs</span>
              <span class="ua-rc-macro-num" id="ua-m-carbs"></span>
            </div>
            <div class="ua-rc-macro">
              <span class="ua-rc-macro-label">fat</span>
              <span class="ua-rc-macro-num" id="ua-m-fat"></span>
            </div>
          </div>
        </div>

        <div class="ua-rc-controls">
          <div class="ua-rc-slider-row">
            <div class="ua-rc-slider-header">
              <span class="ua-rc-slider-label">Servings</span>
              <span class="ua-rc-slider-val" id="ua-val-servings"></span>
            </div>
            <div class="ua-rc-slider-wrap">
              <button class="ua-rc-step-btn" onclick="uaStepServings(-1)">−</button>
              <input class="ua-range" id="ua-slider-servings" type="range" min="1" max="24" step="1" oninput="uaServings(this.value)">
              <button class="ua-rc-step-btn" onclick="uaStepServings(1)">+</button>
            </div>
          </div>
        </div>
      </div>

      <div class="ua-rc-block">
        <h2>Ingredients</h2>
        <div id="ua-ingredients"></div>
      </div>

      <div class="ua-rc-block">
        <h2>Method</h2>
        <div id="ua-method"></div>
      </div>
    `;
  }


  // ── 4. FORMAT AMOUNTS ─────────────────────────────────────────────────────

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


  // ── 5. INTERACTIVE BEHAVIOUR ──────────────────────────────────────────────

  function initBehaviour(R) {
    const B           = R.macros;
    const PROT_RATIO  = B.protein / B.kcal;
    const CARBS_RATIO = B.carbs   / B.kcal;
    const FAT_RATIO   = B.fat     / B.kcal;

    let targetKcal = B.kcal;
    let servings   = R.baseServings;

    // Hide stepper if disabled
    if (!R.showMacroSliders) {
      const stepper = document.querySelector('.ua-rc-stepper');
      if (stepper) stepper.style.display = 'none';
    }

    document.getElementById('ua-slider-servings').value = R.baseServings;

    // Render ingredients
    function renderIngredients(scale) {
      document.getElementById('ua-ingredients').innerHTML =
        R.ingredients.map(sec => {
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

    // Render method
    function renderMethod() {
      document.getElementById('ua-method').innerHTML =
        R.method.map(sec => {
          const steps = sec.steps.map((step, i) => `
            <div class="ua-rc-step">
              <div class="ua-rc-step-num">${i + 1}</div>
              <div class="ua-rc-step-text">${step}</div>
            </div>`).join('');
          return `${sec.section ? `<h3>${sec.section}</h3>` : ''}${steps}`;
        }).join('');
    }

    // Render macros
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
        servings + '\u202f' + (servings === 1 ? R.servingUnit : R.servingUnit + 's');
      document.getElementById('ua-servings-display').textContent = servings;

      renderIngredients(scale * (servings / R.baseServings));
    }

    // Expose handlers globally
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
      servings   = R.baseServings;
      document.getElementById('ua-slider-servings').value = R.baseServings;
      render();
    };
    window.uaServings = function (val) {
      servings = parseInt(val);
      render();
    };

    renderMethod();
    render();
  }


  // ── 6. JSON-LD SCHEMA ─────────────────────────────────────────────────────

  function buildSchema(R) {
    const B = R.macros;
    const ingList = R.ingredients.flatMap(s =>
      s.items.map(i => [
        i.amount % 1 === 0 ? i.amount : i.amount.toFixed(1),
        i.unit || '', i.name, i.note
      ].filter(Boolean).join(' ').trim())
    );
    const stepList = R.method.flatMap(s =>
      s.steps.map((step, idx) => ({
        '@type': 'HowToStep',
        name: `${s.section || 'Step'} ${idx + 1}`,
        text: step.replace(/<[^>]+>/g, '')
      }))
    );
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify({
      '@context':          'https://schema.org',
      '@type':             'Recipe',
      name:                R.name,
      url:                 R.url,
      image:               R.image,
      author:              { '@type': 'Person', name: R.author },
      datePublished:       R.datePublished,
      description:         R.description,
      prepTime:            R.totalTime,
      totalTime:           R.totalTime,
      recipeYield:         `${R.baseServings} ${R.servingUnit}s`,
      nutrition: {
        '@type':              'NutritionInformation',
        calories:             B.kcal + ' calories',
        proteinContent:       B.protein + 'g',
        carbohydrateContent:  B.carbs + 'g',
        fatContent:           B.fat + 'g'
      },
      recipeIngredient:    ingList,
      recipeInstructions:  stepList
    }, null, 2);
    document.head.appendChild(tag);
  }


  // ── 7. AUTO-INIT ──────────────────────────────────────────────────────────

  const root = document.getElementById('ua-rc-root');
  if (!root) return;

  const d = root.dataset;
  const { ingredients, method } = parseContent(root);

  const R = {
    name:             d.name        || '',
    url:              d.url         || window.location.href,
    image:            d.image       || '',
    author:           d.author      || '',
    datePublished:    d.date        || '',
    description:      d.description || '',
    prepTime:         d.prep        || '',
    cookTime:         d.cook        || '',
    totalTime:        d.totalTime   || '',
    difficulty:       d.difficulty  || '',
    servingUnit:      d.unit        || 'serving',
    baseServings:     parseInt(d.serves)  || 1,
    showMacroSliders: d.showSliders !== 'false',
    macros: {
      kcal:    parseFloat(d.kcal)    || 0,
      protein: parseFloat(d.protein) || 0,
      carbs:   parseFloat(d.carbs)   || 0,
      fat:     parseFloat(d.fat)     || 0,
    },
    ingredients,
    method,
  };

  // Replace semantic HTML with interactive card
  root.innerHTML = buildCardHTML(R);

  initBehaviour(R);
  buildSchema(R);

})();