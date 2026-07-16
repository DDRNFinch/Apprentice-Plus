(function(){
  "use strict";
  const CFG={
    brick:{name:"Bricklaying",icon:"🧱"},
    site:{name:"Site Carpentry",icon:"🏠"},
    bench:{name:"Bench Joinery",icon:"🪚"}
  };
  const parts=location.pathname.split("/");
  const course=parts.includes("brick")?"brick":parts.includes("site")?"site":parts.includes("bench")?"bench":null;
  if(!course)return;
  const SETTINGS_KEY="apprenticePlusSettingsV2";
  let settings={course:null,pin:"2468"};
  try{settings={...settings,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||"{}")}}catch(e){}
  if(settings.course&&settings.course!==course){location.replace("../../");return;}

  const PRIVACY=`Apprentice+ stores your work locally on this device. It does not send learner evidence to Apprentice+ servers. PDFs are only shared when you choose to download and upload them to Aptem or another approved platform.

Only include relevant evidence. Avoid unnecessary personal data, customer details, addresses, registrations and identifiable people unless there is a valid reason and permission.

Use Clear all local data to erase locally stored information. Download anything you need first because deletion cannot be undone.`;

  const css=document.createElement("style");
  css.textContent=`
  .applus-launcher{position:fixed;right:12px;bottom:14px;z-index:2147483000;border:0;border-radius:999px;background:#152238;color:#fff;padding:10px 13px;font:800 13px Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.28)}
  .applus-modal{position:fixed;inset:0;z-index:2147483001;background:rgba(7,14,24,.72);display:grid;place-items:center;padding:18px;font-family:Arial,sans-serif}
  .applus-card{width:min(460px,100%);max-height:88vh;overflow:auto;background:#fff;color:#152238;border-radius:20px;padding:20px;box-shadow:0 22px 70px rgba(0,0,0,.4)}
  .applus-card h2{margin:0 0 8px}.applus-card p{color:#66717d;line-height:1.45}.applus-menu{display:grid;gap:9px;margin-top:14px}.applus-menu button{border:0;border-radius:11px;padding:12px 13px;text-align:left;font-weight:800;background:#edf1f5;color:#152238}.applus-menu .danger{background:#a92323;color:#fff}
  .applus-card label{display:block;font-weight:800;margin:12px 0 5px}.applus-card input{width:100%;padding:12px;border:1px solid #d7dbe0;border-radius:10px;font:inherit}.applus-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.applus-actions button{border:0;border-radius:10px;padding:10px 13px;font-weight:800}.applus-cancel{background:#e9edf2}.applus-primary{background:#a92323;color:white}.applus-error{min-height:20px;color:#a92323;font-weight:800;margin-top:7px}.applus-version{font-size:12px;color:#7a8490;text-align:center;margin-top:14px}
  `;
  document.head.appendChild(css);

  const launcher=document.createElement("button");
  launcher.className="applus-launcher";
  launcher.textContent=`A+ · ${CFG[course].icon} ${CFG[course].name}`;
  launcher.type="button";
  launcher.onclick=showMenu;
  document.body.appendChild(launcher);

  function modal(html){
    const wrap=document.createElement("div");
    wrap.className="applus-modal";
    wrap.innerHTML=`<div class="applus-card">${html}</div>`;
    document.body.appendChild(wrap);
    wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};
    return wrap;
  }
  function showMenu(){
    const wrap=modal(`<h2>Apprentice+</h2><p>Current course: <b>${CFG[course].icon} ${CFG[course].name}</b></p>
      <div class="applus-menu">
        <button id="apChangeCourse">🔒 Change course</button>
        <button id="apPrivacy">🛡️ Privacy notice</button>
        <button id="apClear" class="danger">🗑️ Clear all local data</button>
        <button id="apClose">Close</button>
      </div><div class="applus-version">Apprentice+ Core v2.0</div>`);
    wrap.querySelector("#apClose").onclick=()=>wrap.remove();
    wrap.querySelector("#apPrivacy").onclick=()=>alert(PRIVACY);
    wrap.querySelector("#apClear").onclick=clearAll;
    wrap.querySelector("#apChangeCourse").onclick=()=>{wrap.remove();showPin()};
  }
  function showPin(){
    const wrap=modal(`<h2>Change course</h2><p>Enter the tutor PIN to unlock course selection.</p><label>Tutor PIN</label><input id="applusPin" type="password" inputmode="numeric" autocomplete="off"><div class="applus-error" id="applusError"></div><div class="applus-actions"><button class="applus-cancel" id="applusCancel">Cancel</button><button class="applus-primary" id="applusUnlock">Unlock</button></div>`);
    const input=wrap.querySelector("#applusPin");
    wrap.querySelector("#applusCancel").onclick=()=>wrap.remove();
    wrap.querySelector("#applusUnlock").onclick=()=>{
      if(input.value!==String(settings.pin||"2468")){wrap.querySelector("#applusError").textContent="Incorrect tutor PIN.";return;}
      sessionStorage.setItem("apprenticePlusCourseUnlocked","1");
      location.href="../../?choose=1";
    };
  }
  async function clearAll(){
    if(!confirm("Delete all Apprentice+ data stored on this device? Download any PDFs or evidence you need first."))return;
    if(!confirm("This cannot be undone. Continue?"))return;
    try{
      localStorage.clear();sessionStorage.clear();
      if(indexedDB&&indexedDB.databases){
        const dbs=await indexedDB.databases();
        await Promise.all(dbs.filter(db=>db.name).map(db=>new Promise(resolve=>{
          const req=indexedDB.deleteDatabase(db.name);
          req.onsuccess=req.onerror=req.onblocked=()=>resolve();
        })));
      }
      if("caches" in window){
        const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));
      }
      if("serviceWorker" in navigator){
        const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()));
      }
      alert("All locally stored Apprentice+ data has been removed.");
      location.replace("../../?reset=1");
    }catch(error){
      console.error(error);
      alert("Most local data was removed. Close Apprentice+ and clear this site's data in Chrome settings to finish.");
    }
  }
})();