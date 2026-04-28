document.addEventListener('DOMContentLoaded', function () {

    const kategoriInfo = {
        warung: { label: 'Warung Kopi', color: '#c2410c', icon: '☕' },
        sekolah: { label: 'Sekolah', color: '#1d4ed8', icon: '🏫' },
        masjid: { label: 'Masjid', color: '#047857', icon: '🕌' }
    };

    function tagKategori(lokasiList, kategori) {
        return (lokasiList || []).map(lokasi => ({ ...lokasi, kategori }));
    }

    // Combine semua data dari ketiga anggota, lalu beri kategori di sini
    const semuaLokasi = [
        ...tagKategori(window.lokasiShafa, 'warung'),
        ...tagKategori(window.lokasiDea, 'sekolah'),
        ...tagKategori(window.lokasiMaulizar, 'masjid')
    ];

    const lokasiData = semuaLokasi.length > 0 ? semuaLokasi : [];

    function getGoogleMapsUrl(lokasi) {
        if (lokasi.mapsUrl) return lokasi.mapsUrl;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lokasi.lat},${lokasi.lng}`)}`;
    }

    if (!Array.isArray(lokasiData) || lokasiData.length === 0) {
        console.warn('Data lokasi belum tersedia. Pastikan file data sudah ter-load.');
        return;
    }

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
        function makeIcon(number, kategori) {
                const info = kategoriInfo[kategori] || { color: '#475569', icon: '📍', label: 'Lokasi' };
        const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44">
                    <path d="M17 2C9.82 2 4 7.82 4 15c0 9.75 13 27 13 27S30 24.75 30 15C30 7.82 24.18 2 17 2z"
                                fill="${info.color}"/>
                    <circle cx="17" cy="16" r="8.5" fill="#ffffff" opacity="0.96"/>
                    <text x="17" y="18.2" text-anchor="middle" font-family="DM Sans,sans-serif"
                                font-size="10" font-weight="700" fill="${info.color}">${info.icon}</text>
                    <text x="17" y="29" text-anchor="middle" font-family="DM Sans,sans-serif"
                                font-size="7" font-weight="700" fill="#ffffff">${number}</text>
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
    // Update header dengan jumlah total lokasi
    document.querySelector('.brand-sub').textContent = `Banda Aceh · ${lokasiData.length} Lokasi`;

    const markerGroup = L.featureGroup();
    const markers = [];

    lokasiData.forEach((lokasi, i) => {
        const num = i + 1;
        const info = kategoriInfo[lokasi.kategori] || kategoriInfo.warung;
        const marker = L.marker([lokasi.lat, lokasi.lng], { icon: makeIcon(num, lokasi.kategori) });

        const popup = `
        <div class="popup-inner">
            <div class="popup-badge" style="--badge-bg:${info.color}20; --badge-border:${info.color}40; --badge-text:${info.color};">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                ${info.label} ${num}
            </div>
            <div class="popup-name">${lokasi.nama}</div>
            <span class="popup-coords">📍 ${lokasi.lat.toFixed(6)}, ${lokasi.lng.toFixed(6)}</span>
            <a class="popup-link"
               href="${getGoogleMapsUrl(lokasi)}"
               target="_blank"
               rel="noopener noreferrer">
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

    lokasiData.forEach((lokasi, i) => {
        const info = kategoriInfo[lokasi.kategori] || kategoriInfo.warung;
        const li = document.createElement('li');
        li.className = 'loc-item';
        li.innerHTML = `
            <div class="loc-num" style="background:${info.color};">${i + 1}</div>
            <div class="loc-meta">
                <div class="loc-name">${lokasi.nama}</div>
                <div class="loc-tag" style="color:${info.color}; background:${info.color}14;">${info.label}</div>
            </div>`;
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

    // ── 9. CATEGORY FILTER ───────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const activeCategories = new Set(['warung', 'sekolah', 'masjid']);
    const categoryCounts = { warung: 0, sekolah: 0, masjid: 0 };

    // Hitung total setiap kategori dari data aktual
    lokasiData.forEach(loc => {
        if (categoryCounts[loc.kategori] !== undefined) {
            categoryCounts[loc.kategori]++;
        }
    });

    // Render filter text numbers dan set event listener
    filterBtns.forEach(btn => {
        const cat = btn.dataset.kategori;
        
        // Sesuaikan warnanya untuk match dengan kategori if active (optional, kita pakai --accent dari css)
        // Set count yang benar
        const countSpan = btn.querySelector('.filter-count');
        if(countSpan) countSpan.textContent = categoryCounts[cat] || 0;

        btn.addEventListener('click', () => {
            // Toggle active state
            if (activeCategories.has(cat)) {
                activeCategories.delete(cat);
                btn.classList.remove('filter-active');
            } else {
                activeCategories.add(cat);
                btn.classList.add('filter-active');
            }
            updateFilters();
        });
    });

    // Fungsi untuk memperbarui marker di map dan sidebar
    function updateFilters() {
        markerGroup.clearLayers();
        const sidebarItems = listEl.children;

        let activeCount = 0;

        lokasiData.forEach((lokasi, i) => {
            const isVisible = activeCategories.has(lokasi.kategori);
            
            // Tampilkan / Sembunyikan marker di peta
            if (isVisible) {
                markerGroup.addLayer(markers[i]);
                activeCount++;
            }
            
            // Tampilkan / Sembunyikan item di sidebar
            if (sidebarItems[i]) {
                sidebarItems[i].style.display = isVisible ? 'flex' : 'none';
            }
        });
        
        // Paskan view kamera peta dengan bounds lokasi yang baru
        if (activeCount > 0 && markerGroup.getLayers().length > 0) {
            map.flyToBounds(markerGroup.getBounds().pad(0.15), { duration: 0.5 });
        }
    }

});