const test = require('node:test');
const assert = require('node:assert/strict');
const LuminisEngine = require('../src/luminis-engine.js');

test('genera el mismo diseño para la misma seed', () => {
  const first = LuminisEngine.createDesign(3031609);
  const second = LuminisEngine.createDesign(3031609);
  assert.deepEqual(first, second);
  assert.equal(first.version, '0.5.0');
});

test('genera variantes distintas para seeds distintas', () => {
  const first = LuminisEngine.createDesign('Margaret');
  const second = LuminisEngine.createDesign('LuMinis');
  assert.notEqual(first.seed, second.seed);
  assert.notDeepEqual(first.dna, second.dna);
});

test('normaliza seeds numéricas, hexadecimales y textuales', () => {
  assert.equal(LuminisEngine.normalizeSeed(42.9), 42);
  assert.equal(LuminisEngine.normalizeSeed('42'), 42);
  assert.equal(LuminisEngine.normalizeSeed('0x2a'), 42);
  assert.equal(LuminisEngine.normalizeSeed('Marga'), LuminisEngine.normalizeSeed('Marga'));
});

test('mantiene rasgos y decisiones dentro de sus rangos', () => {
  for (let seed = 0; seed < 500; seed += 1) {
    const design = LuminisEngine.createDesign(seed);
    for (const trait of LuminisEngine.traits) {
      assert.ok(design.dna[trait] >= 0 && design.dna[trait] <= 1);
    }
    assert.ok(design.decisions.speedSeconds >= 1 && design.decisions.speedSeconds <= 7);
    assert.ok(design.decisions.particleCount >= 10 && design.decisions.particleCount <= 100);
    assert.ok([1, 2, 3].includes(design.decisions.columns));
    assert.ok(Object.hasOwn(LuminisEngine.themes, design.theme));
  }
});

test('valida ADN externo y limita valores extremos', () => {
  const dna = LuminisEngine.validateDNA({
    curiosity: -2,
    calm: 4,
    elegance: 0.5,
    energy: 0.7,
    complexity: 0.2
  });
  assert.equal(dna.curiosity, 0);
  assert.equal(dna.calm, 1);
  assert.throws(() => LuminisEngine.validateDNA({}), /curiosity must be a number/);
});

test('aplica variables CSS a un destino explícito', () => {
  const values = new Map();
  const target = { style: { setProperty: (name, value) => values.set(name, value) } };
  const design = LuminisEngine.createDesign(99);
  const result = LuminisEngine.applyDesign(design, target);
  assert.equal(result, design);
  assert.equal(values.get('--bg'), design.themeTokens.bg);
  assert.equal(values.get('--grid'), `repeat(${design.decisions.columns},1fr)`);
});

test('extrae una seed reproducible desde la URL', () => {
  assert.equal(LuminisEngine.seedFromSearch('?seed=3031609', 7), 3031609);
  assert.equal(LuminisEngine.seedFromSearch('', 7), 7);
});
