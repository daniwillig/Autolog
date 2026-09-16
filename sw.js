const CACHE_NAME = 'autolog-v2';

// Arquivos locais que precisam funcionar offline
const LOCAL_ASSETS = [
  './',
  './index.html',
  './app.jsx',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// CDNs externos (React, Babel, Inter font)
const CDN_ASSETS = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
];

// ── Install: pré-cacheia tudo ────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cacheia locais (crítico — falha se algum não existir)
      return cache.addAll(LOCAL_ASSETS)
        .then(() =>
          // Cacheia CDNs individualmente (não crítico — ignora falhas)
          Promise.allSettled(
            CDN_ASSETS.map(url =>
              fetch(url, { mode: 'cors' })
                .then(res => { if (res.ok) cache.put(url, res); })
                .catch(() => {})
            )
          )
        );
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: limpa caches antigos ──────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first para assets, network-first para navegação ─────────────
self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignora requisições não-GET
  if (request.method !== 'GET') return;

  // Ignora extensões de browser e chrome-extension://
  if (!request.url.startsWith('http')) return;

  // Navegação/HTML: network-first, para sempre pegar a versão mais nova
  // publicada (o app inteiro mora no index.html, então cache-first aqui
  // travaria os usuários numa versão antiga até um bump manual de cache).
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Demais assets (CDNs, ícones etc.): cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          // Só cacheia respostas válidas
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => {});
    })
  );
});
