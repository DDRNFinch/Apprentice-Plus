"use strict";
(function(){
  if(window.ApprenticeshipPlusAcademy?.version==="phase5-v1") return;

  const STORAGE_KEY="apprenticeshipPlusAcademyProgressV1";
  const PROFILE_KEY="apprenticeshipPlusAcademyLearnerProfileV1";
  const CERTIFICATE_KEY="apprenticeshipPlusAcademyCertificatesV1";

  const COURSES=[
    {
      id:"manual-handling",
      title:"Manual Handling",
      category:"Health & Safety",
      minutes:15,
      xp:500,
      passMark:90,
      status:"available",
      description:"Learn how to assess manual-handling tasks, reduce risk and use safer lifting and carrying techniques.",
      lessons:[
        {
          title:"What is manual handling?",
          text:"Manual handling means transporting or supporting a load by hand or bodily force. It includes lifting, lowering, pushing, pulling, carrying and moving objects. The safest approach is always to avoid unnecessary manual handling where reasonably practicable.",
          points:["Lifting and lowering","Pushing and pulling","Carrying or supporting loads"]
        },
        {
          title:"Why injuries happen",
          text:"Manual-handling injuries often affect the back, shoulders, arms, hands and knees. Injuries can happen suddenly, but they may also develop gradually through repeated poor technique, heavy loads, awkward posture or excessive carrying distances.",
          points:["Heavy or unstable loads","Twisting and reaching","Repetition and fatigue"]
        },
        {
          title:"Assess before you lift",
          text:"Before moving anything, pause and assess the task. Consider the load, the individual, the task and the environment. This is commonly remembered as TILE. Stop and ask for help when the task cannot be completed safely.",
          points:["T — Task","I — Individual","L — Load","E — Environment"]
        },
        {
          title:"Plan the route",
          text:"Check where the load is going before lifting. Remove obstacles, identify changes in level, open doors and make sure the destination is ready. A clear route helps prevent trips, sudden movements and carrying a load for longer than necessary.",
          points:["Remove trip hazards","Check doorways and stairs","Prepare the set-down area"]
        },
        {
          title:"Safe lifting position",
          text:"Stand close to the load with a stable base. Bend the knees and hips rather than stooping from the waist. Keep the natural curve of the back, get a secure grip and keep the load close to the body.",
          points:["Feet apart for balance","Secure grip","Load close to the body"]
        },
        {
          title:"Lift smoothly",
          text:"Use the legs to rise smoothly and avoid jerking. Keep looking ahead and do not twist while lifting. Turn by moving the feet. If the load becomes unstable or too heavy, place it down safely and reassess.",
          points:["Avoid sudden movement","Move the feet to turn","Stop if control is lost"]
        },
        {
          title:"Use mechanical assistance",
          text:"Trolleys, sack trucks, pallet trucks, lifting tables and other aids can reduce risk. Equipment must be suitable, inspected and used correctly. Team lifting may help, but it still requires planning and clear communication.",
          points:["Use the right aid","Check equipment condition","Coordinate team lifts"]
        },
        {
          title:"Your responsibilities",
          text:"Follow training and safe systems of work, use equipment correctly and report hazards, defects, pain or near misses. Never continue with a task that you believe is unsafe. Speak to a supervisor and agree a safer method.",
          points:["Follow instructions","Report problems early","Do not take unnecessary risks"]
        }
      ],
      questions:[
        {
          q:"Which activity is classed as manual handling?",
          options:["Only lifting above shoulder height","Lifting, lowering, pushing, pulling or carrying a load","Only moving loads heavier than 25 kg","Operating any powered machine"],
          answer:1
        },
        {
          q:"What should you do first before moving a load?",
          options:["Lift it quickly","Test it by twisting","Assess the task and load","Ask someone to watch"],
          answer:2
        },
        {
          q:"What does the L in TILE represent?",
          options:["Legislation","Load","Location","Limit"],
          answer:1
        },
        {
          q:"Which is the safest body position when beginning a lift?",
          options:["Load held away from the body","Feet together and back bent","Stable stance with the load close","Twisting towards the destination"],
          answer:2
        },
        {
          q:"How should you change direction while carrying a load?",
          options:["Twist through the waist","Move your feet","Lean sideways","Turn only the shoulders"],
          answer:1
        },
        {
          q:"What should happen if a load feels too heavy or unstable?",
          options:["Continue before becoming tired","Carry it at arm's length","Put it down safely and reassess","Lift faster"],
          answer:2
        },
        {
          q:"Why should the route be checked before lifting?",
          options:["To make the load lighter","To identify obstacles and prepare the destination","To avoid using lifting equipment","To reduce the number of workers"],
          answer:1
        },
        {
          q:"Which option can reduce manual-handling risk?",
          options:["Carrying more in one journey","Using a suitable trolley or lifting aid","Holding the load above the head","Working without breaks"],
          answer:1
        },
        {
          q:"What is important during a team lift?",
          options:["Each person moves independently","One person gives clear coordinated instructions","The strongest person carries most of the weight","The load is passed between people while walking"],
          answer:1
        },
        {
          q:"What should a learner do if manual handling causes pain?",
          options:["Ignore it until the task is complete","Report it and stop or reassess the task","Work faster","Change hands only"],
          answer:1
        }
      ]
    },
    {
      id:"coshh-awareness",
      title:"COSHH Awareness",
      category:"Health & Safety",
      minutes:20,
      xp:500,
      passMark:90,
      status:"available",
      description:"Learn how hazardous substances can affect health and how COSHH information, controls, storage and emergency procedures reduce risk.",
      lessons:[
        {
          title:"What COSHH means",
          text:"COSHH stands for the Control of Substances Hazardous to Health Regulations. COSHH requires employers to assess risks from hazardous substances and prevent or adequately control exposure. Workers must follow the controls, training and instructions provided.",
          points:["Control hazardous substances","Assess exposure risks","Use the agreed controls"]
        },
        {
          title:"Recognising hazardous substances",
          text:"Hazardous substances may be liquids, dusts, fumes, vapours, gases, mists or biological agents. Construction examples include cement, wood dust, solvents, adhesives, paints, cleaning chemicals and silica dust.",
          points:["Check labels and packaging","Consider dust, vapour and fumes","Do not rely only on smell"]
        },
        {
          title:"Hazard labels and pictograms",
          text:"Chemical containers use hazard pictograms and warning statements. These can identify risks such as flammability, corrosion, toxicity, serious health effects or environmental harm. Never use an unlabelled substance.",
          points:["Read the product label","Understand warning symbols","Report missing or damaged labels"]
        },
        {
          title:"Safety Data Sheets",
          text:"A Safety Data Sheet provides detailed information about a substance, including hazards, handling, storage, exposure controls, first aid, spill response and disposal. It supports the COSHH assessment but does not replace it.",
          points:["Check handling instructions","Find first-aid information","Use the correct storage guidance"]
        },
        {
          title:"Routes of exposure",
          text:"Hazardous substances can enter the body by breathing them in, swallowing them, skin or eye contact, or injection through damaged skin. The controls must match the likely route of exposure.",
          points:["Inhalation","Skin and eye contact","Ingestion or injection"]
        },
        {
          title:"The control hierarchy",
          text:"The best control is to remove the hazardous substance or replace it with a safer alternative. Where this is not possible, use engineering controls such as enclosure, extraction or wet methods before relying on PPE and RPE.",
          points:["Eliminate or substitute first","Use extraction or wet methods","PPE is the final layer"]
        },
        {
          title:"Using PPE and RPE",
          text:"PPE and RPE must be suitable for the substance and task. Respiratory protection must have the correct filter and fit the wearer. Tight-fitting masks require face-fit testing and a clean-shaven seal area.",
          points:["Select the correct protection","Inspect before use","Wear and remove it correctly"]
        },
        {
          title:"Storage and housekeeping",
          text:"Keep hazardous substances in approved, labelled containers and store them securely according to the assessment and Safety Data Sheet. Keep lids closed, separate incompatible products and prevent contamination of drains, soil and work areas.",
          points:["Use labelled containers","Secure storage areas","Keep workspaces clean"]
        },
        {
          title:"Spills and emergencies",
          text:"Follow the site emergency procedure for spills, splashes or exposure. Raise the alarm, isolate the area and use the correct spill kit only if trained. Seek first aid and report the incident or near miss.",
          points:["Do not improvise","Use emergency information","Report exposure promptly"]
        },
        {
          title:"Health surveillance and reporting",
          text:"Some work may require health surveillance, such as checks for dermatitis or breathing problems. Attend any required checks and report symptoms early. Records and early intervention help prevent long-term ill health.",
          points:["Report symptoms early","Attend required surveillance","Review controls after problems"]
        }
      ],
      questions:[
        {
          q:"What does COSHH stand for?",
          options:["Control of Site Health Hazards","Control of Substances Hazardous to Health","Construction Operations Safety and Health Handbook","Chemical Organisation Storage and Handling"],
          answer:1
        },
        {
          q:"Which can be a hazardous substance?",
          options:["Only liquids with a warning label","Dust, fumes, vapour, gases and liquids","Only products kept in a chemical store","Only substances that smell strong"],
          answer:1
        },
        {
          q:"What should you do with an unlabelled chemical container?",
          options:["Use a small amount to identify it","Smell it carefully","Do not use it and report it","Pour it into another container"],
          answer:2
        },
        {
          q:"What information can a Safety Data Sheet provide?",
          options:["Employee attendance records","Hazards, handling, first aid and spill response","The site's fire-alarm test dates","Only the purchase price"],
          answer:1
        },
        {
          q:"Which is a route of exposure?",
          options:["Inhalation","Measurement","Inspection","Supervision"],
          answer:0
        },
        {
          q:"What should be considered before relying on PPE?",
          options:["Working faster","Elimination, substitution and engineering controls","Using two pairs of gloves for every task","Moving the substance outdoors"],
          answer:1
        },
        {
          q:"What is required for a tight-fitting respirator to work correctly?",
          options:["A face-fit test and a good seal","A hard hat worn over it","A larger filter than specified","A wet face seal"],
          answer:0
        },
        {
          q:"How should hazardous substances normally be stored?",
          options:["In any convenient drinks bottle","In approved labelled containers according to instructions","With lids removed for ventilation","Next to drains for easy cleaning"],
          answer:1
        },
        {
          q:"What should you do after a hazardous-substance splash or exposure?",
          options:["Wait until the end of the shift","Follow emergency procedures, seek first aid and report it","Wash the area only if it hurts","Continue working while someone checks the label"],
          answer:1
        },
        {
          q:"Why may health surveillance be required?",
          options:["To replace the COSHH assessment","To detect work-related health effects early","To decide who receives PPE","To record productivity"],
          answer:1
        }
      ]
    },
    {id:"equality-diversity",title:"Equality and Diversity",category:"Personal Development",minutes:15,xp:500,status:"coming-soon"},
    {id:"british-values",title:"British Values",category:"Personal Development",minutes:15,xp:500,status:"coming-soon"},
    {id:"fire-safety",title:"Fire Safety Awareness",category:"Health & Safety",minutes:15,xp:500,status:"coming-soon"},
    {id:"ppe-awareness",title:"PPE Awareness",category:"Health & Safety",minutes:15,xp:500,status:"coming-soon"},
    {id:"environmental-awareness",title:"Environmental Awareness",category:"Sustainability",minutes:15,xp:500,status:"coming-soon"},
    {id:"mental-health-awareness",title:"Mental Health Awareness",category:"Wellbeing",minutes:20,xp:500,status:"coming-soon"}
  ];

  const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));

  function loadProgress(){
    try{
      const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
      return value&&typeof value==="object"?value:{};
    }catch(error){
      return {};
    }
  }

  function saveProgress(progress){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  }

  function courseProgress(courseId){
    return loadProgress()[courseId]||{
      lessonIndex:0,
      lessonsViewed:[],
      attempts:0,
      bestScore:0,
      passed:false,
      completedAt:null,
      xpAwarded:false
    };
  }

  function updateCourseProgress(courseId,updates){
    const all=loadProgress();
    all[courseId]={...courseProgress(courseId),...updates};
    saveProgress(all);
    return all[courseId];
  }


  function loadProfile(){
    try{
      const profile=JSON.parse(localStorage.getItem(PROFILE_KEY)||"{}");
      return profile&&typeof profile==="object"?profile:{};
    }catch(error){
      return {};
    }
  }

  function saveProfile(profile){
    localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));
  }

  function loadCertificates(){
    try{
      const records=JSON.parse(localStorage.getItem(CERTIFICATE_KEY)||"{}");
      return records&&typeof records==="object"?records:{};
    }catch(error){
      return {};
    }
  }

  function saveCertificates(records){
    localStorage.setItem(CERTIFICATE_KEY,JSON.stringify(records));
  }

  function formatDate(value){
    const date=value?new Date(value):new Date();
    if(Number.isNaN(date.getTime()))return"";
    return date.toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
  }

  function certificateId(course,progress){
    const records=loadCertificates();
    if(records[course.id]?.certificateId)return records[course.id].certificateId;
    const date=new Date(progress.completedAt||Date.now());
    const stamp=[
      date.getFullYear(),
      String(date.getMonth()+1).padStart(2,"0"),
      String(date.getDate()).padStart(2,"0")
    ].join("");
    const random=Math.random().toString(36).slice(2,7).toUpperCase();
    return `AP-${course.id.replace(/[^a-z0-9]/gi,"").slice(0,6).toUpperCase()}-${stamp}-${random}`;
  }

  function ensureCertificateRecord(course){
    const progress=courseProgress(course.id);
    if(!progress.passed)return null;
    const records=loadCertificates();
    const existing=records[course.id]||{};
    const record={
      courseId:course.id,
      courseTitle:course.title,
      score:progress.bestScore,
      completedAt:progress.completedAt||new Date().toISOString(),
      certificateId:existing.certificateId||certificateId(course,progress),
      generatedAt:existing.generatedAt||null
    };
    records[course.id]=record;
    saveCertificates(records);
    return record;
  }

  function certificateName(){
    return String(loadProfile().name||"").trim();
  }

  function certificateMarkup(course){
    const record=ensureCertificateRecord(course);
    const profile=loadProfile();
    const name=String(profile.name||"").trim();
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-academy-screen="certificates">‹ Certificate library</button>
      <section class="apa-panel apa-certificate-setup">
        <small>IN-HOUSE CERTIFICATE</small>
        <h1>${esc(course.title)}</h1>
        <p>Enter the learner name exactly as it should appear. The certificate can then be opened and saved as a PDF using the phone or browser print menu.</p>
        <label class="apa-field">
          <span>Learner name</span>
          <input type="text" maxlength="80" autocomplete="name" value="${esc(name)}" data-certificate-name placeholder="Enter learner's full name">
        </label>
        <div class="apa-certificate-facts">
          <div><strong>${record.score}%</strong><span>Best score</span></div>
          <div><strong>${formatDate(record.completedAt)}</strong><span>Completed</span></div>
          <div><strong>${course.xp}</strong><span>XP earned</span></div>
        </div>
        <div class="apa-course-actions">
          <button class="apa-primary-action" type="button" data-open-certificate="${course.id}">Open certificate</button>
          <button class="apa-secondary-action" type="button" data-course-id="${course.id}">Return to course</button>
        </div>
        <p class="apa-smallprint">This is an Apprenticeship+ in-house training certificate. It is not an accredited qualification, regulated award or awarding-organisation certificate.</p>
      </section>
    </div>`;
  }

  function printableCertificate(course,name){
    const record=ensureCertificateRecord(course);
    const safeName=esc(name);
    const safeTitle=esc(course.title);
    const completed=formatDate(record.completedAt);
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${safeTitle} Certificate</title>
<style>
@page{size:A4 landscape;margin:0}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;font-family:Arial,Helvetica,sans-serif;background:#e9f1ef;color:#14383a}
body{padding:18px}
.certificate{width:calc(297mm - 20mm);min-height:calc(210mm - 20mm);margin:auto;background:#fff;border:10px solid #075e59;padding:12px;box-shadow:0 14px 50px rgba(0,0,0,.16)}
.inner{min-height:calc(190mm - 24px);border:2px solid #e1b94c;padding:28px 42px;text-align:center;position:relative;overflow:hidden}
.inner:before,.inner:after{content:"";position:absolute;width:260px;height:260px;border-radius:50%;background:#e8f5f1;z-index:0}
.inner:before{left:-150px;top:-150px}.inner:after{right:-150px;bottom:-150px}
.content{position:relative;z-index:1}
.brand{display:inline-flex;gap:10px;align-items:center;font-weight:900;letter-spacing:.12em;color:#075e59}
.brand b{background:#ffe38a;color:#533f08;border-radius:999px;padding:7px 12px}
.kicker{margin-top:32px;font-size:15px;letter-spacing:.22em;font-weight:800;color:#668080}
h1{font-size:42px;margin:12px 0 8px;color:#075e59}
.presented{font-size:18px;color:#718486;margin-top:22px}
.name{font-family:Georgia,serif;font-size:42px;font-style:italic;color:#142f31;margin:12px auto 18px;padding-bottom:12px;border-bottom:2px solid #d8e4e1;max-width:760px}
.statement{font-size:18px;line-height:1.55;max-width:820px;margin:0 auto}
.course{font-size:31px;font-weight:900;color:#08745f;margin:12px 0}
.details{display:flex;justify-content:center;gap:46px;margin-top:30px;flex-wrap:wrap}
.details div{min-width:150px}.details strong,.details span{display:block}.details strong{font-size:18px}.details span{font-size:12px;letter-spacing:.09em;color:#728586;margin-top:5px}
.disclaimer{font-size:10px;color:#7d8989;max-width:760px;margin:30px auto 0;line-height:1.45}
.actions{max-width:1000px;margin:12px auto;display:flex;justify-content:center;gap:10px}
.actions button{border:0;border-radius:12px;padding:12px 18px;font-weight:800}.print{background:#075e59;color:#fff}.close{background:#fff;color:#31595a}
@media print{body{padding:0;background:#fff}.certificate{width:297mm;height:210mm;box-shadow:none}.actions{display:none}}
@media(max-width:800px){body{padding:7px}.certificate{width:100%;min-height:auto;border-width:6px}.inner{min-height:0;padding:24px 15px}.kicker{margin-top:18px}h1{font-size:30px}.name{font-size:31px}.course{font-size:24px}.details{gap:18px}.statement{font-size:16px}}
</style>
</head>
<body>
<div class="actions"><button class="print" onclick="window.print()">Save / Print PDF</button><button class="close" onclick="window.close()">Close</button></div>
<section class="certificate">
  <div class="inner">
    <div class="content">
      <div class="brand"><span>APPRENTICESHIP+</span><b>ACADEMY</b></div>
      <div class="kicker">CERTIFICATE OF COMPLETION</div>
      <h1>In-house Training Certificate</h1>
      <div class="presented">This certificate is presented to</div>
      <div class="name">${safeName}</div>
      <div class="statement">for successfully completing the Apprenticeship+ Academy learning module</div>
      <div class="course">${safeTitle}</div>
      <div class="details">
        <div><strong>${record.score}%</strong><span>ASSESSMENT SCORE</span></div>
        <div><strong>${completed}</strong><span>COMPLETION DATE</span></div>
        <div><strong>${record.certificateId}</strong><span>CERTIFICATE ID</span></div>
      </div>
      <div class="disclaimer">This certificate confirms completion of an Apprenticeship+ in-house learning module. It is not an accredited qualification, regulated award, licence to practise, or certificate issued by an awarding organisation.</div>
    </div>
  </div>
</section>
</body>
</html>`;
  }

  function openPrintableCertificate(course,name){
    const cleanName=String(name||"").trim();
    if(!cleanName)return false;
    saveProfile({...loadProfile(),name:cleanName});
    const record=ensureCertificateRecord(course);
    const records=loadCertificates();
    records[course.id]={...record,generatedAt:new Date().toISOString()};
    saveCertificates(records);
    const popup=window.open("","_blank");
    if(!popup)return false;
    popup.document.open();
    popup.document.write(printableCertificate(course,cleanName));
    popup.document.close();
    return true;
  }

  function readDashboard(){
    const keys=["apprenticeshipPlusDashboard","apDashboardData","apprenticePlusDashboard","modernDashboardData"];
    for(const key of keys){
      try{
        const value=JSON.parse(localStorage.getItem(key)||"null");
        if(value&&typeof value==="object")return value;
      }catch(error){}
    }
    return {};
  }

  function academyXP(){
    return COURSES.reduce((total,course)=>{
      const progress=courseProgress(course.id);
      return total+(progress.passed?Number(course.xp||0):0);
    },0);
  }

  function metrics(){
    const data=readDashboard();
    const completed=Number(data.completed||data.completedAssignments||0);
    const photos=Number(data.photos||data.photoCount||0);
    const streak=Number(data.streak||0);
    const xp=completed*120+Math.min(photos,100)*8+Math.min(streak,30)*25+academyXP();
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
    return {completed,photos,streak,xp,academyXP:academyXP(),level:current.level,title:current.title,progress};
  }

  function trade(){
    const path=location.pathname.toLowerCase();
    if(path.includes("/brick/"))return"Bricklaying";
    if(path.includes("/bench/"))return"Bench Joinery";
    if(path.includes("/pmo/"))return"Property Maintenance";
    return"Site Carpentry";
  }

  function statusText(course){
    if(course.status!=="available")return"Coming soon";
    const progress=courseProgress(course.id);
    if(progress.passed)return`Passed · ${progress.bestScore}%`;
    if(progress.lessonsViewed.length)return"Continue learning";
    return"Start learning";
  }

  function courseCard(course){
    const initials=course.title.split(" ").map(word=>word[0]).join("").slice(0,2);
    const progress=courseProgress(course.id);
    const available=course.status==="available";
    const cls=progress.passed?"completed":available?"available":"locked";
    return `<button class="apa-course-card ${cls}" type="button" data-course-id="${course.id}" ${available?"":"disabled"}>
      <div class="apa-course-icon">${progress.passed?"✓":initials}</div>
      <div class="apa-course-copy">
        <small>${esc(course.category)}</small>
        <h3>${esc(course.title)}</h3>
        <div class="apa-course-meta">
          <span>${course.minutes} minutes</span>
          <span>${course.passMark||90}% pass</span>
          <span>+${course.xp} XP</span>
        </div>
      </div>
      <div class="apa-course-status"><span>${statusText(course)}</span><b>›</b></div>
    </button>`;
  }

  function mainMarkup(){
    const m=metrics();
    const passed=COURSES.filter(course=>courseProgress(course.id).passed).length;
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
          <div><small>ACHIEVEMENT CENTRE</small><h2>Badges, levels and milestones</h2><p>Review your progress and prepare your achievement certificate.</p></div><span>›</span>
        </button>
        <button class="apa-feature" type="button" data-academy-screen="certificates">
          <div class="apa-feature-icon">PDF</div>
          <div><small>DOCUMENT LIBRARY</small><h2>In-house certificates</h2><p>Your earned Academy certificates will appear here automatically.</p></div><span>›</span>
        </button>
      </section>

      <section class="apa-snapshot">
        <div><strong>${m.completed}</strong><span>Assignments completed</span></div>
        <div><strong>${m.academyXP}</strong><span>Academy XP earned</span></div>
        <div><strong>${passed}</strong><span>Courses passed</span></div>
        <div><strong>${COURSES.length}</strong><span>Courses prepared</span></div>
      </section>

      <section class="apa-panel" id="apa-course-library">
        <div class="apa-heading">
          <div><small>SHORT COURSES</small><h2>Academy course library</h2><p>Manual Handling and COSHH Awareness are now available. More shared courses will be added using the same course engine.</p></div>
          <span>${COURSES.filter(c=>c.status==="available").length} available</span>
        </div>
        <div class="apa-course-list">${COURSES.map(courseCard).join("")}</div>
      </section>

      <section class="apa-panel apa-coming">
        <div><small>LEARN, PASS AND EARN</small><h2>Development alongside ${esc(trade())}</h2><p>Complete every learning page, then achieve at least 90% in the assessment to unlock the course result and future certificate.</p></div>
        <div class="apa-disclaimer"><strong>In-house training only</strong><p>Academy certificates are not accredited qualifications, regulated awards or certificates issued by an awarding organisation.</p></div>
      </section>
    </div>`;
  }

  function courseIntro(course){
    const progress=courseProgress(course.id);
    const lessonPercent=Math.round((progress.lessonsViewed.length/course.lessons.length)*100);
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-academy-screen="main">‹ Back to Academy</button>
      <section class="apa-course-hero">
        <div class="apa-course-hero-icon">${progress.passed?"✓":"MH"}</div>
        <div>
          <small>${esc(course.category)}</small>
          <h1>${esc(course.title)}</h1>
          <p>${esc(course.description)}</p>
          <div class="apa-course-meta large">
            <span>${course.minutes} minutes</span><span>${course.passMark}% pass mark</span><span>+${course.xp} XP</span>
          </div>
        </div>
      </section>
      <section class="apa-panel">
        <div class="apa-heading">
          <div><small>YOUR PROGRESS</small><h2>${progress.passed?"Course completed":progress.lessonsViewed.length?"Continue your learning":"Ready to begin"}</h2></div>
          <span>${progress.passed?`${progress.bestScore}% passed`:`${lessonPercent}% viewed`}</span>
        </div>
        <div class="apa-learning-track"><i style="width:${progress.passed?100:lessonPercent}%"></i></div>
        <div class="apa-course-actions">
          <button class="apa-primary-action" type="button" data-start-course="${course.id}">
            ${progress.passed?"Review course":progress.lessonsViewed.length?"Continue course":"Start course"}
          </button>
          ${progress.passed?`<button class="apa-secondary-action" type="button" data-start-assessment="${course.id}">Retake assessment</button>`:""}
        </div>
      </section>
      <section class="apa-panel">
        <small>COURSE CONTENT</small>
        <div class="apa-lesson-list">
          ${course.lessons.map((lesson,index)=>`<div class="${progress.lessonsViewed.includes(index)?"done":""}"><span>${progress.lessonsViewed.includes(index)?"✓":index+1}</span><div><strong>${esc(lesson.title)}</strong><small>Learning page ${index+1}</small></div></div>`).join("")}
          <div class="${progress.passed?"done":""}"><span>${progress.passed?"✓":"Q"}</span><div><strong>Final assessment</strong><small>${course.questions.length} multiple-choice questions</small></div></div>
        </div>
      </section>
    </div>`;
  }

  function lessonMarkup(course,index){
    const lesson=course.lessons[index];
    const progress=courseProgress(course.id);
    const viewed=new Set(progress.lessonsViewed);
    viewed.add(index);
    updateCourseProgress(course.id,{lessonIndex:index,lessonsViewed:[...viewed].sort((a,b)=>a-b)});
    const percent=Math.round(((index+1)/course.lessons.length)*100);
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-course-id="${course.id}">‹ Course overview</button>
      <section class="apa-learning-shell">
        <div class="apa-learning-header">
          <div><small>${esc(course.title)}</small><strong>Page ${index+1} of ${course.lessons.length}</strong></div>
          <span>${percent}%</span>
        </div>
        <div class="apa-learning-track"><i style="width:${percent}%"></i></div>
        <article class="apa-lesson-card">
          <div class="apa-lesson-number">${index+1}</div>
          <small>LEARNING PAGE</small>
          <h1>${esc(lesson.title)}</h1>
          <p>${esc(lesson.text)}</p>
          <ul>${lesson.points.map(point=>`<li>${esc(point)}</li>`).join("")}</ul>
        </article>
        <div class="apa-learning-actions">
          <button type="button" class="apa-secondary-action" ${index===0?"disabled":""} data-lesson="${course.id}:${index-1}">Previous</button>
          ${index===course.lessons.length-1
            ?`<button type="button" class="apa-primary-action" data-start-assessment="${course.id}">Start assessment</button>`
            :`<button type="button" class="apa-primary-action" data-lesson="${course.id}:${index+1}">Next page</button>`}
        </div>
      </section>
    </div>`;
  }

  function assessmentIntro(course){
    const progress=courseProgress(course.id);
    const lessonsComplete=progress.lessonsViewed.length>=course.lessons.length;
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-course-id="${course.id}">‹ Course overview</button>
      <section class="apa-panel apa-assessment-intro">
        <div class="apa-feature-icon">Q</div>
        <small>FINAL ASSESSMENT</small>
        <h1>${esc(course.title)}</h1>
        <p>Answer all ${course.questions.length} questions. You need ${course.passMark}% or higher to pass. You can retake the assessment if required.</p>
        <div class="apa-stat-grid">
          <div><strong>${course.questions.length}</strong><span>Questions</span></div>
          <div><strong>${course.passMark}%</strong><span>Pass mark</span></div>
          <div><strong>${course.xp}</strong><span>XP reward</span></div>
          <div><strong>${progress.bestScore}%</strong><span>Best score</span></div>
        </div>
        ${lessonsComplete
          ?`<button class="apa-primary-action full" type="button" data-begin-quiz="${course.id}">Begin assessment</button>`
          :`<p class="apa-warning">Complete all learning pages before starting the assessment.</p>`}
      </section>
    </div>`;
  }

  function quizMarkup(course,index,answers){
    const question=course.questions[index];
    const selected=answers[index];
    return `<div class="apa-page">
      <section class="apa-learning-shell">
        <div class="apa-learning-header">
          <div><small>${esc(course.title)} assessment</small><strong>Question ${index+1} of ${course.questions.length}</strong></div>
          <span>${Math.round(((index+1)/course.questions.length)*100)}%</span>
        </div>
        <div class="apa-learning-track"><i style="width:${Math.round(((index+1)/course.questions.length)*100)}%"></i></div>
        <article class="apa-question-card">
          <h1>${esc(question.q)}</h1>
          <div class="apa-options">
            ${question.options.map((option,optionIndex)=>`<button type="button" class="${selected===optionIndex?"selected":""}" data-answer="${optionIndex}"><span>${String.fromCharCode(65+optionIndex)}</span>${esc(option)}</button>`).join("")}
          </div>
        </article>
        <div class="apa-learning-actions">
          <button type="button" class="apa-secondary-action" ${index===0?"disabled":""} data-quiz-nav="${index-1}">Previous</button>
          <button type="button" class="apa-primary-action" ${selected===undefined?"disabled":""} data-quiz-nav="${index===course.questions.length-1?"submit":index+1}">
            ${index===course.questions.length-1?"Submit assessment":"Next question"}
          </button>
        </div>
      </section>
    </div>`;
  }

  function resultMarkup(course,score,passed){
    const progress=courseProgress(course.id);
    return `<div class="apa-page">
      <section class="apa-result-card ${passed?"passed":"retry"}">
        <div class="apa-result-badge">${passed?"✓":"!"}</div>
        <small>${passed?"COURSE PASSED":"NOT PASSED YET"}</small>
        <h1>${passed?"Congratulations!":"Keep going"}</h1>
        <p>You scored <strong>${score}%</strong> in ${esc(course.title)}.</p>
        <div class="apa-score-ring"><span>${score}%</span></div>
        ${passed
          ?`<div class="apa-unlocked"><strong>+${course.xp} XP earned</strong><span>Your in-house certificate is ready.</span></div>`
          :`<div class="apa-warning">You need ${course.passMark}% to pass. Review the learning pages and try again.</div>`}
        <div class="apa-course-actions">
          ${passed?`<button class="apa-primary-action" type="button" data-certificate-course="${course.id}">Create certificate</button>`:`<button class="apa-primary-action" type="button" data-course-id="${course.id}">Return to course</button>`}
          <button class="apa-secondary-action" type="button" data-start-assessment="${course.id}">${passed?"Retake assessment":"Try again"}</button>
        </div>
        <p class="apa-smallprint">This records completion of an Apprenticeship+ in-house learning module. It is not an accredited qualification or awarding-body certificate.</p>
      </section>
    </div>`;
  }

  function achievementMarkup(){
    const m=metrics();
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-academy-screen="main">‹ Back to Academy</button>
      <section class="apa-panel">
        <small>ACHIEVEMENT CENTRE</small><h1>Level ${m.level}: ${esc(m.title)}</h1>
        <div class="apa-stat-grid">
          <div><strong>${m.xp}</strong><span>Total XP</span></div>
          <div><strong>${m.academyXP}</strong><span>Academy XP</span></div>
          <div><strong>${m.completed}/20</strong><span>Assignments</span></div>
          <div><strong>${COURSES.filter(c=>courseProgress(c.id).passed).length}</strong><span>Courses passed</span></div>
        </div>
        <button class="apa-disabled" disabled>Progress certificate — planned for a later Academy update</button>
      </section>
    </div>`;
  }

  function certificatesMarkup(){
    const passed=COURSES.filter(course=>courseProgress(course.id).passed);
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-academy-screen="main">‹ Back to Academy</button>
      <section class="apa-panel">
        <div class="apa-heading">
          <div><small>DOCUMENT LIBRARY</small><h1>Your in-house certificates</h1><p>Open a certificate, enter the learner name and use Save / Print PDF.</p></div>
          <span>${passed.length} unlocked</span>
        </div>
        ${passed.length
          ?`<div class="apa-certificate-list">${passed.map(course=>{
              const progress=courseProgress(course.id);
              const record=ensureCertificateRecord(course);
              return `<article>
                <div>PDF</div>
                <div><strong>${esc(course.title)}</strong><span>${progress.bestScore}% · ${formatDate(record.completedAt)}</span><small>${record.certificateId}</small></div>
                <button type="button" data-certificate-course="${course.id}">Open certificate</button>
              </article>`;
            }).join("")}</div>`
          :`<div class="apa-empty"><div>PDF</div><h2>No Academy certificates yet</h2><p>Pass an available Academy course with 90% or higher to unlock an in-house certificate.</p></div>`}
        <p class="apa-smallprint">Certificate records are stored on this device. Clearing the website's stored data will remove locally saved progress and certificate records.</p>
      </section>
    </div>`;
  }

  function renderInto(container,screen="main",payload={}){
    if(!container)return;
    container.classList.add("academy-view");
    if(screen==="main")container.innerHTML=mainMarkup();
    else if(screen==="achievements")container.innerHTML=achievementMarkup();
    else if(screen==="certificates")container.innerHTML=certificatesMarkup();
    else if(screen==="certificate")container.innerHTML=certificateMarkup(payload.course);
    else if(screen==="course")container.innerHTML=courseIntro(payload.course);
    else if(screen==="lesson")container.innerHTML=lessonMarkup(payload.course,payload.index);
    else if(screen==="assessment")container.innerHTML=assessmentIntro(payload.course);
    else if(screen==="quiz")container.innerHTML=quizMarkup(payload.course,payload.index,payload.answers);
    else if(screen==="result")container.innerHTML=resultMarkup(payload.course,payload.score,payload.passed);
    bind(container,screen,payload);
    window.scrollTo({top:0,behavior:"auto"});
  }

  function findCourse(id){
    return COURSES.find(course=>course.id===id);
  }

  function bind(container,screen,payload){
    container.querySelectorAll("[data-academy-screen]").forEach(button=>{
      button.onclick=()=>renderInto(container,button.dataset.academyScreen);
    });
    container.querySelector("[data-academy-scroll='courses']")?.addEventListener("click",()=>{
      container.querySelector("#apa-course-library")?.scrollIntoView({behavior:"smooth",block:"start"});
    });
    container.querySelectorAll("[data-course-id]").forEach(button=>{
      button.onclick=()=>{
        const course=findCourse(button.dataset.courseId);
        if(course&&course.status==="available")renderInto(container,"course",{course});
      };
    });
    container.querySelectorAll("[data-start-course]").forEach(button=>{
      button.onclick=()=>{
        const course=findCourse(button.dataset.startCourse);
        const progress=courseProgress(course.id);
        const index=progress.passed?0:Math.min(progress.lessonIndex,course.lessons.length-1);
        renderInto(container,"lesson",{course,index});
      };
    });
    container.querySelectorAll("[data-lesson]").forEach(button=>{
      button.onclick=()=>{
        if(button.disabled)return;
        const [id,index]=button.dataset.lesson.split(":");
        renderInto(container,"lesson",{course:findCourse(id),index:Number(index)});
      };
    });
    container.querySelectorAll("[data-start-assessment]").forEach(button=>{
      button.onclick=()=>renderInto(container,"assessment",{course:findCourse(button.dataset.startAssessment)});
    });
    container.querySelectorAll("[data-begin-quiz]").forEach(button=>{
      const course=findCourse(button.dataset.beginQuiz);
      button.onclick=()=>renderInto(container,"quiz",{course,index:0,answers:{}});
    });


    container.querySelectorAll("[data-certificate-course]").forEach(button=>{
      button.onclick=()=>{
        const course=findCourse(button.dataset.certificateCourse);
        if(course&&courseProgress(course.id).passed)renderInto(container,"certificate",{course});
      };
    });
    container.querySelectorAll("[data-open-certificate]").forEach(button=>{
      button.onclick=()=>{
        const course=findCourse(button.dataset.openCertificate);
        const input=container.querySelector("[data-certificate-name]");
        const name=String(input?.value||"").trim();
        if(!name){
          input?.focus();
          input?.classList.add("invalid");
          return;
        }
        input?.classList.remove("invalid");
        if(!openPrintableCertificate(course,name)){
          alert("The certificate window was blocked. Please allow pop-ups for Apprentice+ and try again.");
        }
      };
    });
    container.querySelector("[data-certificate-name]")?.addEventListener("input",event=>{
      event.target.classList.remove("invalid");
      saveProfile({...loadProfile(),name:event.target.value});
    });

    if(screen==="quiz"){
      const answers={...(payload.answers||{})};
      container.querySelectorAll("[data-answer]").forEach(button=>{
        button.onclick=()=>{
          answers[payload.index]=Number(button.dataset.answer);
          renderInto(container,"quiz",{course:payload.course,index:payload.index,answers});
        };
      });
      container.querySelectorAll("[data-quiz-nav]").forEach(button=>{
        button.onclick=()=>{
          if(button.disabled)return;
          const target=button.dataset.quizNav;
          if(target==="submit"){
            const correct=payload.course.questions.reduce((total,question,index)=>total+(answers[index]===question.answer?1:0),0);
            const score=Math.round((correct/payload.course.questions.length)*100);
            const passed=score>=payload.course.passMark;
            const old=courseProgress(payload.course.id);
            updateCourseProgress(payload.course.id,{
              attempts:old.attempts+1,
              bestScore:Math.max(old.bestScore,score),
              passed:old.passed||passed,
              completedAt:passed?(old.completedAt||new Date().toISOString()):old.completedAt,
              xpAwarded:old.xpAwarded||passed
            });
            if(passed)ensureCertificateRecord(payload.course);
            renderInto(container,"result",{course:payload.course,score,passed});
          }else{
            renderInto(container,"quiz",{course:payload.course,index:Number(target),answers});
          }
        };
      });
    }
  }

  window.ApprenticeshipPlusAcademy={
    version:"phase5-v1",
    renderInto,
    courses:COURSES
  };
})();