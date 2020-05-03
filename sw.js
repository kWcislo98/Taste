const staticCacheName = "site-static-v1";
const assets = [
  "/",
  "index.html",
  "/scripts/app.js",
  "scripts/auth.js",
  "scripts/index.js",
  "styles.css",
  "logo.png",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js",
  "https://code.jquery.com/jquery-3.3.1.slim.min.js",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
];
// install
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
// deletes unused cache versions
self.addEventListener("activate", (e) => {
  console.log("service worker activated");
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

//fetch
self.addEventListener("fetch", (e) => {
  if (e.request.url.indexOf("firestore.googleapis.com") === -1) {
    e.respondWith(
      caches.match(e.request).then((cacheRes) => {
        return cacheRes || fetch(e.request);
      })
    );
  }
});
