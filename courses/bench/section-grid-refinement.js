"use strict";
(function(){
  if(window.__AP_SECTION_GRID_REFINEMENT__) return;
  window.__AP_SECTION_GRID_REFINEMENT__ = true;

  const clean = value => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

  const CONFIG = {
    revision: {
      heroHeadings: ["revision"],
      tiles: {
        "revision cards": "cards",
        "assignment quizzes": "quiz",
        "epa knowledge mock": "knowledge",
        "epa practical mock": "practical",
        "professional discussion mock": "discussion"
      }
    },
    portfolio: {
      heroHeadings: ["portfolio"],
      tiles: {
        "practical marking": "marking",
        "documents": "documents",
        "employer hub": "employer",
        "off-the-job learning": "otj"
      }
    }
  };

  const ICONS = {
    cards: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h11.5A2.5 2.5 0 0 1 19 7v12.5H7.5A2.5 2.5 0 0 1 5 17V4.5Zm2 2V17c0 .28.22.5.5.5H17V7a.5.5 0 0 0-.5-.5H7Zm2 2h6v1.8H9V8.5Zm0 3.5h6v1.8H9V12Z"/></svg>`,
    quiz: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2Zm1 3v8.2l4-1.7 4 1.7V6H8Zm1.5 1.5h5v1.7h-5V7.5Zm0 3h5v1.7h-5v-1.7Z"/></svg>`,
    knowledge: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Zm-5.5 7.1L12 13l5.5-2.9V15c0 2.1-2.4 3.8-5.5 3.8S6.5 17.1 6.5 15v-4.9ZM20 10h1v7h-1v-7Z"/></svg>`,
    practical: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4V5Zm2 2v10h12V7H6Zm1.5 6h3V16h-3v-3Zm4.5-4h4v7h-4V9Z"/></svg>`,
    discussion: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-4 4v-4H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm1.5 4h7v1.7h-7V8Zm0 3h5v1.7h-5V11Zm12-2h.5a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3v3l-3-3h-2.2v-2H19a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-.5V9Z"/></svg>`,
    marking: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h12v3h4v15H4V3Zm2 2v14h12V8h-4V5H6Zm2 5h8v1.8H8V10Zm0 3.5h5v1.8H8v-1.8Z"/></svg>`,
    documents: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6V2Zm2 2v16h8V8h-4V4H8Zm2 7h4v1.7h-4V11Zm0 3h4v1.7h-4V14Z"/></svg>`,
    employer: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a5 5 0 0 1 5 5v2h2v4h-1v8H6v-8H5V9h2V7a5 5 0 0 1 5-5Zm-3 7h6V7a3 3 0 0 0-6 0v2Zm-1 4v6h8v-6H8Z"/></svg>`,
    otj: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 3v4.6l3.2 1.9-1 1.7L11 12.7V7h2Z"/></svg>`
  };

  function visible(el){
    if(!el) return false;
    const style = getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden" && el.getBoundingClientRect().height > 0;
  }

  function currentSection(){
    const headings = [...document.querySelectorAll("h1,h2,h3,h4")].filter(visible);
    const text = headings.map(h => clean(h.textContent));
    if(text.includes("revision")) return "revision";
    if(text.includes("portfolio")) return "portfolio";
    return null;
  }

  function findCardFromHeading(heading){
    let node = heading;
    for(let i=0; node && i<7; i++, node=node.parentElement){
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      if(
        rect.width > 180 &&
        rect.height > 80 &&
        (
          node.tagName === "BUTTON" ||
          node.tagName === "A" ||
          parseFloat(style.borderRadius) >= 10 ||
          style.borderStyle !== "none"
        )
      ) return node;
    }
    return null;
  }

  function hideHero(section){
    const config = CONFIG[section];
    [...document.querySelectorAll("h1,h2,h3")].forEach(heading => {
      if(!config.heroHeadings.includes(clean(heading.textContent))) return;
      const card = findCardFromHeading(heading);
      if(card) card.classList.add("ap-section-hero-hidden");
    });
  }

  function enhanceTile(card, type){
    if(!card || card.dataset.apGridEnhanced === "true") return;
    card.dataset.apGridEnhanced = "true";
    card.classList.add("ap-section-tile", `ap-section-tile-${type}`);

    const heading = [...card.querySelectorAll("h1,h2,h3,h4,strong,b")]
      .find(el => CONFIG.revision.tiles[clean(el.textContent)] || CONFIG.portfolio.tiles[clean(el.textContent)]);

    if(!heading) return;

    [...card.childNodes].forEach(node => {
      if(node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
    });

    const iconWrap = document.createElement("div");
    iconWrap.className = "ap-section-icon";
    iconWrap.innerHTML = ICONS[type] || ICONS.documents;

    const emojiCandidate = [...card.querySelectorAll("span,div,p")]
      .find(el => {
        const t = el.textContent.trim();
        return t.length <= 4 && /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(t);
      });

    if(emojiCandidate && !emojiCandidate.contains(heading)){
      emojiCandidate.replaceWith(iconWrap);
    }else{
      card.insertBefore(iconWrap, card.firstChild);
    }

    const arrow = document.createElement("span");
    arrow.className = "ap-section-arrow";
    arrow.setAttribute("aria-hidden","true");
    arrow.textContent = "›";
    card.appendChild(arrow);
  }

  function buildGrid(section){
    const config = CONFIG[section];
    const matched = [];

    [...document.querySelectorAll("h2,h3,h4,strong,b")].forEach(heading => {
      const type = config.tiles[clean(heading.textContent)];
      if(!type || !visible(heading)) return;
      const card = findCardFromHeading(heading);
      if(card && !matched.includes(card)){
        matched.push(card);
        enhanceTile(card, type);
      }
    });

    if(!matched.length) return;

    let grid = document.querySelector(`.ap-section-grid[data-section="${section}"]`);
    if(!grid){
      grid = document.createElement("div");
      grid.className = "ap-section-grid";
      grid.dataset.section = section;
      matched[0].parentElement.insertBefore(grid, matched[0]);
    }

    matched.forEach(card => grid.appendChild(card));

    if(section === "revision" && matched.length === 5){
      matched[4].classList.add("ap-section-tile-wide");
    }
  }

  function run(){
    const section = currentSection();
    if(!section) return;
    hideHero(section);
    buildGrid(section);
    document.documentElement.dataset.apSectionGrid = section;
  }

  let queued = false;
  const observer = new MutationObserver(mutations => {
    const external = mutations.some(mutation => {
      const target = mutation.target.nodeType === Node.ELEMENT_NODE
        ? mutation.target
        : mutation.target.parentElement;
      return !target?.closest?.(".ap-section-grid");
    });
    if(!external || queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      run();
    });
  });

  observer.observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",run);
  }else{
    run();
  }
})();