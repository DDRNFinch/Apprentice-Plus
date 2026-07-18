"use strict";
const CACHE_NAME="apprenticeship-plus-pmo-direct-index-v15";
const APP_FILES=[
 "./","./index.html","./app.js",
 './professional-navigation.js','./professional-navigation.css','./remove-workbench.js','./modern-dashboard.js','./modern-dashboard.css','./section-grid-force-fix.js','./section-grid-force-fix.css','./section-grid-cleanup.js','./section-grid-cleanup.css','./portfolio-blank-fix.js','./portfolio-blank-fix.css',
 "./assignment-pdf.js","./legacy-home-cleanup.js","./legacy-home-cleanup.css","./local-reminders.js","./local-reminders.css","./replace-home.js","./replace-home.css","./first-login-setup.js","./first-login-setup.css","./remove-old-home.js","./remove-old-home.css","./remove-smart-reminders.css","./register-service-worker.js","./manifest.json",
 "./trade-logo.png","./icon-192.png","./icon-512.png"
];

self.addEventListener("install",event=>event.waitUntil(
 caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting())
));
self.addEventListener("activate",event=>event.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())
));
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.pathname.endsWith("/courses/pmo/app.js")){
  event.respondWith(fetch(event.request,{cache:"no-store"}).then(r=>r.text()).then(source=>{
   const loader=`
;(function(){
 var styles=[
  './replace-home.css?v=12','./first-login-setup.css?v=12',
  './remove-old-home.css?v=10',
  './remove-smart-reminders.css?v=10',
  './legacy-home-cleanup.css?v=8','./local-reminders.css?v=13',
  './professional-navigation.css?v=1','./modern-dashboard.css?v=1',
  './section-grid-force-fix.css?v=1','./section-grid-cleanup.css?v=1',
  './portfolio-blank-fix.css?v=1'
 ];
 var scripts=[
  './replace-home.js?v=12','./first-login-setup.js?v=13',
  './remove-old-home.js?v=10',
  './legacy-home-cleanup.js?v=8','./local-reminders.js?v=13',
  './professional-navigation.js?v=1','./remove-workbench.js?v=1',
  './modern-dashboard.js?v=1','./section-grid-force-fix.js?v=1',
  './section-grid-cleanup.js?v=1','./portfolio-blank-fix.js?v=1'
 ];
 styles.forEach(function(href){
  var base=href.split('?')[0];
  if(!document.querySelector('link[href^="'+base+'"]')){
   var link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);
  }
 });
 scripts.forEach(function(src){
  var base=src.split('?')[0];
  if(!document.querySelector('script[src^="'+base+'"]')){
   var script=document.createElement('script');script.src=src;script.defer=true;document.head.appendChild(script);
  }
 });
})();`;
   return new Response(source+loader,{headers:{"Content-Type":"application/javascript; charset=utf-8","Cache-Control":"no-store"}});
  }).catch(()=>caches.match(event.request)));
  return;
 }
 const extraFresh=/\/(?:legacy-home-cleanup|firebase-notifications)\.(?:js|css)$/.test(url.pathname);
 const fresh=url.pathname.includes("/courses/pmo/") && /(?:professional-navigation|remove-workbench|modern-dashboard|section-grid-force-fix|section-grid-cleanup|portfolio-blank-fix)\.(?:js|css)$/.test(url.pathname);
 event.respondWith(((typeof extraFresh!=="undefined"&&extraFresh)||fresh?fetch(event.request,{cache:"no-store"}):caches.match(event.request).then(c=>c||fetch(event.request))).catch(()=>caches.match(event.request)));
});