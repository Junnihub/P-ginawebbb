/**
 * map.js
 * Interactive coastline-change map – Puerto Colombia
 *
 * Loads video data from data/videos.json, places Leaflet markers
 * on the map, and wires up the side panel with the year-selector
 * and video player.
 */

'use strict';

/* ---- State ------------------------------------------------ */
let map;
let markers = [];
let activeMarkerId = null;
let videosData = [];

/* ---- DOM references --------------------------------------- */
const sidePanel       = document.getElementById('side-panel');
const panelTitle      = document.getElementById('panel-title');
const panelSubtitle   = document.getElementById('panel-subtitle');
const panelIcon       = document.getElementById('panel-icon');
const panelDesc       = document.getElementById('panel-description');
const panelClose      = document.getElementById('panel-close');
const videoPlayer     = document.getElementById('video-player');
const videoPlaceholder= document.getElementById('video-placeholder');
const yearTabs        = document.getElementById('year-tabs');
const videoYearLabel  = document.getElementById('video-year-label');
const videoDescEl     = document.getElementById('video-description');
const erosionFill     = document.getElementById('erosion-bar-fill');
const mapTip          = document.getElementById('map-tip');
const loadingOverlay  = document.getElementById('loading-overlay');

/* ---- Erosion severity per index (0-4, oldest→newest) ------ */
const EROSION_LEVELS = [10, 30, 50, 70, 90]; // percentage

/* ---- Icon mapping ----------------------------------------- */
const ICON_EMOJI = {
  'anchor':        '⚓',
  'umbrella-beach':'🏖️',
  'water':         '🌊',
  'mountain':      '🪨',
  'wave-square':   '〰️',
};

/* ---- Colour classes per marker index --------------------- */
const COLOR_CLASSES = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];

/* ==========================================================
   Bootstrap
   ========================================================== */
async function init() {
  try {
    videosData = await fetchVideosData();
    initMap();
    addMarkers();
    hideLoading();
  } catch (err) {
    console.error('Error initialising map:', err);
    hideLoading();
  }
}

/* ---- Fetch video database --------------------------------- */
async function fetchVideosData() {
  const response = await fetch('data/videos.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/* ---- Initialise Leaflet map ------------------------------ */
function initMap() {
  map = L.map('map', {
    center: [10.9930, -74.9535],
    zoom: 14,
    zoomControl: false,
    attributionControl: true,
  });

  /* Custom zoom control position */
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  /* Tile layer – OpenStreetMap (no API key required) */
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  /* Optional: Esri satellite tiles as alternative */
  const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles © Esri',
      maxZoom: 19,
    }
  );

  /* Layer control */
  const baseLayers = {
    '🗺️ Mapa de calles': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map),
    '🛰️ Vista satelital': satellite,
  };

  L.control.layers(baseLayers, {}, { position: 'topright' }).addTo(map);

  /* Close panel when clicking on map background */
  map.on('click', () => {
    if (sidePanel.classList.contains('open')) {
      closePanel();
    }
  });

  /* Hide tip after first map interaction */
  map.on('movestart', hideTip);
}

/* ---- Add markers for each location ----------------------- */
function addMarkers() {
  videosData.forEach((location, idx) => {
    const colorClass = COLOR_CLASSES[idx % COLOR_CLASSES.length];
    const emoji = ICON_EMOJI[location.icon] || '📍';

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-pulse"></div>
        <div class="marker-pin ${colorClass}">
          <span class="marker-num">${idx + 1}</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
    });

    const marker = L.marker(location.coordinates, { icon });

    /* Popup on hover */
    const popup = L.popup({ closeButton: false, offset: [0, 0] }).setContent(`
      <div class="popup-inner">
        <h3>${emoji} ${location.location}</h3>
        <p>${location.videos.length} registros temporales disponibles</p>
        <button class="popup-btn" onclick="openPanelForId(${location.id})">
          ▶ Ver videos de cambio costero
        </button>
      </div>
    `);

    marker.bindPopup(popup);

    marker.on('mouseover', function () {
      if (activeMarkerId !== location.id) {
        this.openPopup();
      }
    });

    marker.on('mouseout', function () {
      if (activeMarkerId !== location.id) {
        this.closePopup();
      }
    });

    /* Click opens side panel */
    marker.on('click', function (e) {
      L.DomEvent.stopPropagation(e);
      hideTip();
      openPanel(location, idx);
    });

    marker.addTo(map);
    markers.push({ marker, id: location.id });
  });
}

