// 서비스 워커에서 사용할 캐시 이름
const cacheName = 'cache-v1';

// 오프라인에서 사용할 정적 파일 목록
const precacheResources = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/app/editor.js',
  '/js/app/menu.js', // codelab에 없어서 추가함
  '/js/lib/actions.js',
];

// 서비스 워커 설치: precacheResources에 있는 파일들을 캐시에 미리 저장
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

// 서비스 워커 활성화
self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

// 네트워크 요청 처리: 캐시 우선, 없으면 네트워크 요청
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // 캐시에 있으면 캐시 응답
      }
      return fetch(event.request); // 캐시에 없으면 네트워크 요청
    }),
  );
});
