"use strict";
const CACHE_NAME="apprenticeship-plus-site-professional-navigation-v2";
const APP_FILES=["./","./index.html","./app.js","./professional-navigation.js","./professional-navigation.css","./workbench-data.js","./workbench.js","./assignment-pdf.js","./register-service-worker.js","./manifest.json","./trade-logo.png","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const u=new URL(e.request.url);
 if(u.pathname.endsWith("/courses/site/app.js")){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>r.text()).then(source=>{
   const loader=`;(function(){
    if(!document.querySelector('link[data-ap-professional-navigation]')){
     const l=document.createElement('link');l.rel='stylesheet';l.href='./professional-navigation.css?v=2';l.dataset.apProfessionalNavigation='true';document.head.appendChild(l);
    }
    const s=document.createElement('script');s.src='./professional-navigation.js?v=2';s.defer=true;document.head.appendChild(s);
   })();`;
   return new Response(source+loader,{headers:{"Content-Type":"application/javascript; charset=utf-8"}});
  }).catch(()=>caches.match(e.request)));
  return;
 }
 const fresh=/professional-navigation\.(?:js|css)$/.test(u.pathname);
 e.respondWith((fresh?fetch(e.request,{cache:"no-store"}):caches.match(e.request).then(c=>c||fetch(e.request))).catch(()=>caches.match(e.request)));
});