"use strict";
(function(){
  if(window.__AP_HOME_REPLACEMENT_V1__) return;
  window.__AP_HOME_REPLACEMENT_V1__ = true;

  const clean = value => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

  const legacyMarkers = [
    "smart reminders",
    "welcome to apprenticeship+",
    "welcome to site carpentry",
    "welcome to bench joinery",
    "welcome to bricklaying",
    "welcome to property maintenance",
    "assignments complete",
    "refreshes passed",
    "quiz average",
    "epa readiness guide",
    "your next step",
    "apprenticeship tools",
    "complete learner setup"
  ];

  function visible(element){
    if(!element) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" &&
      style.visibility !== "hidden" &&
      rect.width > 0 &&
      rect.height > 0;
  }

  function protectedElement(element){
    return !element ||
      element.id === "ap-modern-dashboard" ||
      element.closest("#ap-modern-dashboard") ||
      element.id === "ap-notification-button" ||
      element.closest("#ap-notification-panel") ||
      element.closest(".ap-nav-shell") ||
      element.matches("header,nav");
  }

  function nearestCard(element){
    let node = element;
    for(let depth = 0; node && node !== document.body && depth < 10; depth++, node = node.parentElement){
      if(protectedElement(node)) return null;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const text = clean(node.textContent);
      if(
        rect.width > 250 &&
        rect.height > 55 &&
        rect.height < 1800 &&
        (
          parseFloat(style.borderRadius) >= 8 ||
          style.boxShadow !== "none" ||
          style.borderTopStyle !== "none"
        ) &&
        legacyMarkers.some(marker => text.includes(marker))
      ){
        return node;
      }
    }
    return null;
  }

  function removeLegacyHome(){
    const dashboard = document.querySelector("#ap-modern-dashboard");
    if(!dashboard) return;

    document.querySelectorAll("h1,h2,h3,h4,h5,strong,b,small,button,a,p").forEach(element => {
      if(!visible(element) || protectedElement(element)) return;
      const text = clean(element.textContent);
      if(!legacyMarkers.some(marker => text === marker || text.includes(marker))) return;
      const card = nearestCard(element);
      if(card) card.classList.add("ap-remove-legacy-home");
    });

    const main = dashboard.closest("main") || document.querySelector("main");
    if(main){
      [...main.children].forEach(child => {
        if(child === dashboard || child.contains(dashboard) || protectedElement(child)) return;
        const text = clean(child.textContent);
        const hits = legacyMarkers.filter(marker => text.includes(marker)).length;
        if(hits >= 2) child.classList.add("ap-remove-legacy-home");
      });
    }

    // Final sweep for old dashboard sections below the modern dashboard.
    const dashboardBottom = dashboard.getBoundingClientRect().bottom;
    document.querySelectorAll("section,article,main>div").forEach(element => {
      if(!visible(element) || protectedElement(element)) return;
      const rect = element.getBoundingClientRect();
      const text = clean(element.textContent);
      const hits = legacyMarkers.filter(marker => text.includes(marker)).length;
      if(rect.top >= dashboardBottom - 10 && hits >= 1){
        element.classList.add("ap-remove-legacy-home");
      }
    });
  }

  let tries = 0;
  const timer = setInterval(() => {
    removeLegacyHome();
    if(++tries > 60) clearInterval(timer);
  }, 200);

  new MutationObserver(() => requestAnimationFrame(removeLegacyHome))
    .observe(document.documentElement, {childList:true, subtree:true});

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", removeLegacyHome);
  }else{
    removeLegacyHome();
  }
})();