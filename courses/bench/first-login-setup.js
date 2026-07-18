"use strict";
(function(){
  if(window.__AP_FIRST_LOGIN_SETUP_FIXED__) return;
  window.__AP_FIRST_LOGIN_SETUP_FIXED__=true;

  const COURSE='Bench Joinery';
  const APP_STATE_KEY="brick_buddy_2_0";
  const REMINDER_KEY="apprenticePlusLocalReminderPreferencesV3";
  const PROMPT_KEY="apprenticePlusSetupPromptDismissedV2";
  const clean=v=>String(v||"").replace(/\s+/g," ").trim().toLowerCase();

  function savedProfile(){
    try{
      const state=JSON.parse(localStorage.getItem(APP_STATE_KEY)||"null");
      return state?.profile||{};
    }catch{return {}}
  }

  function learnerDetailsComplete(){
    const profile=savedProfile();
    return !!(
      String(profile.learner||"").trim() &&
      String(profile.employer||"").trim() &&
      String(profile.assessor||"").trim()
    );
  }

  function remindersComplete(){
    try{
      const p=JSON.parse(localStorage.getItem(REMINDER_KEY)||"null");
      return !!(p && p.enabled && Array.isArray(p.days) && p.days.length && p.time);
    }catch{return false}
  }

  function closePrompt(){
    document.querySelector("#ap-setup-overlay")?.remove();
  }

  function navigateToProfile(){
    const select=[...document.querySelectorAll("select")].find(s=>
      [...s.options].some(o=>clean(o.textContent).includes("profile"))
    );
    if(select){
      const option=[...select.options].find(o=>clean(o.textContent).includes("profile"));
      select.value=option.value;
      select.dispatchEvent(new Event("change",{bubbles:true}));
      closePrompt();
      return;
    }
    const target=[...document.querySelectorAll("button,a")].find(el=>
      clean(el.textContent).includes("profile")
    );
    target?.click();
    closePrompt();
  }

  function buildPrompt(){
    if(document.querySelector("#ap-setup-overlay"))return;
    const detailsMissing=!learnerDetailsComplete();
    const remindersMissing=!remindersComplete();
    if(!detailsMissing&&!remindersMissing){
      localStorage.removeItem(PROMPT_KEY);
      return;
    }
    if(localStorage.getItem(PROMPT_KEY)==="1")return;

    const overlay=document.createElement("div");
    overlay.id="ap-setup-overlay";
    overlay.className="ap-setup-overlay open";
    overlay.innerHTML=`
      <div class="ap-setup-card">
        <small>GET STARTED</small>
        <h2>Finish setting up Apprentice+</h2>
        <p>Complete these quick steps so ${COURSE} can personalise your dashboard and reminders.</p>
        <div class="ap-setup-list">
          ${detailsMissing?`<div class="ap-setup-item"><span>1</span><div><strong>Complete learner details</strong><div>Add your name, employer and assessor.</div></div></div>`:""}
          ${remindersMissing?`<div class="ap-setup-item"><span>${detailsMissing?2:1}</span><div><strong>Choose reminder settings</strong><div>Select reminder types, days and your preferred time.</div></div></div>`:""}
        </div>
        <div class="ap-setup-actions">
          <button class="ap-setup-primary" id="ap-open-profile">${detailsMissing?"Complete learner details":"Set reminder preferences"}</button>
          <button class="ap-setup-later" id="ap-setup-later">Remind me later</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("#ap-open-profile").onclick=navigateToProfile;
    overlay.querySelector("#ap-setup-later").onclick=()=>{
      localStorage.setItem(PROMPT_KEY,"1");
      closePrompt();
    };
  }

  function monitorSave(){
    document.addEventListener("click",event=>{
      if(!event.target.closest("#saveProfile,#ap-profile-save-prefs"))return;
      setTimeout(()=>{
        if(learnerDetailsComplete()&&remindersComplete()){
          localStorage.removeItem(PROMPT_KEY);
          closePrompt();
        }
      },350);
    });
  }

  const start=()=>{
    monitorSave();
    setTimeout(buildPrompt,650);
  };
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);
  else start();
})();