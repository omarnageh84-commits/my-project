const CACHE = 'omar-v2';
const ASSETS = ['./','./index.html','./home.html','./daily.html','./attendance.html','./tasks.html','./manifest.json'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(cached=>{
      return cached || fetch(e.request).then(res=>{
        return caches.open(CACHE).then(cache=>{
          cache.put(e.request, res.clone());
          return res;
        });
      }).catch(()=>caches.match('./index.html'));
    })
  );
});