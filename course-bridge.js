(function(){
  "use strict";
  const parts=location.pathname.split("/");
  const course=parts.includes("brick")?"brick":parts.includes("site")?"site":parts.includes("bench")?"bench":null;
  if(!course)return;
  const KEY="apprenticePlusSettingsV2";
  let settings={course:null,pin:"2468"};
  try{settings={...settings,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(error){}
  if(settings.course&&settings.course!==course){
    location.replace("../../");
  }
})();


/* Apprenticeship+ Shared Academy */
(function loadSharedAcademy(){
  if (window.__APPRENTICESHIP_PLUS_SHARED_ACADEMY_LOADER__) return;
  window.__APPRENTICESHIP_PLUS_SHARED_ACADEMY_LOADER__ = true;

  const rootPath = new URL("./", document.currentScript?.src || window.location.href);
  const academyCssUrl = new URL("shared/academy.css?v=3", rootPath).href;
  const academyJsUrl = new URL("shared/academy.js?v=3", rootPath).href;

  if (!document.querySelector('link[data-ap-shared-academy]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = academyCssUrl;
    stylesheet.dataset.apSharedAcademy = "true";
    document.head.appendChild(stylesheet);
  }

  if (!document.querySelector('script[data-ap-shared-academy]')) {
    const script = document.createElement("script");
    script.src = academyJsUrl;
    script.defer = true;
    script.dataset.apSharedAcademy = "true";
    document.head.appendChild(script);
  }
})();

