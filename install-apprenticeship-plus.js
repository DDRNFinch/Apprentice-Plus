"use strict";
(function(){
  if(window.__AP_INSTALL_FIX_V2__) return;
  window.__AP_INSTALL_FIX_V2__=true;

  const SEEN_KEY="apprenticeshipPlusInstallPromptSeenV2";
  let deferredPrompt=null;
  let promptReady=false;

  const isStandalone=()=>window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
  const isAndroid=()=>/Android/i.test(navigator.userAgent);
  const isSamsung=()=>/SamsungBrowser/i.test(navigator.userAgent);

  function overlay(){return document.querySelector("#ap-install-overlay")}
  function message(text){const el=document.querySelector("#ap-install-message");if(el)el.innerHTML=text}
  function installButton(){return document.querySelector("#ap-install-now")}

  function updateButton(){
    const button=installButton();
    if(!button)return;
    if(isStandalone()){
      button.textContent="Apprenticeship+ is installed";
      button.disabled=true;
      return;
    }
    if(promptReady){
      button.textContent="Install Apprenticeship+";
      button.disabled=false;
    }else{
      button.textContent=isSamsung()?"Show Samsung install steps":"Show install steps";
      button.disabled=false;
    }
  }

  function close(){
    overlay()?.classList.remove("open");
  }

  function build(){
    if(isStandalone()||overlay())return;
    const panel=document.createElement("div");
    panel.id="ap-install-overlay";
    panel.className="ap-install-overlay";
    panel.innerHTML=`
      <div class="ap-install-card">
        <img src="./icon-192.png" alt="Apprenticeship+">
        <small>INSTALL THE MAIN APP</small>
        <h2>Add Apprenticeship+ to your phone</h2>
        <p>Install Apprenticeship+ once. Bench, Site, Brick and PMO will all open inside this single app.</p>
        <button class="ap-install-primary" id="ap-install-now">Preparing installation…</button>
        <button class="ap-install-secondary" id="ap-install-retry">Check installation again</button>
        <button class="ap-install-later" id="ap-install-later">Not now</button>
        <div class="ap-install-message" id="ap-install-message"></div>
      </div>`;
    document.body.appendChild(panel);

    panel.querySelector("#ap-install-now").onclick=runInstall;
    panel.querySelector("#ap-install-retry").onclick=()=>{
      updateButton();
      if(!promptReady)showManualSteps();
    };
    panel.querySelector("#ap-install-later").onclick=()=>{
      localStorage.setItem(SEEN_KEY,"1");
      close();
    };
    updateButton();
  }

  function show(){
    if(isStandalone())return;
    build();
    overlay()?.classList.add("open");
    setTimeout(()=>{
      updateButton();
      if(!promptReady)message("The automatic install button will appear when your browser makes it available.");
    },500);
  }

  function showManualSteps(){
    if(isSamsung()){
      message("<strong>Samsung Internet:</strong> tap the menu button, choose <strong>Add page to</strong>, then <strong>Home screen</strong>. Make sure this main Apprenticeship+ page is open.");
    }else if(isAndroid()){
      message("<strong>Chrome/Android:</strong> tap the browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>. Make sure this main Apprenticeship+ page is open.");
    }else{
      message("Open your browser menu and choose <strong>Install Apprenticeship+</strong> or <strong>Add to Home Screen</strong>.");
    }
  }

  async function runInstall(){
    if(isStandalone()){
      message("Apprenticeship+ is already installed.");
      return;
    }

    if(!deferredPrompt){
      showManualSteps();
      return;
    }

    const button=installButton();
    button.disabled=true;
    button.textContent="Opening install…";

    try{
      deferredPrompt.prompt();
      const result=await deferredPrompt.userChoice;
      if(result.outcome==="accepted"){
        message("Apprenticeship+ is being installed.");
        localStorage.setItem(SEEN_KEY,"installed");
        setTimeout(close,900);
      }else{
        message("Installation was cancelled. You can try again.");
      }
    }catch(error){
      message("Your browser did not open the automatic installer. Use the browser menu and select <strong>Install app</strong>.");
    }finally{
      deferredPrompt=null;
      promptReady=false;
      updateButton();
    }
  }

  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    deferredPrompt=event;
    promptReady=true;
    updateButton();
    message("Apprenticeship+ is ready to install.");
  });

  window.addEventListener("appinstalled",()=>{
    localStorage.setItem(SEEN_KEY,"installed");
    message("Apprenticeship+ has been installed.");
    setTimeout(close,700);
  });

  const query=new URLSearchParams(location.search);
  const forced=query.get("install")==="1";
  const firstVisit=!localStorage.getItem(SEEN_KEY);

  if(forced||firstVisit){
    setTimeout(show,700);
  }
})();