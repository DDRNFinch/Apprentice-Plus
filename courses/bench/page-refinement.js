"use strict";
(function(){
  if(window.__AP_HIDE_PAGE_HERO__) return;
  window.__AP_HIDE_PAGE_HERO__ = true;

  const emojiPattern=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;
  const clean=value=>String(value||"").replace(emojiPattern,"").replace(/\s+/g," ").trim().toLowerCase();

  function findHeading(title){
    return [...document.querySelectorAll("h1,h2,h3,h4,strong,b")]
      .find(el => clean(el.textContent) === clean(title));
  }

  function findHero(heading){
    let node = heading;
    for(let i=0; node && i<7; i++, node=node.parentElement){
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      if(rect.width > 250 && rect.height > 150 &&
         (parseFloat(style.borderRadius) >= 14 || style.borderStyle !== "none")){
        return node;
      }
    }
    return null;
  }

  function run(){
    const revision = findHeading("Revision");
    const portfolio = findHeading("Portfolio");

    if(revision){
      const hero = findHero(revision);
      if(hero) hero.classList.add("ap-page-hero-hidden");
    }
    if(portfolio){
      const hero = findHero(portfolio);
      if(hero) hero.classList.add("ap-page-hero-hidden");
    }
  }

  let queued=false;
  new MutationObserver(()=>{
    if(queued) return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;run();});
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run);
  else run();
})();