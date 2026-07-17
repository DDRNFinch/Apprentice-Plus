importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");
firebase.initializeApp({"apiKey": "AIzaSyCIILT-Lg2fQ2SI3uswbCCCzvpqk3SLVXg", "authDomain": "apprentice-plus-notifications.firebaseapp.com", "projectId": "apprentice-plus-notifications", "storageBucket": "apprentice-plus-notifications.firebasestorage.app", "messagingSenderId": "709798823441", "appId": "1:709798823441:web:29845352ac571c507c93b0", "measurementId": "G-H45SQ5BCZG"});
const apMessaging=firebase.messaging();
apMessaging.onBackgroundMessage(payload=>{
 const data=payload.data||{},note=payload.notification||{};
 return self.registration.showNotification(note.title||data.title||"Apprenticeship+",{
  body:note.body||data.body||"",icon:"./icon-192.png",badge:"./icon-192.png",
  data:{route:data.route||"Home",url:data.url||"./"}
 });
});
self.addEventListener("notificationclick",event=>{
 event.notification.close();
 const targetUrl=new URL(event.notification.data?.url||"./",self.location.href).href;
 event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
  for(const client of list){if("focus" in client)return client.focus();}
  return clients.openWindow(targetUrl);
 }));
});

"use strict";
const CACHE_NAME="apprenticeship-plus-bench-remove-old-home-v9";
const APP_FILES=[
 "./","./index.html","./app.js",
 "./professional-navigation.js","./professional-navigation.css",
 "./remove-workbench.js","./modern-dashboard.js","./modern-dashboard.css",
 "./section-grid-force-fix.js","./section-grid-force-fix.css",
 "./section-grid-cleanup.js","./section-grid-cleanup.css",
 "./portfolio-blank-fix.js","./portfolio-blank-fix.css","./legacy-home-cleanup.js","./legacy-home-cleanup.css","./remove-old-home.js","./remove-old-home.css","./firebase-notifications.js","./firebase-notifications.css",
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
  './remove-old-home.css?v=9',
  './legacy-home-cleanup.css?v=8','./firebase-notifications.css?v=8',
  './professional-navigation.css?v=6',
  './modern-dashboard.css?v=6',
  './section-grid-force-fix.css?v=6',
  './section-grid-cleanup.css?v=6',
  './portfolio-blank-fix.css?v=6'
 ];
 var scripts=[
  './remove-old-home.js?v=9',
  './legacy-home-cleanup.js?v=8','./firebase-notifications.js?v=8',
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