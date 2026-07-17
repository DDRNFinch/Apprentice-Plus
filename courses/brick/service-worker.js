"use strict";
const CACHE_NAME="apprenticeship-plus-brick-bench-style-navigation-v2";
const APP_FILES=[
  "./",
  "./index.html",
  "./professional-navigation.js",
  "./professional-navigation.css",
  "./manifest.json",
  "./trade-logo.png",
  "./icon-192.png",
  "./icon-512.png"
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
  const isBrickPage=
    url.pathname.endsWith("/courses/brick/") ||
    url.pathname.endsWith("/courses/brick/index.html");

  if(isBrickPage){
    event.respondWith(
      fetch(event.request,{cache:"no-store"})
        .then(response=>response.text())
        .then(html=>{
          const styleTag='<link rel="stylesheet" href="./professional-navigation.css?v=brick-fix-2">';
          const scriptTag='<script defer src="./professional-navigation.js?v=brick-fix-2"></script>';

          if(!html.includes("professional-navigation.css")){
            html=html.replace("</head>",styleTag+"</head>");
          }

          if(!html.includes("professional-navigation.js")){
            html=html.replace("</body>",scriptTag+"</body>");
          }

          return new Response(html,{
            status:200,
            headers:{
              "Content-Type":"text/html; charset=utf-8",
              "Cache-Control":"no-store"
            }
          });
        })
        .catch(()=>caches.match("./index.html"))
    );
    return;
  }

  const fresh=/\/courses\/brick\/(?:professional-navigation\.(?:js|css)|index\.html)$/.test(url.pathname);

  if(fresh){
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
      caches.match(event.request)
        .then(cached=>cached||fetch(event.request))
    );
  }
});