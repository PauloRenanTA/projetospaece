const CACHE_NAME = 'spaece-cache-v1';
const assets = [
  'index.html',
  'style.css',
  'app.js',
  'app.json',
  'icone.jpg'
];

// Instala o Service Worker e guarda os arquivos essenciais no cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Ativa o Service Worker
self.addEventListener('activate', e => {
  console.log('Service Worker ativo!');
});

// Faz o app carregar os arquivos do cache se estiver offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});