/* ---- Open side panel for a given location object --------- */
function openPanel(location, idx) {
  const colorClass = COLOR_CLASSES[idx % COLOR_CLASSES.length];
  const emoji = ICON_EMOJI[location.icon] || '📍';
  activeMarkerId = location.id;

  /* Update header */
  panelTitle.textContent = location.location;
  panelSubtitle.textContent = `Punto ${idx + 1} · ${location.videos.length} períodos`;
  panelIcon.textContent = emoji;
  panelDesc.textContent = location.description;

  /* Build year tabs */
  yearTabs.innerHTML = '';
  location.videos.forEach((vid, vIdx) => {
    const btn = document.createElement('button');
    btn.className = 'year-tab' + (vIdx === 0 ? ' active' : '');
    btn.textContent = vid.year;
    btn.addEventListener('click', () => selectYear(location, vIdx));
    yearTabs.appendChild(btn);
  });

  /* Load first video */
  selectYear(location, 0);

  /* Show panel */
  sidePanel.classList.add('open');

  /* Recenter map slightly left to account for panel */
  const panelPx = window.innerWidth <= 768 ? 0 : 220;
  const targetPt = map.project(location.coordinates, map.getZoom());
  targetPt.x -= panelPx;
  const adjusted = map.unproject(targetPt, map.getZoom());
  map.setView(adjusted, Math.max(map.getZoom(), 15), { animate: true });
}

/* ---- Open panel by location id (called from popup btn) ---- */
function openPanelForId(id) {
  const idx = videosData.findIndex(l => l.id === id);
  if (idx !== -1) {
    map.closePopup();
    openPanel(videosData[idx], idx);
  }
}

/* Expose globally for popup onclick */
window.openPanelForId = openPanelForId;

/* ---- Select a year within the panel ---------------------- */
function selectYear(location, vIdx) {
  const vid = location.videos[vIdx];

  /* Update active tab */
  Array.from(yearTabs.children).forEach((btn, i) => {
    btn.classList.toggle('active', i === vIdx);
  });

  /* Update year label and description */
  videoYearLabel.textContent = `Año ${vid.year}`;
  videoDescEl.textContent = vid.description;

  /* Update erosion bar */
  const total = location.videos.length;
  const pct = EROSION_LEVELS[vIdx] !== undefined
    ? EROSION_LEVELS[vIdx]
    : (total > 1 ? (vIdx / (total - 1)) * 90 : 50);
  erosionFill.style.width = pct + '%';

  /* Load video or show placeholder */
  if (vid.url) {
    videoPlaceholder.style.display = 'none';
    videoPlayer.style.display = 'block';
    videoPlayer.src = vid.url;
    videoPlayer.load();
    videoPlayer.play().catch(() => {
      /* Autoplay may be blocked; that's fine */
    });
  } else {
    videoPlayer.pause();
    videoPlayer.removeAttribute('src');
    videoPlayer.style.display = 'none';
    videoPlaceholder.style.display = 'flex';
  }
}

/* ---- Close panel ----------------------------------------- */
function closePanel() {
  sidePanel.classList.remove('open');
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  activeMarkerId = null;
}

panelClose.addEventListener('click', (e) => {
  e.stopPropagation();
  closePanel();
});

/* ---- Misc helpers ---------------------------------------- */
function hideTip() {
  mapTip.classList.add('hidden');
}

function hideLoading() {
  loadingOverlay.classList.add('hidden');
  setTimeout(() => loadingOverlay.remove(), 600);
}

/* ---- Start ---------------------------------------------- */
document.addEventListener('DOMContentLoaded', init);
