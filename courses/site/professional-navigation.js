"use strict";
(function(){
  if(window.__AP_POLISHED_NAV__) return;
  window.__AP_POLISHED_NAV__ = true;

  const icons = {
    home:"⌂", assignments:"▤", portfolio:"▣",
    workbench:"⚒", revision:"◫", profile:"●"
  };
  const normalise = value => String(value || "").trim().toLowerCase();

  function findNavigationSelect(){
    return [...document.querySelectorAll("select")].find(select => {
      const labels = [...select.options].map(option => normalise(option.textContent));
      return labels.includes("home") && labels.includes("assignments") && labels.includes("profile");
    });
  }

  function initialise(){
    const select = findNavigationSelect();
    if(!select || select.dataset.polishedNavigation) return;
    select.dataset.polishedNavigation = "true";

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
        <div class="ap-nav-panel-head">
          <div><small>Apprenticeship+</small><h2>Navigation</h2></div>
          <button class="ap-nav-close" type="button" aria-label="Close navigation">×</button>
        </div>
        <div class="ap-nav-list"></div>
      </div>`;
    document.body.appendChild(backdrop);

    const list = backdrop.querySelector(".ap-nav-list");

    function currentLabel(){
      return select.options[select.selectedIndex]?.textContent.trim() || "Home";
    }

    function refresh(){
      const active = currentLabel();
      const key = normalise(active);
      trigger.innerHTML = `
        <span class="ap-nav-trigger-icon">${icons[key] || "•"}</span>
        <span class="ap-nav-trigger-copy"><small>Navigate</small><strong>${active}</strong></span>
        <span class="ap-nav-chevron">⌄</span>`;

      list.innerHTML = "";
      [...select.options].forEach(option => {
        const label = option.textContent.trim();
        const optionKey = normalise(label);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ap-nav-item" + (option.selected ? " active" : "");
        button.innerHTML = `
          <span class="ap-nav-item-icon">${icons[optionKey] || "•"}</span>
          <span class="ap-nav-item-copy">
            <strong>${label}</strong>
            <small>${option.selected ? "Current section" : "Open section"}</small>
          </span>
          <span class="ap-nav-item-status">${option.selected ? "✓" : "›"}</span>`;
        button.addEventListener("click", () => {
          button.classList.add("pressed");
          setTimeout(() => {
            select.value = option.value;
            select.dispatchEvent(new Event("change", {bubbles:true}));
            closeMenu();
            setTimeout(refresh, 0);
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
      backdrop.classList.add("closing");
      backdrop.classList.remove("open");
      document.documentElement.classList.remove("ap-nav-open");
      setTimeout(() => backdrop.classList.remove("closing"), 280);
    }

    trigger.addEventListener("click", () => {
      trigger.classList.add("pressed");
      setTimeout(() => trigger.classList.remove("pressed"), 150);
      openMenu();
    });

    backdrop.querySelector(".ap-nav-close").addEventListener("click", closeMenu);
    backdrop.addEventListener("click", event => {
      if(event.target === backdrop) closeMenu();
    });
    document.addEventListener("keydown", event => {
      if(event.key === "Escape") closeMenu();
    });
    select.addEventListener("change", refresh);
    refresh();
  }

  new MutationObserver(initialise).observe(document.documentElement, {
    childList:true,
    subtree:true
  });

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initialise);
  } else {
    initialise();
  }
})();