"use strict";
(function(){
  if(window.__AP_ROOT_INSTALL_PROMPT__) return;
  window.__AP_ROOT_INSTALL_PROMPT__=true;

  const SEEN_KEY="apprenticeshipPlusInstallPromptSeenV1";
  let deferredPrompt=null;

  function installed(){
    return window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone===true;
  }

  function close(){
    document.querySelector("#ap-install-overlay")?.classList.remove("open");
  }

  function build(){
    if(installed()||document.querySelector("#ap-install-overlay"))return;
    const overlay=document.createElement("div");
    overlay.id="ap-install-overlay";
    overlay.className="ap-install-overlay";
    overlay.innerHTML=`
      <div class="ap-install-card">
        <img src="./icon-192.png" alt="Apprenticeship+">
        <small>INSTALL THE APP</small>
        <h2>Add Apprenticeship+ to your phone</h2>
        <p>Install the main Apprenticeship+ app once. All courses open inside the same app, so separate Bench, Site, Brick or PMO apps are not created.</p>
        <button class="ap-install-primary" id="ap-install-now">Install Apprenticeship+</button>
        <button class="ap-install-secondary" id="ap-install-help">Show installation steps</button>
        <button class="ap-install-later" id="ap-install-later">Not now</button>
        <div class="ap-install-message" id="ap-install-message"></div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("#ap-install-now").onclick=runInstall;
    overlay.querySelector("#ap-install-help").onclick=showHelp;
    overlay.querySelector("#ap-install-later").onclick=()=>{
      localStorage.setItem(SEEN_KEY,"1");
      close();
    };
  }

  function show(){
    if(installed())return;
    build();
    document.querySelector("#ap-install-overlay")?.classList.add("open");
  }

  async function runInstall(){
    const message=document.querySelector("#ap-install-message");
    if(deferredPrompt){
      deferredPrompt.prompt();
      const result=await deferredPrompt.userChoice;
      deferredPrompt=null;
      if(message)message.textContent=result.outcome==="accepted"?"Apprenticeship+ is being installed.":"Installation was cancelled.";
      if(result.outcome==="accepted")setTimeout(close,700);
      return;
    }
    showHelp();
  }

  function showHelp(){
    const message=document.querySelector("#ap-install-message");
    if(!message)return;
    message.innerHTML=`Open your browser menu and select <strong>Install app</strong> or <strong>Add to Home screen</strong>. Make sure you are on this main Apprenticeship+ page, not inside an individual course.`;
  }

  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    deferredPrompt=event;
    const query=new URLSearchParams(location.search);
    if(query.get("install")==="1")show();
  });

  window.addEventListener("appinstalled",()=>{
    localStorage.setItem(SEEN_KEY,"installed");
    close();
  });

  const query=new URLSearchParams(location.search);
  const firstVisit=!localStorage.getItem(SEEN_KEY);
  if(query.get("install")==="1"){
    setTimeout(show,350);
  }else if(firstVisit&&!installed()){
    setTimeout(show,900);
  }
})();