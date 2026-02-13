import { warmStrategyCache, offlineFallback } from "workbox-recipes";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

// 1) Page cache (Cache First)
const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60 }), // 30일
  ],
});

// /, /index.html 미리 캐싱(설치 시점에 warm)
warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

// navigate 요청(페이지 이동)은 pageCache로 처리
registerRoute(({ request }) => request.mode === "navigate", pageCache);

// 2) Asset cache (SWR)
registerRoute(
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "asset-cache",
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// 3) Offline fallback
offlineFallback({
  pageFallback: "/offline.html",
});
