document.addEventListener('DOMContentLoaded', function () {

    // ── 1. BASEMAPS ──────────────────────────────────────
    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles © Esri'
    });

    const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors © CARTO'
    });

    // ── 2. INISIALISASI MAP ──────────────────────────────
    const map = L.map('map', {
        layers: [streets],
        zoomControl: false
    });

    // Zoom control di kanan atas
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    // ── 3. CUSTOM MARKER ICON ────────────────────────────
    function makeIcon(number) {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44">
          <defs>
            <linearGradient id="g${number}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4f8eff"/>
              <stop offset="100%" stop-color="#2563eb"/>
            </linearGradient>
            <filter id="shadow${number}" x="-30%" y="-10%" width="160%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#0008"/>
            </filter>
          </defs>
          <path d="M17 2C9.82 2 4 7.82 4 15c0 9.75 13 27 13 27S30 24.75 30 15C30 7.82 24.18 2 17 2z"
                fill="url(#g${number})" filter="url(#shadow${number})"/>
          <circle cx="17" cy="15" r="7" fill="rgba(255,255,255,0.2)"/>
          <text x="17" y="19" text-anchor="middle" font-family="DM Sans,sans-serif"
                font-size="10" font-weight="700" fill="#fff">${number}</text>
        </svg>`;
        return L.divIcon({
            html: svg,
            className: '',
            iconSize: [34, 44],
            iconAnchor: [17, 44],
            popupAnchor: [0, -46]
        });
    }

    // ── 4. MARKER & POPUP ────────────────────────────────
    const lokasi_all = window.semuaLokasi || [];
    document.querySelector('.brand-sub').textContent = `Banda Aceh · ${lokasi_all.length} Lokasi`;

    const markerGroup = L.featureGroup();
    const markers = [];

    lokasi_all.forEach((lokasi, i) => {
        const num = i + 1;
        const marker = L.marker([lokasi.lat, lokasi.lng], { icon: makeIcon(num) });

        const popup = `
        <div class="popup-inner">
            <div class="popup-badge">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Lokasi ${num}
            </div>
            <div class="popup-name">${lokasi.nama}</div>
            <span class="popup-coords">📍 ${lokasi.lat.toFixed(6)}, ${lokasi.lng.toFixed(6)}</span>
            <a class="popup-link"
               href="https://www.google.com/maps/search/?api=1&query=${lokasi.lat},${lokasi.lng}"
               target="_blank">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Buka di Google Maps
            </a>
        </div>`;

        marker.bindPopup(popup, { maxWidth: 260, className: '' });
        markerGroup.addLayer(marker);
        markers.push(marker);
    });

    markerGroup.addTo(map);
    map.fitBounds(markerGroup.getBounds().pad(0.15));

    // ── 5. SIDEBAR LOCATION LIST ─────────────────────────
    const listEl = document.getElementById('location-list');

    lokasi_all.forEach((lokasi, i) => {
        const li = document.createElement('li');
        li.className = 'loc-item';
        li.innerHTML = `
            <div class="loc-num">${i + 1}</div>
            <div class="loc-name">${lokasi.nama}</div>`;
        li.addEventListener('click', () => {
            map.setView([lokasi.lat, lokasi.lng], 17);
            markers[i].openPopup();
            document.querySelectorAll('.loc-item').forEach(el => el.classList.remove('active-loc'));
            li.classList.add('active-loc');
        });
        listEl.appendChild(li);
    });

    // ── 6. BASEMAP SWITCHER ──────────────────────────────
    const basemaps = { streets, satellite, dark };
    let currentBase = streets;

    document.getElementById('basemap-switcher').addEventListener('click', function (e) {
        const btn = e.target.closest('.basemap-btn');
        if (!btn) return;
        const type = btn.dataset.type;
        if (!basemaps[type] || basemaps[type] === currentBase) return;

        map.removeLayer(currentBase);
        map.addLayer(basemaps[type]);
        currentBase = basemaps[type];

        document.querySelectorAll('.basemap-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });

    // ── 7. KOORDINAT DISPLAY (hover) ─────────────────────
    const coordsDisplay = document.getElementById('coords-display');
    map.on('mousemove', function (e) {
        coordsDisplay.innerHTML = `
            <svg width="8" height="8" viewBox="0 0 24 24" fill="#3ecf8e"><circle cx="12" cy="12" r="10"/></svg>
            ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
    });
    map.on('mouseout', function () {
        coordsDisplay.innerHTML = `
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            Hover peta untuk melihat koordinat`;
    });

    // ── 8. RESET ─────────────────────────────────────────
    document.getElementById('reset-zoom-btn').addEventListener('click', () => {
        map.fitBounds(markerGroup.getBounds().pad(0.15));
        document.querySelectorAll('.loc-item').forEach(el => el.classList.remove('active-loc'));
    });

    // Highlight sidebar item saat popup dibuka
    markers.forEach((m, i) => {
        m.on('popupopen', () => {
            document.querySelectorAll('.loc-item').forEach(el => el.classList.remove('active-loc'));
            listEl.children[i]?.classList.add('active-loc');
        });
    });

});