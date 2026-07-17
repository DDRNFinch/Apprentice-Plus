"use strict";
(function(){
  if(window.__AP_PRO_NAV_V2__) return;
  window.__AP_PRO_NAV_V2__ = true;

  const path = location.pathname.toLowerCase();
  const trade =
    path.includes("/brick/") ? {name:"Bricklaying", icon:"🧱"} :
    path.includes("/bench/") ? {name:"Bench Joinery", icon:"🪚"} :
    path.includes("/site/") ? {name:"Site Carpentry", icon:"🔨"} :
    {name:"Property Maintenance", icon:"🛠️"};

  const icons = {
    home:"⌂", assignments:"▤", portfolio:"▣",
    workbench:"⚒", revision:"◫", profile:"●",
    epa:"✓", employer:"◉"
  };

  const normalise = value => String(value || "").trim().toLowerCase();
  const recentKey = "apprentice-plus-recent-sections-" + normalise(trade.name).replace(/\s+/g,"-");

  function findNavigationSelect(){
    return [...document.querySelectorAll("select")].find(select => {
      const labels = [...select.options].map(option => normalise(option.textContent));
      return labels.includes("home") && labels.includes("assignments");
    });
  }

  function getRecent(){
    try { return JSON.parse(localStorage.getItem(recentKey) || "[]"); }
    catch { return []; }
  }

  function saveRecent(label){
    const next = [label, ...getRecent().filter(item => item !== label)].slice(0,3);
    localStorage.setItem(recentKey, JSON.stringify(next));
  }

  function initialise(){
    const select = findNavigationSelect();
    if(!select || select.dataset.professionalNavigationV2) return;
    select.dataset.professionalNavigationV2 = "true";

    const shell = document.createElement("div");
    shell.className = "ap-nav-shell";

    const caption = document.createElement("div");
    caption.className = "ap-nav-caption";
    caption.textContent = "Current section";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "ap-nav-trigger";

    select.parentNode.insertBefore(shell, select);
    shell.append(caption, trigger, select);
    select.classList.add("ap-native-nav-select");

    const backdrop = document.createElement("div");
    backdrop.className = "ap-nav-backdrop";
    backdrop.innerHTML = `
      <div class="ap-nav-panel" role="dialog" aria-modal="true" aria-label="Navigation">
        <div class="ap-nav-trade-head">
          <span class="ap-nav-trade-icon">${trade.icon}</span>
          <span><small>Apprenticeship+</small><strong>${trade.name}</strong></span>
        </div>
        <div class="ap-nav-panel-head">
          <div><small>Course menu</small><h2>Where would you like to go?</h2></div>
          <button class="ap-nav-close" type="button" aria-label="Close navigation">×</button>
        </div>
        <div class="ap-nav-quick-actions">
          <button type="button" data-action="continue"><span>▶</span><strong>Continue assignment</strong><small>Return to your latest work</small></button>
          <button type="button" data-action="workbench"><span>⚒</span><strong>Open Workbench</strong><small>Build evidence and statements</small></button>
        </div>
        <div class="ap-nav-recent-wrap">
          <div class="ap-nav-section-title">Recently visited</div>
          <div class="ap-nav-recent"></div>
        </div>
        <div class="ap-nav-section-title ap-nav-all-title">All sections</div>
        <div class="ap-nav-list"></div>
      </div>`;
    document.body.appendChild(backdrop);

    const list = backdrop.querySelector(".ap-nav-list");
    const recent = backdrop.querySelector(".ap-nav-recent");

    function currentLabel(){
      return select.options[select.selectedIndex]?.textContent.trim() || "Home";
    }

    function choose(label){
      const option = [...select.options].find(item => normalise(item.textContent) === normalise(label));
      if(!option) return false;
      select.value = option.value;
      select.dispatchEvent(new Event("change", {bubbles:true}));
      saveRecent(option.textContent.trim());
      closeMenu();
      setTimeout(refresh,0);
      return true;
    }

    function makeItem(label, active, compact=false){
      const key = normalise(label);
      const button = document.createElement("button");
      button.type = "button";
      button.className = compact ? "ap-nav-recent-item" : "ap-nav-item" + (active ? " active" : "");
      button.innerHTML = compact
        ? `<span>${icons[key] || "•"}</span><strong>${label}</strong><b>›</b>`
        : `<span class="ap-nav-item-icon">${icons[key] || "•"}</span>
           <span class="ap-nav-item-copy"><strong>${label}</strong><small>${active ? "Current section" : "Open section"}</small></span>
           <span class="ap-nav-item-status">${active ? "✓" : "›"}</span>`;
      button.addEventListener("click",()=>choose(label));
      return button;
    }

    function refresh(){
      const active = currentLabel();
      const key = normalise(active);
      trigger.innerHTML = `
        <span class="ap-nav-trigger-icon">${trade.icon}</span>
        <span class="ap-nav-trigger-copy"><small>${trade.name}</small><strong>${active}</strong></span>
        <span class="ap-nav-chevron">⌄</span>`;

      list.innerHTML = "";
      [...select.options].forEach(option => {
        const label = option.textContent.trim();
        list.appendChild(makeItem(label, option.selected));
      });

      recent.innerHTML = "";
      const items = getRecent().filter(label => normalise(label) !== normalise(active));
      if(items.length){
        items.forEach(label => recent.appendChild(makeItem(label,false,true)));
        backdrop.querySelector(".ap-nav-recent-wrap").hidden = false;
      }else{
        backdrop.querySelector(".ap-nav-recent-wrap").hidden = true;
      }
    }

    function openMenu(){
      saveRecent(currentLabel());
      refresh();
      backdrop.classList.add("open");
      document.documentElement.classList.add("ap-nav-open");
    }

    function closeMenu(){
      backdrop.classList.remove("open");
      document.documentElement.classList.remove("ap-nav-open");
    }

    function clickText(text){
      const target = [...document.querySelectorAll("button,a")].find(el =>
        normalise(el.textContent).includes(normalise(text)) && !backdrop.contains(el)
      );
      if(target){ target.click(); return true; }
      return false;
    }

    trigger.addEventListener("click",openMenu);
    backdrop.querySelector(".ap-nav-close").addEventListener("click",closeMenu);
    backdrop.addEventListener("click",event=>{ if(event.target===backdrop) closeMenu(); });
    document.addEventListener("keydown",event=>{ if(event.key==="Escape") closeMenu(); });
    select.addEventListener("change",()=>{ saveRecent(currentLabel()); refresh(); });

    backdrop.querySelector('[data-action="workbench"]').addEventListener("click",()=>choose("Workbench"));
    backdrop.querySelector('[data-action="continue"]').addEventListener("click",()=>{
      closeMenu();
      if(!choose("Assignments")) return;
      setTimeout(()=>{
        if(!clickText("continue assignment")) clickText("continue");
      },120);
    });

    refresh();
  }

  new MutationObserver(initialise).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",initialise);
  else initialise();
})();