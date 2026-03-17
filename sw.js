const CACHE_NAME = 'djkridp-v2';
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

// 網路事件 - 網路策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 快取命中 - 返回快取資源
        if (response) {
          return response;
        }

        // 快取未命中 - 網路到網路
        return fetch(event.request).catch(() => {
          // 網路失敗 - 返回離線頁面（如果是 HTML 請求）
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
