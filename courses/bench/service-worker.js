"use strict";
const CACHE_NAME="apprenticeship-plus-bench-main-install-v16";
const APP_FILES=[
 "./","./index.html","./app.js",
 "./professional-navigation.js","./professional-navigation.css",
 "./remove-workbench.js","./modern-dashboard.js","./modern-dashboard.css",
 "./section-grid-force-fix.js","./section-grid-force-fix.css",
 "./section-grid-cleanup.js","./section-grid-cleanup.css",
 "./portfolio-blank-fix.js","./portfolio-blank-fix.css","./legacy-home-cleanup.js","./legacy-home-cleanup.css","./remove-old-home.js","./remove-old-home.css","./remove-smart-reminders.css","./local-reminders.js","./local-reminders.css","./replace-home.js","./replace-home.css","./first-login-setup.js","./first-login-setup.css",
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
  '../../install-course-option.css?v=16',
  './replace-home.css?v=12','./first-login-setup.css?v=12',
  './remove-old-home.css?v=10',
  './remove-smart-reminders.css?v=10',
  './remove-old-home.css?v=9',
  './legacy-home-cleanup.css?v=8','./local-reminders.css?v=13',
  './professional-navigation.css?v=6',
  './modern-dashboard.css?v=6',
  './section-grid-force-fix.css?v=6',
  './section-grid-cleanup.css?v=6',
  './portfolio-blank-fix.css?v=6'
 ];
 var scripts=[
  '../../install-course-option.js?v=16',
  './replace-home.js?v=12','./first-login-setup.js?v=13',
  './remove-old-home.js?v=10',
  './remove-old-home.js?v=9',
  './legacy-home-cleanup.js?v=8','./local-reminders.js?v=13',
  './professional-navigation.js?v=6',
  './remove-workbench.js?v=6',
  './modern-dashboard.js?v=6',
  './section-grid-force-fix.js?v=6',
  './section-grid-cleanup.js?v=6',
  './portfolio-blank-fix.js?v=6'
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

 const fresh =
  url.pathname.endsWith("/courses/bench/index.html") ||
  url.pathname.endsWith("/courses/bench/portfolio-blank-fix.js") ||
  url.pathname.endsWith("/courses/bench/portfolio-blank-fix.css");

 event.respondWith(
  (fresh
   ? fetch(event.request,{cache:"no-store"}).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
      return response;
     })
   : caches.match(event.request).then(cached=>cached||fetch(event.request))
  ).catch(()=>caches.match(event.request))
 );
});