"use strict";
(function(){
  if(window.ApprenticeshipPlusAcademy?.version==="phase8-1-v1") return;

  const STORAGE_KEY="apprenticeshipPlusAcademyProgressV1";
  const PROFILE_KEY="apprenticeshipPlusAcademyLearnerProfileV1";
  const CERTIFICATE_KEY="apprenticeshipPlusAcademyCertificatesV1";
  const ACHIEVEMENT_KEY="apprenticeshipPlusAchievementSnapshotV1";

  
// Phase 8.2 badge foundation
const BADGE_KEY="apprenticeshipPlusBadgeGalleryV1";
const DEFAULT_BADGES=[
{id:"first-course",title:"First Steps",desc:"Complete your first Academy course."},
{id:"perfect-score",title:"Perfect Score",desc:"Achieve 100% in any assessment."},
{id:"five-courses",title:"Dedicated Learner",desc:"Complete five Academy courses."},
{id:"ten-certs",title:"Certificate Collector",desc:"Earn ten Academy certificates."},
{id:"level20",title:"Master Apprentice",desc:"Reach Level 20."}
];
function getBadges(){
 try{return {...Object.fromEntries(DEFAULT_BADGES.map(b=>[b.id,false])),...JSON.parse(localStorage.getItem(BADGE_KEY)||"{}")};}
 catch(e){return Object.fromEntries(DEFAULT_BADGES.map(b=>[b.id,false]));}
}
function saveBadges(v){localStorage.setItem(BADGE_KEY,JSON.stringify(v));}


  const COURSES=[
    {
      id:"manual-handling",
      title:"Manual Handling",
      category:"Health & Safety",
      minutes:15,
      xp:500,
      passMark:90,
      status:"available",
      description:"Learn how to assess manual-handling tasks, reduce risk and use safer lifting and carrying techniques.",
      lessons:[
        {
          title:"What is manual handling?",
          text:"Manual handling means transporting or supporting a load by hand or bodily force. It includes lifting, lowering, pushing, pulling, carrying and moving objects. The safest approach is always to avoid unnecessary manual handling where reasonably practicable.",
          points:["Lifting and lowering","Pushing and pulling","Carrying or supporting loads"]
        },
        {
          title:"Why injuries happen",
          text:"Manual-handling injuries often affect the back, shoulders, arms, hands and knees. Injuries can happen suddenly, but they may also develop gradually through repeated poor technique, heavy loads, awkward posture or excessive carrying distances.",
          points:["Heavy or unstable loads","Twisting and reaching","Repetition and fatigue"]
        },
        {
          title:"Assess before you lift",
          text:"Before moving anything, pause and assess the task. Consider the load, the individual, the task and the environment. This is commonly remembered as TILE. Stop and ask for help when the task cannot be completed safely.",
          points:["T — Task","I — Individual","L — Load","E — Environment"]
        },
        {
          title:"Plan the route",
          text:"Check where the load is going before lifting. Remove obstacles, identify changes in level, open doors and make sure the destination is ready. A clear route helps prevent trips, sudden movements and carrying a load for longer than necessary.",
          points:["Remove trip hazards","Check doorways and stairs","Prepare the set-down area"]
        },
        {
          title:"Safe lifting position",
          text:"Stand close to the load with a stable base. Bend the knees and hips rather than stooping from the waist. Keep the natural curve of the back, get a secure grip and keep the load close to the body.",
          points:["Feet apart for balance","Secure grip","Load close to the body"]
        },
        {
          title:"Lift smoothly",
          text:"Use the legs to rise smoothly and avoid jerking. Keep looking ahead and do not twist while lifting. Turn by moving the feet. If the load becomes unstable or too heavy, place it down safely and reassess.",
          points:["Avoid sudden movement","Move the feet to turn","Stop if control is lost"]
        },
        {
          title:"Use mechanical assistance",
          text:"Trolleys, sack trucks, pallet trucks, lifting tables and other aids can reduce risk. Equipment must be suitable, inspected and used correctly. Team lifting may help, but it still requires planning and clear communication.",
          points:["Use the right aid","Check equipment condition","Coordinate team lifts"]
        },
        {
          title:"Your responsibilities",
          text:"Follow training and safe systems of work, use equipment correctly and report hazards, defects, pain or near misses. Never continue with a task that you believe is unsafe. Speak to a supervisor and agree a safer method.",
          points:["Follow instructions","Report problems early","Do not take unnecessary risks"]
        }
      ],
      questions:[
        {
          q:"Which activity is classed as manual handling?",
          options:["Only lifting above shoulder height","Lifting, lowering, pushing, pulling or carrying a load","Only moving loads heavier than 25 kg","Operating any powered machine"],
          answer:1
        },
        {
          q:"What should you do first before moving a load?",
          options:["Lift it quickly","Test it by twisting","Assess the task and load","Ask someone to watch"],
          answer:2
        },
        {
          q:"What does the L in TILE represent?",
          options:["Legislation","Load","Location","Limit"],
          answer:1
        },
        {
          q:"Which is the safest body position when beginning a lift?",
          options:["Load held away from the body","Feet together and back bent","Stable stance with the load close","Twisting towards the destination"],
          answer:2
        },
        {
          q:"How should you change direction while carrying a load?",
          options:["Twist through the waist","Move your feet","Lean sideways","Turn only the shoulders"],
          answer:1
        },
        {
          q:"What should happen if a load feels too heavy or unstable?",
          options:["Continue before becoming tired","Carry it at arm's length","Put it down safely and reassess","Lift faster"],
          answer:2
        },
        {
          q:"Why should the route be checked before lifting?",
          options:["To make the load lighter","To identify obstacles and prepare the destination","To avoid using lifting equipment","To reduce the number of workers"],
          answer:1
        },
        {
          q:"Which option can reduce manual-handling risk?",
          options:["Carrying more in one journey","Using a suitable trolley or lifting aid","Holding the load above the head","Working without breaks"],
          answer:1
        },
        {
          q:"What is important during a team lift?",
          options:["Each person moves independently","One person gives clear coordinated instructions","The strongest person carries most of the weight","The load is passed between people while walking"],
          answer:1
        },
        {
          q:"What should a learner do if manual handling causes pain?",
          options:["Ignore it until the task is complete","Report it and stop or reassess the task","Work faster","Change hands only"],
          answer:1
        }
      ]
    },
    {
      id:"coshh-awareness",
      title:"COSHH Awareness",
      category:"Health & Safety",
      minutes:20,
      xp:500,
      passMark:90,
      status:"available",
      description:"Learn how hazardous substances can affect health and how COSHH information, controls, storage and emergency procedures reduce risk.",
      lessons:[
        {
          title:"What COSHH means",
          text:"COSHH stands for the Control of Substances Hazardous to Health Regulations. COSHH requires employers to assess risks from hazardous substances and prevent or adequately control exposure. Workers must follow the controls, training and instructions provided.",
          points:["Control hazardous substances","Assess exposure risks","Use the agreed controls"]
        },
        {
          title:"Recognising hazardous substances",
          text:"Hazardous substances may be liquids, dusts, fumes, vapours, gases, mists or biological agents. Construction examples include cement, wood dust, solvents, adhesives, paints, cleaning chemicals and silica dust.",
          points:["Check labels and packaging","Consider dust, vapour and fumes","Do not rely only on smell"]
        },
        {
          title:"Hazard labels and pictograms",
          text:"Chemical containers use hazard pictograms and warning statements. These can identify risks such as flammability, corrosion, toxicity, serious health effects or environmental harm. Never use an unlabelled substance.",
          points:["Read the product label","Understand warning symbols","Report missing or damaged labels"]
        },
        {
          title:"Safety Data Sheets",
          text:"A Safety Data Sheet provides detailed information about a substance, including hazards, handling, storage, exposure controls, first aid, spill response and disposal. It supports the COSHH assessment but does not replace it.",
          points:["Check handling instructions","Find first-aid information","Use the correct storage guidance"]
        },
        {
          title:"Routes of exposure",
          text:"Hazardous substances can enter the body by breathing them in, swallowing them, skin or eye contact, or injection through damaged skin. The controls must match the likely route of exposure.",
          points:["Inhalation","Skin and eye contact","Ingestion or injection"]
        },
        {
          title:"The control hierarchy",
          text:"The best control is to remove the hazardous substance or replace it with a safer alternative. Where this is not possible, use engineering controls such as enclosure, extraction or wet methods before relying on PPE and RPE.",
          points:["Eliminate or substitute first","Use extraction or wet methods","PPE is the final layer"]
        },
        {
          title:"Using PPE and RPE",
          text:"PPE and RPE must be suitable for the substance and task. Respiratory protection must have the correct filter and fit the wearer. Tight-fitting masks require face-fit testing and a clean-shaven seal area.",
          points:["Select the correct protection","Inspect before use","Wear and remove it correctly"]
        },
        {
          title:"Storage and housekeeping",
          text:"Keep hazardous substances in approved, labelled containers and store them securely according to the assessment and Safety Data Sheet. Keep lids closed, separate incompatible products and prevent contamination of drains, soil and work areas.",
          points:["Use labelled containers","Secure storage areas","Keep workspaces clean"]
        },
        {
          title:"Spills and emergencies",
          text:"Follow the site emergency procedure for spills, splashes or exposure. Raise the alarm, isolate the area and use the correct spill kit only if trained. Seek first aid and report the incident or near miss.",
          points:["Do not improvise","Use emergency information","Report exposure promptly"]
        },
        {
          title:"Health surveillance and reporting",
          text:"Some work may require health surveillance, such as checks for dermatitis or breathing problems. Attend any required checks and report symptoms early. Records and early intervention help prevent long-term ill health.",
          points:["Report symptoms early","Attend required surveillance","Review controls after problems"]
        }
      ],
      questions:[
        {
          q:"What does COSHH stand for?",
          options:["Control of Site Health Hazards","Control of Substances Hazardous to Health","Construction Operations Safety and Health Handbook","Chemical Organisation Storage and Handling"],
          answer:1
        },
        {
          q:"Which can be a hazardous substance?",
          options:["Only liquids with a warning label","Dust, fumes, vapour, gases and liquids","Only products kept in a chemical store","Only substances that smell strong"],
          answer:1
        },
        {
          q:"What should you do with an unlabelled chemical container?",
          options:["Use a small amount to identify it","Smell it carefully","Do not use it and report it","Pour it into another container"],
          answer:2
        },
        {
          q:"What information can a Safety Data Sheet provide?",
          options:["Employee attendance records","Hazards, handling, first aid and spill response","The site's fire-alarm test dates","Only the purchase price"],
          answer:1
        },
        {
          q:"Which is a route of exposure?",
          options:["Inhalation","Measurement","Inspection","Supervision"],
          answer:0
        },
        {
          q:"What should be considered before relying on PPE?",
          options:["Working faster","Elimination, substitution and engineering controls","Using two pairs of gloves for every task","Moving the substance outdoors"],
          answer:1
        },
        {
          q:"What is required for a tight-fitting respirator to work correctly?",
          options:["A face-fit test and a good seal","A hard hat worn over it","A larger filter than specified","A wet face seal"],
          answer:0
        },
        {
          q:"How should hazardous substances normally be stored?",
          options:["In any convenient drinks bottle","In approved labelled containers according to instructions","With lids removed for ventilation","Next to drains for easy cleaning"],
          answer:1
        },
        {
          q:"What should you do after a hazardous-substance splash or exposure?",
          options:["Wait until the end of the shift","Follow emergency procedures, seek first aid and report it","Wash the area only if it hurts","Continue working while someone checks the label"],
          answer:1
        },
        {
          q:"Why may health surveillance be required?",
          options:["To replace the COSHH assessment","To detect work-related health effects early","To decide who receives PPE","To record productivity"],
          answer:1
        }
      ]
    },
    {
      id:"equality-diversity",title:"Equality and Diversity",category:"Personal Development",minutes:15,xp:500,passMark:90,status:"available",
      description:"Learn how equality, diversity and inclusion support fair treatment, respectful behaviour and stronger workplace teams.",
      lessons:[
        {title:"Equality, diversity and inclusion",text:"Equality means fair access and treatment. Diversity recognises differences between people. Inclusion means creating an environment where everyone can participate, contribute and feel respected.",points:["Fair treatment","Value differences","Include everyone"]},
        {title:"Protected characteristics",text:"The Equality Act protects people from discrimination linked to characteristics such as age, disability, race, religion or belief, sex and sexual orientation.",points:["Understand legal protection","Avoid assumptions","Treat people fairly"]},
        {title:"Direct discrimination",text:"Direct discrimination happens when someone is treated less favourably because of a protected characteristic.",points:["Recognise unfair treatment","Apply rules consistently","Report concerns"]},
        {title:"Indirect discrimination",text:"Indirect discrimination can happen when a rule applies to everyone but disadvantages a particular group without objective justification.",points:["Review workplace rules","Consider unintended impact","Use fair alternatives"]},
        {title:"Harassment and victimisation",text:"Harassment includes unwanted behaviour that violates dignity or creates an intimidating, hostile or offensive environment. Victimisation means treating someone badly because they raised a concern.",points:["Respect dignity","Challenge inappropriate behaviour","Protect people who speak up"]},
        {title:"Reasonable adjustments",text:"Reasonable adjustments help remove barriers for disabled people. Examples include changes to equipment, working methods, communication or access arrangements.",points:["Identify barriers","Discuss suitable support","Review effectiveness"]},
        {title:"Inclusive communication",text:"Use respectful language, listen carefully and avoid jokes, stereotypes or comments that may exclude or offend others.",points:["Use clear respectful language","Listen to others","Avoid stereotypes"]},
        {title:"Unconscious bias",text:"Unconscious bias can affect decisions without us realising. Using evidence, consistent criteria and reflection helps reduce unfair judgement.",points:["Question assumptions","Use objective criteria","Reflect on decisions"]},
        {title:"Challenging poor behaviour",text:"Challenge inappropriate behaviour calmly and safely where possible. Report serious or repeated concerns through the correct workplace route.",points:["Be respectful","Use reporting procedures","Support affected colleagues"]},
        {title:"Benefits of inclusion",text:"Inclusive teams can improve trust, safety, communication, problem-solving and retention because people feel able to contribute.",points:["Stronger teamwork","Better communication","Greater wellbeing"]}],
      questions:[
        {q:"What does inclusion mean?",options:["Treating everyone identically in all situations","Creating an environment where everyone can participate","Avoiding all workplace discussion","Allowing only senior staff to decide"],answer:1},
        {q:"Which law protects people from discrimination in Great Britain?",options:["Equality Act 2010","Health and Safety at Work Act only","Building Regulations","Data Protection Act only"],answer:0},
        {q:"What is direct discrimination?",options:["Treating someone less favourably because of a protected characteristic","Applying a fair rule consistently","Offering reasonable support","Using objective criteria"],answer:0},
        {q:"What can indirect discrimination involve?",options:["A rule that disadvantages a group","A personal disagreement","A pay rise","A toolbox talk"],answer:0},
        {q:"What is harassment?",options:["Any performance feedback","Unwanted behaviour that violates dignity or creates an offensive environment","A fair instruction","A risk assessment"],answer:1},
        {q:"Why are reasonable adjustments used?",options:["To give unfair advantage","To remove barriers for disabled people","To avoid training","To reduce responsibilities"],answer:1},
        {q:"Which is inclusive communication?",options:["Using stereotypes","Respectful language and active listening","Ignoring concerns","Speaking only to managers"],answer:1},
        {q:"How can unconscious bias be reduced?",options:["By making faster decisions","By using evidence and consistent criteria","By avoiding records","By relying on first impressions"],answer:1},
        {q:"What should happen after serious inappropriate behaviour?",options:["Ignore it","Report it through the correct route","Share it as a joke","Post it online"],answer:1},
        {q:"What is a benefit of an inclusive team?",options:["Reduced communication","Improved trust and teamwork","More conflict","Less participation"],answer:1}]
    },
    {
      id:"british-values",title:"British Values",category:"Personal Development",minutes:15,xp:500,passMark:90,status:"available",
      description:"Explore democracy, the rule of law, individual liberty, mutual respect and tolerance through practical workplace examples.",
      lessons:[
        {title:"What British Values are",text:"The fundamental British Values are democracy, the rule of law, individual liberty, mutual respect and tolerance of different faiths and beliefs.",points:["Democracy","Rule of law","Liberty, respect and tolerance"]},
        {title:"Democracy",text:"Democracy includes having a voice, contributing to decisions and respecting fair processes. In work this can include consultation, feedback and elected representation.",points:["Have a voice","Listen to others","Respect decisions"]},
        {title:"Rule of law",text:"The rule of law means laws apply to everyone. Workplace policies, safety rules and professional standards help protect people and create accountability.",points:["Follow laws and rules","Understand consequences","Report unlawful behaviour"]},
        {title:"Individual liberty",text:"Individual liberty means people can make lawful choices while respecting the rights and safety of others.",points:["Make informed choices","Respect boundaries","Accept responsibility"]},
        {title:"Mutual respect",text:"Mutual respect means treating others with dignity even when views, roles or backgrounds differ.",points:["Listen respectfully","Avoid intimidation","Value contribution"]},
        {title:"Tolerance",text:"Tolerance means accepting that people may hold different faiths, beliefs or viewpoints, provided these remain within the law.",points:["Respect difference","Avoid prejudice","Challenge extremism"]},
        {title:"Workplace communication",text:"British Values can be demonstrated through fair discussion, listening, respectful disagreement and following agreed procedures.",points:["Discuss fairly","Disagree respectfully","Use formal routes"]},
        {title:"Safeguarding and Prevent",text:"Prevent aims to stop people being drawn into terrorism. Concerns should be reported through safeguarding procedures rather than investigated personally.",points:["Recognise concerns","Report promptly","Do not investigate yourself"]},
        {title:"Freedom and responsibility",text:"Freedom of expression does not excuse threatening, discriminatory or unlawful behaviour. Rights come with responsibilities.",points:["Stay within the law","Respect others","Take responsibility"]},
        {title:"Applying values daily",text:"British Values are shown through fair behaviour, professional conduct, following rules and respecting the rights of colleagues and customers.",points:["Act fairly","Follow procedures","Respect rights"]}],
      questions:[
        {q:"Which is a fundamental British Value?",options:["Democracy","Profit","Seniority","Competition"],answer:0},
        {q:"What does democracy involve?",options:["One person making every decision","Having a voice and respecting fair processes","Ignoring feedback","Avoiding consultation"],answer:1},
        {q:"What does the rule of law mean?",options:["Rules only apply to managers","Laws apply to everyone","Policies are optional","Safety rules can be ignored"],answer:1},
        {q:"What is individual liberty?",options:["Doing anything without consequence","Making lawful choices while respecting others","Ignoring workplace rules","Avoiding responsibility"],answer:1},
        {q:"What is mutual respect?",options:["Agreeing with everyone","Treating others with dignity","Avoiding communication","Following only personal views"],answer:1},
        {q:"What does tolerance involve?",options:["Accepting lawful differences in faith and belief","Ignoring discrimination","Allowing unlawful behaviour","Avoiding diverse teams"],answer:0},
        {q:"How should a safeguarding concern be handled?",options:["Investigate it personally","Report it through the correct procedure","Share it widely","Ignore it"],answer:1},
        {q:"Does freedom of expression allow threatening behaviour?",options:["Yes, always","No","Only at work","Only online"],answer:1},
        {q:"Which behaviour reflects British Values at work?",options:["Respectful discussion and fair processes","Intimidating others","Ignoring rules","Excluding colleagues"],answer:0},
        {q:"Why are workplace rules important?",options:["They create accountability and protection","They remove all choice","They apply only to apprentices","They replace the law"],answer:0}]
    },
    {
      id:"fire-safety",title:"Fire Safety Awareness",category:"Health & Safety",minutes:15,xp:500,passMark:90,status:"available",
      description:"Learn how fires start, how to prevent them, what fire signs and alarms mean, and how to respond safely during an emergency.",
      lessons:[
        {title:"How fire starts",text:"Fire needs heat, fuel and oxygen. This is known as the fire triangle. Removing any one of these elements can prevent or extinguish a fire.",points:["Heat","Fuel","Oxygen"]},
        {title:"Common workplace causes",text:"Common causes include faulty electrical equipment, hot work, smoking materials, poor housekeeping, flammable liquids and unattended heating equipment.",points:["Control ignition sources","Maintain equipment","Keep work areas tidy"]},
        {title:"Fire prevention",text:"Good prevention includes safe storage, removing waste, checking electrical equipment, following hot-work controls and keeping exits clear.",points:["Reduce fuel load","Store materials safely","Keep escape routes clear"]},
        {title:"Fire classes",text:"Different fuels create different fire classes. Extinguishers are selected according to the fuel involved, such as solids, flammable liquids, gases, metals or cooking oils.",points:["Identify the fuel","Use the correct extinguisher","Never guess"]},
        {title:"Fire extinguishers",text:"Extinguishers should only be used by trained people when it is safe to do so and there is a clear escape route. Personal safety always comes first.",points:["Raise the alarm first","Keep an exit behind you","Do not take risks"]},
        {title:"Alarms and signs",text:"Know the site alarm, fire action notices, assembly point, emergency exits and fire-door signs. Report damaged or obstructed signs immediately.",points:["Recognise the alarm","Follow fire signs","Know the assembly point"]},
        {title:"Evacuation",text:"When the alarm sounds, stop work, make the area safe only if this can be done immediately, leave by the nearest safe route and go to the assembly point.",points:["Do not delay","Do not use lifts","Report to the assembly point"]},
        {title:"Fire doors and exits",text:"Fire doors help contain smoke and flames. They must not be wedged open unless fitted with an approved automatic release device. Escape routes must remain unobstructed.",points:["Keep fire doors effective","Protect escape routes","Report defects"]},
        {title:"Hot work",text:"Hot work such as welding, grinding or torch-on roofing can create sparks and heat. Follow the permit system, remove combustibles and provide fire-watch arrangements.",points:["Use permits","Control sparks","Maintain a fire watch"]},
        {title:"After an incident",text:"Do not re-enter until authorised. Report what you saw, cooperate with investigations and ensure any used equipment or extinguishers are replaced.",points:["Wait for permission","Provide accurate information","Review controls"]}],
      questions:[
        {q:"What three elements make up the fire triangle?",options:["Heat, fuel and oxygen","Smoke, flame and water","Fuel, electricity and foam","Air, dust and sparks"],answer:0},
        {q:"What should you do first if you discover a fire?",options:["Look for an extinguisher","Raise the alarm","Open nearby doors","Finish the task"],answer:1},
        {q:"Why must escape routes be kept clear?",options:["For deliveries","For quick safe evacuation","To improve lighting","To store equipment"],answer:1},
        {q:"When may an extinguisher be used?",options:["By anyone immediately","Only when trained, safe and with a clear exit","Only after the fire service arrives","Whenever smoke is visible"],answer:1},
        {q:"What should happen when the fire alarm sounds?",options:["Wait at the workstation","Leave by the nearest safe route","Collect belongings","Use the lift"],answer:1},
        {q:"Why should fire doors not be wedged open?",options:["They may be damaged by airflow","They help contain fire and smoke","They are expensive","They block noise"],answer:1},
        {q:"Which activity may require a hot-work permit?",options:["Sweeping","Grinding","Measuring","Painting with water-based paint"],answer:1},
        {q:"What should happen at the assembly point?",options:["Leave site immediately","Report so attendance can be checked","Return for tools","Stand near the entrance"],answer:1},
        {q:"What is a key fire-prevention measure?",options:["Allowing waste to build up","Removing combustible waste","Disabling alarms","Blocking fire doors"],answer:1},
        {q:"When can you re-enter after an evacuation?",options:["When smoke clears","When authorised","After five minutes","When colleagues return"],answer:1}]
    },
    {
      id:"ppe-awareness",title:"PPE Awareness",category:"Health & Safety",minutes:15,xp:500,passMark:90,status:"available",
      description:"Learn how to select, inspect, wear, maintain and report problems with personal protective equipment and respiratory protective equipment.",
      lessons:[
        {title:"What PPE is",text:"PPE is equipment worn to reduce exposure to hazards. It includes helmets, eye protection, gloves, footwear, hearing protection, high-visibility clothing and fall-protection equipment.",points:["PPE reduces exposure","It must suit the hazard","It does not remove the hazard"]},
        {title:"PPE and the hierarchy",text:"PPE is usually the final layer of control. Hazards should first be eliminated or reduced through safer methods, substitution, guarding, extraction or engineering controls.",points:["Control the hazard first","Use PPE as additional protection","Follow the risk assessment"]},
        {title:"Correct selection",text:"PPE must be appropriate for the task, wearer and environment. Consider protection level, compatibility, size, comfort and relevant standards.",points:["Match PPE to the risk","Check compatibility","Use the correct size"]},
        {title:"Head and foot protection",text:"Safety helmets protect against falling or striking objects. Safety footwear may protect toes, soles and ankles. Inspect both before use and replace damaged equipment.",points:["Check helmet shell and harness","Check boots and soles","Replace damaged items"]},
        {title:"Eye and face protection",text:"Safety glasses, goggles and face shields provide different levels of protection. Select according to impact, dust, splash, radiation or chemical risk.",points:["Use the correct rating","Ensure a secure fit","Keep lenses clean"]},
        {title:"Hand protection",text:"Different gloves protect against different hazards. Cut-resistant gloves may not protect against chemicals, and some gloves can create entanglement risk near rotating machinery.",points:["Match glove to hazard","Check for damage","Avoid entanglement"]},
        {title:"Hearing protection",text:"Earplugs and earmuffs must provide suitable protection and be worn correctly. Overprotection can make communication and warning signals harder to hear.",points:["Use the required protection zone","Fit correctly","Maintain hygiene"]},
        {title:"RPE basics",text:"RPE protects against airborne contaminants. It must be suitable for the hazard, have the correct filter and be worn correctly. Tight-fitting masks require face-fit testing.",points:["Choose the correct filter","Complete face-fit testing","Check the seal"]},
        {title:"Inspection and maintenance",text:"Inspect PPE before use, clean it as instructed and store it to prevent damage or contamination. Do not modify PPE or use it beyond its service life.",points:["Pre-use inspection","Correct cleaning","Safe storage"]},
        {title:"Reporting problems",text:"Report missing, damaged, unsuitable or poorly fitting PPE immediately. Stop the task where protection is inadequate and obtain a suitable replacement.",points:["Do not improvise","Report defects","Replace unsuitable PPE"]}],
      questions:[
        {q:"What is the main purpose of PPE?",options:["To remove all workplace hazards","To reduce exposure to hazards","To replace training","To make work faster"],answer:1},
        {q:"Where does PPE normally sit in the hierarchy of control?",options:["As the first control in every case","As a final layer after higher-level controls","Above elimination","It is not part of the hierarchy"],answer:1},
        {q:"What should PPE selection be based on?",options:["Colour preference","The hazard, task and wearer","The cheapest option","What another worker uses"],answer:1},
        {q:"What should happen before using a safety helmet?",options:["Paint it","Inspect the shell and harness","Remove the harness","Drill ventilation holes"],answer:1},
        {q:"Which protection may be suitable for chemical splashes?",options:["Ordinary sunglasses","Appropriate goggles or face protection","A wool hat","Earplugs"],answer:1},
        {q:"Why can gloves be unsafe near rotating machinery?",options:["They become too warm","They may become entangled","They reduce noise","They attract dust"],answer:1},
        {q:"What is important when using hearing protection?",options:["Wear it loosely","Fit it correctly","Remove it near noisy tools","Share used earplugs"],answer:1},
        {q:"What is required for tight-fitting RPE?",options:["A loose fit","Face-fit testing and a good seal","A hard hat only","Two filters of any type"],answer:1},
        {q:"What should happen to damaged PPE?",options:["Continue using it carefully","Report and replace it","Repair it with tape without approval","Hide the damage"],answer:1},
        {q:"How should PPE be stored?",options:["Where it can become contaminated","According to instructions in a clean protected place","Outside in all weather","Mixed with waste"],answer:1}]
    },
    {
      id:"environmental-awareness",title:"Environmental Awareness",category:"Sustainability",minutes:15,xp:500,passMark:90,status:"available",
      description:"Learn how to reduce waste, use materials efficiently, prevent pollution and support more sustainable working practices.",
      lessons:[
        {title:"Environmental responsibilities",text:"Everyone has a responsibility to prevent environmental harm. Follow site procedures, environmental plans, waste rules and instructions for protecting land, water, air and wildlife.",points:["Follow site controls","Report incidents","Protect the local environment"]},
        {title:"The waste hierarchy",text:"The waste hierarchy prioritises prevention, reuse, recycling and recovery before disposal. The best waste is the waste that is never created.",points:["Prevent waste","Reuse materials","Recycle correctly"]},
        {title:"Material efficiency",text:"Accurate measuring, careful cutting, correct storage and good planning reduce waste. Order the right quantities and protect materials from weather, damage and contamination.",points:["Plan before cutting","Store materials correctly","Use offcuts where suitable"]},
        {title:"Waste sorting",text:"Separate waste into the correct containers. Mixing materials can prevent recycling and increase disposal costs. Never place hazardous waste in general waste.",points:["Use labelled skips","Avoid contamination","Separate hazardous waste"]},
        {title:"Preventing water pollution",text:"Cement washout, oils, fuels, chemicals and silt must not enter drains, watercourses or soil. Use designated washout areas, spill controls and protected storage.",points:["Protect drains","Use bunded storage","Control wash water"]},
        {title:"Air quality and dust",text:"Dust, fumes and emissions can affect people and the environment. Use extraction, wet methods, covers, maintenance and approved work methods to reduce release.",points:["Control dust at source","Cover loose materials","Maintain equipment"]},
        {title:"Noise and nuisance",text:"Noise, vibration, light and traffic can affect neighbours and wildlife. Work within permitted hours and follow controls for deliveries, machinery and temporary lighting.",points:["Reduce unnecessary noise","Respect working hours","Consider neighbours"]},
        {title:"Energy and water",text:"Switch off unused equipment, prevent leaks and use water efficiently. Small actions repeated across a project can significantly reduce environmental impact.",points:["Turn equipment off","Report leaks","Avoid unnecessary water use"]},
        {title:"Spill response",text:"Raise the alarm, stop the source if safe, protect drains and use the correct spill kit. Report all spills and dispose of contaminated materials as instructed.",points:["Act quickly","Protect drainage","Report and record"]},
        {title:"Sustainable behaviour",text:"Good environmental performance depends on everyday behaviour. Challenge poor practice respectfully, suggest improvements and choose lower-impact methods where possible.",points:["Follow procedures","Suggest improvements","Take personal responsibility"]}],
      questions:[
        {q:"What is the first priority in the waste hierarchy?",options:["Disposal","Prevention","Landfill","Incineration"],answer:1},
        {q:"Which action improves material efficiency?",options:["Cutting without measuring","Accurate planning and cutting","Leaving materials uncovered","Ordering excessive quantities"],answer:1},
        {q:"Why should waste be sorted?",options:["To make skips look tidy","To support recycling and prevent contamination","To increase disposal costs","To avoid labels"],answer:1},
        {q:"Where should cement washout water go?",options:["Into a surface drain","Into a designated controlled washout area","Onto bare soil","Into a watercourse"],answer:1},
        {q:"What can reduce dust emissions?",options:["Dry sweeping only","Extraction or wet methods","Removing covers","Increasing vehicle speed"],answer:1},
        {q:"What should happen to an oil spill?",options:["Wash it into a drain","Follow spill procedures and protect drains","Cover it with general waste","Ignore small spills"],answer:1},
        {q:"How can energy use be reduced?",options:["Leave equipment idling","Switch off unused equipment","Use more temporary lighting","Ignore leaks"],answer:1},
        {q:"What should happen to hazardous waste?",options:["Mix it with general waste","Place it in the correct designated container","Burn it on site","Bury it"],answer:1},
        {q:"Which can cause environmental nuisance?",options:["Noise and unnecessary lighting","Accurate cutting","Waste sorting","Switching equipment off"],answer:0},
        {q:"What is good environmental behaviour?",options:["Ignoring poor practice","Following controls and suggesting improvements","Using drains for disposal","Mixing waste streams"],answer:1}]
    },
    {
      id:"mental-health-awareness",title:"Mental Health Awareness",category:"Wellbeing",minutes:20,xp:500,passMark:90,status:"available",
      description:"Build awareness of stress, anxiety, depression, supportive conversations and practical ways to protect wellbeing at work.",
      lessons:[
        {title:"Mental health and wellbeing",text:"Everyone has mental health. It can change over time and can be affected by work, relationships, finances, health and life events.",points:["Mental health affects everyone","It can change","Support is available"]},
        {title:"Stress",text:"Short-term pressure can sometimes help performance, but prolonged or excessive stress can affect sleep, concentration, mood and physical health.",points:["Notice warning signs","Address causes early","Use healthy coping strategies"]},
        {title:"Anxiety",text:"Anxiety can involve persistent worry, fear, restlessness or physical symptoms. Support and professional advice can help when anxiety affects daily life.",points:["Recognise symptoms","Avoid judgement","Encourage support"]},
        {title:"Depression awareness",text:"Depression may involve persistent low mood, loss of interest, tiredness, hopelessness or changes in sleep and appetite.",points:["Take signs seriously","Listen without judgement","Encourage professional help"]},
        {title:"Construction pressures",text:"Long hours, travel, insecurity, physical demands and workplace culture can affect mental wellbeing. Early conversations and practical support matter.",points:["Recognise industry pressures","Promote open discussion","Use support routes"]},
        {title:"Supporting a colleague",text:"Choose a private moment, explain what you have noticed, listen carefully and avoid trying to diagnose or solve everything.",points:["Ask openly","Listen","Signpost support"]},
        {title:"Looking after yourself",text:"Sleep, exercise, routine, breaks, connection and limiting harmful coping behaviours can support wellbeing.",points:["Maintain routines","Take breaks","Stay connected"]},
        {title:"Boundaries and confidentiality",text:"Respect privacy, but do not promise complete secrecy where there is a risk of serious harm. Follow safeguarding or emergency procedures.",points:["Respect privacy","Know your limits","Escalate serious risk"]},
        {title:"Urgent help",text:"If someone may be in immediate danger, contact emergency services or the relevant crisis support route. Stay with them where safe.",points:["Treat risk seriously","Get urgent help","Do not leave them unsupported"]},
        {title:"Creating a healthy culture",text:"Healthy workplaces encourage respectful communication, realistic workloads, early support and zero tolerance of bullying.",points:["Promote respect","Support early action","Challenge stigma"]}],
      questions:[
        {q:"Who has mental health?",options:["Only people with a diagnosis","Everyone","Only adults","Only workers under pressure"],answer:1},
        {q:"What can prolonged stress affect?",options:["Only physical strength","Sleep, mood and concentration","Only pay","Only attendance"],answer:1},
        {q:"Which may be a sign of anxiety?",options:["Persistent worry","Improved concentration only","Higher wages","New equipment"],answer:0},
        {q:"Which may be linked to depression?",options:["Persistent low mood and loss of interest","Temporary boredom only","Improved sleep","Increased confidence"],answer:0},
        {q:"How should you support a colleague?",options:["Diagnose them","Listen and signpost support","Share their information","Tell them to ignore it"],answer:1},
        {q:"Which can support wellbeing?",options:["Regular sleep and breaks","Avoiding all contact","Working constantly","Using harmful coping behaviours"],answer:0},
        {q:"When should confidentiality be broken?",options:["For gossip","Where there is serious risk of harm","Whenever a manager asks casually","Never"],answer:1},
        {q:"What should happen in an immediate crisis?",options:["Wait until next week","Seek urgent help","Post online","Leave the person alone"],answer:1},
        {q:"What can improve workplace mental-health culture?",options:["Bullying","Respectful communication and early support","Ignoring concerns","Unrealistic workloads"],answer:1},
        {q:"What should you avoid when supporting someone?",options:["Listening","Trying to diagnose them","Encouraging help","Choosing a private moment"],answer:1}]
    }
  ];

  const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));

  const ACADEMY_LEVELS=[
    {level:1,title:"New Starter",min:0},
    {level:2,title:"Getting Started",min:250},
    {level:3,title:"Active Learner",min:500},
    {level:4,title:"Developing Apprentice",min:850},
    {level:5,title:"Knowledge Builder",min:1250},
    {level:6,title:"Committed Learner",min:1750},
    {level:7,title:"Skills Explorer",min:2300},
    {level:8,title:"Confident Apprentice",min:2900},
    {level:9,title:"Progress Maker",min:3600},
    {level:10,title:"Academy Achiever",min:4400},
    {level:11,title:"Advanced Learner",min:5300},
    {level:12,title:"Workplace Professional",min:6300},
    {level:13,title:"Knowledge Specialist",min:7400},
    {level:14,title:"High Performer",min:8600},
    {level:15,title:"Course Champion",min:9900},
    {level:16,title:"Advanced Apprentice",min:11300},
    {level:17,title:"EPA Contender",min:12800},
    {level:18,title:"EPA Ready",min:14400},
    {level:19,title:"Academy Expert",min:16100},
    {level:20,title:"Apprenticeship+ Master",min:18000}
  ];

  function loadProgress(){
    try{
      const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");
      return value&&typeof value==="object"?value:{};
    }catch(error){
      return {};
    }
  }

  function saveProgress(progress){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  }

  function courseProgress(courseId){
    return loadProgress()[courseId]||{
      lessonIndex:0,
      lessonsViewed:[],
      attempts:0,
      bestScore:0,
      passed:false,
      completedAt:null,
      xpAwarded:false
    };
  }

  function updateCourseProgress(courseId,updates){
    const all=loadProgress();
    all[courseId]={...courseProgress(courseId),...updates};
    saveProgress(all);
    return all[courseId];
  }


  function loadProfile(){
    try{
      const profile=JSON.parse(localStorage.getItem(PROFILE_KEY)||"{}");
      return profile&&typeof profile==="object"?profile:{};
    }catch(error){
      return {};
    }
  }

  function saveProfile(profile){
    localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));
  }

  function loadCertificates(){
    try{
      const records=JSON.parse(localStorage.getItem(CERTIFICATE_KEY)||"{}");
      return records&&typeof records==="object"?records:{};
    }catch(error){
      return {};
    }
  }

  function saveCertificates(records){
    localStorage.setItem(CERTIFICATE_KEY,JSON.stringify(records));
  }

  function formatDate(value){
    const date=value?new Date(value):new Date();
    if(Number.isNaN(date.getTime()))return"";
    return date.toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
  }

  function certificateId(course,progress){
    const records=loadCertificates();
    if(records[course.id]?.certificateId)return records[course.id].certificateId;
    const date=new Date(progress.completedAt||Date.now());
    const stamp=[
      date.getFullYear(),
      String(date.getMonth()+1).padStart(2,"0"),
      String(date.getDate()).padStart(2,"0")
    ].join("");
    const random=Math.random().toString(36).slice(2,7).toUpperCase();
    return `AP-${course.id.replace(/[^a-z0-9]/gi,"").slice(0,6).toUpperCase()}-${stamp}-${random}`;
  }

  function ensureCertificateRecord(course){
    const progress=courseProgress(course.id);
    if(!progress.passed)return null;
    const records=loadCertificates();
    const existing=records[course.id]||{};
    const record={
      courseId:course.id,
      courseTitle:course.title,
      score:progress.bestScore,
      completedAt:progress.completedAt||new Date().toISOString(),
      certificateId:existing.certificateId||certificateId(course,progress),
      generatedAt:existing.generatedAt||null
    };
    records[course.id]=record;
    saveCertificates(records);
    return record;
  }

  function certificateName(){
    return String(loadProfile().name||"").trim();
  }

  function certificateMarkup(course){
    const record=ensureCertificateRecord(course);
    const profile=loadProfile();
    const name=String(profile.name||"").trim();
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-academy-screen="certificates">‹ Certificate library</button>
      <section class="apa-panel apa-certificate-setup">
        <small>IN-HOUSE CERTIFICATE</small>
        <h1>${esc(course.title)}</h1>
        <p>Enter the learner name exactly as it should appear. The certificate can then be opened and saved as a PDF using the phone or browser print menu.</p>
        <label class="apa-field">
          <span>Learner name</span>
          <input type="text" maxlength="80" autocomplete="name" value="${esc(name)}" data-certificate-name placeholder="Enter learner's full name">
        </label>
        <div class="apa-certificate-facts">
          <div><strong>${record.score}%</strong><span>Best score</span></div>
          <div><strong>${formatDate(record.completedAt)}</strong><span>Completed</span></div>
          <div><strong>${course.xp}</strong><span>XP earned</span></div>
        </div>
        <div class="apa-course-actions">
          <button class="apa-primary-action" type="button" data-open-certificate="${course.id}">Open certificate</button>
          <button class="apa-secondary-action" type="button" data-course-id="${course.id}">Return to course</button>
        </div>
        <p class="apa-smallprint">This is an Apprenticeship+ in-house training certificate. It is not an accredited qualification, regulated award or awarding-organisation certificate.</p>
      </section>
    </div>`;
  }

  function printableCertificate(course,name){
    const record=ensureCertificateRecord(course);
    const safeName=esc(name);
    const safeTitle=esc(course.title);
    const completed=formatDate(record.completedAt);
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${safeTitle} Certificate</title>
<style>
@page{size:A4 landscape;margin:0}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;font-family:Arial,Helvetica,sans-serif;background:#e9f1ef;color:#14383a}
body{padding:18px}
.certificate{width:calc(297mm - 20mm);min-height:calc(210mm - 20mm);margin:auto;background:#fff;border:10px solid #075e59;padding:12px;box-shadow:0 14px 50px rgba(0,0,0,.16)}
.inner{min-height:calc(190mm - 24px);border:2px solid #e1b94c;padding:28px 42px;text-align:center;position:relative;overflow:hidden}
.inner:before,.inner:after{content:"";position:absolute;width:260px;height:260px;border-radius:50%;background:#e8f5f1;z-index:0}
.inner:before{left:-150px;top:-150px}.inner:after{right:-150px;bottom:-150px}
.content{position:relative;z-index:1}
.brand{display:inline-flex;gap:10px;align-items:center;font-weight:900;letter-spacing:.12em;color:#075e59}
.brand b{background:#ffe38a;color:#533f08;border-radius:999px;padding:7px 12px}
.kicker{margin-top:32px;font-size:15px;letter-spacing:.22em;font-weight:800;color:#668080}
h1{font-size:42px;margin:12px 0 8px;color:#075e59}
.presented{font-size:18px;color:#718486;margin-top:22px}
.name{font-family:Georgia,serif;font-size:42px;font-style:italic;color:#142f31;margin:12px auto 18px;padding-bottom:12px;border-bottom:2px solid #d8e4e1;max-width:760px}
.statement{font-size:18px;line-height:1.55;max-width:820px;margin:0 auto}
.course{font-size:31px;font-weight:900;color:#08745f;margin:12px 0}
.details{display:flex;justify-content:center;gap:46px;margin-top:30px;flex-wrap:wrap}
.details div{min-width:150px}.details strong,.details span{display:block}.details strong{font-size:18px}.details span{font-size:12px;letter-spacing:.09em;color:#728586;margin-top:5px}
.disclaimer{font-size:10px;color:#7d8989;max-width:760px;margin:30px auto 0;line-height:1.45}
.actions{max-width:1000px;margin:12px auto;display:flex;justify-content:center;gap:10px}
.actions button{border:0;border-radius:12px;padding:12px 18px;font-weight:800}.print{background:#075e59;color:#fff}.close{background:#fff;color:#31595a}
@media print{body{padding:0;background:#fff}.certificate{width:297mm;height:210mm;box-shadow:none}.actions{display:none}}
@media(max-width:800px){body{padding:7px}.certificate{width:100%;min-height:auto;border-width:6px}.inner{min-height:0;padding:24px 15px}.kicker{margin-top:18px}h1{font-size:30px}.name{font-size:31px}.course{font-size:24px}.details{gap:18px}.statement{font-size:16px}}
</style>
</head>
<body>
<div class="actions"><button class="print" onclick="window.print()">Save / Print PDF</button><button class="close" onclick="window.close()">Close</button></div>
<section class="certificate">
  <div class="inner">
    <div class="content">
      <div class="brand"><span>APPRENTICESHIP+</span><b>ACADEMY</b></div>
      <div class="kicker">CERTIFICATE OF COMPLETION</div>
      <h1>In-house Training Certificate</h1>
      <div class="presented">This certificate is presented to</div>
      <div class="name">${safeName}</div>
      <div class="statement">for successfully completing the Apprenticeship+ Academy learning module</div>
      <div class="course">${safeTitle}</div>
      <div class="details">
        <div><strong>${record.score}%</strong><span>ASSESSMENT SCORE</span></div>
        <div><strong>${completed}</strong><span>COMPLETION DATE</span></div>
        <div><strong>${record.certificateId}</strong><span>CERTIFICATE ID</span></div>
      </div>
      <div class="disclaimer">This certificate confirms completion of an Apprenticeship+ in-house learning module. It is not an accredited qualification, regulated award, licence to practise, or certificate issued by an awarding organisation.</div>
    </div>
  </div>
</section>
</body>
</html>`;
  }

  function openPrintableCertificate(course,name){
    const cleanName=String(name||"").trim();
    if(!cleanName)return false;
    saveProfile({...loadProfile(),name:cleanName});
    const record=ensureCertificateRecord(course);
    const records=loadCertificates();
    records[course.id]={...record,generatedAt:new Date().toISOString()};
    saveCertificates(records);
    const popup=window.open("","_blank");
    if(!popup)return false;
    popup.document.open();
    popup.document.write(printableCertificate(course,cleanName));
    popup.document.close();
    return true;
  }

  function readDashboard(){
    const keys=["apprenticeshipPlusDashboard","apDashboardData","apprenticePlusDashboard","modernDashboardData"];
    for(const key of keys){
      try{
        const value=JSON.parse(localStorage.getItem(key)||"null");
        if(value&&typeof value==="object")return value;
      }catch(error){}
    }
    return {};
  }

  function academyXP(){
    return COURSES.reduce((total,course)=>{
      const progress=courseProgress(course.id);
      return total+(progress.passed?Number(course.xp||0):0);
    },0);
  }

  function achievementStatistics(){
    const progresses=COURSES.map(course=>({course,progress:courseProgress(course.id)}));
    const started=progresses.filter(item=>item.progress.lessonsViewed.length>0||item.progress.attempts>0).length;
    const completed=progresses.filter(item=>item.progress.passed).length;
    const certificates=completed;
    const attempts=progresses.reduce((sum,item)=>sum+Number(item.progress.attempts||0),0);
    const questionsAnswered=progresses.reduce((sum,item)=>sum+(Number(item.progress.attempts||0)*Number(item.course.questions?.length||0)),0);
    const scores=progresses.filter(item=>item.progress.bestScore>0).map(item=>Number(item.progress.bestScore));
    const averageScore=scores.length?Math.round(scores.reduce((sum,score)=>sum+score,0)/scores.length):0;
    const highestScore=scores.length?Math.max(...scores):0;
    const pagesViewed=progresses.reduce((sum,item)=>sum+new Set(item.progress.lessonsViewed||[]).size,0);
    const learningMinutes=Math.round(progresses.reduce((sum,item)=>{
      const totalPages=Math.max(1,item.course.lessons?.length||1);
      const viewed=Math.min(totalPages,new Set(item.progress.lessonsViewed||[]).size);
      return sum+(Number(item.course.minutes||0)*(viewed/totalPages));
    },0));
    const completion=Math.round((completed/Math.max(1,COURSES.length))*100);
    return {
      started,completed,certificates,attempts,questionsAnswered,
      averageScore,highestScore,pagesViewed,learningMinutes,completion
    };
  }

  function levelForXP(xp){
    const current=[...ACADEMY_LEVELS].reverse().find(item=>xp>=item.min)||ACADEMY_LEVELS[0];
    const next=ACADEMY_LEVELS.find(item=>item.level===current.level+1)||null;
    const progress=next
      ?Math.max(0,Math.min(100,Math.round(((xp-current.min)/(next.min-current.min))*100)))
      :100;
    return {...current,next,progress};
  }

  function saveAchievementSnapshot(snapshot){
    try{
      localStorage.setItem(ACHIEVEMENT_KEY,JSON.stringify(snapshot));
    }catch(error){}
  }

  function achievementSnapshot(){
    const stats=achievementStatistics();
    const academyXp=academyXP();
    const level=levelForXP(academyXp);
    const snapshot={
      updatedAt:new Date().toISOString(),
      academyXp,
      level:level.level,
      levelTitle:level.title,
      nextLevelXp:level.next?.min||level.min,
      levelProgress:level.progress,
      statistics:stats
    };
    saveAchievementSnapshot(snapshot);
    return snapshot;
  }

  function metrics(){
    const data=readDashboard();
    const completed=Number(data.completed||data.completedAssignments||0);
    const photos=Number(data.photos||data.photoCount||0);
    const streak=Number(data.streak||0);
    const academy=academyXP();
    const appXp=completed*120+Math.min(photos,100)*8+Math.min(streak,30)*25;
    const xp=appXp+academy;
    const levelData=levelForXP(xp);
    achievementSnapshot();
    return {
      completed,photos,streak,xp,academyXP:academy,
      level:levelData.level,title:levelData.title,progress:levelData.progress,
      nextLevel:levelData.next
    };
  }

  function trade(){
    const path=location.pathname.toLowerCase();
    if(path.includes("/brick/"))return"Bricklaying";
    if(path.includes("/bench/"))return"Bench Joinery";
    if(path.includes("/pmo/"))return"Property Maintenance";
    return"Site Carpentry";
  }

  function statusText(course){
    if(course.status!=="available")return"Coming soon";
    const progress=courseProgress(course.id);
    if(progress.passed)return`Passed · ${progress.bestScore}%`;
    if(progress.lessonsViewed.length){
      const percent=Math.round((progress.lessonsViewed.length/course.lessons.length)*100);
      return`In progress · ${percent}%`;
    }
    return"Start learning";
  }

  let libraryFilter="All";
  let librarySearch="";

  function filteredCourses(){
    const search=librarySearch.trim().toLowerCase();
    return COURSES.filter(course=>{
      const matchesFilter=libraryFilter==="All"||course.category===libraryFilter;
      const haystack=`${course.title} ${course.category} ${course.description||""}`.toLowerCase();
      return matchesFilter&&(!search||haystack.includes(search));
    });
  }

  function courseCard(course){
    const initials=course.title.split(" ").map(word=>word[0]).join("").slice(0,2);
    const progress=courseProgress(course.id);
    const available=course.status==="available";
    const cls=progress.passed?"completed":available?"available":"locked";
    return `<button class="apa-course-card ${cls}" type="button" data-course-id="${course.id}" ${available?"":"disabled"}>
      <div class="apa-course-icon">${progress.passed?"✓":initials}</div>
      <div class="apa-course-copy">
        <small>${esc(course.category)}</small>
        <h3>${esc(course.title)}</h3>
        <div class="apa-course-meta">
          <span>${course.minutes} minutes</span>
          <span>${course.passMark||90}% pass</span>
          <span>+${course.xp} XP</span>
        </div>
      </div>
      <div class="apa-course-status"><span>${statusText(course)}</span><b>›</b></div>
    </button>`;
  }

  function mainMarkup(){
    const m=metrics();
    const passed=COURSES.filter(course=>courseProgress(course.id).passed).length;
    return `<div class="apa-page">
      <section class="apa-hero">
        <div class="apa-hero-copy">
          <div class="apa-kicker"><span>APPRENTICESHIP+</span><b>ACADEMY</b></div>
          <h1>Build skills beyond the trade</h1>
          <p>Complete short in-house learning modules, earn XP and collect certificates throughout your apprenticeship.</p>
          <div class="apa-hero-actions">
            <button type="button" data-academy-scroll="courses">Explore courses</button>
            <button type="button" data-academy-screen="certificates">View certificates</button>
          </div>
        </div>
        <div class="apa-level-card">
          <div class="apa-level-ring"><span>${m.level}</span></div>
          <div>
            <small>YOUR CURRENT LEVEL</small>
            <strong>${esc(m.title)}</strong>
            <b>${m.xp.toLocaleString()} XP</b>
            <div class="apa-level-track"><i style="width:${m.progress}%"></i></div>
            <em>${m.progress}% to the next level</em>
          </div>
        </div>
      </section>

      <section class="apa-feature-grid">
        <button class="apa-feature" type="button" data-academy-screen="achievements">
          <div class="apa-feature-icon">XP</div>
          <div><small>ACHIEVEMENT CENTRE</small><h2>Badges, levels and milestones</h2><p>Review your progress and prepare your achievement certificate.</p></div><span>›</span>
        </button>
        <button class="apa-feature" type="button" data-academy-screen="certificates">
          <div class="apa-feature-icon">PDF</div>
          <div><small>DOCUMENT LIBRARY</small><h2>In-house certificates</h2><p>Your earned Academy certificates will appear here automatically.</p></div><span>›</span>
        </button>
      </section>

      <section class="apa-snapshot">
        <div><strong>${m.completed}</strong><span>Assignments completed</span></div>
        <div><strong>${m.academyXP}</strong><span>Academy XP earned</span></div>
        <div><strong>${passed}</strong><span>Courses passed</span></div>
        <div><strong>${passed}</strong><span>Certificates earned</span></div>
      </section>

      <section class="apa-panel" id="apa-course-library">
        <div class="apa-heading">
          <div><small>SHORT COURSES</small><h2>Academy course library</h2><p>All eight Academy courses are now available across every apprenticeship trade.</p></div>
          <span>${COURSES.filter(c=>c.status==="available").length} available</span>
        </div>
        <div class="apa-library-tools">
          <input type="search" placeholder="Search Academy courses" value="${esc(librarySearch)}" data-academy-search>
          <div class="apa-filter-row">
            ${["All","Health & Safety","Personal Development","Sustainability","Wellbeing"].map(category=>`<button type="button" class="${libraryFilter===category?"active":""}" data-academy-filter="${esc(category)}">${esc(category)}</button>`).join("")}
          </div>
        </div>
        <div class="apa-course-list">${filteredCourses().map(courseCard).join("")||`<div class="apa-no-results"><h3>No matching courses</h3><p>Try another search or category.</p></div>`}</div>
      </section>

      <section class="apa-panel apa-coming">
        <div><small>LEARN, PASS AND EARN</small><h2>Development alongside ${esc(trade())}</h2><p>Complete every learning page, then achieve at least 90% in the assessment to unlock the course result and future certificate.</p></div>
        <div class="apa-disclaimer"><strong>In-house training only</strong><p>Academy certificates are not accredited qualifications, regulated awards or certificates issued by an awarding organisation.</p></div>
      </section>
    </div>`;
  }

  function courseIntro(course){
    const progress=courseProgress(course.id);
    const lessonPercent=Math.round((progress.lessonsViewed.length/course.lessons.length)*100);
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-academy-screen="main">‹ Back to Academy</button>
      <section class="apa-course-hero">
        <div class="apa-course-hero-icon">${progress.passed?"✓":"MH"}</div>
        <div>
          <small>${esc(course.category)}</small>
          <h1>${esc(course.title)}</h1>
          <p>${esc(course.description)}</p>
          <div class="apa-course-meta large">
            <span>${course.minutes} minutes</span><span>${course.passMark}% pass mark</span><span>+${course.xp} XP</span>
          </div>
        </div>
      </section>
      <section class="apa-panel">
        <div class="apa-heading">
          <div><small>YOUR PROGRESS</small><h2>${progress.passed?"Course completed":progress.lessonsViewed.length?"Continue your learning":"Ready to begin"}</h2></div>
          <span>${progress.passed?`${progress.bestScore}% passed`:`${lessonPercent}% viewed`}</span>
        </div>
        <div class="apa-learning-track"><i style="width:${progress.passed?100:lessonPercent}%"></i></div>
        <div class="apa-course-actions">
          <button class="apa-primary-action" type="button" data-start-course="${course.id}">
            ${progress.passed?"Review course":progress.lessonsViewed.length?"Continue course":"Start course"}
          </button>
          ${progress.passed?`<button class="apa-secondary-action" type="button" data-start-assessment="${course.id}">Retake assessment</button>`:""}
        </div>
      </section>
      <section class="apa-panel">
        <small>COURSE CONTENT</small>
        <div class="apa-lesson-list">
          ${course.lessons.map((lesson,index)=>`<div class="${progress.lessonsViewed.includes(index)?"done":""}"><span>${progress.lessonsViewed.includes(index)?"✓":index+1}</span><div><strong>${esc(lesson.title)}</strong><small>Learning page ${index+1}</small></div></div>`).join("")}
          <div class="${progress.passed?"done":""}"><span>${progress.passed?"✓":"Q"}</span><div><strong>Final assessment</strong><small>${course.questions.length} multiple-choice questions</small></div></div>
        </div>
      </section>
    </div>`;
  }

  function lessonMarkup(course,index){
    const lesson=course.lessons[index];
    const progress=courseProgress(course.id);
    const viewed=new Set(progress.lessonsViewed);
    viewed.add(index);
    updateCourseProgress(course.id,{lessonIndex:index,lessonsViewed:[...viewed].sort((a,b)=>a-b)});
    const percent=Math.round(((index+1)/course.lessons.length)*100);
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-course-id="${course.id}">‹ Course overview</button>
      <section class="apa-learning-shell">
        <div class="apa-learning-header">
          <div><small>${esc(course.title)}</small><strong>Page ${index+1} of ${course.lessons.length}</strong></div>
          <span>${percent}%</span>
        </div>
        <div class="apa-learning-track"><i style="width:${percent}%"></i></div>
        <article class="apa-lesson-card">
          <div class="apa-lesson-number">${index+1}</div>
          <small>LEARNING PAGE</small>
          <h1>${esc(lesson.title)}</h1>
          <p>${esc(lesson.text)}</p>
          <ul>${lesson.points.map(point=>`<li>${esc(point)}</li>`).join("")}</ul>
        </article>
        <div class="apa-learning-actions">
          <button type="button" class="apa-secondary-action" ${index===0?"disabled":""} data-lesson="${course.id}:${index-1}">Previous</button>
          ${index===course.lessons.length-1
            ?`<button type="button" class="apa-primary-action" data-start-assessment="${course.id}">Start assessment</button>`
            :`<button type="button" class="apa-primary-action" data-lesson="${course.id}:${index+1}">Next page</button>`}
        </div>
      </section>
    </div>`;
  }

  function assessmentIntro(course){
    const progress=courseProgress(course.id);
    const lessonsComplete=progress.lessonsViewed.length>=course.lessons.length;
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-course-id="${course.id}">‹ Course overview</button>
      <section class="apa-panel apa-assessment-intro">
        <div class="apa-feature-icon">Q</div>
        <small>FINAL ASSESSMENT</small>
        <h1>${esc(course.title)}</h1>
        <p>Answer all ${course.questions.length} questions. You need ${course.passMark}% or higher to pass. You can retake the assessment if required.</p>
        <div class="apa-stat-grid">
          <div><strong>${course.questions.length}</strong><span>Questions</span></div>
          <div><strong>${course.passMark}%</strong><span>Pass mark</span></div>
          <div><strong>${course.xp}</strong><span>XP reward</span></div>
          <div><strong>${progress.bestScore}%</strong><span>Best score</span></div>
        </div>
        ${lessonsComplete
          ?`<button class="apa-primary-action full" type="button" data-begin-quiz="${course.id}">Begin assessment</button>`
          :`<p class="apa-warning">Complete all learning pages before starting the assessment.</p>`}
      </section>
    </div>`;
  }

  function quizMarkup(course,index,answers){
    const question=course.questions[index];
    const selected=answers[index];
    return `<div class="apa-page">
      <section class="apa-learning-shell">
        <div class="apa-learning-header">
          <div><small>${esc(course.title)} assessment</small><strong>Question ${index+1} of ${course.questions.length}</strong></div>
          <span>${Math.round(((index+1)/course.questions.length)*100)}%</span>
        </div>
        <div class="apa-learning-track"><i style="width:${Math.round(((index+1)/course.questions.length)*100)}%"></i></div>
        <article class="apa-question-card">
          <h1>${esc(question.q)}</h1>
          <div class="apa-options">
            ${question.options.map((option,optionIndex)=>`<button type="button" class="${selected===optionIndex?"selected":""}" data-answer="${optionIndex}"><span>${String.fromCharCode(65+optionIndex)}</span>${esc(option)}</button>`).join("")}
          </div>
        </article>
        <div class="apa-learning-actions">
          <button type="button" class="apa-secondary-action" ${index===0?"disabled":""} data-quiz-nav="${index-1}">Previous</button>
          <button type="button" class="apa-primary-action" ${selected===undefined?"disabled":""} data-quiz-nav="${index===course.questions.length-1?"submit":index+1}">
            ${index===course.questions.length-1?"Submit assessment":"Next question"}
          </button>
        </div>
      </section>
    </div>`;
  }

  function resultMarkup(course,score,passed){
    const progress=courseProgress(course.id);
    return `<div class="apa-page">
      <section class="apa-result-card ${passed?"passed":"retry"}">
        <div class="apa-result-badge">${passed?"✓":"!"}</div>
        <small>${passed?"COURSE PASSED":"NOT PASSED YET"}</small>
        <h1>${passed?"Congratulations!":"Keep going"}</h1>
        <p>You scored <strong>${score}%</strong> in ${esc(course.title)}.</p>
        <div class="apa-score-ring"><span>${score}%</span></div>
        ${passed
          ?`<div class="apa-unlocked"><strong>+${course.xp} XP earned</strong><span>Your in-house certificate is ready.</span></div>`
          :`<div class="apa-warning">You need ${course.passMark}% to pass. Review the learning pages and try again.</div>`}
        <div class="apa-course-actions">
          ${passed?`<button class="apa-primary-action" type="button" data-certificate-course="${course.id}">Create certificate</button>`:`<button class="apa-primary-action" type="button" data-course-id="${course.id}">Return to course</button>`}
          <button class="apa-secondary-action" type="button" data-start-assessment="${course.id}">${passed?"Retake assessment":"Try again"}</button>
        </div>
        <p class="apa-smallprint">This records completion of an Apprenticeship+ in-house learning module. It is not an accredited qualification or awarding-body certificate.</p>
      </section>
    </div>`;
  }

  function achievementMarkup(){
    const m=metrics();
    const snapshot=achievementSnapshot();
    const s=snapshot.statistics;
    const nextText=m.nextLevel
      ?`${Math.max(0,m.nextLevel.min-m.xp).toLocaleString()} XP needed for Level ${m.nextLevel.level}`
      :"Maximum Academy level reached";
    return `<div class="apa-page apa-achievement-page">
      <button class="apa-back" type="button" data-academy-screen="main">‹ Back to Academy</button>

      <section class="apa-achievement-hero">
        <div class="apa-achievement-level">
          <div class="apa-big-level"><span>${m.level}</span><small>OF 20</small></div>
          <div>
            <small>APPRENTICESHIP+ LEVEL</small>
            <h1>${esc(m.title)}</h1>
            <p>${m.xp.toLocaleString()} total XP</p>
          </div>
        </div>
        <div class="apa-achievement-progress">
          <div><strong>${m.progress}%</strong><span>${esc(nextText)}</span></div>
          <div class="apa-level-track"><i style="width:${m.progress}%"></i></div>
        </div>
      </section>

      <section class="apa-achievement-summary">
        <article><small>ACADEMY COMPLETION</small><strong>${s.completion}%</strong><span>${s.completed} of ${COURSES.length} courses passed</span></article>
        <article><small>ACADEMY XP</small><strong>${snapshot.academyXp.toLocaleString()}</strong><span>Earned from passed courses</span></article>
        <article><small>CERTIFICATES</small><strong>${s.certificates}</strong><span>In-house certificates earned</span></article>
      </section>

      <section class="apa-panel">
        <div class="apa-heading">
          <div><small>LEARNING STATISTICS</small><h2>Your Academy activity</h2><p>These figures are calculated from progress stored on this device.</p></div>
          <span>${s.started} started</span>
        </div>
        <div class="apa-achievement-stats">
          <article><strong>${s.started}</strong><span>Courses started</span></article>
          <article><strong>${s.completed}</strong><span>Courses completed</span></article>
          <article><strong>${s.averageScore}%</strong><span>Average best score</span></article>
          <article><strong>${s.highestScore}%</strong><span>Highest score</span></article>
          <article><strong>${s.attempts}</strong><span>Assessment attempts</span></article>
          <article><strong>${s.questionsAnswered}</strong><span>Questions answered</span></article>
          <article><strong>${s.pagesViewed}</strong><span>Learning pages viewed</span></article>
          <article><strong>${s.learningMinutes}</strong><span>Estimated learning minutes</span></article>
        </div>
      </section>

      <section class="apa-panel">
        <div class="apa-heading">
          <div><small>LEVEL JOURNEY</small><h2>20 apprentice levels</h2><p>Complete Academy courses and build evidence across Apprentice+ to progress.</p></div>
          <span>Level ${m.level}</span>
        </div>
        <div class="apa-level-journey">
          ${ACADEMY_LEVELS.map(level=>{
            const state=level.level<m.level?"complete":level.level===m.level?"current":"locked";
            return `<article class="${state}">
              <span>${level.level<m.level?"✓":level.level}</span>
              <div><strong>${esc(level.title)}</strong><small>${level.min.toLocaleString()} XP</small></div>
            </article>`;
          }).join("")}
        </div>
      </section>

      <section class="apa-panel apa-foundation-note">
        <small>PHASE 8.1 FOUNDATION</small>
        <h2>Achievement data is now active</h2>
        <p>Your level, Academy completion and learning statistics are saved locally. Automatic badges and badge progress will be added in Phase 8.2.</p>
      </section>
    </div>`;
  }

  function certificatesMarkup(){
    const passed=COURSES.filter(course=>courseProgress(course.id).passed);
    return `<div class="apa-page">
      <button class="apa-back" type="button" data-academy-screen="main">‹ Back to Academy</button>
      <section class="apa-panel">
        <div class="apa-heading">
          <div><small>DOCUMENT LIBRARY</small><h1>Your in-house certificates</h1><p>Open a certificate, enter the learner name and use Save / Print PDF.</p></div>
          <span>${passed.length} unlocked</span>
        </div>
        ${passed.length
          ?`<div class="apa-certificate-list">${passed.map(course=>{
              const progress=courseProgress(course.id);
              const record=ensureCertificateRecord(course);
              return `<article>
                <div>PDF</div>
                <div><strong>${esc(course.title)}</strong><span>${progress.bestScore}% · ${formatDate(record.completedAt)}</span><small>${record.certificateId}</small></div>
                <button type="button" data-certificate-course="${course.id}">Open certificate</button>
              </article>`;
            }).join("")}</div>`
          :`<div class="apa-empty"><div>PDF</div><h2>No Academy certificates yet</h2><p>Pass an available Academy course with 90% or higher to unlock an in-house certificate.</p></div>`}
        <p class="apa-smallprint">Certificate records are stored on this device. Clearing the website's stored data will remove locally saved progress and certificate records.</p>
      </section>
    </div>`;
  }

  function renderInto(container,screen="main",payload={}){
    if(!container)return;
    container.classList.add("academy-view");
    if(screen==="main")container.innerHTML=mainMarkup();
    else if(screen==="achievements")container.innerHTML=achievementMarkup();
    else if(screen==="certificates")container.innerHTML=certificatesMarkup();
    else if(screen==="certificate")container.innerHTML=certificateMarkup(payload.course);
    else if(screen==="course")container.innerHTML=courseIntro(payload.course);
    else if(screen==="lesson")container.innerHTML=lessonMarkup(payload.course,payload.index);
    else if(screen==="assessment")container.innerHTML=assessmentIntro(payload.course);
    else if(screen==="quiz")container.innerHTML=quizMarkup(payload.course,payload.index,payload.answers);
    else if(screen==="result")container.innerHTML=resultMarkup(payload.course,payload.score,payload.passed);
    bind(container,screen,payload);
    window.scrollTo({top:0,behavior:"auto"});
  }

  function findCourse(id){
    return COURSES.find(course=>course.id===id);
  }

  function bind(container,screen,payload){
    container.querySelectorAll("[data-academy-screen]").forEach(button=>{
      button.onclick=()=>renderInto(container,button.dataset.academyScreen);
    });
    container.querySelector("[data-academy-scroll='courses']")?.addEventListener("click",()=>{
      container.querySelector("#apa-course-library")?.scrollIntoView({behavior:"smooth",block:"start"});
    });
    container.querySelector("[data-academy-search]")?.addEventListener("input",event=>{
      librarySearch=event.target.value;
      renderInto(container,"main");
      requestAnimationFrame(()=>container.querySelector("[data-academy-search]")?.focus());
    });
    container.querySelectorAll("[data-academy-filter]").forEach(button=>{
      button.onclick=()=>{
        libraryFilter=button.dataset.academyFilter;
        renderInto(container,"main");
        requestAnimationFrame(()=>container.querySelector("#apa-course-library")?.scrollIntoView({block:"start"}));
      };
    });
    container.querySelectorAll("[data-course-id]").forEach(button=>{
      button.onclick=()=>{
        const course=findCourse(button.dataset.courseId);
        if(course&&course.status==="available")renderInto(container,"course",{course});
      };
    });
    container.querySelectorAll("[data-start-course]").forEach(button=>{
      button.onclick=()=>{
        const course=findCourse(button.dataset.startCourse);
        const progress=courseProgress(course.id);
        const index=progress.passed?0:Math.min(progress.lessonIndex,course.lessons.length-1);
        renderInto(container,"lesson",{course,index});
      };
    });
    container.querySelectorAll("[data-lesson]").forEach(button=>{
      button.onclick=()=>{
        if(button.disabled)return;
        const [id,index]=button.dataset.lesson.split(":");
        renderInto(container,"lesson",{course:findCourse(id),index:Number(index)});
      };
    });
    container.querySelectorAll("[data-start-assessment]").forEach(button=>{
      button.onclick=()=>renderInto(container,"assessment",{course:findCourse(button.dataset.startAssessment)});
    });
    container.querySelectorAll("[data-begin-quiz]").forEach(button=>{
      const course=findCourse(button.dataset.beginQuiz);
      button.onclick=()=>renderInto(container,"quiz",{course,index:0,answers:{}});
    });


    container.querySelectorAll("[data-certificate-course]").forEach(button=>{
      button.onclick=()=>{
        const course=findCourse(button.dataset.certificateCourse);
        if(course&&courseProgress(course.id).passed)renderInto(container,"certificate",{course});
      };
    });
    container.querySelectorAll("[data-open-certificate]").forEach(button=>{
      button.onclick=()=>{
        const course=findCourse(button.dataset.openCertificate);
        const input=container.querySelector("[data-certificate-name]");
        const name=String(input?.value||"").trim();
        if(!name){
          input?.focus();
          input?.classList.add("invalid");
          return;
        }
        input?.classList.remove("invalid");
        if(!openPrintableCertificate(course,name)){
          alert("The certificate window was blocked. Please allow pop-ups for Apprentice+ and try again.");
        }
      };
    });
    container.querySelector("[data-certificate-name]")?.addEventListener("input",event=>{
      event.target.classList.remove("invalid");
      saveProfile({...loadProfile(),name:event.target.value});
    });

    if(screen==="quiz"){
      const answers={...(payload.answers||{})};
      container.querySelectorAll("[data-answer]").forEach(button=>{
        button.onclick=()=>{
          answers[payload.index]=Number(button.dataset.answer);
          renderInto(container,"quiz",{course:payload.course,index:payload.index,answers});
        };
      });
      container.querySelectorAll("[data-quiz-nav]").forEach(button=>{
        button.onclick=()=>{
          if(button.disabled)return;
          const target=button.dataset.quizNav;
          if(target==="submit"){
            const correct=payload.course.questions.reduce((total,question,index)=>total+(answers[index]===question.answer?1:0),0);
            const score=Math.round((correct/payload.course.questions.length)*100);
            const passed=score>=payload.course.passMark;
            const old=courseProgress(payload.course.id);
            updateCourseProgress(payload.course.id,{
              attempts:old.attempts+1,
              bestScore:Math.max(old.bestScore,score),
              passed:old.passed||passed,
              completedAt:passed?(old.completedAt||new Date().toISOString()):old.completedAt,
              xpAwarded:old.xpAwarded||passed
            });
            if(passed)ensureCertificateRecord(payload.course);
            renderInto(container,"result",{course:payload.course,score,passed});
          }else{
            renderInto(container,"quiz",{course:payload.course,index:Number(target),answers});
          }
        };
      });
    }
  }

  window.ApprenticeshipPlusAcademy={
    version:"phase8-1-v1",
    renderInto,
    courses:COURSES,getBadges,saveBadges,defaultBadges:DEFAULT_BADGES
  };
})();

// ===== Phase 8.3 Badge Intelligence =====
window.ApprenticeshipPlusAcademy = window.ApprenticeshipPlusAcademy || {};

ApprenticeshipPlusAcademy.getUnlockedBadges = function(){
  const badges = JSON.parse(localStorage.getItem('ap_badges')||'{}');
  return Object.keys(badges).filter(k=>badges[k]===true);
};

ApprenticeshipPlusAcademy.unlockBadge = function(id){
  const badges = JSON.parse(localStorage.getItem('ap_badges')||'{}');
  if(!badges[id]){
    badges[id]=true;
    localStorage.setItem('ap_badges',JSON.stringify(badges));
  }
};

ApprenticeshipPlusAcademy.getNextBadge = function(){
  const defs = ApprenticeshipPlusAcademy.badgeDatabase || [];
  const unlocked = ApprenticeshipPlusAcademy.getUnlockedBadges();
  return defs.find(b=>!unlocked.includes(b.id)) || null;
};

ApprenticeshipPlusAcademy.getBadgeProgress = function(){
  const defs = ApprenticeshipPlusAcademy.badgeDatabase || [];
  return {
    unlocked: ApprenticeshipPlusAcademy.getUnlockedBadges().length,
    total: defs.length
  };
};
