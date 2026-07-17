"use strict";
const CACHE_NAME="apprenticeship-plus-brick-bench-matching-navigation-v1";
const APP_FILES=[
 "./","./index.html","./professional-navigation.js",
 "./professional-navigation.css","./manifest.json",
 "./trade-logo.png","./icon-192.png","./icon-512.png"
];

self.addEventListener("install",event=>event.waitUntil(
 caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting())
));

self.addEventListener("activate",event=>event.waitUntil(
 caches.keys().then(keys=>Promise.all(
  keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))
 )).then(()=>self.clients.claim())
));

self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET") return;
 const url=new URL(event.request.url);

 if(url.pathname.endsWith("/courses/brick/") || url.pathname.endsWith("/courses/brick/index.html")){
  event.respondWith(
   fetch(event.request,{cache:"no-store"})
    .then(response=>response.text())
    .then(html=>{
      const loader='<link rel="stylesheet" href="./professional-navigation.css?v=bench-match-1"><script defer src="./professional-navigation.js?v=bench-match-1"></script>';
      if(!html.includes("professional-navigation.js")) html=html.replace("</head>",loader+"</head>");
      return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8"}});
    })
    .catch(()=>caches.match("./index.html"))
  );
  return;
 }

 const fresh=/professional-navigation\.(?:js|css)$/.test(url.pathname);
 event.respondWith(
  (fresh
    ? fetch(event.request,{cache:"no-store"})
    : caches.match(event.request).then(cached=>cached||fetch(event.request))
  ).catch(()=>caches.match(event.request))
 );
});