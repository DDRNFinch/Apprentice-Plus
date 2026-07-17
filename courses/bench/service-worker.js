"use strict";
const CACHE_NAME="apprenticeship-plus-bench-remove-workbench-v1";
const APP_FILES=[
 "./","./index.html","./app.js",
 "./professional-navigation.js","./professional-navigation.css",
 "./remove-workbench.js",
 "./workbench-data.js","./workbench.js","./assignment-pdf.js",
 "./register-service-worker.js","./manifest.json",
 "./trade-logo.png","./icon-192.png","./icon-512.png"
];

self.addEventListener("install",event=>{
 event.waitUntil(
  caches.open(CACHE_NAME)
   .then(cache=>cache.addAll(APP_FILES))
   .then(()=>self.skipWaiting())
 );
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
 if(!document.querySelector('link[data-ap-professional-navigation]')){
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='./professional-navigation.css?v=remove-workbench-1';
  link.dataset.apProfessionalNavigation='true';
  document.head.appendChild(link);
 }
 [
  ['./professional-navigation.js?v=remove-workbench-1','apProfessionalNavigation'],
  ['./remove-workbench.js?v=1','apRemoveWorkbench']
 ].forEach(function(item){
  if(!document.querySelector('script[data-'+item[1].replace(/[A-Z]/g,m=>'-'+m.toLowerCase())+']')){
   const script=document.createElement('script');
   script.src=item[0];
   script.defer=true;
   script.dataset[item[1]]='true';
   document.head.appendChild(script);
  }
 });
})();`;
      return new Response(source+loader,{
       headers:{"Content-Type":"application/javascript; charset=utf-8","Cache-Control":"no-store"}
      });
    })
    .catch(()=>caches.match(event.request))
  );
  return;
 }

 const alwaysFresh =
  url.pathname.endsWith("/courses/bench/professional-navigation.js") ||
  url.pathname.endsWith("/courses/bench/professional-navigation.css") ||
  url.pathname.endsWith("/courses/bench/remove-workbench.js") ||
  url.pathname.endsWith("/courses/bench/index.html");

 if(alwaysFresh){
  event.respondWith(
   fetch(event.request,{cache:"no-store"})
    .then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
      return response;
    })
    .catch(()=>caches.match(event.request))
  );
 }else{
  event.respondWith(
   caches.match(event.request).then(cached=>cached||fetch(event.request))
  );
 }
});