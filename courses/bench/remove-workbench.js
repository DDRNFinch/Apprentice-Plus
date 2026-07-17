"use strict";
(function(){
  if(window.__AP_REMOVE_WORKBENCH__) return;
  window.__AP_REMOVE_WORKBENCH__ = true;
  const clean=value=>String(value||"").replace(/\s+/g," ").trim().toLowerCase();

  function run(){
    document.querySelectorAll("select").forEach(select=>{
      [...select.options].forEach(option=>{
        if(clean(option.textContent)==="workbench") option.remove();
      });
    });

    [...document.querySelectorAll("button,a,h1,h2,h3,h4,strong,b")].forEach(element=>{
      if(clean(element.textContent)!=="workbench") return;
      let card=element;
      for(let i=0;card&&i<7;i++,card=card.parentElement){
        const rect=card.getBoundingClientRect();
        const style=getComputedStyle(card);
        if(rect.width>220&&rect.height>70&&(
          card.tagName==="BUTTON"||card.tagName==="A"||
          parseFloat(style.borderRadius)>=10||style.borderStyle!=="none"
        )){
          card.remove();
          return;
        }
      }
    });
  }

  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;run();});
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);
  else run();
})();