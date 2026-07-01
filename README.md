# Luminis Engine v0.4

Luminis Engine es una página experimental que no nace con una estética fija: genera un ADN visual al cargar y usa ese ADN para decidir colores, ritmo, densidad de partículas, espaciado, tipografía y estructura.

La idea central es simple: en vez de diseñar una interfaz como una fotografía congelada, se cultiva como un sistema vivo.

## Demo

Archivo principal del proyecto:

- [`index.html`](./index.html)

Cuando GitHub Pages esté activado, la demo debería quedar disponible en:

- `https://vonximit.github.io/Luminis-engine/`

## Qué hace

- Genera una personalidad visual por seed.
- Elige automáticamente entre temas como `neon`, `glass`, `ember`, `forest` y `space`.
- Ajusta partículas, velocidad, espaciado, radios y grilla según el ADN.
- Permite regenerar el ADN desde la interfaz.
- Permite compartir una versión concreta con `?seed=...`.
- Funciona como una sola página HTML, sin build step ni dependencias locales.

## ADN visual

Cada sesión crea cinco valores entre `0` y `1`:

```js
const p = {
  curiosity: rand(),
  calm: rand(),
  elegance: rand(),
  energy: rand(),
  complexity: rand()
};
```

Luego el motor evalúa esos valores y toma decisiones de interfaz en runtime. Por ejemplo, una sesión con más energía puede acelerar partículas y tender hacia un tema más luminoso; una sesión más calma puede inclinarse hacia una composición más suave y cristalina.

## Uso local

No necesitas instalar nada. Basta con abrir `index.html` en el navegador.

También puedes fijar una versión específica agregando una seed a la URL:

```text
index.html?seed=3031609
```

## Publicación con GitHub Pages

Para publicar la demo como sitio web:

1. Entra al repositorio en GitHub.
2. Ve a `Settings`.
3. Abre `Pages`.
4. En `Build and deployment`, elige `Deploy from a branch`.
5. Selecciona `main` y carpeta `/root`.
6. Guarda los cambios.

Después de unos minutos, GitHub Pages servirá el sitio desde:

```text
https://vonximit.github.io/Luminis-engine/
```

## Estado

Versión actual: `v0.4`

Este proyecto es una pieza de interfaz generativa: pequeña, autocontenida y lista para iterar.
