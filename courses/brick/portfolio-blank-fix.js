"use strict";
(function(){
  if(window.__AP_PORTFOLIO_BLANK_FIX__) return;
  window.__AP_PORTFOLIO_BLANK_FIX__ = true;

  const clean = value => String(value || "").replace(/\s+/g," ").trim().toLowerCase();

  function visible(el){
    if(!el) return false;
    const style=getComputedStyle(el);
    const rect=el.getBoundingClientRect();
    return style.display!=="none" && style.visibility!=="hidden" && rect.width>0 && rect.height>0;
  }

  function restoreGridAncestors(){
    document.querySelectorAll(".ap-force-section-grid").forEach(grid=>{
      let node=grid.parentElement;
      while(node && node!==document.body){
        node.classList.remove("ap-clean-hide-hero","ap-force-hide-hero","ap-section-hero-hidden");
        node.style.removeProperty("display");
        node=node.parentElement;
      }
    });
  }

  function findSmallestPortfolioHero(){
    const candidates=[...document.querySelectorAll("body *")].filter(el=>{
      if(!visible(el)) return false;
      if(el.querySelector(".ap-force-section-grid")) return false;

      const text=clean(el.textContent);
      if(!text.includes("create and record evidence")) return false;
      if(!text.includes("choose the tool you need")) return false;

      const rect=el.getBoundingClientRect();
      return rect.width>250 && rect.height>120 && rect.height<430;
    });

    candidates.sort((a,b)=>{
      const ar=a.getBoundingClientRect();
      const br=b.getBoundingClientRect();
      return (ar.width*ar.height)-(br.width*br.height);
    });

    return candidates[0] || null;
  }

  function run(){
    restoreGridAncestors();

    const pageText=clean(document.body.innerText);
    const isPortfolio=
      pageText.includes("practical marking") &&
      pageText.includes("documents") &&
      pageText.includes("employer hub") &&
      pageText.includes("off-the-job learning");

    if(!isPortfolio) return;

    const hero=findSmallestPortfolioHero();
    if(hero) hero.classList.add("ap-portfolio-hero-only");
  }

  let count=0;
  const timer=setInterval(()=>{
    run();
    count++;
    if(count>40) clearInterval(timer);
  },250);

  new MutationObserver(()=>requestAnimationFrame(run))
    .observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",run);
  }else{
    run();
  }
})();