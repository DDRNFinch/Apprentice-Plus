"use strict";
(function(){
  if(window.__AP_NAV_RECOVERY__) return;
  window.__AP_NAV_RECOVERY__ = true;

  const STORAGE_KEY="apprentice-plus-bench-current-section";
  const ORDER=["Home","Assignments","Portfolio","Workbench","Revision","Profile"];
  const icons={home:"⌂",assignments:"▤",portfolio:"▣",workbench:"⚒",revision:"◫",profile:"●"};
  const normalise=value=>String(value||"").trim().toLowerCase();

  function findNavigationSelect(){
    return [...document.querySelectorAll("select")].find(select=>{
      const labels=[...select.options].map(option=>normalise(option.textContent));
      return ORDER.every(label=>labels.includes(normalise(label)));
    });
  }

  function selectedLabel(select){
    const stored=sessionStorage.getItem(STORAGE_KEY);
    if(stored&&ORDER.includes(stored)) return stored;
    return select.options[select.selectedIndex]?.textContent.trim()||"Home";
  }

  function initialise(){
    const select=findNavigationSelect();
    if(!select||select.dataset.recoveryNavigation) return;
    select.dataset.recoveryNavigation="true";

    const shell=document.createElement("div");
    shell.className="ap-nav-shell";
    const caption=document.createElement("div");
    caption.className="ap-nav-caption";
    caption.textContent="Current section";
    const trigger=document.createElement("button");
    trigger.type="button";
    trigger.className="ap-nav-trigger";

    select.parentNode.insertBefore(shell,select);
    shell.append(caption,trigger,select);
    select.classList.add("ap-native-nav-select");

    const backdrop=document.createElement("div");
    backdrop.className="ap-nav-backdrop";
    backdrop.innerHTML=`
      <div class="ap-nav-panel" role="dialog" aria-modal="true" aria-label="Navigation">
        <div class="ap-nav-panel-head">
          <div><small>Apprenticeship+</small><h2>Navigation</h2></div>
          <button class="ap-nav-close" type="button" aria-label="Close navigation">×</button>
        </div>
        <div class="ap-nav-list"></div>
      </div>`;
    document.body.appendChild(backdrop);
    const list=backdrop.querySelector(".ap-nav-list");

    function refresh(){
      const active=selectedLabel(select);
      const key=normalise(active);
      trigger.innerHTML=`
        <span class="ap-nav-trigger-icon">${icons[key]||"•"}</span>
        <span class="ap-nav-trigger-copy"><small>Navigate</small><strong>${active}</strong></span>
        <span class="ap-nav-chevron">⌄</span>`;

      list.innerHTML="";
      ORDER.forEach(label=>{
        const option=[...select.options].find(item=>normalise(item.textContent)===normalise(label));
        if(!option) return;
        const button=document.createElement("button");
        button.type="button";
        button.className="ap-nav-item"+(label===active?" active":"");
        button.innerHTML=`
          <span class="ap-nav-item-icon">${icons[normalise(label)]||"•"}</span>
          <span class="ap-nav-item-copy">
            <strong>${label}</strong>
            <small>${label===active?"Current section":"Open section"}</small>
          </span>
          <span class="ap-nav-item-status">${label===active?"✓":"›"}</span>`;
        button.addEventListener("click",()=>{
          sessionStorage.setItem(STORAGE_KEY,label);
          document.dispatchEvent(new CustomEvent("apprentice-section-change",{detail:{section:label}}));
          button.classList.add("pressed");
          setTimeout(()=>{
            select.value=option.value;
            select.dispatchEvent(new Event("change",{bubbles:true}));
            closeMenu();
            setTimeout(refresh,120);
          },80);
        });
        list.appendChild(button);
      });
    }

    function openMenu(){
      refresh();
      backdrop.classList.add("open");
      document.documentElement.classList.add("ap-nav-open");
    }

    function closeMenu(){
      backdrop.classList.add("closing");
      backdrop.classList.remove("open");
      document.documentElement.classList.remove("ap-nav-open");
      setTimeout(()=>backdrop.classList.remove("closing"),280);
    }

    trigger.addEventListener("click",openMenu);
    backdrop.querySelector(".ap-nav-close").addEventListener("click",closeMenu);
    backdrop.addEventListener("click",event=>{if(event.target===backdrop)closeMenu();});
    document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu();});
    select.addEventListener("change",()=>{
      const actual=select.options[select.selectedIndex]?.textContent.trim();
      if(actual&&ORDER.includes(actual)&&!sessionStorage.getItem(STORAGE_KEY)){
        sessionStorage.setItem(STORAGE_KEY,actual);
      }
      setTimeout(refresh,0);
    });

    if(!sessionStorage.getItem(STORAGE_KEY)){
      sessionStorage.setItem(STORAGE_KEY,select.options[select.selectedIndex]?.textContent.trim()||"Home");
    }
    refresh();
  }

  new MutationObserver(initialise).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialise);
  else initialise();
})();