"use strict";

async function downloadAssignmentPdf(assignment,evidence,profile){
  let createdUrl=null;

  const safeFileName=value=>String(value||"document")
    .replace(/[^a-z0-9]+/gi,"-")
    .replace(/^-|-$/g,"");


  const addTradeIcon=(pdf,x,y)=>{
    pdf.setDrawColor(255,255,255);pdf.setFillColor(29,204,105);pdf.setLineWidth(.6);
    pdf.rect(x,y+8,16,3,"F");pdf.rect(x+2,y+11,2,5,"F");pdf.rect(x+12,y+11,2,5,"F");
    pdf.circle(x+8,y+4,5,"FD");pdf.setFillColor(4,63,70);pdf.circle(x+8,y+4,1.3,"F");
  };

  const ukDate=value=>{
    const date=value?new Date(value):new Date();
    return Number.isNaN(date.getTime())?"":date.toLocaleDateString("en-GB");
  };

  const addShieldIcon=(pdf,x,y,size)=>{
    pdf.setDrawColor(255,255,255);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(x,y,size,size*1.18,2,2,"S");
    pdf.line(x+size*0.5,y+size*0.25,x+size*0.5,y+size*0.93);
    pdf.line(x+size*0.22,y+size*0.58,x+size*0.78,y+size*0.58);
  };

  const addCameraIcon=(pdf,x,y)=>{
    pdf.setDrawColor(29,204,105);
    pdf.setLineWidth(0.55);
    pdf.roundedRect(x,y,5.8,4.3,1,1,"S");
    pdf.circle(x+2.9,y+2.15,1.05,"S");
    pdf.line(x+1.2,y,x+1.8,y-1);
    pdf.line(x+1.8,y-1,x+3.6,y-1);
    pdf.line(x+3.6,y-1,x+4.2,y);
  };

  const addDocumentIcon=(pdf,x,y)=>{
    pdf.setDrawColor(29,204,105);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(x,y,5.4,6.4,0.7,0.7,"S");
    pdf.line(x+1.2,y+2,x+4.2,y+2);
    pdf.line(x+1.2,y+3.2,x+4.2,y+3.2);
    pdf.line(x+1.2,y+4.4,x+3.4,y+4.4);
  };

  const addPersonIcon=(pdf,x,y)=>{
    pdf.setDrawColor(29,204,105);
    pdf.setLineWidth(0.5);
    pdf.circle(x+3,y+2,1.4,"S");
    pdf.circle(x+3,y+6.4,3,"S");
    pdf.line(x+1.4,y+7.6,x+1.4,y+5.6);
    pdf.line(x+4.6,y+7.6,x+4.6,y+5.6);
  };

  const fitStatement=(pdf,text,width,height)=>{
    let size=8.4;
    const min=5.4;
    const factor=1.45;
    let lines=[];

    while(size>=min){
      pdf.setFontSize(size);
      lines=pdf.splitTextToSize(text,width);
      const h=lines.length*size*0.3528*factor;
      if(h<=height)break;
      size-=0.2;
    }

    const finalSize=Math.max(size,min);
    pdf.setFontSize(finalSize);
    lines=pdf.splitTextToSize(text,width);
    const lineHeight=finalSize*0.3528*factor;
    const maxLines=Math.max(1,Math.floor(height/lineHeight));

    if(lines.length>maxLines){
      lines=lines.slice(0,maxLines);
      const last=String(lines[lines.length-1]||"");
      lines[lines.length-1]=last.length>3?`${last.slice(0,-3)}...`:last;
    }

    return {size:finalSize,lines,factor};
  };

  try{
    evidence=evidence||{};
    profile=profile||{};

    if(!window.jspdf||!window.jspdf.jsPDF){
      throw new Error("jsPDF is unavailable");
    }

    const {jsPDF}=window.jspdf;
    const pdf=new jsPDF({
      orientation:"landscape",
      unit:"mm",
      format:"a4",
      compress:true
    });

    const pageW=pdf.internal.pageSize.getWidth();
    const pageH=pdf.internal.pageSize.getHeight();

    const margin=4.5;
    const headerH=18;
    const bodyTop=margin+headerH+2;
    const bodyBottom=pageH-margin;
    const bodyH=bodyBottom-bodyTop;
    const gap=3.2;

    const leftW=154;
    const rightX=margin+leftW+gap;
    const rightW=pageW-margin-rightX;

    // White page background.
    pdf.setFillColor(255,255,255);
    pdf.rect(0,0,pageW,pageH,"F");

    // Premium blue header.
    pdf.setFillColor(4,63,70);
    pdf.roundedRect(margin,margin,pageW-(margin*2),headerH,3,3,"F");
    pdf.rect(margin,margin+headerH-4,pageW-(margin*2),4,"F");

    // Subtle darker blue accent at right.
    pdf.setFillColor(7,91,99);
    pdf.roundedRect(pageW-47,margin,pageW-(pageW-47)-margin,headerH,3,3,"F");
    pdf.rect(pageW-47,margin+headerH-4,pageW-(pageW-47)-margin,4,"F");

    addTradeIcon(pdf,margin+6,margin+7);

    pdf.setTextColor(255,255,255);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(12);
    const title=`Assignment ${assignment.id}: ${assignment.title}`;
    pdf.text(pdf.splitTextToSize(title,pageW-45).slice(0,1),margin+18,margin+7.6);

    pdf.setFont("helvetica","normal");
    pdf.setFontSize(6.8);
    const learnerName=profile.learner||"Learner not entered";
    const courseName=profile.course||"Apprenticeship";
    const assignmentDate=evidence.date?ukDate(`${evidence.date}T12:00:00`):ukDate();
    pdf.text(`${learnerName}   |   ${courseName}   |   ${assignmentDate}`,margin+18,margin+13.2);

    // Main left panel.
    pdf.setDrawColor(221,227,235);
    pdf.setFillColor(255,255,255);
    pdf.setLineWidth(0.35);
    pdf.roundedRect(margin,bodyTop,leftW,bodyH,3,3,"FD");

    addCameraIcon(pdf,margin+6,bodyTop+7);
    pdf.setTextColor(4,91,96);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(8.8);
    pdf.text("PHOTOGRAPHIC AND SUPPORTING EVIDENCE",margin+15,bodyTop+9.5);

    const gridX=margin+5;
    const gridY=bodyTop+15;
    const gridW=leftW-10;
    const gridH=bodyBottom-gridY-4;
    const cellGap=2.3;
    const cols=3;
    const rows=3;
    const cellW=(gridW-cellGap*(cols-1))/cols;
    const cellH=(gridH-cellGap*(rows-1))/rows;

    const evidenceItems=(evidence.evidenceItems||[])
      .filter(item=>item&&item.key)
      .slice(0,9);

    for(let index=0;index<9;index++){
      const row=Math.floor(index/cols);
      const col=index%cols;
      const x=gridX+col*(cellW+cellGap);
      const y=gridY+row*(cellH+cellGap);
      const item=evidenceItems[index];

      pdf.setDrawColor(220,226,234);
      pdf.setFillColor(255,255,255);
      pdf.roundedRect(x,y,cellW,cellH,2.4,2.4,"FD");

      // Number badge.
      pdf.setFillColor(4,91,96);
      pdf.circle(x+5.5,y+5.5,2.55,"F");
      pdf.setTextColor(255,255,255);
      pdf.setFont("helvetica","bold");
      pdf.setFontSize(6.4);
      pdf.text(String(index+1),x+5.5,y+6.2,{align:"center"});

      // Evidence title.
      pdf.setTextColor(28,37,49);
      pdf.setFont("helvetica","bold");
      pdf.setFontSize(6.1);
      const label=item?.name||`Evidence ${index+1}`;
      const labelLines=pdf.splitTextToSize(label,cellW-13).slice(0,2);
      pdf.text(labelLines,x+10.5,y+4.6,{lineHeightFactor:1.1});

      const mediaX=x+3.2;
      const mediaY=y+11.5;
      const mediaW=cellW-6.4;
      const mediaH=cellH-14.7;

      if(item&&item.isImage){
        try{
          const image=await getImage(item.key);
          if(!image)throw new Error("Image not found");

          const props=pdf.getImageProperties(image);
          const ratio=Math.min(mediaW/props.width,mediaH/props.height);
          const drawW=props.width*ratio;
          const drawH=props.height*ratio;
          const format=String(image).startsWith("data:image/png")?"PNG":"JPEG";

          pdf.addImage(
            image,
            format,
            mediaX+(mediaW-drawW)/2,
            mediaY+(mediaH-drawH)/2,
            drawW,
            drawH,
            undefined,
            "FAST"
          );

          // Camera marker.
          pdf.setFillColor(25,25,25);
          pdf.roundedRect(mediaX+1.2,mediaY+mediaH-6.3,5.8,5.2,1,1,"F");
          pdf.setDrawColor(255,255,255);
          pdf.circle(mediaX+4.1,mediaY+mediaH-3.8,1.15,"S");
        }catch(err){
          pdf.setTextColor(130,138,148);
          pdf.setFont("helvetica","normal");
          pdf.setFontSize(5.5);
          pdf.text(["Image unavailable","Evidence remains saved"],mediaX+2,mediaY+7,{lineHeightFactor:1.2});
        }
      }else if(item){
        pdf.setDrawColor(91,188,145);
        pdf.setLineDashPattern([2,1.5],0);
        pdf.roundedRect(mediaX,mediaY,mediaW,mediaH,2,2,"S");
        pdf.setLineDashPattern([],0);
        pdf.setTextColor(4,91,96);
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(6.2);
        pdf.text("Supporting file",mediaX+mediaW/2,mediaY+mediaH/2-1,{align:"center"});
        pdf.setFont("helvetica","normal");
        pdf.setTextColor(98,108,120);
        pdf.setFontSize(5);
        pdf.text(pdf.splitTextToSize(item.name||"Uploaded file",mediaW-6).slice(0,2),mediaX+mediaW/2,mediaY+mediaH/2+4,{align:"center",lineHeightFactor:1.15});
      }else{
        pdf.setDrawColor(91,188,145);
        pdf.setLineDashPattern([2,1.5],0);
        pdf.roundedRect(mediaX,mediaY,mediaW,mediaH,2,2,"S");
        pdf.setLineDashPattern([],0);

        pdf.setDrawColor(29,204,105);
        pdf.roundedRect(mediaX+mediaW/2-3.4,mediaY+mediaH/2-8,6.8,6.8,1.2,1.2,"S");
        pdf.line(mediaX+mediaW/2-1.7,mediaY+mediaH/2-4.6,mediaX+mediaW/2+1.7,mediaY+mediaH/2-4.6);
        pdf.line(mediaX+mediaW/2,mediaY+mediaH/2-6.3,mediaX+mediaW/2,mediaY+mediaH/2-2.9);

        pdf.setTextColor(29,204,105);
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(5.8);
        pdf.text("Add evidence",mediaX+mediaW/2,mediaY+mediaH/2+3,{align:"center"});

        pdf.setTextColor(98,108,120);
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(4.8);
        pdf.text("No evidence added",mediaX+mediaW/2,mediaY+mediaH/2+8,{align:"center"});
      }
    }

    // Right statement panel.
    const declarationH=58;
    const statementH=bodyH-declarationH-gap;

    pdf.setDrawColor(221,227,235);
    pdf.setFillColor(255,255,255);
    pdf.roundedRect(rightX,bodyTop,rightW,statementH,3,3,"FD");

    addDocumentIcon(pdf,rightX+6,bodyTop+5);
    pdf.setTextColor(4,91,96);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(8.8);
    pdf.text("ACTIVITY STATEMENT",rightX+15,bodyTop+9.4);

    pdf.setDrawColor(226,231,237);
    pdf.line(rightX+5,bodyTop+14,rightX+rightW-5,bodyTop+14);

    const statement=String(evidence.description||"").trim()||"No learner statement entered.";
    const statementX=rightX+5;
    const statementY=bodyTop+20;
    const statementW=rightW-10;
    const statementAvailableH=statementH-25;

    pdf.setTextColor(30,38,48);
    pdf.setFont("helvetica","normal");
    const fitted=fitStatement(pdf,statement,statementW,statementAvailableH);
    pdf.setFontSize(fitted.size);
    pdf.text(fitted.lines,statementX,statementY,{
      lineHeightFactor:fitted.factor,
      maxWidth:statementW
    });

    // Declaration panel.
    const declarationY=bodyTop+statementH+gap;
    pdf.setDrawColor(221,227,235);
    pdf.setFillColor(255,255,255);
    pdf.roundedRect(rightX,declarationY,rightW,declarationH,3,3,"FD");

    addPersonIcon(pdf,rightX+6,declarationY+4.2);
    pdf.setTextColor(4,91,96);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(8.8);
    pdf.text("LEARNER DECLARATION",rightX+15,declarationY+9.5);

    pdf.setDrawColor(226,231,237);
    pdf.line(rightX+5,declarationY+14,rightX+rightW-5,declarationY+14);

    pdf.setTextColor(35,43,52);
    pdf.setFont("helvetica","normal");
    pdf.setFontSize(6.6);
    const declarationText="I confirm that this evidence is my own work and accurately reflects the activity completed.";
    pdf.text(pdf.splitTextToSize(declarationText,rightW-10),rightX+5,declarationY+20,{lineHeightFactor:1.35});

    const signatureY=declarationY+33;
    if(profile.signature){
      try{
        pdf.addImage(profile.signature,"PNG",rightX+6,signatureY-1,52,15);
      }catch(err){
        console.warn("Signature could not be added",err);
      }
    }

    pdf.setDrawColor(182,190,200);
    pdf.line(rightX+5,declarationY+45,rightX+rightW-5,declarationY+45);

    pdf.setTextColor(4,91,96);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(6.2);
    pdf.text(`Signed: ${learnerName}`,rightX+5,declarationY+51);
    pdf.text(`Date: ${ukDate()}`,rightX+rightW-5,declarationY+51,{align:"right"});

    const ksbs=(typeof assignmentKsbMap!=="undefined"&&assignmentKsbMap[String(assignment.id)])
      ?assignmentKsbMap[String(assignment.id)]
      :[];

    if(ksbs.length){
      pdf.setTextColor(45,52,61);
      pdf.setFont("helvetica","normal");
      pdf.setFontSize(5.5);
      pdf.text(`KSBs: ${ksbs.join(", ")}`,rightX+5,declarationY+56);
    }

    const fileName=`Assignment-${assignment.id}-${safeFileName(assignment.title)}.pdf`;
    const blob=pdf.output("blob");
    createdUrl=URL.createObjectURL(blob);

    return{
      blob,
      fileName,
      filename:fileName,
      url:createdUrl
    };
  }catch(error){
    if(createdUrl)URL.revokeObjectURL(createdUrl);
    console.error("Assignment PDF error:",error);
    alert(`The assignment PDF could not be created. Your evidence is still saved.\n\n${error?.message||"Unknown PDF error"}`);
    return null;
  }
}
