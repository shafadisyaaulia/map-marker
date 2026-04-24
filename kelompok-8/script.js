document.addEventListener('DOMContentLoaded', function() {

    // 1. Definisikan Berbagai Jenis Peta (Basemaps)
    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // 2. Inisialisasi Peta
    // Atur peta agar dimulai dengan tampilan 'streets'
    const map = L.map('map', {
        layers: [streets] // Peta default saat pertama kali dimuat
    });

    // 3. Menambahkan Marker dan Membuat Grup
    const markerGroup = L.featureGroup(); // Grup untuk menampung semua marker

    lokasiMaulizar.forEach(lokasi => {
        const marker = L.marker([lokasi.lat, lokasi.lng]);
        
        // Membuat konten HTML untuk popup yang lebih kaya
        const popupContent = `
            <h3>${lokasi.nama}</h3>
            <p>Koordinat: ${lokasi.lat.toFixed(5)}, ${lokasi.lng.toFixed(5)}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=${lokasi.lat},${lokasi.lng}" target="_blank">Lihat di Google Maps</a>
        `;
        
        // Ikat popup ke marker dengan kelas CSS kustom
        marker.bindPopup(popupContent, { className: 'custom-popup' });

        // Tambahkan marker ke grup
        markerGroup.addLayer(marker);
    });

    // Tambahkan grup marker ke peta
    markerGroup.addTo(map);

    // 4. Mengatur Tampilan Awal Peta
    // Peta akan otomatis zoom dan pan agar semua marker terlihat
    map.fitBounds(markerGroup.getBounds().pad(0.1)); // pad(0.1) memberi sedikit padding

    // 5. Menambahkan Kontrol Peta
    // Kontrol untuk memilih jenis peta
    const baseMaps = {
        "Streets": streets,
        "Satellite": satellite,
        "Dark Mode": dark
    };
    L.control.layers(baseMaps).addTo(map);

    // Kontrol skala peta (di pojok kiri bawah)
    L.control.scale({ imperial: false }).addTo(map);

    // 6. Fungsionalitas Tombol Reset Tampilan
    const resetZoomBtn = document.getElementById('reset-zoom-btn');
    resetZoomBtn.addEventListener('click', () => {
        // Kembalikan tampilan agar semua marker pas di layar
        map.fitBounds(markerGroup.getBounds().pad(0.1));
    });

});