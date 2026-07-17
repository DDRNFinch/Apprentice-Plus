"use strict";
(function(){
  if(window.__AP_FIREBASE_NOTIFICATIONS__) return;
  window.__AP_FIREBASE_NOTIFICATIONS__ = true;

  const FIREBASE_CONFIG={"apiKey": "AIzaSyCIILT-Lg2fQ2SI3uswbCCCzvpqk3SLVXg", "authDomain": "apprentice-plus-notifications.firebaseapp.com", "projectId": "apprentice-plus-notifications", "storageBucket": "apprentice-plus-notifications.firebasestorage.app", "messagingSenderId": "709798823441", "appId": "1:709798823441:web:29845352ac571c507c93b0", "measurementId": "G-H45SQ5BCZG"};
  const VAPID_KEY="BNKVBCtlpGFLlTU2dncHMSLt982SOgsNebCGNYOLQY7vH-39jcOzmVfps_GvdqC9wmCluk9FIXua9ugNhck6ZvA";
  const COURSE="Bench Joinery";
  const STORE_KEY="apprenticePlusNotificationCentreV2";
  const PREF_KEY="apprenticePlusPushPreferencesV2";
  const DAYS=["mon","tue","wed","thu","fri","sat","sun"];
  const DAY_LABELS={mon:"Mon",tue:"Tue",wed:"Wed",thu:"Thu",fri:"Fri",sat:"Sat",sun:"Sun"};

  const normalise=v=>String(v||"").replace(/\s+/g," ").trim().toLowerCase();
  const load=(key,fallback)=>{try{return {...fallback,...JSON.parse(localStorage.getItem(key)||"{}")}}catch{return fallback}};
  const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const escapeHTML=v=>String(v||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));

  function defaultPrefs(){
    return {
      types:{photos:true,assignments:true,otj:true,streaks:true,announcements:true},
      days:["wed","fri","sun"],
      time:"18:00",
      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"Europe/London"
    };
  }

  function preferences(){return load(PREF_KEY,defaultPrefs())}
  function notifications(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"[]")}catch{return []}}
  function storeNotification(item){
    const list=notifications();
    const record={id:item.id||String(Date.now()),title:item.title||"Apprenticeship+",body:item.body||"",route:item.route||"Home",createdAt:item.createdAt||new Date().toISOString(),read:false};
    if(!list.some(x=>x.id===record.id)){list.unshift(record);localStorage.setItem(STORE_KEY,JSON.stringify(list.slice(0,50)))}
    refreshBadge();renderList();
  }
  function refreshBadge(){
    const badge=document.querySelector(".ap-notification-badge");
    if(!badge)return;
    const count=notifications().filter(x=>!x.read).length;
    badge.textContent=count>9?"9+":String(count);badge.hidden=count===0;
  }
  function renderList(){
    const el=document.querySelector("#ap-notification-list");if(!el)return;
    const list=notifications();
    el.innerHTML=list.length?list.map(item=>`<button class="ap-notification-item ${item.read?"":"unread"}" data-id="${escapeHTML(item.id)}" data-route="${escapeHTML(item.route)}"><span class="ap-notification-dot"></span><div><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.body)}</p><small>${new Date(item.createdAt).toLocaleString()}</small></div></button>`).join(""):`<div class="ap-notification-empty"><strong>No notifications yet</strong><p>Your reminders and course updates will appear here.</p></div>`;
  }
  function routeTo(label){
    const select=[...document.querySelectorAll("select")].find(s=>[...s.options].some(o=>normalise(o.textContent)===normalise(label)));
    const option=select&&[...select.options].find(o=>normalise(o.textContent)===normalise(label));
    if(select&&option){select.value=option.value;select.dispatchEvent(new Event("change",{bubbles:true}))}
  }
  function closePanel(){document.querySelector("#ap-notification-panel")?.classList.remove("open");document.documentElement.classList.remove("ap-notifications-open")}
  function setStatus(message,type="",profile=false){
    const el=document.querySelector(profile?".ap-profile-status":"#ap-notification-status");
    if(el){el.textContent=message;el.className=profile?"ap-profile-status "+type:"ap-notification-status";if(!profile)el.dataset.type=type}
  }

  function buildBell(){
    if(document.querySelector("#ap-notification-button"))return;
    const button=document.createElement("button");
    button.id="ap-notification-button";button.className="ap-notification-button";button.setAttribute("aria-label","Open notifications");
    button.innerHTML=`<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 11a2 2 0 0 0 4 0h-4Z"/></svg><span class="ap-notification-badge" hidden>0</span>`;
    document.body.appendChild(button);

    const panel=document.createElement("div");
    panel.id="ap-notification-panel";panel.className="ap-notification-panel";
    panel.innerHTML=`<div class="ap-notification-sheet"><header><div><small>APPRENTICESHIP+</small><h2>Notifications</h2></div><button id="ap-close-notifications">×</button></header><div class="ap-notification-actions"><button id="ap-enable-push">Enable notifications</button><button id="ap-mark-read">Mark all read</button></div><div id="ap-notification-status" class="ap-notification-status"></div><div id="ap-notification-list"></div></div>`;
    document.body.appendChild(panel);

    button.onclick=()=>{panel.classList.add("open");document.documentElement.classList.add("ap-notifications-open");renderList()};
    panel.onclick=e=>{if(e.target===panel)closePanel()};
    panel.querySelector("#ap-close-notifications").onclick=closePanel;
    panel.querySelector("#ap-mark-read").onclick=()=>{localStorage.setItem(STORE_KEY,JSON.stringify(notifications().map(x=>({...x,read:true}))));refreshBadge();renderList()};
    panel.querySelector("#ap-enable-push").onclick=enablePush;
    panel.querySelector("#ap-notification-list").onclick=e=>{
      const item=e.target.closest(".ap-notification-item");if(!item)return;
      localStorage.setItem(STORE_KEY,JSON.stringify(notifications().map(x=>x.id===item.dataset.id?{...x,read:true}:x)));
      refreshBadge();closePanel();routeTo(item.dataset.route||"Home");
    };
    refreshBadge();
  }

  function isProfile(){
    const text=normalise(document.body.innerText);
    return text.includes("profile")&&(
      [...document.querySelectorAll("h1,h2,h3")].some(el=>normalise(el.textContent)==="profile")||
      text.includes("settings")
    );
  }

  function buildProfileSettings(){
    if(!isProfile())return;
    if(document.querySelector(".ap-profile-notification-settings"))return;
    const root=document.createElement("section");
    root.className="ap-profile-notification-settings";
    const p=preferences();
    root.innerHTML=`
      <small>NOTIFICATIONS</small>
      <h2>Reminder settings</h2>
      <p>Choose exactly what Apprentice+ reminds you about and when.</p>
      <fieldset><legend>Notification types</legend>
        ${[["photos","Evidence-photo reminders"],["assignments","Unfinished assignments"],["otj","Off-the-job learning"],["streaks","Streak and achievement updates"],["announcements","Tutor and course announcements"]].map(([key,label])=>`<label><input type="checkbox" data-pref-type="${key}" ${p.types?.[key]!==false?"checked":""}> ${label}</label>`).join("")}
      </fieldset>
      <fieldset><legend>Reminder days</legend><div class="ap-day-grid">
        ${DAYS.map(day=>`<label><input type="checkbox" data-pref-day="${day}" ${(p.days||[]).includes(day)?"checked":""}><span>${DAY_LABELS[day]}</span></label>`).join("")}
      </div></fieldset>
      <label class="ap-time-row">Preferred time <input type="time" id="ap-profile-pref-time" value="${escapeHTML(p.time||"18:00")}"></label>
      <button id="ap-profile-enable-push">${Notification.permission==="granted"?"Notifications enabled":"Enable notifications"}</button>
      <button id="ap-profile-save-prefs" style="margin-top:10px;background:#e7f4f0;color:#075b63">Save reminder settings</button>
      <div class="ap-profile-status"></div>`;
    const main=document.querySelector("main")||document.body;
    main.appendChild(root);
    root.querySelector("#ap-profile-enable-push").onclick=enablePush;
    root.querySelector("#ap-profile-save-prefs").onclick=saveProfilePreferences;
  }

  async function saveProfilePreferences(){
    const types={};
    document.querySelectorAll("[data-pref-type]").forEach(el=>types[el.dataset.prefType]=el.checked);
    const days=[...document.querySelectorAll("[data-pref-day]:checked")].map(el=>el.dataset.prefDay);
    const p={types,days,time:document.querySelector("#ap-profile-pref-time")?.value||"18:00",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"Europe/London"};
    save(PREF_KEY,p);
    setStatus("Reminder settings saved.","success",true);
    if(window.__apFirebase?.user)await saveDevice(window.__apFirebase.token||null);
  }

  function loadFirebaseScripts(){
    const scripts=["https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js","https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js","https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"];
    return scripts.reduce((p,src)=>p.then(()=>new Promise((resolve,reject)=>{
      if(document.querySelector(`script[src="${src}"]`))return resolve();
      const s=document.createElement("script");s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    })),Promise.resolve());
  }
  async function tokenId(token){const hash=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(token));return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("")}
  async function initialiseFirebase(){
    if(window.__apFirebase)return window.__apFirebase;
    await loadFirebaseScripts();
    if(!firebase.apps.length)firebase.initializeApp(FIREBASE_CONFIG);
    const auth=firebase.auth(),db=firebase.firestore(),messaging=firebase.messaging.isSupported()?firebase.messaging():null;
    const credential=await auth.signInAnonymously();
    window.__apFirebase={auth,db,messaging,user:credential.user,token:null};
    if(messaging)messaging.onMessage(payload=>{
      const data=payload.data||{},note=payload.notification||{};
      storeNotification({id:data.messageId,title:note.title||data.title,body:note.body||data.body,route:data.route||"Home"});
    });
    return window.__apFirebase;
  }
  async function saveDevice(token){
    const ctx=window.__apFirebase;if(!ctx?.user||!ctx?.db)return;
    const id=await tokenId(token||ctx.user.uid);
    await ctx.db.collection("users").doc(ctx.user.uid).collection("devices").doc(id).set({
      uid:ctx.user.uid,token:token||ctx.token||null,course:COURSE,enabled:Notification.permission==="granted",preferences:preferences(),userAgent:navigator.userAgent.slice(0,300),updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
  }

  async function enablePush(event){
    const buttons=[document.querySelector("#ap-enable-push"),document.querySelector("#ap-profile-enable-push")].filter(Boolean);
    buttons.forEach(btn=>{btn.textContent="Enabling…";btn.disabled=true});
    try{
      setStatus("Connecting notifications…");
      setStatus("Connecting notifications…","",true);
      const permission=await Notification.requestPermission();
      if(permission!=="granted")throw new Error("Notification permission was not granted.");
      buttons.forEach(btn=>btn.textContent="Notifications enabled");
      const ctx=await initialiseFirebase();
      if(!ctx.messaging)throw new Error("Firebase messaging is not supported on this device.");
      const registration=await navigator.serviceWorker.ready;
      const token=await ctx.messaging.getToken({vapidKey:VAPID_KEY,serviceWorkerRegistration:registration});
      if(!token)throw new Error("No notification token was returned.");
      ctx.token=token;await saveDevice(token);
      buttons.forEach(btn=>{btn.textContent="Notifications enabled";btn.disabled=false});
      setStatus("Push notifications are enabled.","success");
      setStatus("Push notifications are enabled.","success",true);
      storeNotification({title:"Notifications enabled",body:`${COURSE} reminders are active on this device.`,route:"Home"});
    }catch(error){
      buttons.forEach(btn=>{btn.textContent="Enable notifications";btn.disabled=false});
      setStatus(error.message||"Notifications could not be enabled.","error");
      setStatus(error.message||"Notifications could not be enabled.","error",true);
    }
  }

  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;buildBell();buildProfileSettings()});
  }).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{buildBell();buildProfileSettings()});
  else{buildBell();buildProfileSettings()}
})();