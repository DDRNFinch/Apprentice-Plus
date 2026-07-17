"use strict";
(function(){
  if(window.__AP_CLEAN_SECTION_GRID__) return;
  window.__AP_CLEAN_SECTION_GRID__ = true;

  const clean = value => String(value || "").replace(/\s+/g," ").trim().toLowerCase();
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

  const sectionConfig = {
    portfolio: {
      phrases: ["create and record evidence","choose the tool you need"],
      items: ["practical marking","documents","employer hub","off-the-job learning"]
    },
    revision: {
      phrases: ["prepare for your epa","choose the revision or mock assessment you need"],
      items: ["revision cards","assignment quizzes","epa knowledge mock","epa practical mock","professional discussion mock"]
    }
  };

  function isVisible(el){
    if(!el) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function detectSection(){
    const text = clean(document.body.innerText);
    const portfolioScore = sectionConfig.portfolio.items.filter(x => text.includes(x)).length;
    const revisionScore = sectionConfig.revision.items.filter(x => text.includes(x)).length;
    if(portfolioScore >= 3) return "portfolio";
    if(revisionScore >= 4) return "revision";
    return null;
  }

  function hideRepeatedHero(section){
    const phrases = sectionConfig[section].phrases;

    [...document.querySelectorAll("body *")].forEach(el => {
      if(!isVisible(el)) return;
      const text = clean(el.textContent);
      if(!text) return;

      const matchesAll = phrases.every(phrase => text.includes(phrase));
      if(!matchesAll) return;

      const rect = el.getBoundingClientRect();
      if(rect.width < 250 || rect.height < 120 || rect.height > 500) return;

      el.classList.add("ap-clean-hide-hero");
    });
  }

  function removeEmojiNodes(root){
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const toClean = [];
    while(walker.nextNode()){
      if(emojiRegex.test(walker.currentNode.nodeValue || "")){
        toClean.push(walker.currentNode);
      }
    }
    toClean.forEach(node => {
      node.nodeValue = node.nodeValue.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,"").trimStart();
    });

    [...root.querySelectorAll("*")].forEach(el => {
      if(el.classList.contains("ap-force-grid-icon")) return;
      if(el.querySelector("svg")) return;

      const ownText = [...el.childNodes]
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.nodeValue || "")
        .join("");

      if(emojiRegex.test(ownText)){
        [...el.childNodes]
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .forEach(node => {
            node.nodeValue = node.nodeValue.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,"");
          });
      }

      const full = (el.textContent || "").trim();
      if(el.children.length === 0 && full.length <= 5 && emojiRegex.test(full)){
        el.remove();
      }
    });
  }

  function cleanTiles(section){
    const labels = sectionConfig[section].items;

    document.querySelectorAll(".ap-force-grid-tile").forEach(card => {
      removeEmojiNodes(card);

      [...card.querySelectorAll("*")].forEach(el => {
        const text = clean(el.textContent);
        if(labels.includes(text)) return;
        if(el.children.length === 0 && emojiRegex.test(el.textContent || "")){
          el.remove();
        }
      });
    });
  }

  function run(){
    const section = detectSection();
    if(!section) return;
    hideRepeatedHero(section);
    cleanTiles(section);
  }

  let runs = 0;
  const timer = setInterval(() => {
    run();
    runs++;
    if(runs > 40) clearInterval(timer);
  }, 250);

  new MutationObserver(() => requestAnimationFrame(run))
    .observe(document.documentElement,{childList:true,subtree:true,characterData:true});

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",run);
  }else{
    run();
  }
})();