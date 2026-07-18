"use strict";
const CACHE="apprenticeship-plus-main-install-prompt-v2";
const CORE=["./","./index.html","./app.js","./manifest.json","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./course-bridge.js","./install-apprenticeship-plus.js","./install-apprenticeship-plus.css","./install-course-option.js","./install-course-option.css"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const url=new URL(e.request.url);
 const rootPage=url.pathname.endsWith("/Apprentice-Plus/")||url.pathname.endsWith("/Apprentice-Plus/index.html");
 if(rootPage){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>r.text()).then(html=>{
   const tags='<link rel="stylesheet" href="./install-apprenticeship-plus.css?v=2"><script defer src="./install-apprenticeship-plus.js?v=2"></scr'+'ipt>';
   if(!html.includes("install-apprenticeship-plus.js"))html=html.replace("</head>",tags+"</head>");
   return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}});
  }).catch(()=>caches.match("./index.html")));
  return;
 }
 e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request).then(r=>{const y=r.clone();caches.open(CACHE).then(c=>c.put(e.request,y));return r})));
});