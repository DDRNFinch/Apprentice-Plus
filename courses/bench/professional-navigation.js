"use strict";
(function(){
  if(window.__AP_POLISHED_NAV_CONTROLLER__) return;
  window.__AP_POLISHED_NAV_CONTROLLER__ = true;

  const icons = {
    home:"⌂", assignments:"▤", portfolio:"▣",
    workbench:"⚒", revision:"◫", profile:"●"
  };
  const normalise = value => String(value || "").trim().toLowerCase();

  let activeSelect = null;
  let shell = null;
  let trigger = null;
  let backdrop = null;
  let list = null;

  function findNavigationSelect(){
    return [...document.querySelectorAll("select")].find(select => {
      const labels = [...select.options].map(option => normalise(option.textContent));
      return labels.includes("home") && labels.includes("assignments") && labels.includes("profile");
    });
  }

  function detectVisibleSection(){
    const text = normalise(document.body.innerText);
    if(text.includes("revision cards") && text.includes("epa knowledge mock")) return "Revision";
    if(text.includes("practical marking") && text.includes("employer hub")) return "Portfolio";
    return null;
  }

  function currentLabel(){
    const visible = detectVisibleSection();
    if(visible) return visible;
    return activeSelect?.options[activeSelect.selectedIndex]?.textContent.trim() || "Home";
  }

  function syncSelectVisualOnly(){
    const visible = detectVisibleSection();
    if(!visible || !activeSelect) return;
    const option = [...activeSelect.options].find(item => normalise(item.textContent) === normalise(visible));
    if(option && activeSelect.value !== option.value){
      activeSelect.value = option.value;
    }
  }

  function refresh(){
    if(!activeSelect || !document.contains(activeSelect)) return;
    syncSelectVisualOnly();

    const active = currentLabel();
    const key = normalise(active);
    trigger.innerHTML = `
      <span class="ap-nav-trigger-icon">${icons[key] || "•"}</span>
      <span class="ap-nav-trigger-copy"><small>Navigate</small><strong>${active}</strong></span>
      <span class="ap-nav-chevron">⌄</span>`;

    list.innerHTML = "";
    [...activeSelect.options].forEach(option => {
      const label = option.textContent.trim();
      const optionKey = normalise(label);
      const isActive = normalise(label) === normalise(active);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ap-nav-item" + (isActive ? " active" : "");
      button.innerHTML = `
        <span class="ap-nav-item-icon">${icons[optionKey] || "•"}</span>
        <span class="ap-nav-item-copy">
          <strong>${label}</strong>
          <small>${isActive ? "Current section" : "Open section"}</small>
        </span>
        <span class="ap-nav-item-status">${isActive ? "✓" : "›"}</span>`;
      button.addEventListener("click", () => {
        button.classList.add("pressed");
        setTimeout(() => {
          activeSelect.value = option.value;
          activeSelect.dispatchEvent(new Event("change", {bubbles:true}));
          closeMenu();
          setTimeout(rebuild, 120);
        }, 90);
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
    if(!backdrop) return;
    backdrop.classList.add("closing");
    backdrop.classList.remove("open");
    document.documentElement.classList.remove("ap-nav-open");
    setTimeout(() => backdrop?.classList.remove("closing"), 280);
  }

  function removeOldUI(){
    document.querySelectorAll(".ap-nav-shell,.ap-nav-backdrop").forEach(el => el.remove());
    document.querySelectorAll("select.ap-native-nav-select").forEach(el => {
      el.classList.remove("ap-native-nav-select");
      delete el.dataset.polishedNavigation;
    });
  }

  function initialise(select){
    activeSelect = select;
    removeOldUI();

    shell = document.createElement("div");
    shell.className = "ap-nav-shell";

    const caption = document.createElement("div");
    caption.className = "ap-nav-caption";
    caption.textContent = "Current section";

    trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "ap-nav-trigger";

    activeSelect.parentNode.insertBefore(shell, activeSelect);
    shell.append(caption, trigger, activeSelect);
    activeSelect.classList.add("ap-native-nav-select");
    activeSelect.dataset.polishedNavigation = "true";

    backdrop = document.createElement("div");
    backdrop.className = "ap-nav-backdrop";
    backdrop.innerHTML = `
      <div class="ap-nav-panel" role="dialog" aria-modal="true" aria-label="Navigation">
        <div class="ap-nav-panel-head">
          <div><small>Apprenticeship+</small><h2>Navigation</h2></div>
          <button class="ap-nav-close" type="button" aria-label="Close navigation">×</button>
        </div>
        <div class="ap-nav-list"></div>
      </div>`;
    document.body.appendChild(backdrop);
    list = backdrop.querySelector(".ap-nav-list");

    trigger.addEventListener("click", () => {
      trigger.classList.add("pressed");
      setTimeout(() => trigger.classList.remove("pressed"), 150);
      openMenu();
    });
    backdrop.querySelector(".ap-nav-close").addEventListener("click", closeMenu);
    backdrop.addEventListener("click", event => {
      if(event.target === backdrop) closeMenu();
    });
    activeSelect.addEventListener("change", () => setTimeout(rebuild, 80));

    refresh();
  }

  function rebuild(){
    const select = findNavigationSelect();
    if(!select) return;
    if(select !== activeSelect || !shell || !document.contains(shell)){
      initialise(select);
    }else{
      refresh();
    }
  }

  document.addEventListener("keydown", event => {
    if(event.key === "Escape") closeMenu();
  });

  let queued = false;
  new MutationObserver(() => {
    if(queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      rebuild();
    });
  }).observe(document.documentElement, {childList:true, subtree:true});

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", rebuild);
  }else{
    rebuild();
  }
})();