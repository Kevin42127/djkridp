const CACHE_NAME = 'djkridp-v4'; // 更新版本號強制清除舊快取
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

// 安裝事件 - 緩存資源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All resources cached');
        self.skipWaiting(); // 立即激活新的 service worker
      })
  );
});

// 激活事件 - 清理舊緩存
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

// 網路事件 - 智能快取策略
self.addEventListener('fetch', event => {
  // 對於 HTML 檔案，使用網路優先確保最新版本
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 網路成功，更新快取
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // 網路失敗，使用快取
          return caches.match(event.request);
        })
    );
    return;
  }

  // 對於 CSS/JS 檔案，使用快取優先但檢查更新
  if (event.request.url.includes('/css/') || event.request.url.includes('/js/')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          // 先嘗試網路檢查是否有更新
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              // 網路成功，更新快取
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
              return networkResponse;
            })
            .catch(() => {
              // 網路失敗，使用快取
              return cachedResponse;
            });

          // 如果有快取，先返回快取，背景更新
          if (cachedResponse) {
            // 背景檢查更新
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

          // 沒有快取，等待網路
          return fetchPromise;
        })
    );
    return;
  }

  // 其他資源使用原來的網路優先策略
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

// 後台消息處理
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
