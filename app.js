const COURSES={
  brick:{name:"Bricklaying",path:"./courses/brick/"},
  site:{name:"Site Carpentry",path:"./courses/site/"},
  bench:{name:"Bench Joinery",path:"./courses/bench/"}
};


const COURSE_PRIVACY_NOTICE=`Apprenticeship+ Privacy & Data

Apprenticeship+ stores assignment text, photographs, signatures, revision progress and generated documents locally on this device.

Apprenticeship+ does not upload learner evidence to its own servers. Generated PDFs are only shared when you choose to download and upload them to Aptem or another approved platform.

Only include information and photographs relevant to the apprenticeship. Avoid unnecessary personal information, customer details, addresses, registrations or identifiable people unless there is a valid reason and permission.

You can remove locally stored information from Profile & Settings using Clear all local data.`;

function requestPrivacyAgreement(course){
  const selected=COURSES[course];
  if(!selected)return;

  document.querySelector(".privacy-consent-modal")?.remove();

  const modal=document.createElement("div");
  modal.className="privacy-consent-modal";
  modal.innerHTML=`
    <div class="privacy-consent-card" role="dialog" aria-modal="true" aria-labelledby="privacyConsentTitle">
      <div class="privacy-consent-badge">🛡</div>
      <h2 id="privacyConsentTitle">Privacy & Data</h2>
      <p>Before opening <b>${selected.name}</b>, confirm that you understand how Apprenticeship+ stores and handles information.</p>
      <div class="privacy-consent-notice">
        <p>Apprenticeship+ stores your work locally on this device.</p>
        <p>No learner evidence is uploaded to Apprenticeship+ servers.</p>
        <p>PDFs are only shared when you choose to download and upload them to Aptem or another approved platform.</p>
        <p>Only include relevant evidence and avoid unnecessary personal information.</p>
      </div>
      <div class="privacy-consent-actions">
        <button type="button" class="privacy-decline">Decline</button>
        <button type="button" class="privacy-agree">Agree and continue</button>
      </div>
    </div>`;

  document.body.appendChild(modal);

  modal.querySelector(".privacy-decline").onclick=()=>{
    modal.remove();
    document.querySelectorAll(".course-confirm-overlay").forEach(node=>node.remove());
    document.querySelectorAll(".course").forEach(node=>node.classList.remove("selected"));
  };

  modal.querySelector(".privacy-agree").onclick=()=>{
    localStorage.setItem("apprenticeshipPlusPrivacyAccepted","true");
    localStorage.setItem("apprenticeshipPlusPrivacyAcceptedAt",new Date().toISOString());
    modal.remove();
    openCourse(course);
  };
}


const KEY="apprenticePlusSettingsV2";
let settings={course:null,pin:"2468"};

try{
  settings={...settings,...JSON.parse(localStorage.getItem(KEY)||"{}")};
}catch(error){}

const unlocked=sessionStorage.getItem("apprenticePlusCourseUnlocked")==="1";
const choose=new URLSearchParams(location.search).has("choose");

function saveSettings(){
  localStorage.setItem(KEY,JSON.stringify(settings));
}

function openCourse(course){
  const selected=COURSES[course];
  if(!selected)return;

  settings.course=course;
  saveSettings();
  sessionStorage.removeItem("apprenticePlusCourseUnlocked");
  location.href=selected.path;
}

// Normally reopen the learner's saved course automatically.
// The selector is shown for first use or after the Developer section unlocks it.
if(settings.course&&!choose){
  openCourse(settings.course);
}else if(choose&&!unlocked&&settings.course){
  openCourse(settings.course);
}else{
  const grid=document.querySelector(".courses.course-grid");

  if(grid){
    const closeOverlays=()=>{
      grid.querySelectorAll(".course-confirm-overlay").forEach(node=>node.remove());
      grid.querySelectorAll(".course").forEach(node=>node.classList.remove("selected"));
    };

    grid.querySelectorAll(".course").forEach(button=>{
      button.addEventListener("click",event=>{
        event.preventDefault();
        event.stopPropagation();

        const course=button.dataset.course;
        closeOverlays();
        button.classList.add("selected");

        const overlay=document.createElement("div");
        overlay.className="course-confirm-overlay";
        overlay.innerHTML=`
          <strong>Open ${COURSES[course]?.name||"course"}?</strong>
          <div class="course-confirm-actions">
            <button type="button" class="confirm-course">Confirm</button>
          </div>`;

        button.appendChild(overlay);

        overlay.addEventListener("click",overlayEvent=>{
          overlayEvent.stopPropagation();
        });

        overlay.querySelector(".confirm-course").addEventListener("click",confirmEvent=>{
          confirmEvent.preventDefault();
          confirmEvent.stopPropagation();
          requestPrivacyAgreement(course);
        });
      });
    });

    // Tapping a different icon replaces the confirmation.
    // Tapping outside closes it without displaying a Cancel button.
    document.addEventListener("click",event=>{
      if(!event.target.closest(".course"))closeOverlays();
    });
  }
}

if("serviceWorker" in navigator){
  addEventListener("load",()=>{
    navigator.serviceWorker.register("./service-worker.js",{scope:"./"});
  });
}

const PRIVACY_NOTICE=`Apprenticeship+ Privacy Notice

Apprenticeship+ is a local document-creation tool. Information entered into the app is stored on this device using browser storage. Apprentice+ does not send learner names, photographs, written evidence or generated PDFs to Apprentice+ servers.

When you generate or download a PDF, you decide where it is saved and whether it is uploaded to Aptem or another approved learning platform. Storage and processing after upload are governed by that platform and your organisation's policies.

Only include information and photographs that are relevant to your apprenticeship evidence. Avoid unnecessary personal information, customer details, addresses, vehicle registrations and identifiable people unless there is a valid reason and permission to include them.

You can remove locally stored Apprenticeship+ information using Clear all local data. Download anything you need first because deletion cannot be undone.`;

async function deleteAllIndexedDatabases(){
  if(!indexedDB || !indexedDB.databases) return;
  const databases=await indexedDB.databases();
  await Promise.all(databases.filter(db=>db.name).map(db=>new Promise(resolve=>{
    const request=indexedDB.deleteDatabase(db.name);
    request.onsuccess=request.onerror=request.onblocked=()=>resolve();
  })));
}
async function clearAllApprenticePlusData(){
  const confirmed=confirm("Delete all Apprenticeship+ data stored on this device? Download any PDFs or evidence you need first. This cannot be undone.");
  if(!confirmed)return;
  const second=confirm("This will remove course selection, assignment text, uploaded evidence, saved documents, EPA results and settings from this device. Continue?");
  if(!second)return;
  try{
    localStorage.clear();
    sessionStorage.clear();
    await deleteAllIndexedDatabases();
    if("caches" in window){
      const keys=await caches.keys();
      await Promise.all(keys.map(key=>caches.delete(key)));
    }
    if("serviceWorker" in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg=>reg.unregister()));
    }
    alert("All locally stored Apprenticeship+ data has been removed.");
    location.replace("./?reset=1");
  }catch(error){
    console.error(error);
    alert("Most local data was removed, but your browser reported an error. Close Apprentice+ and clear this site's data in Chrome settings to finish.");
  }
}
document.getElementById("showPrivacy")?.addEventListener("click",()=>alert(PRIVACY_NOTICE));
document.getElementById("clearLocalData")?.addEventListener("click",clearAllApprenticePlusData);