"use strict";

const CACHE_NAME = "apprenticeship-plus-pmo-course-v3";

const APP_FILES = [
  "./",
  "./index.html",
  "./app.js",
  "./workbench-data.js",
  "./workbench.js",
  "./assignment-pdf.js",
  "./register-service-worker.js",
  "./manifest.json",
  "./trade-logo.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const networkFirst =
    url.pathname.endsWith("/courses/pmo/") ||
    url.pathname.endsWith("/courses/pmo/index.html") ||
    url.pathname.endsWith("/courses/pmo/app.js") ||
    url.pathname.endsWith("/courses/pmo/trade-logo.png") ||
    url.pathname.endsWith("/courses/pmo/icon-192.png") ||
    url.pathname.endsWith("/courses/pmo/icon-512.png");

  if (networkFirst) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }))
  );
});
