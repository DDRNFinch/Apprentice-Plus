"use strict";
(function(){
  if(window.__AP_CLEAN_PAGES_V2__) return;
  window.__AP_CLEAN_PAGES_V2__ = true;

  const iconPaths = {
    "Portfolio": '<path d="M4 7.75A1.75 1.75 0 0 1 5.75 6h4l1.5 1.75h7A1.75 1.75 0 0 1 20 9.5v7.75A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25z"/><path d="M4 10h16"/>',
    "Practical Marking": '<path d="M5 19h14"/><path d="m7 16 8.75-8.75 2 2L9 18H7z"/><path d="m14.75 8.25 2 2"/>',
    "Documents": '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M10 13h5M10 17h5"/>',
    "Employer Hub": '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M5 21a7 7 0 0 1 14 0"/><path d="M18 11h3M19.5 9.5v3"/>',
    "Off-the-Job Learning": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "Revision": '<path d="m3 9 9-5 9 5-9 5z"/><path d="M7 12v4c3 2 7 2 10 0v-4"/><path d="M21 9v6"/>',
    "Revision Cards": '<path d="M5 6h14v12H5z"/><path d="M8 10h8M8 14h5"/><path d="m3 8-1 1v10h14"/>',
    "Assignment Quizzes": '<path d="M7 3h10v18H7z"/><path d="M10 8h4M10 12h4"/><path d="m10 16 1.5 1.5L15 14"/>',
    "EPA Knowledge Mock": '<path d="m3 9 9-5 9 5-9 5z"/><path d="M7 12v4c3 2 7 2 10 0v-4"/><path d="M21 9v6"/>',
    "EPA Practical Mock": '<path d="M4 20h16"/><path d="M7 17V9h10v8"/><path d="M9 9V5h6v4"/><path d="M10 13h4"/>',
    "Professional Discussion Mock": '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>'
  };

  const titles = Object.keys(iconPaths);
  const emojiPattern = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

  function clean(value){
    return String(value || "").replace(emojiPattern,"").replace(/\s+/g," ").trim();
  }

  function svg(title){
    return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[title]}</svg>`;
  }

  function exactTitleElement(title){
    return [...document.querySelectorAll("h1,h2,h3,h4,h5,strong,b")].find(el => clean(el.textContent) === title);
  }

  function cardFor(element){
    let node = element;
    for(let i=0; node && i<7; i++, node=node.parentElement){
      const r = node.getBoundingClientRect();
      const s = getComputedStyle(node);
      if(r.width > 250 && r.height > 90 &&
        (node.tagName==="BUTTON" || node.tagName==="A" ||
         parseFloat(s.borderRadius) >= 12 || s.borderStyle!=="none")){
        return node;
      }
    }
    return element.parentElement;
  }

  function stripEmoji(root){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const cleaned = node.nodeValue.replace(emojiPattern,"");
      if(cleaned !== node.nodeValue) node.nodeValue = cleaned;
    });
  }

  function refineHero(title){
    const heading = exactTitleElement(title);
    if(!heading || heading.dataset.cleanHeroV2) return;
    heading.dataset.cleanHeroV2 = "true";
    stripEmoji(heading);

    const hero = cardFor(heading);
    if(!hero || hero.dataset.cleanHeroV2) return;
    hero.dataset.cleanHeroV2 = "true";
    hero.classList.add("ap-clean-hero");

    const icon = document.createElement("span");
    icon.className = "ap-clean-hero-icon";
    icon.innerHTML = svg(title);
    heading.insertBefore(icon, heading.firstChild);
    heading.classList.add("ap-clean-hero-title");
  }

  function refineCard(title){
    const heading = exactTitleElement(title);
    if(!heading || heading.dataset.cleanCardV2) return;
    heading.dataset.cleanCardV2 = "true";

    const card = cardFor(heading);
    if(!card || card.dataset.cleanCardV2) return;
    card.dataset.cleanCardV2 = "true";
    stripEmoji(card);
    card.classList.add("ap-clean-card");
    heading.classList.add("ap-clean-card-title");

    const icon = document.createElement("span");
    icon.className = "ap-clean-card-icon";
    icon.innerHTML = svg(title);
    card.appendChild(icon);

    const arrow = document.createElement("span");
    arrow.className = "ap-clean-card-arrow";
    arrow.textContent = "›";
    arrow.setAttribute("aria-hidden","true");
    card.appendChild(arrow);
  }

  function run(){
    refineHero("Portfolio");
    refineHero("Revision");
    titles.filter(t => t !== "Portfolio" && t !== "Revision").forEach(refineCard);
  }

  let scheduled = false;
  new MutationObserver(()=>{
    if(scheduled) return;
    scheduled = true;
    requestAnimationFrame(()=>{
      scheduled = false;
      run();
    });
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run);
  else run();
})();