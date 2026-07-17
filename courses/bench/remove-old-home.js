"use strict";
(function(){
  if(window.__AP_REMOVE_REMAINING_OLD_HOME__) return;
  window.__AP_REMOVE_REMAINING_OLD_HOME__ = true;

  const clean = value => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

  const legacyHeadings = [
    "welcome to apprenticeship+",
    "assignments complete",
    "refreshes passed",
    "quiz average",
    "epa readiness guide",
    "your next step"
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

  function findLegacyCard(element){
    let node = element;

    for(let depth = 0; node && node !== document.body && depth < 9; depth++, node = node.parentElement){
      if(node.id === "ap-modern-dashboard" || node.closest("#ap-modern-dashboard")) return null;
      if(node.classList.contains("ap-nav-shell") || node.closest(".ap-nav-shell")) return null;

      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);

      if(
        rect.width > 260 &&
        rect.height > 80 &&
        rect.height < 900 &&
        (
          parseFloat(style.borderRadius) >= 10 ||
          style.borderTopStyle !== "none" ||
          style.boxShadow !== "none"
        )
      ){
        return node;
      }
    }

    return null;
  }

  function hideLegacyCards(){
    if(!document.querySelector("#ap-modern-dashboard")) return;

    [...document.querySelectorAll("h1,h2,h3,h4,h5,strong,b,small")].forEach(element => {
      if(!visible(element)) return;

      const text = clean(element.textContent);
      if(!legacyHeadings.includes(text)) return;

      const card = findLegacyCard(element);
      if(card) card.classList.add("ap-old-home-remove");
    });

    // Extra safeguard for the welcome/setup card.
    [...document.querySelectorAll("button,a")].forEach(button => {
      const text = clean(button.textContent);
      if(text !== "complete learner setup") return;

      const card = findLegacyCard(button);
      if(card) card.classList.add("ap-old-home-remove");
    });

    // Remove a remaining wrapper only when it consists entirely of legacy home content.
    [...document.querySelectorAll("main > section, main > div")].forEach(container => {
      if(container.id === "ap-modern-dashboard") return;
      if(container.contains(document.querySelector("#ap-modern-dashboard"))) return;
      if(container.contains(document.querySelector(".ap-nav-shell"))) return;

      const text = clean(container.textContent);
      const hits = legacyHeadings.filter(label => text.includes(label)).length;
      if(hits >= 4){
        container.classList.add("ap-old-home-remove");
      }
    });
  }

  let count = 0;
  const timer = setInterval(() => {
    hideLegacyCards();
    count++;
    if(count > 50) clearInterval(timer);
  }, 200);

  new MutationObserver(() => requestAnimationFrame(hideLegacyCards))
    .observe(document.documentElement, {childList:true, subtree:true});

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", hideLegacyCards);
  }else{
    hideLegacyCards();
  }
})();