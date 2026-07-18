"use strict";
(function(){
  if(window.ApprenticeshipPlusAcademy?.version==="first-class-v1") return;

  const COURSES=[
    {title:"Manual Handling",category:"Health & Safety",minutes:15,xp:500},
    {title:"COSHH Awareness",category:"Health & Safety",minutes:20,xp:500},
    {title:"Equality and Diversity",category:"Personal Development",minutes:15,xp:500},
    {title:"British Values",category:"Personal Development",minutes:15,xp:500},
    {title:"Fire Safety Awareness",category:"Health & Safety",minutes:15,xp:500},
    {title:"PPE Awareness",category:"Health & Safety",minutes:15,xp:500},
    {title:"Environmental Awareness",category:"Sustainability",minutes:15,xp:500},
    {title:"Mental Health Awareness",category:"Wellbeing",minutes:20,xp:500}
  ];

  const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));

  function readData(){
    const keys=["apprenticeshipPlusDashboard","apDashboardData","apprenticePlusDashboard","modernDashboardData"];
    for(const key of keys){
      try{
        const value=JSON.parse(localStorage.getItem(key)||"null");
        if(value&&typeof value==="object") return value;
      }catch(error){}
    }
    return {};
  }

  function metrics(){
    const data=readData();
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
    const current=[...levels].reverse().find(item=>xp>=item.min)||levels[0];
    const progress=Math.max(0,Math.min(100,Math.round(((xp-current.min)/(current.next-current.min))*100)));
    return {completed,photos,streak,xp,level:current.level,title:current.title,progress};
  }

  function trade(){
    const path=location.pathname.toLowerCase();
    if(path.includes("/brick/")) return "Bricklaying";
    if(path.includes("/bench/")) return "Bench Joinery";
    if(path.includes("/pmo/")) return "Property Maintenance";
    return "Site Carpentry";
  }

  function courseCard(course){
    const initials=course.title.split(" ").map(word=>word[0]).join("").slice(0,2);
    return `<article class="apa-course-card">
      <div class="apa-course-icon">${initials}</div>
      <div class="apa-course-copy">
        <small>${esc(course.category)}</small>
        <h3>${esc(course.title)}</h3>
        <div class="apa-course-meta">
          <span>${course.minutes} minutes</span>
          <span>90% pass</span>
          <span>+${course.xp} XP</span>
        </div>
      </div>
      <div class="apa-course-status"><span>Coming soon</span><b>›</b></div>
    </article>`;
  }

  function mainMarkup(){
    const m=metrics();
    return `<div class="apa-page">
      <section class="apa-hero">
        <div class="apa-hero-copy">
          <div class="apa-kicker"><span>APPRENTICESHIP+</span><b>ACADEMY</b></div>
          <h1>Build skills beyond the trade</h1>
          <p>Complete short in-house learning modules, earn XP and collect certificates throughout your apprenticeship.</p>
          <div class="apa-hero-actions">
            <button type="button" data-academy-scroll="courses">Explore courses</button>
            <button type="button" data-academy-screen="certificates">View certificates</button>
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

      <section class="apa-feature-grid">
        <button class="apa-feature" type="button" data-academy-screen="achievements">
          <div class="apa-feature-icon">XP</div>
          <div><small>ACHIEVEMENT CENTRE</small><h2>Badges, levels and milestones</h2><p>Review your progress and prepare your achievement certificate.</p></div>
          <span>›</span>
        </button>
        <button class="apa-feature" type="button" data-academy-screen="certificates">
          <div class="apa-feature-icon">PDF</div>
          <div><small>DOCUMENT LIBRARY</small><h2>In-house certificates</h2><p>Your earned Academy certificates will appear here automatically.</p></div>
          <span>›</span>
        </button>
      </section>

      <section class="apa-snapshot">
        <div><strong>${m.completed}</strong><span>Assignments completed</span></div>
        <div><strong>${m.photos}</strong><span>Evidence photos</span></div>
        <div><strong>${m.streak}</strong><span>Day activity streak</span></div>
        <div><strong>${COURSES.length}</strong><span>Courses prepared</span></div>
      </section>

      <section class="apa-panel" id="apa-course-library">
        <div class="apa-heading">
          <div><small>SHORT COURSES</small><h2>Academy course library</h2><p>Professional in-house learning shared across every apprenticeship trade.</p></div>
          <span>${COURSES.length} prepared</span>
        </div>
        <div class="apa-course-list">${COURSES.map(courseCard).join("")}</div>
      </section>

      <section class="apa-panel apa-coming">
        <div><small>LEARN, PASS AND EARN</small><h2>Development alongside ${esc(trade())}</h2><p>Each course will include learning content and a multiple-choice assessment. A score of 90% or higher will unlock an Apprenticeship+ in-house certificate.</p></div>
        <div class="apa-disclaimer"><strong>In-house training only</strong><p>Academy certificates are not accredited qualifications, regulated awards or certificates issued by an awarding organisation.</p></div>
      </section>
    </div>`;
  }

  function subMarkup(screen){
    const m=metrics();
    if(screen==="achievements"){
      return `<div class="apa-page">
        <button class="apa-back" type="button" data-academy-screen="main">‹ Back to Academy</button>
        <section class="apa-panel">
          <small>ACHIEVEMENT CENTRE</small>
          <h1>Level ${m.level}: ${esc(m.title)}</h1>
          <div class="apa-stat-grid">
            <div><strong>${m.xp}</strong><span>Total XP</span></div>
            <div><strong>${m.completed}/20</strong><span>Assignments</span></div>
            <div><strong>${m.photos}</strong><span>Evidence photos</span></div>
            <div><strong>${m.streak}</strong><span>Day streak</span></div>
          </div>
          <button class="apa-disabled" disabled>Generate progress certificate — coming next</button>
        </section>
      </div>`;
    }
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-academy-screen="main">‹ Back to Academy</button>
      <section class="apa-panel">
        <small>DOCUMENT LIBRARY</small>
        <h1>Your in-house certificates</h1>
        <div class="apa-empty"><div>PDF</div><h2>No Academy certificates yet</h2><p>Certificates earned from passed short courses will be stored here and later added to Portfolio → Documents.</p></div>
      </section>
    </div>`;
  }

  function bind(container){
    container.querySelectorAll("[data-academy-screen]").forEach(button=>{
      button.addEventListener("click",()=>renderInto(container,button.dataset.academyScreen));
    });
    container.querySelector("[data-academy-scroll='courses']")?.addEventListener("click",()=>{
      container.querySelector("#apa-course-library")?.scrollIntoView({behavior:"smooth",block:"start"});
    });
  }

  function renderInto(container,screen="main"){
    if(!container) return;
    container.innerHTML=screen==="main"?mainMarkup():subMarkup(screen);
    container.classList.add("academy-view");
    bind(container);
    window.scrollTo({top:0,behavior:"auto"});
  }

  window.ApprenticeshipPlusAcademy={version:"first-class-v1",renderInto};
})();