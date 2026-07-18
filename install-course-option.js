"use strict";
(function(){
  if(window.__AP_INSTALL_OPTION_FIX__) return;
  window.__AP_INSTALL_OPTION_FIX__=true;

  function isOptionsPage(){
    const text=String(document.body.innerText||"").toLowerCase();
    return text.includes("learner profile") ||
      [...document.querySelectorAll("h1,h2,h3")].some(el=>{
        const value=String(el.textContent||"").trim().toLowerCase();
        return value==="options"||value==="profile"||value.includes("profile and settings");
      });
  }

  function add(){
    if(!isOptionsPage()||document.querySelector(".ap-main-install-option"))return;
    const card=document.createElement("section");
    card.className="ap-main-install-option";
    card.innerHTML=`
      <small>APP INSTALLATION</small>
      <h2>Install Apprenticeship+</h2>
      <p>Install the main Apprenticeship+ app once. Every trade course will open inside it.</p>
      <button>Open main app installer</button>`;
    card.querySelector("button").onclick=()=>{
      window.location.assign(new URL("../../?install=1",window.location.href).href);
    };
    const reminders=document.querySelector(".ap-profile-notification-settings");
    const profile=document.querySelector("#saveProfile")?.closest("section,.card");
    const anchor=reminders||profile;
    if(anchor?.parentNode)anchor.insertAdjacentElement("afterend",card);
    else (document.querySelector("main")||document.body).appendChild(card);
  }

  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;add()});
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add);
  else add();
})();