self.addEventListener('install', e => {
  e.waitUntil(
    
    caches.open('era-cache').then(cache => {
      return cache.addAll([
        
        './J3.html',
        './Imagenes1/8493053.webp',
        './Imagenes1/ovejas2.webp',
        'Imagenes1/8001320.png',
        'Imagenes1/8344917.png',
        'Imagenes1/gamed.webp',
        'Imagenes1/simple-video-library-icon-sign-design-free-png.webp'
        // Agrega aquí más archivos si los tienes (CSS, JS, sonidos, etc.)
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});

