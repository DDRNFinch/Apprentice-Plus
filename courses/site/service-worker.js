"use strict";
const CACHE_NAME="apprenticeship-plus-site-bench-matching-navigation-v1";
const APP_FILES=[
 "./","./index.html","./app.js","./professional-navigation.js",
 "./professional-navigation.css","./workbench-data.js","./workbench.js",
 "./assignment-pdf.js","./register-service-worker.js","./manifest.json",
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

 if(url.pathname.endsWith("/courses/site/app.js")){
  event.respondWith(
   fetch(event.request,{cache:"no-store"})
    .then(response=>response.text())
    .then(source=>{
      const loader=`
;(function(){
 if(!document.querySelector('link[data-ap-professional-navigation]')){
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='./professional-navigation.css?v=bench-match-1';
  link.dataset.apProfessionalNavigation='true';
  document.head.appendChild(link);
 }
 const script=document.createElement('script');
 script.src='./professional-navigation.js?v=bench-match-1';
 script.defer=true;
 document.head.appendChild(script);
})();`;
      return new Response(source+loader,{
       headers:{"Content-Type":"application/javascript; charset=utf-8"}
      });
    })
    .catch(()=>caches.match(event.request))
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