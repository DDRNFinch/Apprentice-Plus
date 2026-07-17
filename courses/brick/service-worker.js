"use strict";
const CACHE_NAME="apprenticeship-plus-brick-match-bench-complete-v1";
const APP_FILES=[
 "./","./index.html",
 './professional-navigation.js','./professional-navigation.css','./remove-workbench.js','./modern-dashboard.js','./modern-dashboard.css','./section-grid-force-fix.js','./section-grid-force-fix.css','./section-grid-cleanup.js','./section-grid-cleanup.css','./portfolio-blank-fix.js','./portfolio-blank-fix.css',
 "./register-service-worker.js","./manifest.json",
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
 const page=url.pathname.endsWith("/courses/brick/")||url.pathname.endsWith("/courses/brick/index.html");
 if(page){
  event.respondWith(fetch(event.request,{cache:"no-store"}).then(r=>r.text()).then(html=>{
   const styles=[
    './professional-navigation.css?v=1','./modern-dashboard.css?v=1',
    './section-grid-force-fix.css?v=1','./section-grid-cleanup.css?v=1',
    './portfolio-blank-fix.css?v=1'
   ];
   const scripts=[
    './professional-navigation.js?v=1','./remove-workbench.js?v=1',
    './modern-dashboard.js?v=1','./section-grid-force-fix.js?v=1',
    './section-grid-cleanup.js?v=1','./portfolio-blank-fix.js?v=1'
   ];
   const tags=styles.map(h=>'<link rel="stylesheet" href="'+h+'">').join("")+
     scripts.map(s=>'<script defer src="'+s+'"></scr'+'ipt>').join("");
   html=html.replace("</head>",tags+"</head>");
   return new Response(html,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}});
  }).catch(()=>caches.match("./index.html")));
  return;
 }
 const fresh=url.pathname.includes("/courses/brick/") && /(?:professional-navigation|remove-workbench|modern-dashboard|section-grid-force-fix|section-grid-cleanup|portfolio-blank-fix)\.(?:js|css)$/.test(url.pathname);
 event.respondWith((fresh?fetch(event.request,{cache:"no-store"}):caches.match(event.request).then(c=>c||fetch(event.request))).catch(()=>caches.match(event.request)));
});