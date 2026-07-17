"use strict";
(function(){
  if(window.__AP_SECTION_GRID_FORCE_FIX__) return;
  window.__AP_SECTION_GRID_FORCE_FIX__ = true;

  const normalise = value => String(value || "").replace(/\s+/g," ").trim().toLowerCase();

  const sectionItems = {
    portfolio: [
      ["practical marking","marking"],
      ["documents","documents"],
      ["employer hub","employer"],
      ["off-the-job learning","otj"]
    ],
    revision: [
      ["revision cards","cards"],
      ["assignment quizzes","quiz"],
      ["epa knowledge mock","knowledge"],
      ["epa practical mock","practical"],
      ["professional discussion mock","discussion"]
    ]
  };

  const icons = {
    marking:'<svg viewBox="0 0 24 24"><path d="M4 3h12v3h4v15H4V3Zm2 2v14h12V8h-4V5H6Zm2 5h8v2H8v-2Zm0 4h5v2H8v-2Z"/></svg>',
    documents:'<svg viewBox="0 0 24 24"><path d="M6 2h8l4 4v16H6V2Zm2 2v16h8V8h-4V4H8Zm2 7h4v2h-4v-2Zm0 4h4v2h-4v-2Z"/></svg>',
    employer:'<svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 1 5 5v2h2v4h-1v8H6v-8H5V9h2V7a5 5 0 0 1 5-5Zm-3 7h6V7a3 3 0 0 0-6 0v2Zm-1 4v6h8v-6H8Z"/></svg>',
    otj:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 3v4.6l3.2 1.9-1 1.7-4.2-2.5V7H13Z"/></svg>',
    cards:'<svg viewBox="0 0 24 24"><path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Zm2 2v12h10V6H7Zm2 3h6v2H9V9Zm0 4h6v2H9v-2Z"/></svg>',
    quiz:'<svg viewBox="0 0 24 24"><path d="M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2Zm1 3v11.8l4-1.7 4 1.7V6H8Zm2 2h4v2h-4V8Zm0 4h4v2h-4v-2Z"/></svg>',
    knowledge:'<svg viewBox="0 0 24 24"><path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Zm-5.5 7.2L12 13l5.5-2.8V15c0 2.1-2.4 3.8-5.5 3.8S6.5 17.1 6.5 15v-4.8Z"/></svg>',
    practical:'<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 6h3v3H8v-3Zm5-4h3v7h-3V9Z"/></svg>',
    discussion:'<svg viewBox="0 0 24 24"><path d="M5 4h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-4 4v-4a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm2 4h7v2H7V8Zm0 4h5v2H7v-2Z"/></svg>'
  };

  function isVisible(el){
    if(!el) return false;
    const s=getComputedStyle(el);
    const r=el.getBoundingClientRect();
    return s.display!=="none" && s.visibility!=="hidden" && r.width>0 && r.height>0;
  }

  function exactTextElements(text){
    const target=normalise(text);
    return [...document.querySelectorAll("body *")].filter(el=>{
      if(!isVisible(el)) return false;
      if(normalise(el.textContent)!==target) return false;
      return ![...el.children].some(child=>normalise(child.textContent)===target);
    });
  }

  function findCard(el){
    let node=el;
    let fallback=null;
    for(let i=0;node&&node!==document.body&&i<9;i++,node=node.parentElement){
      const r=node.getBoundingClientRect();
      const s=getComputedStyle(node);
      if(r.width>220 && r.height>75 && r.height<420){
        fallback=node;
        if(
          node.matches("button,a,[role=button]") ||
          parseFloat(s.borderRadius)>=12 ||
          s.borderTopStyle!=="none" ||
          s.boxShadow!=="none"
        ) return node;
      }
    }
    return fallback;
  }

  function detectSection(){
    const portfolioHits=sectionItems.portfolio.filter(([label])=>exactTextElements(label).length).length;
    const revisionHits=sectionItems.revision.filter(([label])=>exactTextElements(label).length).length;
    if(portfolioHits>=3) return "portfolio";
    if(revisionHits>=4) return "revision";
    return null;
  }

  function removeHero(section){
    exactTextElements(section).forEach(el=>{
      const card=findCard(el);
      if(!card) return;
      const text=normalise(card.textContent);
      if(
        (section==="portfolio" && text.includes("choose the tool you need")) ||
        (section==="revision" && text.includes("choose the revision or mock assessment"))
      ){
        card.classList.add("ap-force-hide-hero");
      }
    });
  }

  function replaceEmoji(card,iconType){
    if(card.querySelector(".ap-force-grid-icon")) return;
    const icon=document.createElement("div");
    icon.className="ap-force-grid-icon";
    icon.innerHTML=icons[iconType];

    const candidates=[...card.querySelectorAll("*")].filter(el=>{
      const t=el.textContent.trim();
      return t.length>0 && t.length<=5 &&
        /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(t) &&
        el.children.length===0;
    });
    if(candidates[0]) candidates[0].replaceWith(icon);
    else card.prepend(icon);
  }

  function apply(){
    const section=detectSection();
    if(!section) return;

    removeHero(section);

    const cards=[];
    sectionItems[section].forEach(([label,type])=>{
      const heading=exactTextElements(label)[0];
      if(!heading) return;
      const card=findCard(heading);
      if(!card || cards.includes(card)) return;

      card.classList.add("ap-force-grid-tile",`ap-force-grid-${type}`);
      card.dataset.apForceGrid="true";
      replaceEmoji(card,type);

      if(!card.querySelector(".ap-force-grid-arrow")){
        const arrow=document.createElement("span");
        arrow.className="ap-force-grid-arrow";
        arrow.textContent="›";
        card.appendChild(arrow);
      }
      cards.push(card);
    });

    if(cards.length<3) return;

    let grid=document.querySelector(`.ap-force-section-grid[data-section="${section}"]`);
    if(!grid){
      grid=document.createElement("div");
      grid.className="ap-force-section-grid";
      grid.dataset.section=section;
      cards[0].parentElement.insertBefore(grid,cards[0]);
    }
    cards.forEach(card=>grid.appendChild(card));
    if(section==="revision"&&cards[4]) cards[4].classList.add("ap-force-grid-wide");
  }

  let runs=0;
  const timer=setInterval(()=>{
    apply();
    runs++;
    if(runs>40) clearInterval(timer);
  },250);

  new MutationObserver(()=>{
    requestAnimationFrame(apply);
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply);
  else apply();
})();