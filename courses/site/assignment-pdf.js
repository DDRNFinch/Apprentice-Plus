"use strict";

async function downloadAssignmentPdf(assignment,evidence,profile){
  let createdUrl=null;

  const safeFileName=value=>String(value||"document")
    .replace(/[^a-z0-9]+/gi,"-")
    .replace(/^-|-$/g,"");

  const ukDate=value=>{
    const date=value?new Date(value):new Date();
    return Number.isNaN(date.getTime())?"":date.toLocaleDateString("en-GB");
  };

  const fitText=(pdf,text,width,height,startSize=9,minSize=5.4)=>{
    let size=startSize;
    const lineFactor=1.22;
    let lines=[];

    while(size>=minSize){
      pdf.setFontSize(size);
      lines=pdf.splitTextToSize(text,width);
      const lineHeightMm=size*0.3528*lineFactor;
      if(lines.length*lineHeightMm<=height)break;
      size-=0.25;
    }

    const finalSize=Math.max(size,minSize);
    pdf.setFontSize(finalSize);
    lines=pdf.splitTextToSize(text,width);

    const lineHeightMm=finalSize*0.3528*lineFactor;
    const maxLines=Math.max(1,Math.floor(height/lineHeightMm));

    if(lines.length>maxLines){
      lines=lines.slice(0,maxLines);
      const last=String(lines[lines.length-1]||"");
      lines[lines.length-1]=last.length>4?`${last.slice(0,-4)}...`:last;
    }

    return {lines,fontSize:finalSize,lineFactor};
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

    const margin=7;
    const gap=5;
    const headerH=16;
    const usableTop=margin+headerH;
    const usableBottom=pageH-margin;
    const usableH=usableBottom-usableTop;

    const leftW=136;
    const rightX=margin+leftW+gap;
    const rightW=pageW-rightX-margin;

    // Give the statement roughly 82% of the right-hand height.
    const declarationH=38;
    const declarationY=usableBottom-declarationH;
    const textH=declarationY-usableTop-4;

    const evidenceItems=(evidence.evidenceItems||[])
      .filter(item=>item&&item.key)
      .slice(0,9);

    // Header
    pdf.setFillColor(20,35,57);
    pdf.roundedRect(margin,margin,pageW-(margin*2),13,3,3,"F");

    pdf.setTextColor(255,255,255);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(11);
    const headerTitle=`Assignment ${assignment.id}: ${assignment.title}`;
    pdf.text(pdf.splitTextToSize(headerTitle,pageW-(margin*2)-10).slice(0,1),margin+5,margin+5.6);

    pdf.setFont("helvetica","normal");
    pdf.setFontSize(6.7);
    const learnerName=profile.learner||"Learner not entered";
    const assignmentDate=evidence.date?ukDate(`${evidence.date}T12:00:00`):ukDate();
    pdf.text(`${learnerName}  |  ${profile.course||"Apprenticeship"}  |  ${assignmentDate}`,margin+5,margin+10.5);

    // Left half: 3 x 3 evidence grid
    pdf.setTextColor(30,38,48);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(7.5);
    pdf.text("Photographic and supporting evidence",margin,usableTop+3);

    const gridY=usableTop+5.5;
    const gridH=usableBottom-gridY;
    const columns=3;
    const rows=3;
    const cellGap=2.2;
    const cellW=(leftW-(cellGap*(columns-1)))/columns;
    const cellH=(gridH-(cellGap*(rows-1)))/rows;

    for(let index=0;index<9;index++){
      const row=Math.floor(index/columns);
      const column=index%columns;
      const x=margin+(column*(cellW+cellGap));
      const y=gridY+(row*(cellH+cellGap));
      const item=evidenceItems[index];

      pdf.setDrawColor(190,198,207);
      pdf.setFillColor(248,250,252);
      pdf.roundedRect(x,y,cellW,cellH,2,2,"FD");

      pdf.setFont("helvetica","bold");
      pdf.setFontSize(5.4);
      pdf.setTextColor(45,52,61);
      const label=item?.name||`Evidence ${index+1}`;
      const labelLines=pdf.splitTextToSize(`${index+1}. ${label}`,cellW-4).slice(0,2);
      pdf.text(labelLines,x+2,y+3.5,{lineHeightFactor:1.12});

      const imageTop=y+8;
      const imageMaxH=cellH-10;
      const imageMaxW=cellW-4;

      if(!item){
        pdf.setFont("helvetica","normal");
        pdf.setFontSize(5.7);
        pdf.setTextColor(145,151,158);
        pdf.text("No evidence added",x+2,imageTop+7);
        continue;
      }

      if(item.isImage){
        try{
          const image=await getImage(item.key);
          if(!image)throw new Error("Image not found");

          const properties=pdf.getImageProperties(image);
          const ratio=Math.min(imageMaxW/properties.width,imageMaxH/properties.height);
          const drawW=properties.width*ratio;
          const drawH=properties.height*ratio;
          const format=String(image).startsWith("data:image/png")?"PNG":"JPEG";

          pdf.addImage(
            image,
            format,
            x+(cellW-drawW)/2,
            imageTop+(imageMaxH-drawH)/2,
            drawW,
            drawH,
            undefined,
            "FAST"
          );
        }catch(imageError){
          console.warn("Evidence image could not be added",imageError);
          pdf.setFont("helvetica","normal");
          pdf.setFontSize(5.4);
          pdf.setTextColor(125,131,138);
          pdf.text(["Image unavailable","Evidence remains saved"],x+2,imageTop+6,{lineHeightFactor:1.15});
        }
      }else{
        pdf.setFont("helvetica","bold");
        pdf.setFontSize(5.7);
        pdf.setTextColor(55,62,70);
        pdf.text("Supporting file",x+2,imageTop+5);

        pdf.setFont("helvetica","normal");
        pdf.setFontSize(5.2);
        const fileLines=pdf.splitTextToSize(item.name||"Uploaded file",cellW-4).slice(0,4);
        pdf.text(fileLines,x+2,imageTop+10,{lineHeightFactor:1.15});
      }
    }

    // Upper right: readable activity statement
    pdf.setDrawColor(190,198,207);
    pdf.setFillColor(255,255,255);
    pdf.roundedRect(rightX,usableTop,rightW,textH,3,3,"FD");

    pdf.setFillColor(239,244,249);
    pdf.roundedRect(rightX,usableTop,rightW,10,3,3,"F");
    pdf.rect(rightX,usableTop+6,rightW,4,"F");

    pdf.setTextColor(20,35,57);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(8.5);
    pdf.text("Activity statement",rightX+4,usableTop+6.5);

    const statement=String(evidence.description||"").trim()||"No learner statement entered.";
    const statementX=rightX+5;
    const statementY=usableTop+15;
    const statementW=rightW-10;
    const statementH=textH-20;

    pdf.setFont("helvetica","normal");
    pdf.setTextColor(35,42,51);

    const fitted=fitText(pdf,statement,statementW,statementH,9,5.4);
    pdf.setFontSize(fitted.fontSize);
    pdf.text(fitted.lines,statementX,statementY,{
      lineHeightFactor:fitted.lineFactor,
      maxWidth:statementW
    });

    // Lower right: compact declaration/signature/date block
    pdf.setDrawColor(190,198,207);
    pdf.setFillColor(248,250,252);
    pdf.roundedRect(rightX,declarationY,rightW,declarationH,3,3,"FD");

    pdf.setTextColor(20,35,57);
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(7.5);
    pdf.text("Learner declaration",rightX+4,declarationY+5.5);

    pdf.setFont("helvetica","normal");
    pdf.setFontSize(5.8);
    pdf.setTextColor(45,52,61);
    const declarationText="I confirm that this evidence is my own work and accurately reflects the activity completed.";
    pdf.text(pdf.splitTextToSize(declarationText,rightW-8),rightX+4,declarationY+10,{lineHeightFactor:1.15});

    const signatureTop=declarationY+18;
    const signatureLineY=declarationY+29;

    if(profile.signature){
      try{
        pdf.addImage(profile.signature,"PNG",rightX+5,signatureTop,43,10);
      }catch(signatureError){
        console.warn("Signature could not be added",signatureError);
      }
    }

    pdf.setDrawColor(160,168,178);
    pdf.line(rightX+4,signatureLineY,rightX+(rightW*0.62),signatureLineY);
    pdf.line(rightX+(rightW*0.68),signatureLineY,rightX+rightW-4,signatureLineY);

    pdf.setFont("helvetica","bold");
    pdf.setFontSize(5.6);
    pdf.text(`Signed: ${learnerName}`,rightX+4,signatureLineY+4);
    pdf.text(`Date: ${ukDate()}`,rightX+(rightW*0.68),signatureLineY+4);

    const ksbs=(typeof assignmentKsbMap!=="undefined"&&assignmentKsbMap[String(assignment.id)])
      ?assignmentKsbMap[String(assignment.id)]
      :[];

    if(ksbs.length){
      pdf.setFont("helvetica","normal");
      pdf.setFontSize(4.9);
      pdf.setTextColor(90,96,104);
      pdf.text(pdf.splitTextToSize(`KSBs: ${ksbs.join(", ")}`,rightW-8).slice(0,1),rightX+4,usableBottom-1.8);
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
