"use strict";
(function(){
  if(window.__AP_REFINED_PAGES__) return;
  window.__AP_REFINED_PAGES__ = true;

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
    "EPA Practical Mock": '<path d="M4 20h16"/><path d="M7 17V9h10v8"/><path d="M9 9V5h6v4"/><path d="M10 13h4"/>'
  };

  const descriptions = {
    "Practical Marking":"Assess practical work and create a PDF.",
    "Documents":"Find and generate saved documents.",
    "Employer Hub":"Create employer evidence and witness records.",
    "Off-the-Job Learning":"Create clear learning-time entries.",
    "Revision Cards":"Review questions you previously answered incorrectly.",
    "Assignment Quizzes":"Complete targeted quizzes linked to finished assignments.",
    "EPA Knowledge Mock":"Complete the full 40-question scenario assessment.",
    "EPA Practical Mock":"Learner self-mark and assessor judgement mark sheet."
  };

  const cleanText = value => String(value || "")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,"")
    .replace(/\s+/g," ")
    .trim();

  function svgFor(title){
    const paths = iconPaths[title];
    if(!paths) return "";
    return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  }

  function findTitleElement(title){
    const candidates = [...document.querySelectorAll("h1,h2,h3,h4,strong,b,div,span")];
    return candidates.find(el => {
      if(el.children.length > 2) return false;
      return cleanText(el.textContent) === title;
    });
  }

  function findCard(el){
    let current = el;
    for(let i=0; current && i<6; i++, current=current.parentElement){
      const tag = current.tagName;
      const style = getComputedStyle(current);
      const rect = current.getBoundingClientRect();
      if((tag==="BUTTON" || tag==="A" || style.cursor==="pointer") && rect.height > 80) return current;
      if(rect.height > 120 && rect.width > 250 &&
         (parseFloat(style.borderRadius) >= 10 || style.borderStyle !== "none")) return current;
    }
    return el.parentElement;
  }

  function removeLeadingEmoji(el){
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const before = node.nodeValue;
      const after = before.replace(/^[\s\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]+/gu,"");
      if(before !== after){
        node.nodeValue = after;
        return;
      }
    }
  }

  function refineHero(title){
    const heading = findTitleElement(title);
    if(!heading || heading.dataset.refinedHero) return;
    heading.dataset.refinedHero = "true";
    removeLeadingEmoji(heading);
    heading.classList.add("ap-refined-hero-title");
    heading.insertAdjacentHTML("afterbegin", `<span class="ap-refined-hero-icon">${svgFor(title)}</span>`);
    const hero = findCard(heading);
    if(hero) hero.classList.add("ap-refined-hero");
  }

  function refineCard(title){
    const heading = findTitleElement(title);
    if(!heading || heading.dataset.refinedCard) return;
    heading.dataset.refinedCard = "true";
    removeLeadingEmoji(heading);

    const card = findCard(heading);
    if(!card || card.dataset.refinedCard) return;
    card.dataset.refinedCard = "true";
    card.classList.add("ap-refined-tool-card");

    const icon = document.createElement("span");
    icon.className = "ap-refined-card-icon";
    icon.innerHTML = svgFor(title);
    card.insertBefore(icon, card.firstChild);

    const content = document.createElement("span");
    content.className = "ap-refined-card-content";

    // Move title and its nearest description into a clean content column.
    const descriptionText = descriptions[title];
    let description = [...card.querySelectorAll("p,small,div,span")].find(el =>
      el !== heading && cleanText(el.textContent) === descriptionText
    );

    heading.classList.add("ap-refined-card-title");
    heading.parentNode.insertBefore(content, heading);
    content.appendChild(heading);
    if(description){
      description.classList.add("ap-refined-card-description");
      content.appendChild(description);
    }

    const arrow = document.createElement("span");
    arrow.className = "ap-refined-card-arrow";
    arrow.setAttribute("aria-hidden","true");
    arrow.textContent = "›";
    card.appendChild(arrow);
  }

  function run(){
    refineHero("Portfolio");
    refineHero("Revision");
    [
      "Practical Marking","Documents","Employer Hub","Off-the-Job Learning",
      "Revision Cards","Assignment Quizzes","EPA Knowledge Mock","EPA Practical Mock"
    ].forEach(refineCard);
  }

  let queued = false;
  const observer = new MutationObserver(()=>{
    if(queued) return;
    queued = true;
    requestAnimationFrame(()=>{ queued=false; run(); });
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run);
  else run();
})();