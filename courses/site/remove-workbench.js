"use strict";
(function(){
  if(window.__AP_REMOVE_WORKBENCH__) return;
  window.__AP_REMOVE_WORKBENCH__ = true;

  const clean = value => String(value || "").replace(/\s+/g," ").trim().toLowerCase();

  function removeFromSelects(){
    document.querySelectorAll("select").forEach(select => {
      [...select.options].forEach(option => {
        if(clean(option.textContent) === "workbench"){
          option.remove();
        }
      });
    });
  }

  function removeWorkbenchCards(){
    const candidates = [...document.querySelectorAll("button,a,h1,h2,h3,h4,strong,b")];
    candidates.forEach(element => {
      if(clean(element.textContent) !== "workbench") return;

      let card = element;
      for(let i=0; card && i<7; i++, card=card.parentElement){
        const rect = card.getBoundingClientRect();
        const style = getComputedStyle(card);
        if(
          rect.width > 220 &&
          rect.height > 70 &&
          (
            card.tagName === "BUTTON" ||
            card.tagName === "A" ||
            parseFloat(style.borderRadius) >= 10 ||
            style.borderStyle !== "none"
          )
        ){
          card.remove();
          return;
        }
      }
    });
  }

  function redirectIfNeeded(){
    const text = clean(document.body.innerText);
    const visibleWorkbenchHeading = [...document.querySelectorAll("h1,h2,h3")]
      .some(el => clean(el.textContent) === "workbench" && getComputedStyle(el).display !== "none");

    if(visibleWorkbenchHeading && text.includes("workbench")){
      const select = [...document.querySelectorAll("select")].find(s =>
        [...s.options].some(o => clean(o.textContent) === "home")
      );
      const home = select && [...select.options].find(o => clean(o.textContent) === "home");
      if(select && home){
        select.value = home.value;
        select.dispatchEvent(new Event("change",{bubbles:true}));
      }
    }
  }

  function run(){
    removeFromSelects();
    removeWorkbenchCards();
    redirectIfNeeded();
  }

  let queued = false;
  new MutationObserver(() => {
    if(queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      run();
    });
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",run);
  }else{
    run();
  }
})();