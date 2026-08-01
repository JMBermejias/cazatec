const CACHE_NAME = 'cazatec-v13';
const BASE = new URL('.', self.location.href).pathname;
const ASSETS = [
    BASE + 'index.html',
    BASE + 'styles.css',
    BASE + 'app.js',
    BASE + 'db.js',
    BASE + 'manifest.json',
    BASE + 'icon-192.png',
    BASE + 'icon-512.png',
    BASE + 'vendor/leaflet/leaflet.css',
    BASE + 'vendor/leaflet/leaflet.js',
    BASE + 'vendor/leaflet/images/layers.png',
    BASE + 'vendor/leaflet/images/layers-2x.png',
    BASE + 'vendor/leaflet/images/marker-icon.png',
    BASE + 'vendor/leaflet/images/marker-icon-2x.png',
    BASE + 'vendor/leaflet/images/marker-shadow.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        ).then(() => self.clients.matchAll()).then((clients) => {
            clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    if (url.pathname.endsWith('/sw.js') || url.pathname.endsWith('sw.js')) {
        event.respondWith(
            fetch(event.request, { cache: 'no-store' }).then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return response;
            }).catch(() => caches.match(event.request))
        );
        return;
    }

    if (url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname === BASE || url.pathname === BASE.slice(0, -1)) {
        event.respondWith(
            fetch(event.request, { cache: 'no-store' }).then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => caches.match(event.request).then((c) => c || new Response('Offline', { status: 503 })))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((response) => {
                if (response.ok && event.request.url.startsWith('http')) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => new Response('', { status: 503 }));
        })
    );
});
