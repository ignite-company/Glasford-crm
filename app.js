
(function () {
"use strict";

const STORE="glasford_command_center_v1";
const STAGES=["New lead","Contacted","Follow-up","Estimate scheduled","Estimate sent","Won","Lost"];
const JOB_STATUS=["Scheduled","In progress","Completed","Paid","Cancelled"];
const EST_STATUS=["Draft","Visit scheduled","Sent","Accepted","Declined"];
const CADENCE=[
 {day:0,title:"Immediate response",channel:"Call + text",detail:"Call promptly, then send a friendly acknowledgment.",message:"Hi {name}, this is Glasford Tree Trimming. Thanks for reaching out about your tree service. We'd love to help. Is there a good time to talk?"},
 {day:2,title:"Personal check-in",channel:"Phone call",detail:"Try again at a different time of day.",message:"Hi {name}, just following up on your tree service request. Happy to answer questions or arrange an estimate."},
 {day:4,title:"Helpful reminder",channel:"Text message",detail:"Keep it light. Offer to arrange a free conversation.",message:"Hey {name}, Glasford Tree Trimming here. Still looking for help with your trees? We can talk through the work and next steps."},
 {day:7,title:"Second phone attempt",channel:"Call + voicemail",detail:"Call and leave a short, clear message when possible.",message:"Hi {name}, calling from Glasford Tree Trimming regarding your request. Give us a call whenever you have a moment."},
 {day:10,title:"Availability check",channel:"Text message",detail:"Make replying feel easy with a simple question.",message:"Hi {name}, checking in. Would you like to get an estimate on your tree work this week or would later be better?"},
 {day:14,title:"Two-week follow-up",channel:"Phone call",detail:"Reach out personally and make a final offer to discuss the job.",message:"Hi {name}, this is Glasford. Just wanted to follow up on the tree service you inquired about."},
 {day:21,title:"Stay top of mind",channel:"Text message",detail:"Reintroduce the team without pressure.",message:"Hi {name}, Glasford Tree Trimming here. If that tree project is still on your list, we're here whenever you're ready."},
 {day:30,title:"Final friendly check-in",channel:"Text message",detail:"Close the active sequence respectfully; customer can still respond.",message:"Hi {name}, last check-in from Glasford Tree Trimming about your tree work. No pressure at all. We're here if you need us."}
];
const P={
 house:'<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/>',
 board:'<rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 3.2a4 4 0 0 1 0 7.6M22 21v-2a4 4 0 0 0-3-3.87"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
 clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h6"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
 dollar:'<path d="M12 2v20M17 5H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8H6"/>',
 activity:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
 leaf:'<path d="M20 4c-7-1-15 2-15 11a5 5 0 0 0 5 5c9 0 12-8 10-16Z"/><path d="M5 20c3-7 7-10 13-13"/>',
 tree:'<path d="M12 22v-8M8 22h8"/><path d="M12 2 4 12h4l-3 5h14l-3-5h4L12 2Z"/>',
 phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19 19 0 0 1-17.7-17.7A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7l.4 2.6a2 2 0 0 1-.6 1.7L7 9.8a16 16 0 0 0 7.2 7.2l1.8-1.8a2 2 0 0 1 1.7-.6l2.6.4a2 2 0 0 1 1.7 1.9Z"/>',
 message:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.8-.4-4-1L3 21l1.5-5.5A8.5 8.5 0 1 1 21 11.5Z"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 x:'<path d="M5 5 19 19M19 5 5 19"/>',
 chevron:'<path d="m9 18 6-6-6-6"/>',
 down:'<path d="m6 9 6 6 6-6"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4"/><path d="M5 17v4h14v-4"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2 2-.06-.06A1.65 1.65 0 0 0 16 18.5a1.65 1.65 0 0 0-1 .9V21h-3v-1.6a1.65 1.65 0 0 0-1-.9 1.65 1.65 0 0 0-1.8.33l-.06.06-2-2 .06-.06A1.65 1.65 0 0 0 7.5 15a1.65 1.65 0 0 0-.9-1H5v-3h1.6a1.65 1.65 0 0 0 .9-1A1.65 1.65 0 0 0 7.17 8.2l-.06-.06 2-2 .06.06A1.65 1.65 0 0 0 11 6.5a1.65 1.65 0 0 0 1-.9V4h3v1.6a1.65 1.65 0 0 0 1 .9 1.65 1.65 0 0 0 1.8-.33l.06-.06 2 2-.06.06A1.65 1.65 0 0 0 19.5 10a1.65 1.65 0 0 0 .9 1H22v3h-1.6a1.65 1.65 0 0 0-1 .9Z"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 pause:'<path d="M9 5v14M15 5v14"/>',
 play:'<path d="m8 5 12 7-12 7Z"/>',
 map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
 card:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9a7 7 0 0 1 12-3l2.5 3M4 15l2.5 3a7 7 0 0 0 12-3"/>'
};
function icon(name,size){return '<svg width="'+(size||17)+'" height="'+(size||17)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[name]||P.leaf)+'</svg>';}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function uid(prefix){return prefix+"_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7);}
function dayDate(d){var x=new Date();x.setHours(12,0,0,0);x.setDate(x.getDate()+(d||0));return x.toISOString().slice(0,10);}
function addDays(start,n){var x=new Date((start||dayDate(0))+"T12:00:00");x.setDate(x.getDate()+n);return x.toISOString().slice(0,10);}
function timeFmt(t){if(!t)return "Time not set";var p=t.split(":"),h=Number(p[0]);if(!Number.isFinite(h))return t;return (h%12||12)+":"+(p[1]||"00")+" "+(h>=12?"PM":"AM");}
function dateFmt(v,opts){if(!v)return "Not set";var t=new Date(v.length===10?v+"T12:00:00":v);if(isNaN(t))return "Not set";return t.toLocaleDateString("en-US",opts||{month:"short",day:"numeric",year:"numeric"});}
function dollars(n){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(Number(n)||0);}
function num(n){return (Number(n)||0).toLocaleString("en-US");}
function initials(s){return String(s||"?").trim().split(/\s+/).slice(0,2).map(function(z){return z[0];}).join("").toUpperCase();}
function validAmount(n){return Number.isFinite(n)&&n>=0&&n<1000000000;}
function newDemo(){
 return {version:1,demo:true,leads:[
  {id:"l1",name:"Taylor Reed",phone:"(555) 010-1401",email:"",address:"Example property, North NJ",service:"Tree removal",source:"Website",stage:"New lead",created:dayDate(-1),notes:"Sample lead for demonstration only.",followStart:"",followPaused:false,steps:[]},
  {id:"l2",name:"Jordan Miller",phone:"(555) 010-1402",email:"",address:"Example property, North NJ",service:"Tree trimming",source:"Referral",stage:"Follow-up",created:dayDate(-6),notes:"Sample lead. First call received no answer.",followStart:dayDate(-6),followPaused:false,steps:[0,1]},
  {id:"l3",name:"Avery Collins",phone:"(555) 010-1403",email:"",address:"Example property, North NJ",service:"Stump grinding",source:"Google",stage:"Estimate sent",created:dayDate(-9),notes:"Sample lead.",followStart:"",followPaused:true,steps:[]},
  {id:"l4",name:"Casey Walker",phone:"(555) 010-1404",email:"",address:"Example property, North NJ",service:"Tree pruning",source:"Phone",stage:"Estimate scheduled",created:dayDate(-4),notes:"Sample lead.",followStart:"",followPaused:false,steps:[]},
  {id:"l5",name:"Riley Parker",phone:"(555) 010-1405",email:"",address:"Example property, North NJ",service:"Storm cleanup",source:"Referral",stage:"Won",created:dayDate(-20),notes:"Sample customer.",followStart:"",followPaused:true,steps:[]}
 ],estimates:[
  {id:"e1",leadId:"l3",name:"Avery Collins",service:"Stump grinding",amount:1850,status:"Sent",date:dayDate(-2),notes:"Sample estimate"},
  {id:"e2",leadId:"l4",name:"Casey Walker",service:"Tree pruning",amount:1450,status:"Draft",date:dayDate(0),notes:"Sample estimate",visitDate:dayDate(2),visitTime:"10:00",assignedCrew:"Glasford team"},
  {id:"e3",leadId:"l5",name:"Riley Parker",service:"Storm cleanup",amount:3200,status:"Accepted",date:dayDate(-14),notes:"Sample estimate"}
 ],jobs:[
  {id:"j1",leadId:"l5",name:"Riley Parker",service:"Storm cleanup",address:"Example property, North NJ",amount:3200,date:dayDate(-3),status:"Completed",notes:"Sample job"},
  {id:"j2",leadId:"l4",name:"Casey Walker",service:"Tree pruning",address:"Example property, North NJ",amount:1450,date:dayDate(3),time:"08:00",crew:"Crew A",status:"Scheduled",notes:"Sample job"}
 ],payments:[{id:"p1",jobId:"j1",amount:1600,date:dayDate(-2),note:"Sample payment"}]};
}
function load(){try{var saved=JSON.parse(localStorage.getItem(STORE));if(saved&&Array.isArray(saved.leads)&&Array.isArray(saved.jobs)&&Array.isArray(saved.estimates)&&Array.isArray(saved.payments)){
  if(saved.demo){
   var sampleEstimate=saved.estimates.find(function(e){return e.id==="e2"&&e.name==="Casey Walker";});
   if(sampleEstimate&&!sampleEstimate.visitDate){sampleEstimate.visitDate=addDays(sampleEstimate.date||dayDate(0),2);sampleEstimate.visitTime="10:00";sampleEstimate.assignedCrew="Glasford team";}
   var sampleJob=saved.jobs.find(function(j){return j.id==="j2"&&j.name==="Casey Walker";});
   if(sampleJob&&!sampleJob.time){sampleJob.time="08:00";sampleJob.crew="Crew A";}
  }
  return saved;
 }}catch(e){}return newDemo();}
var db=load();
var ui={page:"home",query:"",modal:"",id:"",mobile:false,leadFilter:"All",calendarDay:dayDate(0),datePrefill:""};
function save(){localStorage.setItem(STORE,JSON.stringify(db));render();}
function leadBy(id){return db.leads.find(function(l){return l.id===id;});}
function jobBy(id){return db.jobs.find(function(j){return j.id===id;});}
function paid(jobId){return db.payments.filter(function(p){return p.jobId===jobId;}).reduce(function(s,p){return s+Number(p.amount||0);},0);}
function activeLead(l){return l.followStart&&!l.followPaused&&l.stage!=="Won"&&l.stage!=="Lost";}
function nextStep(l){if(!activeLead(l))return null;for(var i=0;i<CADENCE.length;i++)if(!(l.steps||[]).includes(i))return {i:i,due:addDays(l.followStart,CADENCE[i].day),step:CADENCE[i]};return null;}
function tasks(){return db.leads.map(function(l){var s=nextStep(l);return s?{lead:l,i:s.i,due:s.due,step:s.step}:null;}).filter(Boolean).sort(function(a,b){return a.due.localeCompare(b.due);});}
function badge(s){var color=["Paid","Won","Completed","Accepted"].includes(s)?"good":["Lost","Declined","Cancelled"].includes(s)?"bad":["Follow-up","Sent","In progress","Due today"].includes(s)?"warn":["Scheduled","Estimate scheduled","Visit scheduled"].includes(s)?"blue":"dark";return '<span class="pill '+color+'">'+esc(s)+'</span>';}
function empty(title,sub,which){return '<div class="empty"><div class="empty-icon">'+icon(which||"leaf",23)+'</div><strong>'+esc(title)+'</strong><p>'+esc(sub||"")+'</p></div>';}
function btn(action,label,klass){return '<button type="button" class="btn '+(klass||"")+'" '+action+'>'+label+'</button>';}

function navItem(page,label,ic,count){
 const active=ui.page===page;
 return '<button type="button" class="dock-item '+(active?'active':'')+'" data-page="'+page+'" aria-label="'+esc(label)+'" '+(active?'aria-current="page"':'')+'>'
 +'<span class="dock-icon">'+icon(ic,23)+(count>0?'<span class="dock-count">'+count+'</span>':'')+'</span>'
 +'<span class="dock-label">'+esc(label)+'</span></button>';
}
function pageMeta(){return {home:["Today","See what needs attention."],leads:["Leads","Every customer inquiry."],calendar:["Calendar","Today and upcoming appointments."],followups:["Follow-ups","Never lose a customer."],estimates:["Estimates","Keep track of quotes."],jobs:["Jobs","Work and payments."],settings:["Settings","Backup and local data."]}[ui.page]||["Today",""];}

function shell(content){
 var due=tasks().filter(function(t){return t.due<=dayDate(0);}).length;
 return '<div class="shell"><div class="workspace">'
 +'<header class="topbar"><div class="top-brand"><img class="logo-mark" src="https://assets.cdn.filesafe.space/bF1dT8IAVuvat84LkAVe/media/6ae0bab4c62ddbd638d94b5b.png" alt="Glasford Tree Trimming logo" style="object-fit:contain;background:transparent;box-shadow:none" /><div><strong>GLASFORD TREE TRIMMING</strong><span>COMMAND CENTER</span></div></div></header>'
 +'<main class="main" id="main-content">'+notice()+content+'</main>'
 +'</div><nav class="bottom-dock" aria-label="Main navigation">'
 +navItem("home","Home","house")+navItem("leads","Leads","users")+navItem("calendar","Calendar","calendar")
 +navItem("followups","Follow-ups","clock",due)+navItem("estimates","Estimates","file")+navItem("jobs","Jobs","clipboard")
 +'</nav></div>'+modal();
}
function notice(){return '<div class="preview-notice"><div>'+icon("leaf",16)+' &nbsp;<strong>'+(db.demo?"Sample workspace":"Local preview")+'.</strong> '+(db.demo?"This workspace contains fictional example records. Clear them before adding real customer information. ":"")+'Entries are saved in this browser only. Automated calls and texts are not connected.</div>'+(db.demo?'<button data-clear-demo>Clear workspace</button>':'<button data-page="settings">Backup / import data</button>')+'</div>';}
function header(eyebrow,title,desc,actions){return '<div class="intro"><div><div class="eyebrow">'+esc(eyebrow)+'</div><h1>'+esc(title)+'</h1><p>'+esc(desc)+'</p></div><div class="actions">'+(actions||"")+'</div></div>';}
function metric(label,value,foot,ic){return '<div class="metric"><div class="metric-top"><div class="metric-label">'+label+'</div><div class="metric-icon">'+icon(ic,19)+'</div></div><div class="metric-value">'+value+'</div><div class="metric-foot">'+foot+'</div></div>';}
function identity(name,detail){return '<div class="identity"><div class="lead-avatar">'+esc(initials(name))+'</div><div style="min-width:0"><div class="identity-main">'+esc(name)+'</div><div class="identity-sub">'+esc(detail||"")+'</div></div></div>';}

function home(){
 const today=dayDate(0),planned=scheduleFor(today);
 const pending=db.leads.filter(l=>["New lead","Contacted"].includes(l.stage)).sort((a,b)=>(b.created||"").localeCompare(a.created||""));
 const due=tasks().filter(t=>t.due<=today);
 const openEst=db.estimates.filter(e=>e.status==="Sent");
 const collected=db.payments.reduce((n,p)=>n+Number(p.amount||0),0);
 const upcoming=db.jobs.filter(j=>["Scheduled","In progress"].includes(j.status)&&j.date>=today).sort((a,b)=>(a.date||"").localeCompare(b.date||""));
 const intro=header("TODAY","Your day, made simple.","Know who to call, where to go, and what needs doing.",btn('data-modal="lead"',icon("plus",17)+" New lead","btn-primary"));
 const stats='<div class="metrics home-metrics">'+metric("New leads",num(db.leads.filter(l=>l.stage==="New lead").length),"Waiting for first contact","users")+metric("Estimates waiting",num(openEst.length),"Quotes awaiting an answer","file")+metric("Money collected",dollars(collected),"Payments received","dollar")+'</div>';
 const schedule='<section class="card card-pad"><div class="card-title-row"><div><div class="card-kicker">'+icon("calendar",16)+' '+dateFmt(today,{weekday:"long",month:"long",day:"numeric"})+'</div><div class="card-title">Today’s schedule</div><div class="card-sub">Jobs and estimate visits booked for today</div></div><button class="text-link" data-page="calendar">Calendar '+icon("arrow",17)+'</button></div>'
 +(planned.length?'<div class="simple-rows">'+planned.map(scheduleRow).join("")+'</div>':empty("Nothing booked today","Open the calendar to see upcoming days.","calendar"))+'</section>';
 const attention='<section class="card card-pad"><div class="card-title-row"><div><div class="card-title">Needs attention</div><div class="card-sub">The conversations to handle next</div></div><span class="attention-total">'+(pending.length+due.length)+'</span></div>'
 +(due.length||pending.length?'<div class="simple-rows">'
 +due.slice(0,3).map(t=>'<button class="simple-row" data-lead="'+esc(t.lead.id)+'"><span class="row-icon amber">'+icon("phone",20)+'</span><span class="row-copy"><strong>'+esc(t.lead.name)+'</strong><small>Follow up · '+esc(t.step.channel)+'</small></span>'+badge(t.due<today?"Overdue":"Due today")+icon("chevron",18)+'</button>').join("")
 +pending.slice(0,3).map(l=>'<button class="simple-row" data-lead="'+esc(l.id)+'"><span class="row-icon">'+icon("users",20)+'</span><span class="row-copy"><strong>'+esc(l.name)+'</strong><small>'+esc(l.service||"Tree service")+'</small></span>'+badge(l.stage)+icon("chevron",18)+'</button>').join("")+'</div>':empty("All caught up","New leads and follow-ups will show here.","check"))
 +'<button class="wide-quiet-action" data-page="leads">See all leads '+icon("chevron",17)+'</button></section>';
 const jobs='<section class="card card-pad"><div class="card-title-row"><div><div class="card-title">Upcoming jobs</div><div class="card-sub">Where the crew is heading next</div></div><button class="text-link" data-page="calendar">Schedule '+icon("arrow",17)+'</button></div>'
 +(upcoming.length?'<div class="simple-rows">'+upcoming.slice(0,4).map(j=>'<button class="simple-row" data-job="'+esc(j.id)+'"><span class="row-icon">'+icon("tree",20)+'</span><span class="row-copy"><strong>'+esc(j.name)+'</strong><small>'+dateFmt(j.date,{weekday:"short",month:"short",day:"numeric"})+(j.time?' · '+timeFmt(j.time):"")+' · '+esc(j.service)+'</small></span>'+icon("chevron",18)+'</button>').join("")+'</div>':empty("No upcoming jobs","Scheduled work appears here.","calendar"))+'</section>';
 const quotes='<section class="card card-pad"><div class="card-title-row"><div><div class="card-title">Estimates waiting</div><div class="card-sub">Quotes that need a customer response</div></div><button class="text-link" data-page="estimates">Estimates '+icon("arrow",17)+'</button></div>'
 +(openEst.length?'<div class="simple-rows">'+openEst.slice(0,4).map(e=>'<button class="simple-row" data-estimate="'+esc(e.id)+'"><span class="row-icon">'+icon("file",20)+'</span><span class="row-copy"><strong>'+esc(e.name)+'</strong><small>'+esc(e.service)+'</small></span><span class="row-value">'+dollars(e.amount)+'</span>'+icon("chevron",18)+'</button>').join("")+'</div>':empty("No quotes waiting","Sent estimates will show here.","check"))+'</section>';
 return intro+stats+'<div class="dashboard-grid">'+schedule+attention+'</div><div class="dashboard-grid">'+jobs+quotes+'</div><div class="workspace-footer"><span>Glasford Tree Trimming</span><button data-page="settings">'+icon("settings",16)+' Workspace settings</button></div>';
}


function scheduleFor(day){
 var out=[];
 db.jobs.forEach(function(j){if(j.date===day&&j.status!=="Cancelled")out.push({kind:"job",id:j.id,name:j.name,service:j.service,address:j.address||"",time:j.time||"",crew:j.crew||"",status:j.status});});
 db.estimates.forEach(function(e){if(e.visitDate===day&&e.status!=="Declined"){var l=leadBy(e.leadId);out.push({kind:"estimate",id:e.id,name:e.name,service:e.service,address:l?.address||"",time:e.visitTime||"",crew:e.assignedCrew||"",status:e.status});}});
 return out.sort(function(a,b){return (a.time||"99:99").localeCompare(b.time||"99:99")||a.name.localeCompare(b.name);});
}
function scheduleRow(ev){
 var details='<button class="simple-row schedule-row" data-'+(ev.kind==="job"?"job":"estimate")+'="'+esc(ev.id)+'"><span class="schedule-time">'+(ev.time?timeFmt(ev.time):"Any time")+'</span><span class="row-icon '+(ev.kind==="estimate"?"light":"")+'">'+icon(ev.kind==="estimate"?"file":"tree",20)+'</span><span class="row-copy"><strong>'+esc(ev.name)+'</strong><small>'+esc(ev.kind==="estimate"?"Estimate visit":"Job")+' · '+esc(ev.service)+'</small>'+(ev.address?'<small>'+esc(ev.address)+'</small>':"")+(ev.crew?'<small>Assigned: '+esc(ev.crew)+'</small>':"")+'</span>'+icon("chevron",18)+'</button>';
 var action=ev.kind==="job"&&["Scheduled","In progress"].includes(ev.status)?'<button class="status-action" data-quick-job="'+esc(ev.id)+'">'+icon("check",16)+' '+(ev.status==="Scheduled"?"Start work":"Mark complete")+'</button>':"";
 return '<div class="schedule-item">'+details+action+'</div>';
}
function calendar(){
 var chosen=ui.calendarDay||dayDate(0),base=new Date(chosen+"T12:00:00"),yr=base.getFullYear(),mo=base.getMonth();
 var first=new Date(yr,mo,1),offset=first.getDay(),days=new Date(yr,mo+1,0).getDate(),total=Math.ceil((offset+days)/7)*7,cells=[];
 var selected=scheduleFor(chosen),today=dayDate(0);
 for(var i=0;i<total;i++){
  var date=new Date(yr,mo,1-offset+i),key=date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0"),events=scheduleFor(key);
  cells.push('<button class="calendar-cell '+(date.getMonth()!==mo?"other-month ":"")+(key===today?"is-today ":"")+(key===chosen?"selected":"")+'" data-calendar-day="'+key+'" aria-label="'+dateFmt(key,{weekday:"long",month:"long",day:"numeric"})+' · '+events.length+' scheduled"><span>'+date.getDate()+'</span><span class="calendar-markers">'+events.slice(0,3).map(function(e){return '<i class="'+(e.kind==="job"?"work-dot":"estimate-dot")+'"></i>';}).join("")+'</span></button>');
 }
 return header("TEAM SCHEDULE","Your calendar.","Tap a date to see jobs, on-site estimates, locations, and assigned crew.",btn("data-calendar-today","Today","btn-soft"))
 +'<div class="calendar-layout"><section class="card calendar-panel"><div class="calendar-controls"><div class="calendar-month">'+base.toLocaleDateString("en-US",{month:"long",year:"numeric"})+'</div><div class="calendar-buttons"><button class="calendar-arrow previous" data-calendar-shift="-1" aria-label="Previous month">'+icon("chevron",18)+'</button><button class="calendar-arrow next" data-calendar-shift="1" aria-label="Next month">'+icon("chevron",18)+'</button></div></div>'
 +'<div class="calendar-weekdays">'+["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(function(w){return '<span>'+w+'</span>';}).join("")+'</div><div class="calendar-days">'+cells.join("")+'</div>'
 +'<div class="calendar-legend"><span><i class="work-dot"></i> Jobs</span><span><i class="estimate-dot"></i> Estimates</span></div></section>'
 +'<section class="card card-pad calendar-agenda"><div class="card-title-row"><div><div class="card-kicker">SELECTED DAY</div><div class="card-title">'+dateFmt(chosen,{weekday:"long",month:"long",day:"numeric"})+'</div><div class="card-sub">'+selected.length+' scheduled '+(selected.length===1?"appointment":"appointments")+'</div></div></div>'
 +(selected.length?'<div class="simple-rows">'+selected.map(scheduleRow).join("")+'</div>':empty("No work scheduled","You can add a job or schedule an estimate visit.","calendar"))
 +'<div class="calendar-add"><button class="btn btn-primary" data-modal="job" data-prefill-date="'+chosen+'">'+icon("plus",17)+' Add job</button><button class="btn btn-soft" data-modal="estimate" data-prefill-date="'+chosen+'">'+icon("plus",17)+' Estimate visit</button></div></section></div>';
}


function leads(){
 var q=ui.query.toLowerCase();
 var list=db.leads.filter(function(l){return [l.name,l.phone,l.service,l.address,l.source].join(" ").toLowerCase().includes(q);});
 var visible=ui.leadFilter==="All"?list:list.filter(l=>l.stage===ui.leadFilter);
 var filter='<select class="filter lead-filter" data-lead-filter aria-label="Filter by stage">'+["All"].concat(STAGES).map(function(v){return '<option value="'+esc(v)+'" '+(ui.leadFilter===v?"selected":"")+'>'+(v==="All"?"All leads":esc(v))+'</option>';}).join("")+'</select>';
 var board='<div class="board-wrap"><div class="board">'+STAGES.map(function(stage){
  var group=list.filter(l=>l.stage===stage);
  return '<div class="board-column" data-drop-stage="'+esc(stage)+'"><div class="column-head"><strong>'+esc(stage)+'</strong><span>'+group.length+'</span></div>'
  +(group.length?group.map(function(l){return '<article class="lead-tile" draggable="true" data-drag-id="'+esc(l.id)+'"><div class="tile-title"><button class="tile-click" data-lead="'+esc(l.id)+'">'+esc(l.name)+'</button>'+icon("chevron",14)+'</div><div class="tile-service">'+esc(l.service||"Tree service")+'<br>'+esc(l.address||"Address not provided")+'</div><div class="tile-bottom"><span class="tile-phone">'+esc(l.phone||"No phone")+'</span><span class="tile-age">'+dateFmt(l.created,{month:"short",day:"numeric"})+'</span></div><div style="margin-top:11px"><select class="tile-select" data-stage="'+esc(l.id)+'" aria-label="Move '+esc(l.name)+' to a new stage">'+STAGES.map(function(st){return '<option '+(st===l.stage?"selected":"")+'>'+esc(st)+'</option>';}).join("")+'</select></div></article>';}).join(""):'<div class="column-empty">No leads in this stage.</div>')+'</div>';
 }).join("")+'</div></div>';
 var mobile='<div class="mobile-lead-list">'+(visible.length?visible.map(function(l){
  return '<article class="mobile-lead-card"><button class="mobile-lead-main" data-lead="'+esc(l.id)+'">'+identity(l.name,l.service||"Tree service")+'<span class="mobile-lead-arrow">'+icon("chevron",19)+'</span></button><div class="mobile-lead-bottom"><span>'+esc(l.phone||"Phone not provided")+'</span><select class="tile-select" data-stage="'+esc(l.id)+'" aria-label="Stage for '+esc(l.name)+'">'+STAGES.map(function(st){return '<option '+(st===l.stage?"selected":"")+'>'+esc(st)+'</option>';}).join("")+'</select></div></article>';
 }).join(""):empty("No matching leads","Change the filter or add a customer inquiry.","users"))+'</div>';
 return header("CUSTOMERS","Your leads.","Every inquiry in one place. Tap a name for details or change its stage to move it forward.",btn('data-modal="lead"',icon("plus",17)+" Add lead","btn-primary"))
 +'<div class="toolbar"><div class="search-box">'+icon("search",18)+'<input data-search placeholder="Search name, phone, service..." value="'+esc(ui.query)+'" aria-label="Search leads"/></div><div class="toolbar-right">'+filter+'</div></div>'
 +board+mobile;
}

function followups(){
 var due=tasks().filter(function(t){return t.due<=dayDate(0);}),future=tasks().filter(function(t){return t.due>dayDate(0);});
 return header("Customer retention","A follow-up system that never forgets.","When a lead doesn't answer, start the timeline. Each step becomes a trackable outreach task.",btn('data-modal="lead"',icon("plus",15)+" Add lead","btn-primary"))
 +'<div class="sequence-explain"><div class="quick-icon">'+icon("activity",20)+'</div><div><strong>What happens after a missed call?</strong><p>Mark the lead as <b>No answer</b>. They will move into Follow-up, starting with same-day outreach, then check-ins on days 2, 4, 7, 10, 14, 21, and 30. When they reply, you can pause the sequence and move them toward an estimate. This workspace tracks tasks and contact attempts. It does not automatically send texts or place calls.</p></div></div>'
 +'<section class="card card-pad" style="margin-bottom:20px"><div class="card-title-row"><div><div class="card-title">The 30-day follow-up journey</div><div class="card-sub">A respectful mix of calls and texts so prospects do not fall through the cracks</div></div>'+badge("8 touchpoints")+'</div><div class="timeline">'
 +CADENCE.map(function(s,i){return '<div class="step-card"><div class="step-count"><div class="step-num">'+(i+1)+'</div><div class="step-day">DAY '+s.day+'</div></div><h3>'+esc(s.channel)+'</h3><p>'+esc(s.detail)+'</p></div>';}).join("")+'</div><div class="sequence-notice">Suggested wording is available inside each lead detail panel. Stop or pause the sequence when a customer replies or asks not to be contacted.</div></section>'
 +'<div class="section-grid"><section class="card"><div class="card-pad" style="padding-bottom:10px"><div class="card-title-row"><div><div class="card-title">Due now</div><div class="card-sub">Reach out today and mark each attempt complete</div></div>'+badge(due.length+" to do")+'</div></div>'
 +(due.length?due.map(function(t){return taskRow(t);}).join(""):empty("Nothing due right now","Tasks appear here when an active follow-up reaches its next day.","check"))+'</section>'
 +'<section class="card"><div class="card-pad" style="padding-bottom:10px"><div class="card-title-row"><div><div class="card-title">Coming up</div><div class="card-sub">Your next scheduled outreach tasks</div></div>'+badge(future.length+" scheduled")+'</div></div>'
 +(future.length?future.slice(0,7).map(function(t){return taskRow(t);}).join(""):empty("No upcoming follow-ups","Start a follow-up from a lead's profile.","calendar"))+'</section></div>'
 +'<section class="card card-pad"><div class="card-title-row"><div><div class="card-title">Leads in follow-up</div><div class="card-sub">Choose a customer to view every step and its suggested wording</div></div></div>'
 +(db.leads.filter(activeLead).length?'<div class="mini-list">'+db.leads.filter(activeLead).map(function(l){var n=nextStep(l);return '<div class="mini-row"><div>'+identity(l.name,l.service+' · '+(n?"Day "+n.step.day+" next":"Sequence finished"))+'</div>'+btn('data-lead="'+esc(l.id)+'"',"View timeline "+icon("chevron",14),"btn-sm")+'</div>';}).join("")+'</div>':empty("No active follow-ups","Open any lead and select No answer to begin.","clock"))+'</section>';
}
function taskRow(t){return '<div class="followup-row"><div>'+identity(t.lead.name,t.lead.service)+'</div><div class="followup-method"><div style="font-size:12px;font-weight:750;color:var(--green)">'+esc(t.step.channel)+'</div><div class="muted">Step '+(t.i+1)+' · Day '+t.step.day+'</div></div><div class="followup-state"><div class="due">'+dateFmt(t.due,{month:"short",day:"numeric"})+'</div><div class="muted">'+(t.due<dayDate(0)?"Overdue":t.due===dayDate(0)?"Due today":"Upcoming")+'</div></div>'+btn('data-lead="'+esc(t.lead.id)+'"',"Open "+icon("chevron",13),"btn-sm")+'</div>';}

function estimates(){
 var total=db.estimates.filter(function(x){return x.status==="Sent";}).reduce(function(a,b){return a+Number(b.amount||0);},0);
 return header("Estimates & quotes","All your estimates in one place.","See the amount quoted, when it was prepared, and whether the customer has accepted or still needs to respond.",btn('data-modal="estimate"',icon("plus",18)+" New estimate","btn-primary"))
 +'<div class="metrics metric-two">'+metric("Outstanding quoted value",dollars(total),"Sent estimates awaiting a response","file")+metric("Accepted estimates",dollars(db.estimates.filter(function(e){return e.status==="Accepted";}).reduce(function(s,e){return s+Number(e.amount||0);},0)),"Accepted does not mean paid","check")+'</div>'
 +'<section class="card card-pad"><div class="card-title-row"><div><div class="card-title">All estimates</div><div class="card-sub">Select any estimate to update its status or amount</div></div></div>'
 +(db.estimates.length?'<div class="records-list">'+db.estimates.slice().sort(function(a,b){return (b.date||"").localeCompare(a.date||"");}).map(function(e){return '<div class="record-row"><div class="record-person">'+identity(e.name,e.service)+'<div class="record-date">'+icon("calendar",17)+' '+dateFmt(e.date)+'</div>'+(e.visitDate?'<div class="record-date">'+icon("clock",17)+' Visit: '+dateFmt(e.visitDate)+(e.visitTime?' · '+timeFmt(e.visitTime):'')+'</div>':'')+(e.assignedCrew?'<div class="record-date">'+icon("users",17)+' '+esc(e.assignedCrew)+'</div>':'')+'</div><div class="record-finance"><strong>'+dollars(e.amount)+'</strong>'+badge(e.status)+'</div>'+btn('data-estimate="'+esc(e.id)+'"',"View / edit "+icon("chevron",17),"record-open")+'</div>';}).join("")+'</div>':empty("No estimates","Add a quote to track its value, date, and status.","file"))
 +'</section>';
}

function jobs(){
 var sum=db.jobs.reduce(function(s,j){return s+Math.max(0,Number(j.amount||0)-paid(j.id));},0);
 var collected=db.payments.reduce(function(s,p){return s+Number(p.amount||0);},0);
 return header("Work & revenue","Jobs and money, in one view.","Track scheduled and completed work, record deposits and final payments, and see what customers still owe.",btn('data-modal="job"',icon("plus",18)+" Add job","btn-primary"))
 +'<div class="metrics metric-three">'+metric("Collected",dollars(collected),"Based on payment entries","dollar")+metric("Remaining balance",dollars(sum),"Job totals minus collected payments","file")+metric("Open jobs",num(db.jobs.filter(function(j){return ["Scheduled","In progress"].includes(j.status);}).length),"Scheduled or in progress","calendar")+'</div>'
 +'<section class="card card-pad" style="margin-bottom:22px"><div class="card-title-row"><div><div class="card-title">All jobs</div><div class="card-sub">Open a job to edit its schedule or record a payment</div></div></div>'
 +(db.jobs.length?'<div class="records-list">'+db.jobs.slice().sort(function(a,b){return (a.date||"9999").localeCompare(b.date||"9999");}).map(function(j){var paidAmount=paid(j.id);return '<div class="record-row"><div class="record-person">'+identity(j.name,j.service)+'<div class="record-date">'+icon("calendar",17)+' '+dateFmt(j.date)+(j.time?' · '+timeFmt(j.time):'')+'</div>'+(j.crew?'<div class="record-date">'+icon("users",17)+' '+esc(j.crew)+'</div>':'')+'</div><div class="record-finance"><strong>'+dollars(j.amount)+'</strong>'+badge(j.status)+'<span class="record-paid">'+dollars(paidAmount)+' collected</span><div class="progress-track"><div class="progress-fill" style="width:'+Math.min(100,Number(j.amount)>0?paidAmount/Number(j.amount)*100:0)+'%"></div></div></div>'+btn('data-job="'+esc(j.id)+'"',"Open job "+icon("chevron",17),"record-open")+'</div>';}).join("")+'</div>':empty("No jobs yet","Create a job to start tracking work and payments.","calendar"))
 +'</section>'
 +'<section class="card card-pad"><div class="card-title-row"><div><div class="card-title">Payment history</div><div class="card-sub">Every deposit and final payment entered into the command center</div></div></div>'
 +(db.payments.length?'<div class="mini-list">'+db.payments.slice().sort(function(a,b){return b.date.localeCompare(a.date);}).map(function(p){var j=jobBy(p.jobId);return '<div class="mini-row"><div>'+identity(j?j.name:"Unlinked payment",p.note||"Job payment")+'</div><div class="right-meta"><strong>'+dollars(p.amount)+'</strong><small>'+dateFmt(p.date)+'</small></div></div>';}).join("")+'</div>':empty("No payments recorded","Open any job to record a deposit or payment.","dollar"))
 +'</section>';
}
function settings(){
 return header("Administration","Your workspace settings.","Export a backup and restore it later on another device.","")
 +'<section class="card settings-box"><h3>Local preview storage</h3><p>The current version saves to this browser, not a shared database. It is suitable for reviewing the workflow, but should not be used as the live team CRM until authentication, shared data storage, and sending integrations are set up.</p><div class="actions">'+btn("data-export",icon("download",15)+" Export full backup","btn-primary")+btn("data-export-csv",icon("download",15)+" Export leads CSV","")+'</div></section>'
 +'<section class="card settings-box"><h3>Restore a backup</h3><p>Import a JSON backup you previously exported from this workspace. This replaces the data currently in this browser.</p><div class="field"><label for="json-file">Select backup JSON</label><input type="file" id="json-file" accept=".json,application/json" style="max-width:340px"/></div></section>'
 +'<section class="card settings-box"><h3>Start with an empty workspace</h3><p>Remove all demo records. This cannot be undone unless you exported a backup.</p>'+btn("data-clear-demo",icon("refresh",15)+" Clear workspace","btn-danger")+'</section>';
}
function input(name,label,value,type,opts){return '<div class="field '+(opts&&opts.wide?"wide":"")+'"><label for="fld-'+name+'">'+esc(label)+'</label><input id="fld-'+name+'" name="'+name+'" class="'+(type==="date"||type==="time"?"native-date-input":"")+'" type="'+(type||"text")+'" value="'+esc(value||"")+'" '+(opts&&opts.required?"required":"")+' '+(opts&&opts.min!=null?'min="'+opts.min+'"':"")+' placeholder="'+esc(opts&&opts.placeholder||"")+'"/></div>';}
function pick(name,label,value,options,wide){return '<div class="field '+(wide?"wide":"")+'"><label for="fld-'+name+'">'+esc(label)+'</label><select name="'+name+'" id="fld-'+name+'">'+options.map(function(o){var v=typeof o==="string"?o:o[0],l=typeof o==="string"?o:o[1];return '<option value="'+esc(v)+'" '+(String(v)===String(value)?"selected":"")+'>'+esc(l)+'</option>';}).join("")+'</select></div>';}
function notes(value){return '<div class="field wide"><label>Notes</label><textarea name="notes" placeholder="Add job details, customer requests, or next steps...">'+esc(value||"")+'</textarea></div>';}
function leadOptions(selected){return [["","No linked lead"]].concat(db.leads.map(function(l){return [l.id,l.name+" · "+(l.service||"Tree service")];}));}
function modal(){
 if(!ui.modal)return "";
 var head="",sub="",body="",foot="";
 if(ui.modal==="lead"){
  var l=leadBy(ui.id)||{};
  head=ui.id?"Edit lead":"Add a new lead";sub="Record the information you need to follow up.";
  body='<form id="lead-form"><div class="field-grid">'+input("name","Customer name",l.name,"text",{required:true,wide:true,placeholder:"First and last name"})+input("phone","Phone number",l.phone,"tel",{placeholder:"(201) 555-0100"})+input("email","Email address",l.email,"email")+input("address","Property / service address",l.address,"text",{wide:true,placeholder:"Street, city, state"})+input("service","Requested service",l.service,"text",{wide:true,placeholder:"Tree trimming, removal, stump grinding..."})+pick("source","Lead source",l.source||"Website",["Website","Google","Phone","Referral","Facebook","Other"])+pick("stage","Pipeline stage",l.stage||"New lead",STAGES)+notes(l.notes)+'</div></form>';
  foot=btn("data-close","Cancel","")+ '<button type="submit" form="lead-form" class="btn btn-primary">'+icon("check",15)+' Save lead</button>';
 }else if(ui.modal==="lead-detail"){
  var ld=leadBy(ui.id);if(!ld)return "";
  head=ld.name;sub=ld.service||"Tree service lead";
  var step=nextStep(ld),linkPhone=String(ld.phone||"").replace(/[^0-9+]/g,"");
  body='<div class="detail-meta">'+badge(ld.stage)+badge(ld.source||"Unknown source")+'<span class="pill">Added '+dateFmt(ld.created)+'</span></div><div class="detail-note"><b>Property:</b> '+esc(ld.address||"Not provided")+'<br><b>Phone:</b> '+esc(ld.phone||"Not provided")+'<br><b>Email:</b> '+esc(ld.email||"Not provided")+'<br><b>Notes:</b> '+esc(ld.notes||"No notes yet")+'</div>'
   +'<div class="contact-actions">'+(linkPhone?'<a class="btn" href="tel:'+encodeURIComponent(linkPhone)+'">'+icon("phone",15)+' Call</a><a class="btn" href="sms:'+encodeURIComponent(linkPhone)+'">'+icon("message",15)+' Text</a>':"")+btn('data-edit-lead="'+esc(ld.id)+'"',icon("file",15)+" Edit details","")+'</div>'
   +'<div class="detail-section">Where is this lead?</div><div class="status-track">'+STAGES.map(function(s){return '<button data-move-lead="'+esc(ld.id)+'" data-move-stage="'+esc(s)+'" class="'+(ld.stage===s?"selected":"")+'">'+esc(s)+'</button>';}).join("")+'</div>'
   +'<div class="detail-section">Contact outcome</div><div class="quick-actions">'+btn('data-contact="noanswer" data-id="'+esc(ld.id)+'"',icon("clock",15)+" No answer → follow-up","btn-soft")+btn('data-contact="answered" data-id="'+esc(ld.id)+'"',icon("check",15)+" Customer answered","")+'</div>'
   +'<div class="detail-section">Follow-up timeline</div><p class="small-caption">The schedule starts on the date you mark <b>No answer</b>. Mark a step done when you actually reach out. No messages are sent automatically.</p>'
   +(ld.followStart?'<div class="detail-meta" style="margin-top:12px">'+badge(ld.followPaused?"Paused":step?"Active sequence":"Sequence complete")+'<span class="pill">Started '+dateFmt(ld.followStart)+'</span></div><div class="quick-actions" style="margin:10px 0 5px">'+btn('data-toggle-follow="'+esc(ld.id)+'"',icon(ld.followPaused?"play":"pause",15)+(ld.followPaused?" Resume":" Pause")+" sequence","btn-sm")+'</div>':'<div style="margin-top:13px">'+btn('data-contact="noanswer" data-id="'+esc(ld.id)+'"',"Start follow-up timeline","btn-soft")+'</div>')
   +'<div class="divider"></div>'
   +CADENCE.map(function(s,i){var done=(ld.steps||[]).includes(i),date=ld.followStart?addDays(ld.followStart,s.day):"",due=date&&date<=dayDate(0);return '<div class="follow-item"><div class="step-num" style="background:'+(done?"#7daf89":i===step?.i?"#173e2e":"#bdcec1")+'">'+(done?icon("check",14):(i+1))+'</div><div class="follow-info"><strong>Day '+s.day+' · '+esc(s.channel)+'</strong><p>'+esc(s.message.replace(/\{name\}/g,ld.name.split(" ")[0]))+'</p><p style="color:'+(due&&!done?"#a97632":"#a2ada4")+'">'+(date?dateFmt(date)+(done?" · Completed":due?" · Due":" · Upcoming"):"Starts after first unanswered contact")+'</p></div>'+(ld.followStart?btn('data-step="'+esc(ld.id)+'" data-index="'+i+'"',done?"Undo":"Done","btn-sm"):"")+'</div>';}).join("");
  foot=btn('data-modal="estimate" data-prelead="'+esc(ld.id)+'"',"Create estimate","")+btn('data-modal="job" data-prelead="'+esc(ld.id)+'"',"Create job","btn-primary");
 }else if(ui.modal==="estimate"){
  var e=db.estimates.find(function(v){return v.id===ui.id;})||{};
  var selectedLead=leadBy(e.leadId||ui.prelead||"");
  head=ui.id?"Edit estimate":"New estimate";sub="Record an amount and its current status.";
  body='<form id="estimate-form"><div class="field-grid">'+pick("leadId","Linked lead",e.leadId||ui.prelead||"",leadOptions(),true)+input("name","Customer name",e.name||selectedLead?.name,"text",{required:true,wide:true})+input("service","Work being quoted",e.service||selectedLead?.service,"text",{required:true,wide:true})+input("amount","Estimate value ($)",e.amount||"","number",{required:true,min:0})+pick("status","Estimate status",e.status||(ui.datePrefill?"Visit scheduled":"Draft"),EST_STATUS,true)+input("date","Date quote prepared",e.date||dayDate(0),"date")+input("visitDate","On-site estimate date",e.visitDate||ui.datePrefill||"","date")+input("visitTime","Estimate arrival time",e.visitTime||"","time")+input("assignedCrew","Assigned estimator",e.assignedCrew||"","text",{wide:true,placeholder:"Who is going to the property?"})+notes(e.notes)+'</div></form>';
  foot=(ui.id?btn('data-delete-estimate="'+esc(ui.id)+'"',"Delete","btn-danger"):"")+btn("data-close","Cancel","")+'<button type="submit" form="estimate-form" class="btn btn-primary">Save estimate</button>';
  if(ui.id&&e.status==="Accepted"&&!db.jobs.some(function(j){return j.estimateId===e.id;}))body+='<div class="sequence-explain" style="margin-top:16px"><div>'+icon("check",19)+'</div><div><strong>Estimate accepted</strong><p>Create a job below when this work is ready to be scheduled.</p>'+btn('data-create-job-from-estimate="'+esc(e.id)+'"',"Create job","btn-sm btn-soft")+'</div></div>';
 }else if(ui.modal==="job"){
  var j=jobBy(ui.id)||{};var linked=leadBy(j.leadId||ui.prelead||"");
  head=ui.id?"Edit job":"Add a job";sub="Schedule work and keep track of total job value.";
  body='<form id="job-form"><div class="field-grid">'+pick("leadId","Linked lead",j.leadId||ui.prelead||"",leadOptions(),true)+input("name","Customer name",j.name||linked?.name,"text",{required:true,wide:true})+input("service","Type of work",j.service||linked?.service,"text",{required:true,wide:true})+input("address","Job address",j.address||linked?.address,"text",{wide:true})+input("amount","Job total ($)",j.amount||"","number",{required:true,min:0})+input("date","Job date",j.date||ui.datePrefill||dayDate(1),"date")+input("time","Arrival time",j.time||"","time")+input("crew","Assigned crew",j.crew||"","text",{wide:true,placeholder:"Crew name or team members"})+pick("status","Job status",j.status||"Scheduled",JOB_STATUS,true)+notes(j.notes)+'</div></form>';
  if(ui.id)body+='<div class="divider"></div><div class="detail-section">Payments collected for this job</div><div style="font-size:25px;font-weight:850;color:var(--green)">'+dollars(paid(j.id))+' <span style="font-size:12px;color:#879b8d;font-weight:600">of '+dollars(j.amount)+'</span></div><div class="progress-track" style="margin-bottom:18px"><div class="progress-fill" style="width:'+Math.min(100,Number(j.amount)>0?paid(j.id)/Number(j.amount)*100:0)+'%"></div></div>'+btn('data-modal="payment" data-jobref="'+esc(j.id)+'"',icon("plus",14)+" Record payment","btn-soft")+'<div class="mini-list" style="margin-top:15px">'+db.payments.filter(function(p){return p.jobId===j.id;}).map(function(p){return '<div class="mini-row"><div><strong>'+dateFmt(p.date)+'</strong><div class="identity-sub">'+esc(p.note||"Payment")+'</div></div><div class="right-meta"><strong>'+dollars(p.amount)+'</strong><div style="margin-top:5px">'+btn('data-delete-payment="'+esc(p.id)+'"',"Remove","btn-sm btn-danger")+'</div></div></div>';}).join("")+'</div>';
  foot=(ui.id?btn('data-delete-job="'+esc(ui.id)+'"',"Delete","btn-danger"):"")+btn("data-close","Cancel","")+'<button type="submit" form="job-form" class="btn btn-primary">Save job</button>';
 }else if(ui.modal==="payment"){
  var payJob=jobBy(ui.jobref);if(!payJob)return "";
  head="Record a payment";sub=payJob.name+" · "+payJob.service;
  body='<div class="sequence-explain"><div>'+icon("dollar",20)+'</div><div><strong>Amount remaining: '+dollars(Math.max(0,Number(payJob.amount)-paid(payJob.id)))+'</strong><p>Record deposits and final payments only after the money is received. This updates the Money Collected dashboard total.</p></div></div><form id="payment-form"><div class="field-grid">'+input("amount","Payment amount ($)","","number",{required:true,min:0})+input("date","Payment received",dayDate(0),"date")+input("note","Description","Deposit","text",{wide:true})+'</div></form>';
  foot=btn("data-close","Cancel","")+'<button type="submit" form="payment-form" class="btn btn-primary">Record payment</button>';
 }
 return '<div class="modal-overlay" data-overlay><div class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><div class="drawer-header"><div><h2 id="drawer-title">'+esc(head)+'</h2><p>'+esc(sub)+'</p></div><button class="close-btn" aria-label="Close" data-close>'+icon("x",18)+'</button></div><div class="drawer-body">'+body+'</div><div class="drawer-footer">'+foot+'</div></div></div>';
}
function render(){
 var html={home:home,leads:leads,calendar:calendar,followups:followups,estimates:estimates,jobs:jobs,settings:settings};
 document.getElementById("app").innerHTML=shell((html[ui.page]||home)());
 document.body.style.overflow=ui.modal?"hidden":"";
}
function toast(s){var div=document.createElement("div");div.className="toast-item";div.textContent=s;document.getElementById("toast").appendChild(div);setTimeout(function(){div.remove();},3500);}
function setStage(l,stage){if(!STAGES.includes(stage))return;l.stage=stage;if(["Won","Lost"].includes(stage))l.followPaused=true;if(stage==="Follow-up"&&!l.followStart){l.followStart=dayDate(0);l.steps=[];l.followPaused=false;}save();toast("Lead moved to "+stage);}
function contact(l,outcome){if(outcome==="noanswer"){l.stage="Follow-up";if(!l.followStart||l.followPaused){l.followStart=dayDate(0);l.steps=[];}l.followPaused=false;save();toast("Follow-up timeline started");}else{l.stage="Contacted";l.followPaused=true;save();toast("Contact recorded. Follow-up paused.");}}
function getForm(form){var obj={};new FormData(form).forEach(function(v,k){obj[k]=String(v).trim();});return obj;}
function download(name,text,type){var blob=new Blob([text],{type:type||"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(function(){URL.revokeObjectURL(url);},2000);}
document.addEventListener("click",function(ev){
 var e=ev.target,el=e.closest("[data-page]");if(el){ui.page=el.dataset.page;ui.mobile=false;ui.query="";ui.modal="";ui.datePrefill="";render();if(typeof window!=="undefined"&&window.scrollTo)window.scrollTo(0,0);return;}
 el=e.closest("[data-quick-job]");if(el){var j=jobBy(el.dataset.quickJob);if(j){j.status=j.status==="Scheduled"?"In progress":j.status==="In progress"?"Completed":j.status;save();toast(j.status==="In progress"?"Work started":"Job marked complete");}return;}
 el=e.closest("[data-calendar-day]");if(el){ui.calendarDay=el.dataset.calendarDay;render();return;}
 el=e.closest("[data-calendar-shift]");if(el){var d=new Date(ui.calendarDay+"T12:00:00"),c=new Date(d.getFullYear(),d.getMonth()+Number(el.dataset.calendarShift),1);ui.calendarDay=c.getFullYear()+"-"+String(c.getMonth()+1).padStart(2,"0")+"-01";render();return;}
 if(e.closest("[data-calendar-today]")){ui.calendarDay=dayDate(0);render();return;}
 if(e.closest("[data-menu]")){ui.mobile=!ui.mobile;render();return;}
 if(e.closest("[data-close-menu]")){ui.mobile=false;render();return;}
 if(e.closest("[data-close]")||(e.matches("[data-overlay]"))){ui.modal="";ui.id="";ui.prelead="";ui.jobref="";render();return;}
 el=e.closest("[data-modal]");if(el){ui.modal=el.dataset.modal;ui.id="";ui.prelead=el.dataset.prelead||"";ui.jobref=el.dataset.jobref||"";ui.datePrefill=el.dataset.prefillDate||"";render();return;}
 el=e.closest("[data-lead]");if(el){ui.id=el.dataset.lead;ui.modal="lead-detail";render();return;}
 el=e.closest("[data-edit-lead]");if(el){ui.id=el.dataset.editLead;ui.modal="lead";render();return;}
 el=e.closest("[data-estimate]");if(el){ui.id=el.dataset.estimate;ui.modal="estimate";render();return;}
 el=e.closest("[data-job]");if(el){ui.id=el.dataset.job;ui.modal="job";render();return;}
 el=e.closest("[data-move-lead]");if(el){var l=leadBy(el.dataset.moveLead);if(l){setStage(l,el.dataset.moveStage);}return;}
 el=e.closest("[data-contact]");if(el){var lead=leadBy(el.dataset.id);if(lead)contact(lead,el.dataset.contact);return;}
 el=e.closest("[data-toggle-follow]");if(el){var l1=leadBy(el.dataset.toggleFollow);if(l1){l1.followPaused=!l1.followPaused;save();toast(l1.followPaused?"Follow-up paused":"Follow-up resumed");}return;}
 el=e.closest("[data-step]");if(el){var l2=leadBy(el.dataset.step),i=Number(el.dataset.index);if(l2&&l2.followStart&&i>=0&&i<CADENCE.length){l2.steps=l2.steps||[];if(l2.steps.includes(i)){l2.steps=l2.steps.filter(function(n){return n!==i;});}else l2.steps.push(i);save();toast("Follow-up task updated");}return;}
 el=e.closest("[data-create-job-from-estimate]");if(el){var x=db.estimates.find(function(k){return k.id===el.dataset.createJobFromEstimate;});if(x){var linked=leadBy(x.leadId);db.jobs.push({id:uid("j"),estimateId:x.id,leadId:x.leadId||"",name:x.name,service:x.service,address:linked?.address||"",amount:x.amount,date:dayDate(1),status:"Scheduled",notes:"Created from accepted estimate"});ui.id="";ui.modal="";ui.page="jobs";save();toast("Job created from estimate");}return;}
 el=e.closest("[data-delete-payment]");if(el){var pid=el.dataset.deletePayment,pmt=db.payments.find(function(p){return p.id===pid;});if(pmt&&confirm("Remove this payment record?")){var pj=jobBy(pmt.jobId);db.payments=db.payments.filter(function(p){return p.id!==pid;});if(pj&&pj.status==="Paid"&&paid(pj.id)<Number(pj.amount))pj.status="Completed";save();toast("Payment record removed");}return;}
 el=e.closest("[data-delete-estimate]");if(el){if(confirm("Delete this estimate?")){db.estimates=db.estimates.filter(function(v){return v.id!==el.dataset.deleteEstimate;});ui.modal="";save();toast("Estimate deleted");}return;}
 el=e.closest("[data-delete-job]");if(el){var jobid=el.dataset.deleteJob;if(db.payments.some(function(p){return p.jobId===jobid;})){toast("Remove linked payments before deleting a paid job.");return;}if(confirm("Delete this job?")){db.jobs=db.jobs.filter(function(v){return v.id!==jobid;});ui.modal="";save();toast("Job deleted");}return;}
 el=e.closest("[data-clear-demo]");if(el){if(confirm("Remove all leads, estimates, jobs, and payments in this browser? Export a backup first if needed.")){db={version:1,demo:false,leads:[],estimates:[],jobs:[],payments:[]};ui.modal="";save();toast("Workspace cleared");}return;}
 el=e.closest("[data-export]");if(el){download("glasford-command-center-backup.json",JSON.stringify(db,null,2));toast("Backup exported");return;}
 el=e.closest("[data-export-csv]");if(el){var keys=["name","phone","email","address","service","source","stage","created","notes"],csv=[keys.join(",")].concat(db.leads.map(function(l){return keys.map(function(k){return '"'+String(l[k]||"").replace(/"/g,'""')+'"';}).join(",");})).join("\r\n");download("glasford-leads.csv",csv,"text/csv");toast("Lead CSV exported");return;}
});
document.addEventListener("change",function(ev){
 var el=ev.target;if(el.matches("[data-stage]")){var l=leadBy(el.dataset.stage);if(l)setStage(l,el.value);return;}
 if(el.matches("[data-search]")){ui.query=el.value;render();return;}
 if(el.matches("[data-lead-filter]")){ui.leadFilter=el.value;render();return;}
 if(el.id==="json-file"&&el.files[0]){var reader=new FileReader();reader.onload=function(){try{var imported=JSON.parse(reader.result);if(!imported||!Array.isArray(imported.leads)||!Array.isArray(imported.jobs)||!Array.isArray(imported.estimates)||!Array.isArray(imported.payments))throw Error("Invalid backup structure");if(confirm("Replace all current browser data with this backup?")){db=imported;save();toast("Backup restored");}}catch(err){toast("Could not read this backup JSON");}};reader.readAsText(el.files[0]);}
});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&ui.modal){ui.modal="";render();}if(e.key==="Enter"&&e.target.matches("[data-search]")){ui.query=e.target.value;render();}});
document.addEventListener("submit",function(ev){
 var form=ev.target;if(!["lead-form","estimate-form","job-form","payment-form"].includes(form.id))return;ev.preventDefault();var v=getForm(form);
 if(form.id==="lead-form"){
  if(!v.name){toast("Please enter a customer name");return;}
  var l=leadBy(ui.id);
  if(l){Object.assign(l,{name:v.name,phone:v.phone,email:v.email,address:v.address,service:v.service,source:v.source,stage:v.stage,notes:v.notes});if(["Won","Lost"].includes(v.stage))l.followPaused=true;}
  else{db.leads.unshift({id:uid("l"),name:v.name,phone:v.phone,email:v.email,address:v.address,service:v.service,source:v.source,stage:v.stage,created:dayDate(0),notes:v.notes,followStart:v.stage==="Follow-up"?dayDate(0):"",followPaused:false,steps:[]});}
  ui.modal="";ui.id="";save();toast("Lead saved");return;
 }
 if(form.id==="estimate-form"){
  var a=Number(v.amount);if(!validAmount(a)||!v.name||!v.service){toast("Check the amount and required fields");return;}
  if(v.status==="Visit scheduled"&&!v.visitDate){toast("Choose the on-site estimate date");return;}
  var e=db.estimates.find(function(x){return x.id===ui.id;});
  if(e)Object.assign(e,{leadId:v.leadId,name:v.name,service:v.service,amount:a,date:v.date,status:v.status,visitDate:v.visitDate||"",visitTime:v.visitTime||"",assignedCrew:v.assignedCrew||"",notes:v.notes});
  else db.estimates.unshift({id:uid("e"),leadId:v.leadId,name:v.name,service:v.service,amount:a,date:v.date,status:v.status,visitDate:v.visitDate||"",visitTime:v.visitTime||"",assignedCrew:v.assignedCrew||"",notes:v.notes});
  var lead=leadBy(v.leadId);if(lead&&v.status==="Visit scheduled"&&lead.stage!=="Won"){lead.stage="Estimate scheduled";lead.followPaused=true;}
  if(lead&&v.status==="Sent"&&lead.stage!=="Won"){lead.stage="Estimate sent";lead.followPaused=true;}
  if(lead&&v.status==="Accepted"){lead.stage="Won";lead.followPaused=true;}
  ui.modal="";ui.id="";save();toast("Estimate saved");return;
 }
 if(form.id==="job-form"){
  var a=Number(v.amount);if(!validAmount(a)||!v.name||!v.service){toast("Check the amount and required fields");return;}
  var j=jobBy(ui.id);
  if(!v.date){toast("Choose the job date");return;}
  if(j&&a<paid(j.id)){toast("Job total cannot be lower than payments already received");return;}
  if(v.status==="Paid"&&(!j||paid(j.id)<a)){toast("Record full payment before marking a job paid");return;}
  if(j)Object.assign(j,{leadId:v.leadId,name:v.name,service:v.service,address:v.address,amount:a,date:v.date,time:v.time||"",crew:v.crew||"",status:v.status,notes:v.notes});
  else db.jobs.unshift({id:uid("j"),leadId:v.leadId,name:v.name,service:v.service,address:v.address,amount:a,date:v.date,time:v.time||"",crew:v.crew||"",status:v.status,notes:v.notes});
  ui.modal="";ui.id="";save();toast("Job saved");return;
 }
 if(form.id==="payment-form"){
  var j=jobBy(ui.jobref),amount=Number(v.amount);
  if(!j||!validAmount(amount)||amount<=0){toast("Enter a valid payment amount");return;}
  var outstanding=Math.max(0,Number(j.amount)-paid(j.id));
  if(amount>outstanding){toast("Payment exceeds this job's remaining balance");return;}
  db.payments.unshift({id:uid("p"),jobId:j.id,amount:amount,date:v.date||dayDate(0),note:v.note||"Payment"});
  if(amount>=outstanding)j.status="Paid";
  ui.modal="job";ui.id=j.id;ui.jobref="";save();toast("Payment recorded");return;
 }
});
document.addEventListener("dragstart",function(e){var tile=e.target.closest("[data-drag-id]");if(tile&&e.dataTransfer){e.dataTransfer.setData("text/plain",tile.dataset.dragId);e.dataTransfer.effectAllowed="move";}});
document.addEventListener("dragover",function(e){var target=e.target.closest("[data-drop-stage]");if(target){e.preventDefault();target.classList.add("drag-over");}});
document.addEventListener("dragleave",function(e){var target=e.target.closest("[data-drop-stage]");if(target&&!target.contains(e.relatedTarget))target.classList.remove("drag-over");});
document.addEventListener("drop",function(e){var target=e.target.closest("[data-drop-stage]");if(target){e.preventDefault();var id=e.dataTransfer.getData("text/plain"),l=leadBy(id);if(l)setStage(l,target.dataset.dropStage);}});
document.addEventListener("dragend",function(){document.querySelectorAll(".drag-over").forEach(function(el){el.classList.remove("drag-over");});});
render();
})();
