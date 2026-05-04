# 🌊 COSTAS_GITT – Peligros Costeros de Puerto Colombia

Extensión académica de [CoastSat](https://github.com/kvos/CoastSat) aplicada a
**Puerto Colombia, Atlántico, Colombia**.

Muestra un **mapa interactivo** con zonas de peligro costero identificadas
mediante análisis de imágenes satelitales (Landsat / Sentinel-2) a través de
Google Earth Engine.

---

## Características del mapa

| Capa | Descripción |
|------|-------------|
| 🔴 Erosión Alta | Retroceso costero > 1 m/año documentado por satélite |
| 🟠 Erosión Moderada | Retroceso costero 0.3–1 m/año |



## Estructura del proyecto

```
COSTAS_GITT/
├── index.html                   # Mapa interactivo (Leaflet.js, sin dependencias)
├── generar_mapa.py              # Generador Python con Folium
├── requirements.txt             # Dependencias Python
├── data/
│   └── peligros_costeros.geojson  # Datos GeoJSON de peligros costeros
└── output/                      # Mapas generados por generar_mapa.py
```

---

## Área de estudio

**Puerto Colombia** (10.9856°N, 74.9731°O) es un municipio del departamento
del Atlántico, Colombia, ubicado sobre el Mar Caribe.  Su costa es afectada por:

- **Erosión costera** acelerada por oleaje y déficit de sedimentos.
- **Marejadas ciclónicas** asociadas a depresiones tropicales del Caribe.
- **Contaminación** por escorrentía urbana y descargas directas al mar.


---

## Metodología (CoastSat)

Este proyecto se basa en la metodología de
[CoastSat (Vos et al., 2019)](https://github.com/kvos/CoastSat):

1. Descarga de imágenes Landsat (5/7/8/9) y Sentinel-2 desde Google Earth Engine.
2. Preprocesamiento y clasificación de píxeles (arena, agua, vegetación, urbanismo).
3. Extracción de la línea costera con el algoritmo MNDWI/NDWI.
4. Análisis de series temporales de la posición de la playa (<5años–presente).
5. Visualización de cambios y zonas de riesgo en mapa interactivo.

---

## Referencias

- Vos, K., Splinter, K. D., Harley, M. D., Simmons, J. A., & Turner, I. L. (2019).
  **CoastSat: A Google Earth Engine-enabled Python toolkit to extract shorelines
  from publicly available satellite imagery.** *Environmental Modelling & Software*,
  122, 104528. <https://doi.org/10.1016/j.envsoft.2019.104528>

- Repositorio original: <https://github.com/kvos/CoastSat>

---

## Créditos

- **Datos satelitales:** Landsat (USGS/NASA) y Sentinel-2 (ESA/Copernicus)
  vía Google Earth Engine.
- **Mapa base:** OpenStreetMap.


> Proyecto académico · Universidad Francisco José de Caldas

