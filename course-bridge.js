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
  if(settings.course&&settings.course!==course){ location.replace("../../"); return; }

  const css=document.createElement("style");
  css.textContent=`
  .applus-launcher{position:fixed;right:12px;bottom:14px;z-index:2147483000;border:0;border-radius:999px;background:#152238;color:#fff;padding:10px 13px;font:800 13px Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.28)}
  .applus-modal{position:fixed;inset:0;z-index:2147483001;background:rgba(7,14,24,.72);display:grid;place-items:center;padding:18px;font-family:Arial,sans-serif}
  .applus-card{width:min(430px,100%);background:#fff;color:#152238;border-radius:20px;padding:20px;box-shadow:0 22px 70px rgba(0,0,0,.4)}
  .applus-card h2{margin:0 0 8px}.applus-card p{color:#66717d}.applus-card label{display:block;font-weight:800;margin:12px 0 5px}.applus-card input{width:100%;padding:12px;border:1px solid #d7dbe0;border-radius:10px;font:inherit}.applus-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.applus-actions button{border:0;border-radius:10px;padding:10px 13px;font-weight:800}.applus-cancel{background:#e9edf2}.applus-primary{background:#a92323;color:white}.applus-error{min-height:20px;color:#a92323;font-weight:800;margin-top:7px}
  `;
  document.head.appendChild(css);
  const launcher=document.createElement("button");
  launcher.className="applus-launcher";
  launcher.textContent=`A+ · ${CFG[course].icon} ${CFG[course].name}`;
  launcher.type="button";
  launcher.onclick=showDialog;
  document.body.appendChild(launcher);

  function showDialog(){
    const wrap=document.createElement("div"); wrap.className="applus-modal";
    wrap.innerHTML=`<div class="applus-card"><h2>Apprentice+ course</h2><p>Current course: <b>${CFG[course].icon} ${CFG[course].name}</b></p><label>Tutor PIN</label><input id="applusPin" type="password" inputmode="numeric" autocomplete="off"><div class="applus-error" id="applusError"></div><div class="applus-actions"><button class="applus-cancel" id="applusCancel">Cancel</button><button class="applus-primary" id="applusUnlock">Change course</button></div></div>`;
    document.body.appendChild(wrap);
    const input=wrap.querySelector('#applusPin');
    wrap.querySelector('#applusCancel').onclick=()=>wrap.remove();
    wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};
    wrap.querySelector('#applusUnlock').onclick=()=>{
      if(input.value!==String(settings.pin||'2468')){wrap.querySelector('#applusError').textContent='Incorrect tutor PIN.';return;}
      sessionStorage.setItem('apprenticePlusCourseUnlocked','1');
      location.href='../../?choose=1';
    };
  }
})();