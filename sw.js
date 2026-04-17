const CACHE_NAME = 'djkridp-v4'; // Versionsnummer aktualisiert, um alten Cache zu löschen
const urlsToCache = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/global.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/navigation.js',
  '/js/animations.js',
  '/js/scroll-progress.js',
  '/js/ai-chat.js',
  '/js/twitch-status.js',
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/favicon-96x96.png',
  '/images/apple-touch-icon.png',
  '/images/phone.png',
  '/images/pc.png',
  '/images/offline.jpg',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/images/site.webmanifest'
];

// Installationsereignis - Ressourcen zwischenspeichern
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Alle Ressourcen zwischengespeichert');
        self.skipWaiting(); // Neuen Service Worker sofort aktivieren
      })
  );
});

// Aktivierungsereignis - Alte Cache leeren
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Old caches deleted');
      return self.clients.claim();
    })
  );
});

// Netzwerkereignis - Intelligente Cache-Strategie
self.addEventListener('fetch', event => {
  // Für HTML-Dateien Netzwerk-Priorität verwenden, um neueste Version sicherzustellen
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Netzwerk erfolgreich, Cache aktualisieren
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // Netzwerk fehlgeschlagen, Cache verwenden
          return caches.match(event.request);
        })
    );
    return;
  }

  // Für CSS/JS-Dateien Cache-Priorität verwenden, aber auf Updates prüfen
  if (event.request.url.includes('/css/') || event.request.url.includes('/js/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // Zuerst Netzwerk prüfen, ob Updates verfügbar sind
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // Netzwerk erfolgreich, Cache aktualisieren
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
              return networkResponse;
            })
            .catch(() => {
              // Netzwerk fehlgeschlagen, Cache verwenden
              return cachedResponse;
            });

          // Wenn Cache vorhanden, zuerst zurückgeben und im Hintergrund aktualisieren
          if (cachedResponse) {
            // Im Hintergrund auf Updates prüfen
            fetch(event.request)
              .then(networkResponse => {
                if (networkResponse.ok) {
                  caches.open(CACHE_NAME)
                    .then(cache => {
                      cache.put(event.request, networkResponse);
                    });
                }
              });
            return cachedResponse;
          }

          // Kein Cache vorhanden, auf Netzwerk warten
          return fetchPromise;
        })
    );
    return;
  }

  // Andere Ressourcen verwenden ursprüngliche Netzwerk-First-Strategie
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Hintergrund-Nachrichtenverarbeitung
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
