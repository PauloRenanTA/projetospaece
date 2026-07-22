const CACHE_NAME = 'spaece-app-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/manifest.json',
  '/imagens/icone.jpg',
  '/imagens/gato.jpg' // Adicione aqui os caminhos de novas imagens que cadastrar
];

// Instala o Service Worker e guarda os arquivos no cache físico
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Arquivos de simulação guardados offline!');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativa o Worker e remove caches antigos se houver atualização
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta as requisições: tenta ler do cache primeiro para funcionar offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
