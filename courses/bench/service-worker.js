"use strict";
const CACHE_NAME="apprenticeship-plus-bench-section-grid-force-v4";
const APP_FILES=[
 "./","./index.html","./app.js",
 "./professional-navigation.js","./professional-navigation.css",
 "./remove-workbench.js","./modern-dashboard.js","./modern-dashboard.css",
 "./section-grid-force-fix.js","./section-grid-force-fix.css",
 "./register-service-worker.js","./manifest.json",
 "./trade-logo.png","./icon-192.png","./icon-512.png"
];

self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
 event.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET") return;
 const url=new URL(event.request.url);

 if(url.pathname.endsWith("/courses/bench/app.js")){
  event.respondWith(
   fetch(event.request,{cache:"no-store"})
    .then(response=>response.text())
    .then(source=>{
      const loader=`
;(function(){
 var styles=[
  './professional-navigation.css?v=4',
  './modern-dashboard.css?v=4',
  './section-grid-force-fix.css?v=4'
 ];
 var scripts=[
  './professional-navigation.js?v=4',
  './remove-workbench.js?v=4',
  './modern-dashboard.js?v=4',
  './section-grid-force-fix.js?v=4'
 ];
 styles.forEach(function(href){
  var base=href.split('?')[0];
  if(!document.querySelector('link[href^="'+base+'"]')){
   var link=document.createElement('link');
   link.rel='stylesheet';link.href=href;document.head.appendChild(link);
  }
 });
 scripts.forEach(function(src){
  var base=src.split('?')[0];
  if(!document.querySelector('script[src^="'+base+'"]')){
   var script=document.createElement('script');
   script.src=src;script.defer=true;document.head.appendChild(script);
  }
 });
})();`;
      return new Response(source+loader,{
       headers:{
        "Content-Type":"application/javascript; charset=utf-8",
        "Cache-Control":"no-store, no-cache, must-revalidate"
       }
      });
    })
    .catch(()=>caches.match(event.request))
  );
  return;
 }

 const forceFresh=
  url.pathname.endsWith("/courses/bench/index.html") ||
  url.pathname.endsWith("/courses/bench/section-grid-force-fix.js") ||
  url.pathname.endsWith("/courses/bench/section-grid-force-fix.css") ||
  url.pathname.endsWith("/courses/bench/modern-dashboard.js") ||
  url.pathname.endsWith("/courses/bench/modern-dashboard.css") ||
  url.pathname.endsWith("/courses/bench/professional-navigation.js") ||
  url.pathname.endsWith("/courses/bench/professional-navigation.css");

 event.respondWith(
  (forceFresh
   ? fetch(event.request,{cache:"no-store"}).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
      return response;
     })
   : caches.match(event.request).then(cached=>cached||fetch(event.request))
  ).catch(()=>caches.match(event.request))
 );
});