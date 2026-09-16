# Luminis Engine

Motor determinista de diseño generativo. Convierte una seed numérica o textual en un ADN visual reproducible y deriva un tema, tokens CSS y decisiones de composición.

**La misma seed produce el mismo diseño.** Luminis Engine no “piensa” ni diseña autónomamente: ejecuta reglas visuales explícitas y verificables definidas por la autora.

## Demostración

Abre [`index.html`](./index.html) directamente o sirve el repositorio:

```bash
python3 -m http.server 8080
```

Después visita `http://localhost:8080/?seed=Marga`.

## Uso como biblioteca

### Navegador

```html
<script src="./src/luminis-engine.js"></script>
<script>
  const design = LuminisEngine.createDesign('Margaret');
  LuminisEngine.applyDesign(design);

  console.log(design.dna);
  console.log(design.theme);
  console.log(design.decisions);
</script>
```

### Node.js

```js
const LuminisEngine = require('./src/luminis-engine.js');

const design = LuminisEngine.createDesign(3031609);
console.log(design.variables);
```

## Flujo del motor

```text
seed
  → generador pseudoaleatorio determinista
  → ADN: curiosity, calm, elegance, energy, complexity
  → puntuación de temas
  → tema ganador
  → decisiones: velocidad, partículas, espaciado, radio y columnas
  → tokens CSS
```

## Resultado

`createDesign(seed)` devuelve un objeto inmutable:

```js
{
  version: '0.5.0',
  seed: 3031609,
  seedHex: '002e4239',
  dna: { curiosity, calm, elegance, energy, complexity },
  scores: { neon, glass, ember, forest, space },
  theme: 'ember',
  themeTokens: { /* colores y tipografías */ },
  decisions: {
    speedSeconds,
    particleCount,
    spacingPx,
    radiusPx,
    columns
  },
  variables: { /* propiedades CSS */ }
}
```

El tema exacto del ejemplo depende de las reglas vigentes en esta versión; usa siempre el objeto devuelto como fuente de verdad.

## API

| Función | Propósito |
| --- | --- |
| `normalizeSeed(value)` | Convierte números, hexadecimal o texto en una seed de 32 bits |
| `createRng(seed)` | Crea un generador pseudoaleatorio determinista |
| `createDNA(seed)` | Genera los cinco rasgos visuales |
| `validateDNA(dna)` | Valida y limita un ADN externo al rango 0–1 |
| `scoreThemes(dna)` | Calcula la puntuación de los cinco temas |
| `chooseTheme(dna)` | Devuelve el tema con mayor puntuación |
| `deriveDecisions(dna)` | Calcula decisiones de composición |
| `createDesign(seed)` | Ejecuta el flujo completo |
| `applyDesign(design, target)` | Aplica los tokens CSS al documento o a otro elemento |
| `seedFromSearch(search, fallback)` | Lee `?seed=` desde una cadena de búsqueda |

## Temas incorporados

- `neon`
- `glass`
- `ember`
- `forest`
- `space`

Los temas son conjuntos de tokens prediseñados. El motor selecciona y combina reglas; no inventa colores fuera de esos conjuntos.

## Desarrollo

```bash
npm test
npm run check
npm pack --dry-run
```

La suite verifica determinismo, diversidad entre seeds, rangos, validación, aplicación de CSS y lectura de URL.

## Alcance

Luminis Engine es una herramienta de creative coding y sistemas de diseño. El “ADN” es una metáfora para cinco parámetros numéricos; no representa personalidad, emoción o consciencia real.

## Licencia

El repositorio todavía no define una licencia de reutilización. Hasta que la autora elija una, el código permanece con todos los derechos reservados.
