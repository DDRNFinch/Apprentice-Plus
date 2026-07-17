"use strict";
const CACHE_NAME="apprenticeship-plus-brick-professional-navigation-v2";
const APP_FILES=["./","./index.html","./professional-navigation.js","./professional-navigation.css","./manifest.json","./trade-logo.png","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const u=new URL(e.request.url);
 if(u.pathname.endsWith("/courses/brick/")||u.pathname.endsWith("/courses/brick/index.html")){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>r.text()).then(html=>{
   const loader='<link rel="stylesheet" href="./professional-navigation.css?v=2"><script defer src="./professional-navigation.js?v=2"></script>';
   if(!html.includes("professional-navigation.js")) html=html.replace("</head>",loader+"</head>");
   return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8"}});
  }).catch(()=>caches.match("./index.html")));
  return;
 }
 const fresh=/professional-navigation\.(?:js|css)$/.test(u.pathname);
 e.respondWith((fresh?fetch(e.request,{cache:"no-store"}):caches.match(e.request).then(c=>c||fetch(e.request))).catch(()=>caches.match(e.request)));
});