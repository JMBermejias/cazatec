const CACHE_NAME = 'cazatec-v8';
const BASE = self.location.pathname.replace(/\/[^/]*$/, '/');
const ASSETS = [
    BASE + 'index.html',
    BASE + 'styles.css',
    BASE + 'app.js',
    BASE + 'firebase-config.js',
    BASE + 'manifest.json',
    BASE + 'icon-192.png',
    BASE + 'icon-512.png'
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

    event.respondWith(
        fetch(event.request).then((response) => {
            if (response.ok) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
        }).catch(() => {
            return caches.match(event.request).then((cached) => {
                return cached || new Response('Offline', { status: 503 });
            });
        })
    );
});
