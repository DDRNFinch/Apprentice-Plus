(function(){
  "use strict";
  const parts=location.pathname.split("/");
  const course=parts.includes("brick")?"brick":parts.includes("site")?"site":parts.includes("bench")?"bench":parts.includes("pmo")?"pmo":null;
  if(!course)return;
  const KEY="apprenticePlusSettingsV2";
  let settings={course:null,pin:"2468"};
  try{settings={...settings,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(error){}
  if(settings.course&&settings.course!==course){
    location.replace("../../");
  }

  if(course==="brick"){
    if(!document.querySelector('link[data-brick-professional-navigation]')){
      const link=document.createElement("link");
      link.rel="stylesheet";
      link.href="./professional-navigation.css?v=direct-1";
      link.dataset.brickProfessionalNavigation="true";
      document.head.appendChild(link);
    }

    if(!document.querySelector('script[data-brick-professional-navigation]')){
      const script=document.createElement("script");
      script.src="./professional-navigation.js?v=direct-1";
      script.defer=true;
      script.dataset.brickProfessionalNavigation="true";
      document.head.appendChild(script);
    }
  }
})();