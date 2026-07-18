"use strict";
(function(){
  if(window.__APPRENTICESHIP_PLUS_ACADEMY__) return;
  window.__APPRENTICESHIP_PLUS_ACADEMY__=true;

  const COURSE_LIBRARY=[
    {id:"manual-handling",title:"Manual Handling",category:"Health & Safety",minutes:15,xp:500,status:"coming-soon"},
    {id:"coshh-awareness",title:"COSHH Awareness",category:"Health & Safety",minutes:20,xp:500,status:"coming-soon"},
    {id:"equality-diversity",title:"Equality and Diversity",category:"Personal Development",minutes:15,xp:500,status:"coming-soon"},
    {id:"british-values",title:"British Values",category:"Personal Development",minutes:15,xp:500,status:"coming-soon"},
    {id:"fire-safety",title:"Fire Safety Awareness",category:"Health & Safety",minutes:15,xp:500,status:"coming-soon"},
    {id:"ppe-awareness",title:"PPE Awareness",category:"Health & Safety",minutes:15,xp:500,status:"coming-soon"},
    {id:"environmental-awareness",title:"Environmental Awareness",category:"Sustainability",minutes:15,xp:500,status:"coming-soon"},
    {id:"mental-health-awareness",title:"Mental Health Awareness",category:"Wellbeing",minutes:20,xp:500,status:"coming-soon"}
  ];

  const norm=v=>String(v||"").trim().toLowerCase();
  const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

  function detectTrade(){
    const text=(document.title+" "+document.body.innerText.slice(0,1500)).toLowerCase();
    if(text.includes("brick")) return "Bricklaying";
    if(text.includes("bench")) return "Bench Joinery";
    if(text.includes("property maintenance")||text.includes("pmo")) return "Property Maintenance";
    return "Site Carpentry";
  }

  function readDashboard(){
    const candidates=[
      "apprenticeshipPlusDashboard",
      "apDashboardData",
      "apprenticePlusDashboard",
      "modernDashboardData"
    ];
    for(const key of candidates){
      try{
        const parsed=JSON.parse(localStorage.getItem(key)||"null");
        if(parsed&&typeof parsed==="object") return parsed;
      }catch(e){}
    }
    return {};
  }

  function metrics(){
    const data=readDashboard();
    const completed=Number(data.completed||data.completedAssignments||0);
    const photos=Number(data.photos||data.photoCount||0);
    const streak=Number(data.streak||0);
    const xp=completed*120+Math.min(photos,100)*8+Math.min(streak,30)*25;
    const levels=[
      {level:1,title:"Starter",min:0,next:500},
      {level:2,title:"Developing Apprentice",min:500,next:1200},
      {level:3,title:"Skilled Apprentice",min:1200,next:2200},
      {level:4,title:"Advanced Apprentice",min:2200,next:3500},
      {level:5,title:"EPA Contender",min:3500,next:5000},
      {level:6,title:"EPA Ready",min:5000,next:7000}
    ];
    const current=[...levels].reverse().find(x=>xp>=x.min)||levels[0];
    const progress=Math.max(0,Math.min(100,Math.round((xp-current.min)/(current.next-current.min)*100)));
    return {completed,photos,streak,xp,level:current.level,title:current.title,progress};
  }

  function findSelect(){
    return [...document.querySelectorAll("select")].find(select=>{
      const labels=[...select.options].map(o=>norm(o.textContent));
      return labels.includes("home")&&labels.includes("assignments");
    });
  }

  function ensureOption(select){
    let option=[...select.options].find(o=>o.value==="__academy__");
    if(!option){
      option=document.createElement("option");
      option.value="__academy__";
      option.textContent="Academy";
      const revision=[...select.options].find(o=>norm(o.textContent)==="revision");
      if(revision) select.insertBefore(option,revision);
      else select.appendChild(option);
    }
  }

  function courseCard(course){
    return `<article class="apa-course-card">
      <div class="apa-course-icon">${course.title.split(" ").map(x=>x[0]).join("").slice(0,2)}</div>
      <div class="apa-course-copy">
        <small>${esc(course.category)}</small>
        <h3>${esc(course.title)}</h3>
        <div class="apa-course-meta">
          <span>${course.minutes} minutes</span>
          <span>90% pass</span>
          <span>+${course.xp} XP</span>
        </div>
      </div>
      <div class="apa-course-side"><span class="apa-status">Coming soon</span><b>›</b></div>
    </article>`;
  }

  function render(){
    const m=metrics(), trade=detectTrade();
    let root=document.getElementById("ap-academy-root");
    if(!root){
      root=document.createElement("main");
      root.id="ap-academy-root";
      root.className="apa-root";
      document.body.appendChild(root);
    }
    root.innerHTML=`
      <section class="apa-hero">
        <button class="apa-back" type="button" aria-label="Return to Home">‹</button>
        <div class="apa-hero-copy">
          <div class="apa-kicker"><span>APPRENTICESHIP+</span><b>ACADEMY</b></div>
          <h1>Build skills beyond the trade</h1>
          <p>Complete short in-house learning modules, earn XP and collect certificates throughout your apprenticeship.</p>
          <div class="apa-hero-actions">
            <button type="button" data-scroll="courses">Explore courses</button>
            <button type="button" data-view="certificates">View certificates</button>
          </div>
        </div>
        <div class="apa-level-card">
          <div class="apa-level-ring"><span>${m.level}</span></div>
          <div>
            <small>YOUR CURRENT LEVEL</small>
            <strong>${esc(m.title)}</strong>
            <b>${m.xp.toLocaleString()} XP</b>
            <div class="apa-level-track"><i style="width:${m.progress}%"></i></div>
            <em>${m.progress}% to the next level</em>
          </div>
        </div>
      </section>

      <section class="apa-grid">
        <button class="apa-feature apa-achievements" type="button" data-view="achievements">
          <div class="apa-feature-icon"><span>XP</span></div>
          <div><small>ACHIEVEMENT CENTRE</small><h2>Badges, levels and milestones</h2><p>View your progress and prepare your achievement certificate.</p></div>
          <span>Open ›</span>
        </button>
        <button class="apa-feature apa-certificates" type="button" data-view="certificates">
          <div class="apa-feature-icon"><span>PDF</span></div>
          <div><small>DOCUMENT LIBRARY</small><h2>In-house certificates</h2><p>Your earned Academy certificates will appear here automatically.</p></div>
          <span>Open ›</span>
        </button>
      </section>

      <section class="apa-snapshot">
        <div><strong>${m.completed}</strong><span>Assignments completed</span></div>
        <div><strong>${m.photos}</strong><span>Evidence photos</span></div>
        <div><strong>${m.streak}</strong><span>Day activity streak</span></div>
        <div><strong>${COURSE_LIBRARY.length}</strong><span>Courses prepared</span></div>
      </section>

      <section class="apa-panel" id="apa-courses">
        <div class="apa-heading"><div><small>SHORT COURSES</small><h2>Academy course library</h2><p>Professional in-house learning that can be completed alongside any trade.</p></div><span>${COURSE_LIBRARY.length} prepared</span></div>
        <p class="apa-notice"><strong>Phase 1 foundation:</strong> course content and assessments will be activated in the next phase. All courses are shared across ${esc(trade)} and every other trade.</p>
        <div class="apa-course-list">${COURSE_LIBRARY.map(courseCard).join("")}</div>
      </section>

      <section class="apa-panel apa-coming">
        <div><small>COMING NEXT</small><h2>Learn, pass and earn</h2><p>Each course will include learning content and a multiple-choice assessment. A score of 90% or higher will unlock an Apprenticeship+ in-house certificate.</p></div>
        <div class="apa-disclaimer"><strong>In-house training only</strong><p>Academy certificates will not be accredited qualifications, regulated awards or certificates issued by an awarding organisation.</p></div>
      </section>

      <div class="apa-subview" hidden>
        <button class="apa-subview-back" type="button">‹ Academy</button>
        <div class="apa-subview-content"></div>
      </div>`;
    wire(root,m);
  }

  function wire(root,m){
    root.querySelector(".apa-back").onclick=close;
    root.querySelectorAll("[data-view]").forEach(btn=>btn.onclick=()=>openSubview(btn.dataset.view,m));
    root.querySelector("[data-scroll='courses']")?.addEventListener("click",()=>document.getElementById("apa-courses")?.scrollIntoView({behavior:"smooth",block:"start"}));
    root.querySelector(".apa-subview-back").onclick=()=>root.querySelector(".apa-subview").hidden=true;
  }

  function openSubview(view,m){
    const sub=document.querySelector(".apa-subview");
    const content=sub.querySelector(".apa-subview-content");
    if(view==="achievements"){
      content.innerHTML=`<section class="apa-panel"><small>ACHIEVEMENT CENTRE</small><h1>Level ${m.level}: ${esc(m.title)}</h1>
      <div class="apa-stat-grid"><div><strong>${m.xp}</strong><span>Total XP</span></div><div><strong>${m.completed}/20</strong><span>Assignments</span></div><div><strong>${m.photos}</strong><span>Evidence photos</span></div><div><strong>${m.streak}</strong><span>Day streak</span></div></div>
      <button class="apa-primary" disabled>Generate progress certificate — Phase 2</button></section>`;
    }else{
      content.innerHTML=`<section class="apa-panel"><small>DOCUMENT LIBRARY</small><h1>Your in-house certificates</h1>
      <div class="apa-empty"><div>PDF</div><h2>No Academy certificates yet</h2><p>Certificates earned from passed short courses will be stored here and added to Portfolio → Documents in a later phase.</p></div></section>`;
    }
    sub.hidden=false;
    sub.scrollTop=0;
  }

  function open(){
    const select=findSelect();
    if(select){ensureOption(select);select.value="__academy__";}
    document.documentElement.classList.add("apa-open");
    render();
  }

  function close(){
    document.documentElement.classList.remove("apa-open");
    document.getElementById("ap-academy-root")?.remove();
    const select=findSelect();
    if(select){
      const home=[...select.options].find(o=>norm(o.textContent)==="home");
      if(home){select.value=home.value;select.dispatchEvent(new Event("change",{bubbles:true}));}
    }
  }

  function initialise(){
    const select=findSelect();
    if(!select)return;
    ensureOption(select);
    if(select.dataset.academyReady)return;
    select.dataset.academyReady="true";
    select.addEventListener("change",event=>{
      if(select.value==="__academy__"){
        event.stopImmediatePropagation();
        open();
      }else if(document.documentElement.classList.contains("apa-open")){
        document.documentElement.classList.remove("apa-open");
        document.getElementById("ap-academy-root")?.remove();
      }
    },true);
  }

  window.ApprenticeshipPlusAcademy={open,close,render};

  new MutationObserver(initialise).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialise);
  else initialise();
})();