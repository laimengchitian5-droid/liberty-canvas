const CACHE_VERSION = "libertycanvas-v6";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const STATIC_ASSET_URLS = [
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icons/favicon-48.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon.svg",
  "/icons/maskable-icon.svg",
  "/icons/brands/liberty-plug.svg",
  "/icons/brands/liberty-play.svg",
  "/icons/brands/liberty-discover.svg",
  "/icons/brands/liberty-forge.svg",
  "/icons/brands/liberty-runtime.svg",
  "/icons/apple-touch-icon.svg",
];

function shouldBypassServiceWorker(request) {
  if (request.method !== "GET") {
    return true;
  }

  // Next.js App Router flight / prefetch / server-action requests must not be cached.
  if (request.headers.get("RSC") === "1") {
    return true;
  }

  if (request.headers.get("Next-Router-Prefetch") === "1") {
    return true;
  }

  if (request.headers.get("Next-Router-State-Tree")) {
    return true;
  }

  if (request.headers.get("Next-Action")) {
    return true;
  }

  const url = new URL(request.url);

  if (url.searchParams.has("_rsc")) {
    return true;
  }

  return false;
}

async function precacheRequest(cache, url) {
  try {
    const response = await fetch(url, { credentials: "same-origin" });

    if (response.ok) {
      await cache.put(url, response);
    }
  } catch (error) {
    console.warn("[sw] precache failed:", url, error);
  }
}

async function precacheStaticAssets() {
  const cache = await caches.open(STATIC_CACHE);
  await Promise.all(STATIC_ASSET_URLS.map((asset) => precacheRequest(cache, asset)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheStaticAssets().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                (key.startsWith("personality-quiz-") ||
                  key.startsWith("libertycanvas-") ||
                  key.startsWith("rubelcanvas-v")) &&
                key !== STATIC_CACHE &&
                key !== RUNTIME_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAssetRequest(request) {
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return false;
  }

  return (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname === "/manifest.webmanifest"
  );
}

function offlineResponse() {
  return new Response(
    '<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>Offline</title></head><body><main><h1>Offline</h1><p>Reconnect and reload LibertyCanvas.</p></main></body></html>',
    {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cached = await cache.match(request);
    return cached ?? offlineResponse();
  }
}

function isResultPageRequest(url) {
  return /^\/diagnosis\/play\/[^/]+\/result\/?$/.test(url.pathname);
}

async function serveNavigation(request) {
  if (isResultPageRequest(new URL(request.url))) {
    return networkFirst(request, RUNTIME_CACHE);
  }

  return networkFirst(request, STATIC_CACHE);
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (shouldBypassServiceWorker(request)) {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    return;
  }

  if (isStaticAssetRequest(request)) {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(serveNavigation(request));
  }
});
