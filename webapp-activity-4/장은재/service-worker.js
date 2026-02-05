import { warmStrategyCache, offlineFallback } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// HTML 페이지 캐시 설정
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200], // 정상 응답(200)만 캐시
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 최대 30일까지만 보관
    }),
  ],
});

// 서비스워커 처음 설치할 때 메인 페이지 미리 캐시에 저장
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// 페이지 이동 요청은 HTML 캐시로 처리
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// 정적 파일(css, js) 캐시 설정
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// 오프라인일 때 보여줄 페이지 설정
offlineFallback({
  pageFallback: '/offline.html',
});
