/*
Copyright 2021 Google LLC
Licensed under the Apache License, Version 2.0 (the "License");
*/

const cacheName = 'cache-v1';

const precacheResources = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/js/main.js',
  '/js/app/editor.js',
  '/js/app/menu.js',
  '/images/logo.svg',
  '/manifest.json',
  '/js/lib/actions.js',
];

// install: 파일들을 미리 캐시에 저장
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources))
  );
});

// activate: (필요하면 여기서 오래된 캐시 삭제 가능)
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/@vite/')) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cached) => {
        return cached || new Response('', {
          headers: { 'Content-Type': 'application/javascript' },
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).catch(async () => {
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
