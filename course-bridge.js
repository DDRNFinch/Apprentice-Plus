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
  const academyCssUrl = new URL("shared/academy.css?v=12", rootPath).href;
  const academyJsUrl = new URL("shared/academy.js?v=12", rootPath).href;

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



/* Total XP on the main Apprentice+ home page */
(function mountHomeXp(){
  "use strict";
  function isAcademyVisible(){return !!document.querySelector(".academy-view .apa-page");}
  function target(){return document.querySelector("main")||document.querySelector("#app")||document.querySelector(".app-shell")||document.body;}
  function render(){
    const api=window.ApprenticeshipPlusAcademy;
    if(!api?.getMetrics)return;
    if(isAcademyVisible()){document.querySelector(".ap-home-xp-card")?.remove();return;}
    const root=target();
    if(!root||root===document.body&&document.body.children.length<2)return;
    const m=api.getMetrics();
    let card=document.querySelector(".ap-home-xp-card");
    if(!card){
      card=document.createElement("section");card.className="ap-home-xp-card";
      const anchor=root.querySelector(".current-section,.section-selector,.dashboard-header,.home-header,header+*")||root.firstElementChild;
      if(anchor?.parentNode===root)anchor.insertAdjacentElement("afterend",card);else root.prepend(card);
    }
    const html=`<div class="ap-home-xp-icon">★</div><div class="ap-home-xp-copy"><small>APPRENTICESHIP+ PROGRESS</small><strong>${Number(m.xp||0).toLocaleString()} total XP</strong><span>${Number(m.bonusXP||0).toLocaleString()} bonus XP from badges and milestones</span></div><div class="ap-home-xp-level">Level ${m.level}</div>`;
    if(card.innerHTML!==html)card.innerHTML=html;
  }
  function schedule(){setTimeout(render,250)}
  window.addEventListener("load",schedule);
  document.addEventListener("click",schedule,true);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();
