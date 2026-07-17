"use strict";
(function(){
  if(window.__AP_LEGACY_HOME_CLEANUP__) return;
  window.__AP_LEGACY_HOME_CLEANUP__ = true;

  const normalise=v=>String(v||"").replace(/\s+/g," ").trim().toLowerCase();

  function isVisible(el){
    if(!el)return false;
    const s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=="none"&&s.visibility!=="hidden"&&r.width>0&&r.height>0;
  }

  function isHome(){
    return !!document.querySelector("#ap-modern-dashboard");
  }

  function cardFor(el){
    let node=el;
    for(let i=0;node&&node!==document.body&&i<8;i++,node=node.parentElement){
      const r=node.getBoundingClientRect();
      const s=getComputedStyle(node);
      if(r.width>240&&r.height>75&&r.height<1500&&(
        parseFloat(s.borderRadius)>=10||
        s.borderTopStyle!=="none"||
        s.boxShadow!=="none"
      )) return node;
    }
    return null;
  }

  function run(){
    if(!isHome())return;

    const dashboard=document.querySelector("#ap-modern-dashboard");
    const nav=document.querySelector(".ap-nav-shell");

    const legacyMarkers=[
      "welcome to site carpenter",
      "welcome to bench joinery",
      "welcome to bricklaying",
      "welcome to property maintenance",
      "welcome to pmo",
      "assignment completion",
      "revision progress",
      "quiz scores",
      "epa readiness guide",
      "apprenticeship tools"
    ];

    [...document.querySelectorAll("h1,h2,h3,h4,strong")].forEach(el=>{
      if(!isVisible(el))return;
      const text=normalise(el.textContent);
      if(!legacyMarkers.some(marker=>text.includes(marker)))return;

      const card=cardFor(el);
      if(!card||card.contains(dashboard)||card.contains(nav))return;
      card.classList.add("ap-legacy-home-hidden");
    });

    // Also hide any old-home wrapper that contains several legacy markers.
    [...document.querySelectorAll("main,section,div")].forEach(el=>{
      if(!isVisible(el)||el.contains(dashboard)||el.contains(nav))return;
      const text=normalise(el.textContent);
      const hits=legacyMarkers.filter(marker=>text.includes(marker)).length;
      const r=el.getBoundingClientRect();
      if(hits>=3&&r.width>260&&r.height>350){
        el.classList.add("ap-legacy-home-hidden");
      }
    });
  }

  let count=0;
  const timer=setInterval(()=>{run();if(++count>40)clearInterval(timer)},250);
  new MutationObserver(()=>requestAnimationFrame(run))
    .observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);
  else run();
})();