(function(){
  "use strict";
  const parts=location.pathname.split("/");
  const course=parts.includes("brick")?"brick":parts.includes("site")?"site":parts.includes("bench")?"bench":null;
  if(!course)return;
  const KEY="apprenticePlusSettingsV2";
  let settings={course:null,pin:"2468"};
  try{settings={...settings,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch(error){}
  if(settings.course&&settings.course!==course){
    location.replace("../../");
  }
})();