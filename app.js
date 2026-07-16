const COURSES={brick:{name:"Bricklaying",path:"./courses/brick/"},site:{name:"Site Carpentry",path:"./courses/site/"},bench:{name:"Bench Joinery",path:"./courses/bench/"}};
const KEY="apprenticePlusSettingsV2";let settings={course:null,pin:"2468"};try{settings={...settings,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(e){}let selected=null;const unlocked=sessionStorage.getItem("apprenticePlusCourseUnlocked")==="1";const choose=new URLSearchParams(location.search).has("choose");
function save(){localStorage.setItem(KEY,JSON.stringify(settings))}function openCourse(k){if(!COURSES[k])return;settings.course=k;save();sessionStorage.removeItem("apprenticePlusCourseUnlocked");location.href=COURSES[k].path}
if(settings.course&&!choose){openCourse(settings.course)}else if(choose&&!unlocked&&settings.course){openCourse(settings.course)}else{if(unlocked)document.getElementById("lockNote").innerHTML="🔓 Course selection unlocked. Choose the correct course and confirm it.";document.querySelectorAll("[data-course]").forEach(b=>b.onclick=()=>{selected=b.dataset.course;document.querySelectorAll("[data-course]").forEach(x=>x.classList.toggle("selected",x===b));document.getElementById("continue").disabled=false});document.getElementById("continue").onclick=()=>selected&&openCourse(selected)}
document.getElementById("savePin").onclick=()=>{const old=document.getElementById("oldPin").value;const next=document.getElementById("newPin").value.trim();const msg=document.getElementById("pinMessage");msg.style.color="#a92323";if(old!==String(settings.pin)){msg.textContent="Current PIN is incorrect.";return}if(!/^\d{4,12}$/.test(next)){msg.textContent="Use 4–12 numbers for the new PIN.";return}settings.pin=next;save();msg.style.color="#16845b";msg.textContent="Tutor PIN updated."};
if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js",{scope:"./"}));

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
