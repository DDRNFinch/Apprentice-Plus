"use strict";
(function(){
  if(window.__AP_FIRST_LOGIN_SETUP__) return;
  window.__AP_FIRST_LOGIN_SETUP__ = true;

  const COURSE='Bricklaying';
  const SEEN_KEY="apprenticePlusSetupPromptSeenV1";
  const REMINDER_KEY="apprenticePlusLocalReminderPreferencesV3";
  const clean=value=>String(value||"").replace(/\s+/g," ").trim().toLowerCase();

  function learnerDetailsComplete(){
    const knownKeys=[
      "learnerName","apprenticeName","learnerDetails","apprenticePlusLearnerProfile",
      "apprenticePlusProfile","profileData"
    ];
    for(const key of knownKeys){
      const value=localStorage.getItem(key);
      if(!value)continue;
      try{
        const parsed=JSON.parse(value);
        if(parsed && typeof parsed==="object"){
          const name=parsed.name||parsed.learnerName||parsed.fullName||parsed.firstName;
          if(String(name||"").trim())return true;
        }
      }catch{
        if(String(value).trim().length>1)return true;
      }
    }
    const inputs=[...document.querySelectorAll('input[name*="name" i],input[id*="name" i]')];
    return inputs.some(input=>String(input.value||"").trim().length>1);
  }

  function remindersComplete(){
    try{
      const p=JSON.parse(localStorage.getItem(REMINDER_KEY)||"null");
      return !!(p && p.enabled && Array.isArray(p.days) && p.days.length && p.time);
    }catch{return false}
  }

  function goTo(label){
    const wanted=clean(label);
    const select=[...document.querySelectorAll("select")].find(s=>
      [...s.options].some(o=>clean(o.textContent).includes(wanted))
    );
    if(select){
      const option=[...select.options].find(o=>clean(o.textContent).includes(wanted));
      if(option){
        select.value=option.value;
        select.dispatchEvent(new Event("change",{bubbles:true}));
        close();
        return;
      }
    }
    const clickable=[...document.querySelectorAll("button,a")].find(el=>clean(el.textContent).includes(wanted));
    if(clickable){clickable.click();close()}
  }

  function close(){
    document.querySelector("#ap-setup-overlay")?.classList.remove("open");
  }

  function build(){
    if(document.querySelector("#ap-setup-overlay"))return;
    const detailsMissing=!learnerDetailsComplete();
    const remindersMissing=!remindersComplete();
    if(!detailsMissing&&!remindersMissing)return;
    if(localStorage.getItem(SEEN_KEY)==="dismissed")return;

    const overlay=document.createElement("div");
    overlay.id="ap-setup-overlay";
    overlay.className="ap-setup-overlay";
    overlay.innerHTML=`
      <div class="ap-setup-card">
        <small>GET STARTED</small>
        <h2>Finish setting up Apprentice+</h2>
        <p>Complete these quick steps so ${COURSE} can personalise your dashboard and reminders.</p>
        <div class="ap-setup-list">
          ${detailsMissing?`<div class="ap-setup-item"><span>1</span><div><strong>Complete learner details</strong><div>Add your name and learner information.</div></div></div>`:""}
          ${remindersMissing?`<div class="ap-setup-item"><span>${detailsMissing?2:1}</span><div><strong>Choose reminder settings</strong><div>Select reminder types, days and your preferred time.</div></div></div>`:""}
        </div>
        <div class="ap-setup-actions">
          ${detailsMissing?`<button class="ap-setup-primary" id="ap-setup-profile">Complete learner details</button>`:""}
          ${remindersMissing?`<button class="${detailsMissing?"ap-setup-secondary":"ap-setup-primary"}" id="ap-setup-reminders">Set reminder preferences</button>`:""}
          <button class="ap-setup-later" id="ap-setup-later">Remind me later</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.querySelector("#ap-setup-profile")?.addEventListener("click",()=>goTo("profile"));
    overlay.querySelector("#ap-setup-reminders")?.addEventListener("click",()=>goTo("profile"));
    overlay.querySelector("#ap-setup-later").addEventListener("click",()=>{
      localStorage.setItem(SEEN_KEY,"dismissed");
      close();
    });

    setTimeout(()=>overlay.classList.add("open"),500);
  }

  function reconsider(){
    if(learnerDetailsComplete()&&remindersComplete()){
      localStorage.removeItem(SEEN_KEY);
      close();
    }
  }

  let tries=0;
  const timer=setInterval(()=>{
    build();
    reconsider();
    if(++tries>30)clearInterval(timer);
  },300);

  new MutationObserver(()=>requestAnimationFrame(()=>{build();reconsider()}))
    .observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",build);
  else build();
})();