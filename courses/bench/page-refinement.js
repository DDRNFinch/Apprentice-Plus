"use strict";
(function(){
  if(window.__AP_SAFE_PAGE_REFINEMENT__) return;
  window.__AP_SAFE_PAGE_REFINEMENT__=true;

  const STORAGE_KEY="apprentice-plus-bench-current-section";
  const emojiPattern=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;
  const clean=value=>String(value||"").replace(emojiPattern,"").replace(/\s+/g," ").trim();

  function titleElement(title){
    return [...document.querySelectorAll("h1,h2,h3,h4,strong,b")].find(el=>clean(el.textContent)===title);
  }

  function enclosingCard(el){
    let node=el;
    for(let i=0;node&&i<7;i++,node=node.parentElement){
      const rect=node.getBoundingClientRect();
      const style=getComputedStyle(node);
      if(rect.width>250&&rect.height>120&&(parseFloat(style.borderRadius)>=12||style.borderStyle!=="none")) return node;
    }
    return null;
  }

  function stripEmoji(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>node.nodeValue=node.nodeValue.replace(emojiPattern,""));
  }

  function apply(){
    document.querySelectorAll("main,section,.view,#view").forEach(stripEmoji);

    const section=sessionStorage.getItem(STORAGE_KEY)||"Home";
    document.querySelectorAll(".ap-hide-page-hero").forEach(el=>el.classList.remove("ap-hide-page-hero"));

    if(section==="Portfolio"){
      const heading=titleElement("Portfolio");
      const card=heading&&enclosingCard(heading);
      if(card)card.classList.add("ap-hide-page-hero");
    }
    if(section==="Revision"){
      const heading=titleElement("Revision");
      const card=heading&&enclosingCard(heading);
      if(card)card.classList.add("ap-hide-page-hero");
    }
  }

  document.addEventListener("apprentice-section-change",()=>setTimeout(apply,140));
  new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply);
  else apply();
})();