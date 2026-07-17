"use strict";
const CACHE_NAME="apprenticeship-plus-bench-navigation-page-header-corrected-v1";
const APP_FILES=[
 "./","./index.html","./app.js",
 "./professional-navigation.js","./professional-navigation.css",
 "./page-refinement.js","./page-refinement.css",
 "./workbench-data.js","./workbench.js","./assignment-pdf.js",
 "./register-service-worker.js","./manifest.json",
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

 if(url.pathname.endsWith("/courses/bench/app.js")){
  event.respondWith(
   fetch(event.request,{cache:"no-store"})
    .then(response=>response.text())
    .then(source=>{
      const loader=`
;(function(){
 ['./professional-navigation.css?v=corrected-1','./page-refinement.css?v=corrected-1'].forEach(function(href){
  if(!document.querySelector('link[href^="'+href.split('?')[0]+'"]')){
   const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);
  }
 });
 ['./professional-navigation.js?v=corrected-1','./page-refinement.js?v=corrected-1'].forEach(function(src){
  const script=document.createElement('script');script.src=src;script.defer=true;document.head.appendChild(script);
 });
})();`;
      return new Response(source+loader,{headers:{"Content-Type":"application/javascript; charset=utf-8"}});
    })
    .catch(()=>caches.match(event.request))
  );
  return;
 }

 const fresh=/\/courses\/bench\/(?:$|index\.html$|professional-navigation\.(?:js|css)$|page-refinement\.(?:js|css)$|workbench-data\.js$|workbench\.js$|assignment-pdf\.js$|trade-logo\.png$|manifest\.json$)/.test(url.pathname);
 event.respondWith(
  (fresh
    ? fetch(event.request,{cache:"no-store"})
    : caches.match(event.request).then(cached=>cached||fetch(event.request))
  ).catch(()=>caches.match(event.request))
 );
});