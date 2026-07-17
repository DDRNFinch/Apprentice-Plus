"use strict";
const CACHE_NAME="apprenticeship-plus-bench-page-selection-header-fix-v1";
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
 const cssFiles=[
  './professional-navigation.css?v=polished-1',
  './page-refinement.css?v=selection-fix-1'
 ];
 cssFiles.forEach(function(href){
  if(!document.querySelector('link[href^="'+href.split('?')[0]+'"]')){
   const link=document.createElement('link');
   link.rel='stylesheet';link.href=href;document.head.appendChild(link);
  }
 });
 ['./professional-navigation.js?v=polished-1','./page-refinement.js?v=selection-fix-1'].forEach(function(src){
  const script=document.createElement('script');
  script.src=src;script.defer=true;document.head.appendChild(script);
 });
})();`;
      return new Response(source+loader,{
       headers:{"Content-Type":"application/javascript; charset=utf-8"}
      });
    })
    .catch(()=>caches.match(event.request))
  );
  return;
 }

 const fresh=/\/courses\/bench\/(?:$|index\.html$|professional-navigation\.(?:js|css)$|page-refinement\.(?:js|css)$|workbench-data\.js$|workbench\.js$|assignment-pdf\.js$|trade-logo\.png$|manifest\.json$)/.test(url.pathname);
 if(fresh){
  event.respondWith(fetch(event.request,{cache:"no-store"})
   .then(response=>{
    const copy=response.clone();
    caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
    return response;
   }).catch(()=>caches.match(event.request)));
 }else{
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
 }
});