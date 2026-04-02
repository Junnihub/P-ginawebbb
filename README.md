# P-ginawebbb — Mapa Interactivo de Cambios Costeros
**Puerto Colombia, Atlántico, Colombia**

Sitio web estático que muestra un **mapa interactivo** con puntos de observación a lo largo de la costa de Puerto Colombia. Al hacer clic en cada marcador se abre un panel lateral con reproductor de video y un selector de año, permitiendo visualizar la **evolución de la línea de costa** a través del tiempo (1985 – 2023).

---

## Tecnologías

| Herramienta | Uso |
|---|---|
| [Leaflet.js 1.9](https://leafletjs.com/) | Mapa interactivo (sin API key) |
| OpenStreetMap / Esri Satellite | Capas de tiles |
| HTML5 `<video>` | Reproductor de video |
| JSON (`data/videos.json`) | Base de datos de videos y puntos |
| CSS puro + JS puro | Sin frameworks / sin build step |

---

## Estructura del proyecto

```
P-ginawebbb/
├── index.html          ← Página principal
├── css/
│   └── style.css       ← Estilos (tema oscuro marino)
├── js/
│   └── map.js          ← Lógica del mapa y panel de video
└── data/
    └── videos.json     ← 📌 BASE DE DATOS de puntos y videos
```

---

## Cómo agregar videos

Edita `data/videos.json`. Cada entrada tiene esta forma:

```json
{
  "id": 1,
  "location": "Muelle de Puerto Colombia",
  "coordinates": [10.9928, -74.9535],
  "description": "Descripción del punto...",
  "icon": "anchor",
  "videos": [
    {
      "year": 1985,
      "url": "https://tu-servidor.com/video_1985.mp4",
      "thumbnail": "",
      "description": "Descripción del estado costero en ese año."
    }
  ]
}
```

### Campo `url`

Acepta:
- **Ruta local**: `videos/muelle_1985.mp4` (coloca los archivos en una carpeta `videos/`)
- **URL absoluta**: `https://ejemplo.com/video.mp4`
- **Vacío `""`**: muestra un placeholder con instrucciones (útil mientras se cargan los videos)

### Iconos disponibles (`icon`)

`anchor` · `umbrella-beach` · `water` · `mountain` · `wave-square`

---

## Ejecutar localmente

Por ser un sitio estático, solo necesitas un servidor HTTP local (los navegadores bloquean `fetch()` desde `file://`):

```bash
# Python 3
python -m http.server 8080
# → abre http://localhost:8080

# Node.js (npx)
npx serve .
```

---

## Agregar más puntos de observación

Añade un nuevo objeto al array en `data/videos.json` con las coordenadas del punto en la costa y los videos correspondientes. El mapa generará el marcador automáticamente.

