if (!window.semuaLokasi) window.semuaLokasi = [];

const lokasiDea = [
 // SD
  { nama: "SD Negeri 1 Banda Aceh", lat: 5.5528423, lng: 95.3130464, mapsUrl: "https://www.google.com/maps?q=5.5528423,95.3130464" },
  { nama: "SD Negeri 2 Banda Aceh", lat: 5.5523193, lng: 95.311225, mapsUrl: "https://www.google.com/maps?q=5.5523193,95.311225" },
  { nama: "SD Negeri 3 Banda Aceh", lat: 5.5513045, lng: 95.32135, mapsUrl: "https://www.google.com/maps?q=5.5513045,95.32135" },
  { nama: "SD Negeri 20 Banda Aceh", lat: 5.5620988, lng: 95.323291, mapsUrl: "https://www.google.com/maps?q=5.5620988,95.323291" },
  { nama: "SD Negeri 22 Banda Aceh", lat: 5.5448171, lng: 95.317686, mapsUrl: "https://www.google.com/maps?q=5.5448171,95.317686" },
  { nama: "SD Negeri 40 Banda Aceh", lat: 5.5453513, lng: 95.3199778, mapsUrl: "https://www.google.com/maps?q=5.5453513,95.3199778" },
  
  // SMP
  { nama: "SMP Negeri 1 Banda Aceh", lat: 5.5521015, lng: 95.3127823, mapsUrl: "https://www.google.com/maps?q=5.5521015,95.3127823" },
  { nama: "SMP Negeri 3 Banda Aceh", lat: 5.5447399, lng: 95.3182964, mapsUrl: "https://www.google.com/maps?q=5.5447399,95.3182964" },
  { nama: "SMP Negeri 4 Banda Aceh", lat: 5.5612765, lng: 95.3201194, mapsUrl: "https://www.google.com/maps?q=5.5612765,95.3201194" },
  { nama: "SMP Negeri 7 Banda Aceh", lat: 5.5334682, lng: 95.3088112, mapsUrl: "https://www.google.com/maps?q=5.5334682,95.3088112" },
  { nama: "SMP Negeri 17 Banda Aceh", lat: 5.5484843, lng: 95.3137686, mapsUrl: "https://www.google.com/maps?q=5.5484843,95.3137686" },
  
  // SMA
  { nama: "SMA Negeri 1 Banda Aceh", lat: 5.5513700, lng: 95.3124848, mapsUrl: "https://www.google.com/maps?q=5.5513700,95.3124848" },
  { nama: "SMA Negeri 3 Banda Aceh", lat: 5.5610931, lng: 95.3317178, mapsUrl: "https://www.google.com/maps?q=5.5610931,95.3317178" },
  { nama: "SMA Negeri 4 Banda Aceh", lat: 5.566026, lng: 95.34313, mapsUrl: "https://www.google.com/maps?q=5.566026,95.34313" },
  { nama: "SMA Negeri 7 Banda Aceh", lat: 5.535039, lng: 95.30861, mapsUrl: "https://www.google.com/maps?q=5.535039,95.30861" },
  { nama: "SMA Negeri 9 Banda Aceh", lat: 5.5250349, lng: 95.3250647, mapsUrl: "https://www.google.com/maps?q=5.5250349,95.3250647" },
  
  // SMK
  { nama: "SMK Negeri 1 Banda Aceh", lat: 5.5217641, lng: 95.3207916, mapsUrl: "https://maps.app.goo.gl/B9WSRg7kUAd4eHUw8" },
  { nama: "SMK Negeri 2 Banda Aceh", lat: 5.5223511, lng: 95.3200010, mapsUrl: "https://www.google.com/maps?q=5.5223511,95.3200010" },
  { nama: "SMK Negeri 3 Banda Aceh", lat: 5.5229381, lng: 95.3204875, mapsUrl: "https://www.google.com/maps?q=5.5229381,95.3204875" },
  
  // MAN
  { nama: "MAN Model Banda Aceh", lat: 5.562461, lng: 95.329809, mapsUrl: "https://www.google.com/maps?q=5.562461,95.329809" },
  { nama: "MAN 2 Banda Aceh", lat: 5.5308130, lng: 95.2980380, mapsUrl: "https://www.google.com/maps?q=5.5308130,95.2980380" },
  { nama: "MAN Rukoh Banda Aceh", lat: 5.5808476, lng: 95.3636452, mapsUrl: "https://www.google.com/maps?q=5.5808476,95.3636452" },
];

window.lokasiDea = lokasiDea;
window.semuaLokasi.push(...lokasiDea);