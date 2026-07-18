"use strict";
(function(){
  if(window.__AP_INSTALL_OPTION__) return;
  window.__AP_INSTALL_OPTION__=true;

  const ROOT="../../?install=1";

  function isOptionsPage(){
    const text=String(document.body.innerText||"").toLowerCase();
    const headings=[...document.querySelectorAll("h1,h2,h3")].map(x=>String(x.textContent||"").trim().toLowerCase());
    return headings.some(x=>x==="options"||x==="profile"||x.includes("profile and settings")) ||
      text.includes("learner profile");
  }

  function addOption(){
    if(!isOptionsPage()||document.querySelector(".ap-main-install-option"))return;
    const card=document.createElement("section");
    card.className="ap-main-install-option";
    card.innerHTML=`
      <small>APP INSTALLATION</small>
      <h2>Install Apprenticeship+</h2>
      <p>Install the main Apprenticeship+ app once. This course and every other course will open inside it.</p>
      <button>Install main Apprenticeship+ app</button>`;
    card.querySelector("button").onclick=()=>location.href=ROOT;

    const profile=document.querySelector("#saveProfile")?.closest("section,.card");
    const reminders=document.querySelector(".ap-profile-notification-settings");
    const anchor=reminders||profile;
    if(anchor&&anchor.parentNode)anchor.insertAdjacentElement("afterend",card);
    else (document.querySelector("main")||document.body).appendChild(card);
  }

  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;addOption()});
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",addOption);
  else addOption();
})();