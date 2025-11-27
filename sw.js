const CACHE_NAME = 'subtitle-ai-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

// Activate Event
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
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    // Network first for API calls or CDNs, cache first for local assets
    if (event.request.url.includes('googleapis') || event.request.url.includes('openrouter')) {
        return; // Let browser handle API calls
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});