// Canvia VERSIO cada vegada que actualitzis l’app perquè tothom rebi la nova versió
const VERSIO = "gim-v1";
const FITXERS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSIO).then(c => c.addAll(FITXERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSIO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Primer xarxa (per veure les actualitzacions) i, si no hi ha connexió, la còpia guardada
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const c = r.clone();
      caches.open(VERSIO).then(ca => ca.put(e.request, c));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
