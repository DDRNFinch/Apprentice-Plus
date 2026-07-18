"use strict";
(function(){
  if(window.__AP_LOCAL_REMINDERS__) return;
  window.__AP_LOCAL_REMINDERS__=true;

  const COURSE='Bench Joinery';
  const STORE_KEY="apprenticePlusNotificationCentreV3";
  const PREF_KEY="apprenticePlusLocalReminderPreferencesV3";
  const LAST_KEY="apprenticePlusLastLocalReminderV3";
  const DAYS=["sun","mon","tue","wed","thu","fri","sat"];
  const LABELS={sun:"Sun",mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat"};

  const normalise=v=>String(v||"").replace(/\s+/g," ").trim().toLowerCase();
  const escapeHTML=v=>String(v||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
  const load=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key)||"null");return value?{...fallback,...value}:fallback}catch{return fallback}};
  const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));

  function defaults(){
    return {
      enabled:true,
      types:{photos:true,assignments:true,otj:true,revision:true,streaks:true,achievements:true,announcements:true},
      days:["mon","wed","fri"],
      time:"18:00"
    };
  }

  function prefs(){return load(PREF_KEY,defaults())}
  function notices(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"[]")}catch{return []}}

  function learnerName(){
    const candidates=[
      localStorage.getItem("learnerName"),
      localStorage.getItem("apprenticeName"),
      document.querySelector('input[name*="name" i]')?.value,
      document.querySelector('[data-learner-name]')?.textContent
    ].filter(Boolean);
    const name=String(candidates[0]||"").trim().split(/\s+/)[0];
    return name&&name.length<30?name:"";
  }

  function pageText(){return normalise(document.body.innerText)}

  function firstNumber(patterns){
    const text=document.body.innerText||"";
    for(const pattern of patterns){
      const match=text.match(pattern);
      if(match)return Number(match[1]);
    }
    return null;
  }

  function progressSnapshot(){
    const text=pageText();
    const completed=firstNumber([/(\d+)\s*assignments?\s*complete/i,/assignments?\s*complete\s*(\d+)/i]);
    const total=firstNumber([/(\d+)\s*total\s*assignments?/i,/out of\s*(\d+)\s*assignments?/i]);
    const percent=firstNumber([/assignment progress\s*(\d+)%/i,/portfolio progress\s*(\d+)%/i,/overall progress\s*(\d+)%/i]);
    const streak=firstNumber([/(\d+)\s*day\s*streak/i,/current streak\s*(\d+)/i]);
    const photoCount=firstNumber([/(\d+)\s*photos?/i]);
    const hasAssignment=text.includes("assignment");
    const hasRevision=text.includes("revision");
    const hasOTJ=text.includes("off-the-job")||text.includes("otj");
    return {completed,total,percent,streak,photoCount,hasAssignment,hasRevision,hasOTJ};
  }

  function greeting(){
    const hour=new Date().getHours();
    const part=hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";
    const name=learnerName();
    return name?`${part} ${name}!`:part+"!";
  }

  function personalisedReminder(){
    const p=prefs(),s=progressSnapshot(),options=[];
    if(p.types.photos){
      if(s.photoCount===0)options.push({title:greeting(),body:"You have not added any evidence photos yet. Take your first clear workplace photo today.",route:"Assignments"});
      else options.push({title:"Keep your evidence moving",body:"Add one clear photo and a short explanation of what you did and learned.",route:"Assignments"});
    }
    if(p.types.assignments&&s.hasAssignment){
      if(s.completed!=null&&s.total!=null&&s.total>s.completed){
        const left=s.total-s.completed;
        options.push({title:"You are making progress",body:`You have ${left} assignment${left===1?"":"s"} left. Open the next one and complete one small section today.`,route:"Assignments"});
      }else if(s.percent!=null){
        options.push({title:"Continue your portfolio",body:`Your visible assignment progress is ${s.percent}%. A short evidence update today will keep it moving.`,route:"Assignments"});
      }else options.push({title:"Your next useful step",body:"Open your current assignment and complete one photo, note or knowledge answer.",route:"Assignments"});
    }
    if(p.types.otj&&s.hasOTJ)options.push({title:"Record learning while it is fresh",body:"Add your latest off-the-job learning: what you did, what you learned and how long it took.",route:"Portfolio"});
    if(p.types.revision&&s.hasRevision)options.push({title:"Quick revision challenge",body:"Complete one short revision activity today to strengthen your knowledge before EPA.",route:"Revision"});
    if(p.types.streaks&&s.streak!=null)options.push({title:`Keep your ${s.streak}-day streak going`,body:"One small update today is enough to keep your learning momentum.",route:"Home"});
    if(p.types.achievements&&s.percent!=null&&s.percent>=75)options.push({title:"You are closing in on completion",body:`You are showing ${s.percent}% progress. Keep going—your next completed section could unlock another achievement.`,route:"Home"});
    if(!options.length)options.push({title:greeting(),body:`Open ${COURSE} and complete one useful learning action today.`,route:"Home"});
    return options[Math.floor(Date.now()/86400000)%options.length];
  }

  function addNotice(item,showPhone=false){
    const list=notices();
    const record={
      id:item.id||`${COURSE}-${new Date().toISOString().slice(0,10)}-${item.route||"Home"}`,
      title:item.title||"Apprenticeship+",
      body:item.body||"",
      route:item.route||"Home",
      createdAt:item.createdAt||new Date().toISOString(),
      read:false
    };
    if(!list.some(x=>x.id===record.id)){
      list.unshift(record);localStorage.setItem(STORE_KEY,JSON.stringify(list.slice(0,50)));
      if(showPhone&&"Notification" in window&&Notification.permission==="granted"){
        try{new Notification(record.title,{body:record.body,icon:"./icon-192.png",tag:record.id})}catch{}
      }
    }
    refreshBadge();renderList();
  }

  function dueNow(){
    const p=prefs();
    if(!p.enabled)return false;
    const now=new Date(),day=DAYS[now.getDay()];
    if(!(p.days||[]).includes(day))return false;
    const [h,m]=String(p.time||"18:00").split(":").map(Number);
    if(now.getHours()*60+now.getMinutes()<h*60+m)return false;
    const today=now.toISOString().slice(0,10);
    return localStorage.getItem(LAST_KEY)!==today;
  }

  function checkReminder(){
    if(!dueNow())return;
    const reminder=personalisedReminder();
    addNotice({...reminder,id:`local-${COURSE}-${new Date().toISOString().slice(0,10)}`},true);
    localStorage.setItem(LAST_KEY,new Date().toISOString().slice(0,10));
  }

  function refreshBadge(){
    const badge=document.querySelector(".ap-notification-badge");if(!badge)return;
    const count=notices().filter(x=>!x.read).length;
    badge.textContent=count>9?"9+":String(count);badge.hidden=count===0;
  }

  function renderList(){
    const el=document.querySelector("#ap-notification-list");if(!el)return;
    const list=notices();
    el.innerHTML=list.length?list.map(item=>`<button class="ap-notification-item ${item.read?"":"unread"}" data-id="${escapeHTML(item.id)}" data-route="${escapeHTML(item.route)}"><span class="ap-notification-dot"></span><div><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.body)}</p><small>${new Date(item.createdAt).toLocaleString()}</small></div></button>`).join(""):`<div class="ap-notification-empty"><strong>No reminders yet</strong><p>Your personalised reminders will appear here when they are due.</p></div>`;
  }

  function routeTo(label){
    const select=[...document.querySelectorAll("select")].find(s=>[...s.options].some(o=>normalise(o.textContent)===normalise(label)));
    const option=select&&[...select.options].find(o=>normalise(o.textContent)===normalise(label));
    if(select&&option){select.value=option.value;select.dispatchEvent(new Event("change",{bubbles:true}))}
  }

  function closePanel(){document.querySelector("#ap-notification-panel")?.classList.remove("open");document.documentElement.classList.remove("ap-notifications-open")}
  function status(message,type="",profile=false){
    const el=document.querySelector(profile?".ap-profile-status":"#ap-notification-status");
    if(!el)return;
    el.textContent=message;
    if(profile)el.className="ap-profile-status "+type;
    else el.dataset.type=type;
  }

  async function enableLocal(){
    const buttons=[document.querySelector("#ap-enable-local"),document.querySelector("#ap-profile-enable-local")].filter(Boolean);
    buttons.forEach(btn=>{btn.textContent="Enabling…";btn.disabled=true});
    try{
      let permission="default";
      if("Notification" in window)permission=await Notification.requestPermission();
      const p=prefs();p.enabled=true;save(PREF_KEY,p);
      buttons.forEach(btn=>{btn.textContent=permission==="granted"?"Reminders enabled":"In-app reminders enabled";btn.disabled=false});
      status(permission==="granted"?"Local notifications are enabled.":"In-app reminders are enabled. They will appear when Apprentice+ is opened.","success");
      status(permission==="granted"?"Local notifications are enabled.":"In-app reminders are enabled.","success",true);
      addNotice({id:"local-enabled-"+COURSE,title:"Reminders enabled",body:`${COURSE} will now check your chosen reminder days and times whenever Apprentice+ is opened.`,route:"Home"});
    }catch(error){
      buttons.forEach(btn=>{btn.textContent="Enable reminders";btn.disabled=false});
      status("Reminders could not be enabled.","error");
    }
  }

  function buildBell(){
    if(document.querySelector("#ap-notification-button"))return;
    const button=document.createElement("button");
    button.id="ap-notification-button";button.className="ap-notification-button";button.setAttribute("aria-label","Open reminders");
    button.innerHTML=`<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 11a2 2 0 0 0 4 0h-4Z"/></svg><span class="ap-notification-badge" hidden>0</span>`;
    document.body.appendChild(button);
    const panel=document.createElement("div");
    panel.id="ap-notification-panel";panel.className="ap-notification-panel";
    panel.innerHTML=`<div class="ap-notification-sheet"><header><div><small>APPRENTICESHIP+</small><h2>Reminders</h2></div><button id="ap-close-notifications">×</button></header><div class="ap-notification-actions"><button id="ap-enable-local">Enable reminders</button><button id="ap-mark-read">Mark all read</button></div><div class="ap-local-note">This free version checks reminders whenever Apprentice+ is opened or being used. It does not use Firebase or create any charges.</div><div id="ap-notification-status" class="ap-notification-status"></div><div id="ap-notification-list"></div></div>`;
    document.body.appendChild(panel);
    button.onclick=()=>{panel.classList.add("open");document.documentElement.classList.add("ap-notifications-open");renderList()};
    panel.onclick=e=>{if(e.target===panel)closePanel()};
    panel.querySelector("#ap-close-notifications").onclick=closePanel;
    panel.querySelector("#ap-enable-local").onclick=enableLocal;
    panel.querySelector("#ap-mark-read").onclick=()=>{localStorage.setItem(STORE_KEY,JSON.stringify(notices().map(x=>({...x,read:true}))));refreshBadge();renderList()};
    panel.querySelector("#ap-notification-list").onclick=e=>{
      const item=e.target.closest(".ap-notification-item");if(!item)return;
      localStorage.setItem(STORE_KEY,JSON.stringify(notices().map(x=>x.id===item.dataset.id?{...x,read:true}:x)));
      refreshBadge();closePanel();routeTo(item.dataset.route||"Home");
    };
    refreshBadge();
  }

  function isProfile(){
    return !!document.querySelector("#saveProfile,#profileLearner");
  }

  function saveSettings(){
    const types={};
    document.querySelectorAll("[data-pref-type]").forEach(el=>types[el.dataset.prefType]=el.checked);
    const days=[...document.querySelectorAll("[data-pref-day]:checked")].map(el=>el.dataset.prefDay);
    save(PREF_KEY,{enabled:true,types,days,time:document.querySelector("#ap-profile-pref-time")?.value||"18:00"});
    status("Reminder settings saved.","success",true);
    checkReminder();
  }

  function buildProfile(){
    if(!isProfile()||document.querySelector(".ap-profile-notification-settings"))return;
    const p=prefs(),root=document.createElement("section");
    root.className="ap-profile-notification-settings";
    root.innerHTML=`
      <small>REMINDERS</small><h2>Personal reminder settings</h2>
      <p>Choose what Apprentice+ should remind you about when you next open the app.</p>
      <fieldset><legend>Reminder types</legend>
      ${[["photos","Evidence-photo reminders"],["assignments","Unfinished assignments"],["otj","Off-the-job learning"],["revision","Revision"],["streaks","Streak updates"],["achievements","Achievements"],["announcements","Tutor announcements"]].map(([key,label])=>`<label><input type="checkbox" data-pref-type="${key}" ${p.types?.[key]!==false?"checked":""}> ${label}</label>`).join("")}
      </fieldset>
      <fieldset><legend>Reminder days</legend><div class="ap-day-grid">
      ${DAYS.slice(1).concat("sun").map(day=>`<label><input type="checkbox" data-pref-day="${day}" ${(p.days||[]).includes(day)?"checked":""}><span>${LABELS[day]}</span></label>`).join("")}
      </div></fieldset>
      <label class="ap-time-row">Preferred time <input type="time" id="ap-profile-pref-time" value="${escapeHTML(p.time||"18:00")}"></label>
      <button id="ap-profile-enable-local">${p.enabled?"Reminders enabled":"Enable reminders"}</button>
      <button id="ap-profile-save-prefs" style="margin-top:10px;background:#e7f4f0;color:#075b63">Save reminder settings</button>
      <div class="ap-profile-status"></div>`;
    const learnerSection=document.querySelector("#saveProfile")?.closest("section,.card");
    if(learnerSection && learnerSection.parentNode){
      learnerSection.insertAdjacentElement("afterend",root);
    }else{
      (document.querySelector("main")||document.body).appendChild(root);
    }
    root.querySelector("#ap-profile-enable-local").onclick=enableLocal;
    root.querySelector("#ap-profile-save-prefs").onclick=saveSettings;
  }

  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;buildBell();buildProfile();checkReminder()});
  }).observe(document.documentElement,{childList:true,subtree:true});

  const start=()=>{buildBell();buildProfile();checkReminder();setInterval(checkReminder,60000)};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();