# COSTAS HUB: Monitoreo Satelital de la Línea Costera

**COSTAS HUB** es un sistema académico de monitoreo satelital de la línea costera del municipio de Puerto Colombia (Atlántico, Colombia). El proyecto utiliza imágenes Landsat 8/9 y Sentinel-2 descargadas a través de Google Earth Engine para extraer la posición de la interfaz agua-arena en seis segmentos del litoral, cuantificando su evolución morfológica desde enero de 2023.

## 📊 Visualización de Resultados
Los resultados se publican en un visor web interactivo donde los polígonos de cada segmento se colorean dinámicamente según su estado actual:
* 🔴 **Erosión**: $\Delta x < -1$ m
* 🟢 **Acreción**: $\Delta x > +1$ m
* ⚪ **Estable**: $-1 \leq \Delta x \leq +1$ m
* 💠 **Sin datos**: JSON ausente o datos insuficientes

## 📂 Estructura del Repositorio
* `gemini.ipynb`: Notebook de Google Colab. Descarga imágenes, extrae *shorelines*, construye transectos y genera `resultados_web.json`.
* `app.js`: Lógica del visor web (Leaflet.js), manejo de polígonos, renderizado de métricas y gestión de eventos.
* `index.html`: Estructura base del visor web.
* `styles.css`: Diseño visual y leyenda del visor.
* `resultados_web.json`: Salida procesada con el balance neto y métricas por segmento.

## 🚀 Implementación

### 1. Procesamiento (Google Colab)
1. Abre `gemini.ipynb` en Google Colab.
2. Inicializa tu proyecto de Google Earth Engine con tu propio ID en la celda correspondiente:
   ```python
   ee.Initialize(project='tu-id-de-proyecto')


### Carpéta utilizada para el proyecto: https://drive.google.com/drive/folders/1LTcBcnEHvLeX4f_AqwZJ606OGd392ms4?usp=drive_link
