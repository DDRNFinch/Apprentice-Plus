"use strict";
(function(){
  const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||
    (navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  if(!isIOS)return;
  window.addEventListener("pageshow",()=>{
    const name=sessionStorage.getItem("apprenticeshipPlusLastPdfName");
    if(!name)return;
    sessionStorage.removeItem("apprenticeshipPlusLastPdfName");
    setTimeout(()=>{
      const toast=document.createElement("div");
      toast.className="ap-ios-pdf-toast";
      toast.textContent="On iPhone: use Share, then Save to Files, to keep your PDF.";
      document.body.appendChild(toast);
      setTimeout(()=>toast.remove(),6500);
    },400);
  });
})();