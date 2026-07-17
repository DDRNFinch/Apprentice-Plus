"use strict";
(function(){
  if(window.__AP_MODERN_DASHBOARD__) return;
  window.__AP_MODERN_DASHBOARD__ = true;

  const TOTAL_ASSIGNMENTS=20;
  const STORE_KEY="apprenticePlusBenchDashboardV1";
  const clean=value=>String(value||"").replace(/\s+/g," ").trim().toLowerCase();

  function todayKey(date=new Date()){
    return date.toISOString().slice(0,10);
  }

  function load(){
    try{
      return {
        activityDays:[],
        longestStreak:0,
        reminders:{photos:true,assignments:true,weekly:true,enabled:false},
        achievements:[],
        ...JSON.parse(localStorage.getItem(STORE_KEY)||"{}")
      };
    }catch{
      return {activityDays:[],longestStreak:0,reminders:{photos:true,assignments:true,weekly:true,enabled:false},achievements:[]};
    }
  }

  function save(data){
    localStorage.setItem(STORE_KEY,JSON.stringify(data));
  }

  function recordActivity(){
    const data=load();
    const today=todayKey();
    data.activityDays=[...new Set([...(data.activityDays||[]),today])].sort();
    data.longestStreak=Math.max(data.longestStreak||0,currentStreak(data.activityDays));
    save(data);
  }

  function currentStreak(days){
    const set=new Set(days||[]);
    let date=new Date();
    let count=0;
    // Allow today's streak or a streak ending yesterday.
    if(!set.has(todayKey(date))){
      date.setDate(date.getDate()-1);
    }
    while(set.has(todayKey(date))){
      count++;
      date.setDate(date.getDate()-1);
    }
    return count;
  }

  function walk(value,stats,seen=new WeakSet()){
    if(value===null||value===undefined)return;
    if(typeof value==="object"){
      if(seen.has(value))return;
      seen.add(value);

      if(Array.isArray(value)){
        value.forEach(item=>walk(item,stats,seen));
        return;
      }

      Object.entries(value).forEach(([key,item])=>{
        const k=clean(key);
        if(k.includes("evidenceitem")&&Array.isArray(item)) stats.photos+=item.filter(x=>x&&((x.isImage===true)||String(x.type||"").startsWith("image/"))).length;
        if(k.includes("photo")&&Array.isArray(item)) stats.photos+=item.filter(Boolean).length;
        if((k.includes("generated")||k.includes("pdf"))&&item){
          if(typeof item==="object"||item===true||typeof item==="string") stats.pdfs++;
        }
        if((k.includes("description")||k.includes("statement"))&&typeof item==="string"&&item.trim().split(/\s+/).length>=50) stats.statements++;
        if((k.includes("complete")||k.includes("ready"))&&item===true) stats.completionSignals++;
        walk(item,stats,seen);
      });
    }
  }

  function storageStats(){
    const stats={photos:0,pdfs:0,statements:0,completionSignals:0};
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(key===STORE_KEY)continue;
      try{walk(JSON.parse(localStorage.getItem(key)),stats);}catch{}
    }
    stats.photos=Math.min(stats.photos,9999);
    stats.pdfs=Math.min(stats.pdfs,999);
    stats.statements=Math.min(stats.statements,999);
    return stats;
  }

  function completedAssignments(){
    const body=document.body.innerText;
    const patterns=[
      /(\d+)\s*\/\s*20\s*(?:assignments?)?/i,
      /(\d+)\s*(?:of|out of)\s*20\s*(?:assignments?)?/i,
      /assignments?\s*(?:complete|completed)?\s*[:\-]?\s*(\d+)\s*\/\s*20/i
    ];
    for(const pattern of patterns){
      const match=body.match(pattern);
      if(match)return Math.max(0,Math.min(TOTAL_ASSIGNMENTS,Number(match[1])));
    }

    const stats=storageStats();
    return Math.max(0,Math.min(TOTAL_ASSIGNMENTS,Math.max(stats.pdfs,stats.completionSignals)));
  }

  function learnerName(){
    const heading=[...document.querySelectorAll("h1,h2,h3")].find(el=>/welcome back/i.test(el.textContent||""));
    const match=heading?.textContent.match(/welcome back,?\s*(.+)/i);
    return match?.[1]?.replace(/[!,.]+$/,"").trim()||"Apprentice";
  }

  function isHome(){
    return [...document.querySelectorAll("h1,h2,h3")].some(el=>{
      const style=getComputedStyle(el);
      return style.display!=="none"&&/welcome back|epa readiness/i.test(el.textContent||"");
    });
  }

  function goTo(label){
    const select=[...document.querySelectorAll("select")].find(s=>
      [...s.options].some(o=>clean(o.textContent)===clean(label))
    );
    const option=select&&[...select.options].find(o=>clean(o.textContent)===clean(label));
    if(select&&option){
      select.value=option.value;
      select.dispatchEvent(new Event("change",{bubbles:true}));
    }
  }

  function nextAssignment(completed){
    return Math.min(TOTAL_ASSIGNMENTS,completed+1);
  }

  function achievements(completed,stats,streak){
    const items=[
      {name:"First Step",text:"Complete your first assignment",done:completed>=1},
      {name:"Evidence Builder",text:"Upload 25 evidence photos",done:stats.photos>=25},
      {name:"Portfolio Progress",text:"Complete 5 assignments",done:completed>=5},
      {name:"Consistent Learner",text:"Build a 7-day activity streak",done:streak>=7},
      {name:"Halfway There",text:"Complete 10 assignments",done:completed>=10},
      {name:"EPA Ready",text:"Complete all 20 assignments",done:completed>=20}
    ];
    return items;
  }

  function journeyHTML(completed){
    const current=nextAssignment(completed);
    const visible=[];
    for(let i=1;i<=TOTAL_ASSIGNMENTS;i++){
      if(i<=3||i>=TOTAL_ASSIGNMENTS-1||Math.abs(i-current)<=2){
        visible.push(i);
      }else if(visible[visible.length-1]!=="…"){
        visible.push("…");
      }
    }
    return visible.map(item=>{
      if(item==="…")return `<div class="ap-journey-gap">•••</div>`;
      const status=item<=completed?"done":item===current?"current":"future";
      return `<button class="ap-journey-step ${status}" data-open-assignment="${item}">
        <span>${item<=completed?"✓":item}</span>
        <div><strong>Assignment ${item}</strong><small>${item<=completed?"Completed":item===current?"Next to complete":"Upcoming"}</small></div>
      </button>`;
    }).join("");
  }

  function reminderText(completed,stats){
    const reminders=[];
    if(stats.photos===0)reminders.push("Take your first evidence photos.");
    if(completed<TOTAL_ASSIGNMENTS)reminders.push(`Continue Assignment ${nextAssignment(completed)}.`);
    if(stats.statements<completed)reminders.push("Finish any outstanding evidence statements.");
    return reminders.slice(0,3);
  }

  function notify(title,body){
    if("Notification" in window&&Notification.permission==="granted"){
      try{new Notification(title,{body,icon:"./icon-192.png"});}catch{}
    }
  }

  async function enableNotifications(){
    if(!("Notification" in window)){
      alert("Notifications are not supported by this browser.");
      return false;
    }
    const permission=await Notification.requestPermission();
    const data=load();
    data.reminders.enabled=permission==="granted";
    save(data);
    if(permission==="granted"){
      notify("Apprenticeship+ reminders enabled","You will see helpful reminders when you use the app.");
      return true;
    }
    return false;
  }

  function maybeShowReminder(completed,stats){
    const data=load();
    if(!data.reminders?.enabled||Notification.permission!=="granted")return;
    const last=data.lastReminderDate;
    const today=todayKey();
    if(last===today)return;
    const reminders=reminderText(completed,stats);
    if(reminders.length){
      notify("Your Apprentice+ reminder",reminders[0]);
      data.lastReminderDate=today;
      save(data);
    }
  }

  function hideOldHome(){
    [...document.querySelectorAll("h1,h2,h3")].forEach(heading=>{
      if(!/welcome back|epa readiness/i.test(heading.textContent||""))return;
      let card=heading;
      for(let i=0;card&&i<7;i++,card=card.parentElement){
        const rect=card.getBoundingClientRect();
        const style=getComputedStyle(card);
        if(rect.width>250&&rect.height>120&&(parseFloat(style.borderRadius)>=10||style.borderStyle!=="none")){
          card.classList.add("ap-old-home-hidden");
          break;
        }
      }
    });
  }

  function render(){
    if(!isHome())return;
    hideOldHome();

    let root=document.querySelector("#ap-modern-dashboard");
    if(!root){
      root=document.createElement("section");
      root.id="ap-modern-dashboard";
      const nav=document.querySelector(".ap-nav-shell");
      if(nav)nav.insertAdjacentElement("afterend",root);
      else document.querySelector("main")?.prepend(root);
    }

    const completed=completedAssignments();
    const percent=Math.round((completed/TOTAL_ASSIGNMENTS)*100);
    const stats=storageStats();
    const data=load();
    const streak=currentStreak(data.activityDays);
    const awards=achievements(completed,stats,streak);
    const unlocked=awards.filter(x=>x.done).length;
    const reminders=reminderText(completed,stats);

    root.innerHTML=`
      <div class="ap-dash-welcome">
        <div>
          <small>YOUR APPRENTICESHIP JOURNEY</small>
          <h1>Welcome back, ${learnerName()}</h1>
          <p>Keep building evidence and moving towards EPA.</p>
        </div>
        <div class="ap-progress-ring" style="--progress:${percent}">
          <strong>${percent}%</strong><span>complete</span>
        </div>
      </div>

      <div class="ap-dashboard-grid">
        <article class="ap-dashboard-card ap-progress-card">
          <div class="ap-card-heading"><span>Assignment progress</span><strong>${completed}/${TOTAL_ASSIGNMENTS}</strong></div>
          <div class="ap-progress-track"><i style="width:${percent}%"></i></div>
          <button class="ap-primary-action" data-dashboard-route="Assignments">Continue Assignment ${nextAssignment(completed)}</button>
        </article>

        <article class="ap-dashboard-card ap-streak-card">
          <small>CURRENT STREAK</small>
          <strong>${streak}</strong>
          <span>${streak===1?"active day":"active days"}</span>
          <p>Longest streak: ${data.longestStreak||streak} days</p>
        </article>
      </div>

      <div class="ap-stat-grid">
        <article><span>Evidence photos</span><strong>${stats.photos}</strong></article>
        <article><span>Statements</span><strong>${stats.statements}</strong></article>
        <article><span>PDFs generated</span><strong>${stats.pdfs}</strong></article>
        <article><span>Achievements</span><strong>${unlocked}/${awards.length}</strong></article>
      </div>

      <article class="ap-dashboard-card">
        <div class="ap-section-heading"><div><small>PROGRESS ROADMAP</small><h2>Your journey to EPA</h2></div><span>${completed} completed</span></div>
        <div class="ap-journey">${journeyHTML(completed)}</div>
      </article>

      <article class="ap-dashboard-card">
        <div class="ap-section-heading"><div><small>MILESTONES</small><h2>Achievements</h2></div><span>${unlocked} unlocked</span></div>
        <div class="ap-achievement-grid">
          ${awards.map(item=>`<div class="ap-achievement ${item.done?"unlocked":"locked"}">
            <span>${item.done?"✓":"○"}</span><div><strong>${item.name}</strong><small>${item.text}</small></div>
          </div>`).join("")}
        </div>
      </article>

      <article class="ap-dashboard-card ap-reminder-card">
        <div class="ap-section-heading"><div><small>SMART REMINDERS</small><h2>Stay on track</h2></div></div>
        <div class="ap-reminder-list">
          ${reminders.length?reminders.map(text=>`<div><span>•</span><p>${text}</p></div>`).join(""):"<p>Everything is up to date.</p>"}
        </div>
        <button class="ap-secondary-action" id="ap-enable-reminders">${data.reminders?.enabled?"Notifications enabled":"Enable notifications"}</button>
        <small class="ap-reminder-note">Reminders appear when the app is opened or being used. True background push notifications require a separate notification service.</small>
      </article>
    `;

    root.querySelectorAll("[data-dashboard-route]").forEach(button=>{
      button.onclick=()=>goTo(button.dataset.dashboardRoute);
    });

    root.querySelectorAll("[data-open-assignment]").forEach(button=>{
      button.onclick=()=>{
        goTo("Assignments");
        setTimeout(()=>{
          const id=button.dataset.openAssignment;
          const target=document.querySelector(`[data-open-assignment="${id}"],[data-assignment-id="${id}"]`);
          if(target&&target!==button)target.click();
        },150);
      };
    });

    root.querySelector("#ap-enable-reminders").onclick=async event=>{
      const enabled=await enableNotifications();
      event.currentTarget.textContent=enabled?"Notifications enabled":"Enable notifications";
    };

    maybeShowReminder(completed,stats);
  }

  document.addEventListener("click",event=>{
    const target=event.target.closest("button,input[type=file],textarea");
    if(!target)return;
    const text=clean(target.textContent||target.getAttribute("aria-label")||"");
    if(target.matches("input[type=file]")||text.includes("generate pdf")||text.includes("save")||text.includes("complete")){
      recordActivity();
      setTimeout(render,200);
    }
  },true);

  document.addEventListener("change",event=>{
    if(event.target.matches("input[type=file],textarea"))recordActivity();
  },true);

  let queued=false;
  const dashboardObserver=new MutationObserver(mutations=>{
    // Ignore mutations created by the dashboard itself. Rebuilding the whole
    // dashboard during a touch scroll interrupts Android's scroll momentum.
    const hasExternalMutation=mutations.some(mutation=>{
      const target=mutation.target.nodeType===Node.ELEMENT_NODE
        ? mutation.target
        : mutation.target.parentElement;
      return !target?.closest?.("#ap-modern-dashboard");
    });

    if(!hasExternalMutation||queued)return;

    queued=true;
    requestAnimationFrame(()=>{
      queued=false;
      render();
    });
  });

  dashboardObserver.observe(document.documentElement,{
    childList:true,
    subtree:true
  });

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render);
  else render();
})();