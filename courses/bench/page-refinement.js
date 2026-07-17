"use strict";
(function(){
  if(window.__AP_PAGE_SELECTION_FIX__) return;
  window.__AP_PAGE_SELECTION_FIX__ = true;

  const emojiPattern=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;
  const clean=value=>String(value||"").replace(emojiPattern,"").replace(/\s+/g," ").trim().toLowerCase();

  function findNavigationSelect(){
    return [...document.querySelectorAll("select")].find(select=>{
      const labels=[...select.options].map(option=>clean(option.textContent));
      return labels.includes("home")&&labels.includes("assignments")&&labels.includes("portfolio");
    });
  }

  function setCurrentSection(label){
    const select=findNavigationSelect();
    if(!select) return;
    const option=[...select.options].find(item=>clean(item.textContent)===clean(label));
    if(!option || select.value===option.value) return;
    select.value=option.value;
    select.dispatchEvent(new Event("change",{bubbles:true}));
  }

  function findTitle(text){
    return [...document.querySelectorAll("h1,h2,h3,h4,strong,b")].find(el=>clean(el.textContent)===clean(text));
  }

  function findCard(el){
    let node=el;
    for(let i=0;node&&i<7;i++,node=node.parentElement){
      const rect=node.getBoundingClientRect();
      const style=getComputedStyle(node);
      if(rect.width>250&&rect.height>100&&
         (parseFloat(style.borderRadius)>=12||style.borderStyle!=="none")){
        return node;
      }
    }
    return null;
  }

  function hideTopSection(title){
    const heading=findTitle(title);
    if(!heading) return false;
    const card=findCard(heading);
    if(!card) return false;
    card.classList.add("ap-hide-page-hero");
    return true;
  }

  function detectAndApply(){
    const portfolioVisible=findTitle("Portfolio");
    const revisionVisible=findTitle("Revision");

    if(portfolioVisible && hideTopSection("Portfolio")){
      setCurrentSection("Portfolio");
      document.body.dataset.apCurrentPage="portfolio";
      return;
    }

    if(revisionVisible && hideTopSection("Revision")){
      setCurrentSection("Revision");
      document.body.dataset.apCurrentPage="revision";
      return;
    }
  }

  let scheduled=false;
  new MutationObserver(()=>{
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      detectAndApply();
    });
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",detectAndApply);
  }else{
    detectAndApply();
  }
})();