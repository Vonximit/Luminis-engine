(function (root, factory) {
  'use strict';

  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LuminisEngine = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const VERSION = '0.5.0';
  const TRAITS = Object.freeze(['curiosity', 'calm', 'elegance', 'energy', 'complexity']);

  const THEMES = Object.freeze({
    neon: Object.freeze({
      bg: '#0a0014', surface: 'rgba(120,0,255,.12)', surface2: 'rgba(120,0,255,.06)',
      accent: '#c084fc', accent2: '#e879f9', text: '#fce7ff', text2: '#d8b4fe',
      text3: '#a855f7', border: 'rgba(168,85,247,.2)', border2: 'rgba(168,85,247,.45)',
      glow: 'rgba(192,132,252,.25)', particles: Object.freeze(['#e879f9', '#a855f7', '#f0abfc', '#c084fc', '#7e22ce']),
      font: 'Space Grotesk,system-ui,sans-serif', heading: 'Space Grotesk,system-ui,sans-serif'
    }),
    glass: Object.freeze({
      bg: '#dbeafe', surface: 'rgba(255,255,255,.55)', surface2: 'rgba(255,255,255,.3)',
      accent: '#0369a1', accent2: '#0284c7', text: '#0c4a6e', text2: '#0369a1',
      text3: '#075985', border: 'rgba(3,105,161,.18)', border2: 'rgba(3,105,161,.35)',
      glow: 'rgba(56,189,248,.2)', particles: Object.freeze(['#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7']),
      font: 'Inter,system-ui,sans-serif', heading: 'Inter,system-ui,sans-serif'
    }),
    ember: Object.freeze({
      bg: '#0f0500', surface: 'rgba(251,146,60,.1)', surface2: 'rgba(251,146,60,.05)',
      accent: '#fb923c', accent2: '#fdba74', text: '#fff7ed', text2: '#fed7aa',
      text3: '#fb923c', border: 'rgba(251,146,60,.2)', border2: 'rgba(251,146,60,.4)',
      glow: 'rgba(251,146,60,.25)', particles: Object.freeze(['#fb923c', '#f97316', '#fdba74', '#fbbf24', '#ea580c']),
      font: 'Space Mono,monospace', heading: 'Space Mono,monospace'
    }),
    forest: Object.freeze({
      bg: '#021404', surface: 'rgba(34,197,94,.1)', surface2: 'rgba(34,197,94,.05)',
      accent: '#22c55e', accent2: '#4ade80', text: '#f0fdf4', text2: '#bbf7d0',
      text3: '#22c55e', border: 'rgba(34,197,94,.18)', border2: 'rgba(34,197,94,.38)',
      glow: 'rgba(34,197,94,.2)', particles: Object.freeze(['#22c55e', '#16a34a', '#4ade80', '#86efac', '#15803d']),
      font: 'Inter,system-ui,sans-serif', heading: 'Georgia,serif'
    }),
    space: Object.freeze({
      bg: '#0d1117', surface: 'rgba(30,41,59,.7)', surface2: 'rgba(30,41,59,.4)',
      accent: '#7f8ea3', accent2: '#a8b8cc', text: '#f1f5f9', text2: '#a8b8cc',
      text3: '#7f8ea3', border: 'rgba(127,142,163,.2)', border2: 'rgba(127,142,163,.4)',
      glow: 'rgba(127,142,163,.15)', particles: Object.freeze(['#586880', '#7f8ea3', '#3d4f63', '#a8b8cc', '#2a3749']),
      font: 'Inter,system-ui,sans-serif', heading: 'Inter,system-ui,sans-serif'
    })
  });

  function hashString(value) {
    let hash = 2166136261;
    for (const char of String(value)) {
      hash ^= char.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function normalizeSeed(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value) >>> 0;
    const text = String(value ?? '').trim();
    if (!text) return 0;
    if (/^0x[\da-f]+$/i.test(text)) return Number.parseInt(text.slice(2), 16) >>> 0;
    if (/^[+-]?\d+$/.test(text)) return Number.parseInt(text, 10) >>> 0;
    return hashString(text);
  }

  function createRng(seed) {
    let state = normalizeSeed(seed);
    return function random() {
      state = (state + 0x6d2b79f5) >>> 0;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function createDNA(seed) {
    const random = createRng(seed);
    return Object.freeze(Object.fromEntries(
      TRAITS.map(name => [name, Number(random().toFixed(4))])
    ));
  }

  function validateDNA(dna) {
    const normalized = {};
    for (const trait of TRAITS) {
      const value = Number(dna && dna[trait]);
      if (!Number.isFinite(value)) throw new TypeError(`Luminis Engine: ${trait} must be a number.`);
      normalized[trait] = Math.max(0, Math.min(1, value));
    }
    return Object.freeze(normalized);
  }

  function scoreThemes(input) {
    const dna = validateDNA(input);
    return Object.freeze({
      neon: dna.energy * 2.2 - dna.calm * 0.8 - 0.3,
      glass: dna.calm * 2.2 - dna.energy * 0.8 - 0.3,
      ember: dna.energy * 1.4 + (1 - dna.calm) * 1.2 - dna.elegance * 0.5 - 0.6,
      forest: dna.calm * 1.2 + dna.elegance * 0.9 - dna.energy * 1.1 - 0.4,
      space: dna.curiosity * 0.4 + 0.1
    });
  }

  function chooseTheme(dna) {
    const scores = scoreThemes(dna);
    return Object.keys(scores).reduce(
      (winner, name) => scores[name] > scores[winner] ? name : winner,
      'space'
    );
  }

  function deriveDecisions(input) {
    const dna = validateDNA(input);
    return Object.freeze({
      speedSeconds: Number(Math.max(1, 7 - dna.energy * 6).toFixed(2)),
      particleCount: Math.floor(dna.curiosity * 90 + 10),
      spacingPx: Math.floor(40 + dna.elegance * 70),
      radiusPx: Math.floor(4 + dna.complexity * 46),
      columns: dna.complexity < 0.33 ? 1 : dna.complexity > 0.66 ? 3 : 2
    });
  }

  function cssVariables(themeName, decisions) {
    const theme = THEMES[themeName];
    if (!theme) throw new RangeError(`Luminis Engine: unknown theme ${themeName}.`);
    return Object.freeze({
      '--bg': theme.bg,
      '--surface': theme.surface,
      '--surface2': theme.surface2,
      '--accent': theme.accent,
      '--accent2': theme.accent2,
      '--text': theme.text,
      '--text2': theme.text2,
      '--text3': theme.text3,
      '--border': theme.border,
      '--border2': theme.border2,
      '--glow': theme.glow,
      '--speed': `${decisions.speedSeconds}s`,
      '--spacing': `${decisions.spacingPx}px`,
      '--radius': `${decisions.radiusPx}px`,
      '--grid': `repeat(${decisions.columns},1fr)`,
      '--font': theme.font,
      '--head': theme.heading
    });
  }

  function createDesign(seedInput) {
    const seed = normalizeSeed(seedInput);
    const dna = createDNA(seed);
    const theme = chooseTheme(dna);
    const decisions = deriveDecisions(dna);
    return Object.freeze({
      version: VERSION,
      seed,
      seedHex: seed.toString(16).padStart(8, '0'),
      dna,
      scores: scoreThemes(dna),
      theme,
      themeTokens: THEMES[theme],
      decisions,
      variables: cssVariables(theme, decisions)
    });
  }

  function applyDesign(design, target) {
    const root = target || (typeof document !== 'undefined' ? document.documentElement : null);
    if (!root || !root.style || typeof root.style.setProperty !== 'function') {
      throw new TypeError('Luminis Engine: applyDesign needs an element with a style declaration.');
    }
    for (const [name, value] of Object.entries(design.variables)) root.style.setProperty(name, value);
    return design;
  }

  function seedFromSearch(search, fallback) {
    const params = new URLSearchParams(String(search || '').replace(/^\?/, ''));
    const value = params.get('seed');
    return value === null || value === '' ? normalizeSeed(fallback) : normalizeSeed(value);
  }

  return Object.freeze({
    version: VERSION,
    traits: TRAITS,
    themes: THEMES,
    normalizeSeed,
    createRng,
    createDNA,
    validateDNA,
    scoreThemes,
    chooseTheme,
    deriveDecisions,
    createDesign,
    applyDesign,
    seedFromSearch
  });
});
