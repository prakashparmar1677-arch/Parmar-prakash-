/* Pro Tournament demo prototype.
   Local browser storage only; do not use for real payments or public admin access. */
const $ = id => document.getElementById(id);
const STORAGE_KEY = "proTournament.demo.v1";
const ADMIN_PASSWORD = "ChangeMe123!"; // CHANGE THIS before demo use; not secure for public deployment.
const starter = [
 {id:"demo-1",name:"Rookie Solo Showdown",mode:"Solo",type:"Free",fee:0,prize:500,date:"",slots:48,status:"Open",rules:"Be on time. No hacks, teaming or abusive conduct.",room:"",roomPass:""},
 {id:"demo-2",name:"Squad Weekend Clash",mode:"Squad",type:"Paid",fee:20,prize:1500,date:"",slots:12,status:"Open",rules:"Demo listing only. Do not pay anyone; payment is not implemented.",room:"",roomPass:""}
];
let data = loadData(), isAdmin = false, selectedTournament = null;
function loadData(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const d=JSON.parse(raw);if(Array.isArray(d.tournaments)&&Array.isArray(d.registrations))return d;}}catch(e){}return {tournaments:starter.map(x=>({...x})),registrations:[]};}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));render();}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function dateText(v){if(!v)return "To be announced";const d=new Date(v);return Number.isNaN(d.getTime())?esc(v):d.toLocaleString([], {dateStyle:"medium",timeStyle:"short"});}
function money(n){return "₹"+Number(n||0).toLocaleString("en-IN");}
function toast(msg){$("toast").textContent=msg;$("toast").classList.remove("hidden");setTimeout(()=>$("toast").classList.add("hidden"),2600);}
function openModal(id){$(id).classList.remove("hidden");}
function closeModal(id){$(id).classList.add("hidden");}
function findTournament(id){return data.tournaments.find(t=>t.id===id);}
function render(){
 const filter=$("filter").value;
 const list=data.tournaments.filter(t=>filter==="all"||t.type===filter).slice().sort((a,b)=>(a.date||"").localeCompare(b.date||""));
 $("statTournaments").textContent=data.tournaments.length;
 $("tournamentList").innerHTML=list.length?list.map(t=>{
  const registered=data.registrations.filter(r=>r.tournamentId===t.id).length;
  const fee=t.type==="Free"?"FREE ENTRY":money(t.fee)+" ENTRY";
  return `<article class="tcard"><div class="pills"><span class="pill ${t.type==="Free"?"free":""}">${esc(fee)}</span><span class="pill">${esc(t.mode)}</span><span class="pill">${esc(t.status)}</span></div><h3>${esc(t.name)}</h3><p>${esc(t.rules||"Rules will be announced by the organiser.")}</p><div class="meta"><div><small>PRIZE POOL</small><b>${money(t.prize)}</b></div><div><small>START TIME</small><b>${dateText(t.date)}</b></div><div><small>PLAYERS / TEAMS</small><b>${registered} / ${esc(t.slots)}</b></div><div><small>ROOM DETAILS</small><b>${t.room?"Published":"Not published"}</b></div></div><button class="primary joinBtn" data-join="${esc(t.id)}" ${t.status!=="Open"||registered>=Number(t.slots)?"disabled":""}>${t.status==="Open"&&registered<Number(t.slots)?"Register now":"Registration closed"}</button></article>`;
 }).join(""):`<div class="empty">No tournaments in this filter yet. Check back soon.</div>`;
 document.querySelectorAll("[data-join]").forEach(b=>b.addEventListener("click",()=>startJoin(b.dataset.join)));
 if(isAdmin)renderAdmin();
}
function startJoin(id){const t=findTournament(id);if(!t)return;selectedTournament=t;$("joinTournamentId").value=id;$("joinTitle").textContent=`${t.name} · ${t.type==="Free"?"Free entry":money(t.fee)+" entry fee"}`;$("joinNote").textContent=t.type==="Paid"?"Paid event listing only. This demo does not accept payments; do not send money.": "Submitting registers your interest; check room details and organiser announcements."; $("joinResult").classList.add("hidden");$("joinForm").classList.remove("hidden");openModal("joinModal");}
$("joinForm").addEventListener("submit",e=>{e.preventDefault();const id=$("joinTournamentId").value,t=findTournament(id);if(!t||t.status!=="Open"){toast("Registration is closed.");return;}const uid=$("playerUid").value.trim();if(!/^[0-9]{5,20}$/.test(uid)){toast("Enter a numeric UID (5–20 digits).");return;}if(data.registrations.some(r=>r.tournamentId===id&&r.uid===uid)){toast("This UID is already registered for this tournament.");return;}if(data.registrations.filter(r=>r.tournamentId===id).length>=Number(t.slots)){toast("This tournament is full.");return;}data.registrations.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),tournamentId:id,name:$("playerName").value.trim(),uid,contact:$("playerContact").value.trim(),createdAt:new Date().toISOString()});save();$("joinForm").classList.add("hidden");$("joinResult").textContent="Registration saved in this browser demo. No payment was taken. Contact the organiser for next steps.";$("joinResult").classList.remove("hidden");});
$("filter").addEventListener("change",render);
$("adminToggle").addEventListener("click",()=>{openModal("adminModal");$("adminLoginArea").classList.toggle("hidden",isAdmin);$("adminArea").classList.toggle("hidden",!isAdmin);if(isAdmin)renderAdmin();});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
document.querySelectorAll(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m.id);}));
$("adminLoginForm").addEventListener("submit",e=>{e.preventDefault();if($("adminPassword").value===ADMIN_PASSWORD){isAdmin=true;$("adminLoginArea").classList.add("hidden");$("adminArea").classList.remove("hidden");$("adminPassword").value="";renderAdmin();}else toast("Incorrect demo password.");});
$("logout").addEventListener("click",()=>{isAdmin=false;$("adminArea").classList.add("hidden");$("adminLoginArea").classList.remove("hidden");toast("Logged out.");});
$("tType").addEventListener("change",()=>{if($("tType").value==="Free")$("tFee").value=0;else if(Number($("tFee").value)===0)$("tFee").value=20;});
$("createForm").addEventListener("submit",e=>{e.preventDefault();if(!isAdmin)return;const type=$("tType").value,fee=Number($("tFee").value);if(type==="Free"&&fee!==0){toast("Free tournament must have ₹0 entry.");return;}if(type==="Paid"&&fee<=0){toast("Paid tournament needs an entry amount.");return;}data.tournaments.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name:$("tName").value.trim(),mode:$("tMode").value,type,fee,prize:Number($("tPrize").value),date:$("tDate").value,slots:Number($("tSlots").value),status:$("tStatus").value,rules:$("tRules").value.trim(),room:$("tRoom").value.trim(),roomPass:$("tRoomPass").value.trim()});save();e.target.reset();$("tFee").value=0;$("tPrize").value=0;$("tSlots").value=48;toast("Tournament created.");});
function renderAdmin(){
 $("adminTournaments").innerHTML=data.tournaments.length?data.tournaments.map(t=>`<div class="adminitem"><div><strong>${esc(t.name)}</strong><small>${esc(t.type)} · ${esc(t.mode)} · ${esc(t.status)} · ${data.registrations.filter(r=>r.tournamentId===t.id).length} registrations</small></div><div><button class="outline" data-status="${esc(t.id)}">Cycle status</button> <button class="danger" data-delete="${esc(t.id)}">Delete</button></div></div>`).join(""):"<p class='muted'>No tournaments yet.</p>";
 document.querySelectorAll("[data-status]").forEach(b=>b.addEventListener("click",()=>{const t=findTournament(b.dataset.status);if(!t)return;t.status=({Open:"Full",Full:"Completed",Completed:"Open"})[t.status]||"Open";save();}));
 document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{const t=findTournament(b.dataset.delete);if(!t||!confirm(`Delete "${t.name}" and its registrations?`))return;data.tournaments=data.tournaments.filter(x=>x.id!==t.id);data.registrations=data.registrations.filter(r=>r.tournamentId!==t.id);save();}));
 const regs=data.registrations;
 $("adminRegistrations").innerHTML=regs.length?`<div class="tablewrap"><table><thead><tr><th>Tournament</th><th>Player</th><th>UID</th><th>Contact</th><th>Registered</th><th></th></tr></thead><tbody>${regs.map(r=>`<tr><td>${esc(findTournament(r.tournamentId)?.name||"Deleted tournament")}</td><td>${esc(r.name)}</td><td>${esc(r.uid)}</td><td>${esc(r.contact||"—")}</td><td>${dateText(r.createdAt)}</td><td><button class="danger" data-unreg="${esc(r.id)}">Remove</button></td></tr>`).join("")}</tbody></table></div>`:"<p class='muted'>No registrations yet.</p>";
 document.querySelectorAll("[data-unreg]").forEach(b=>b.addEventListener("click",()=>{data.registrations=data.registrations.filter(r=>r.id!==b.dataset.unreg);save();}));
}
$("exportData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="pro-tournament-backup.json";a.click();URL.revokeObjectURL(a.href);});
$("importData").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const d=JSON.parse(await file.text());if(!Array.isArray(d.tournaments)||!Array.isArray(d.registrations))throw Error("bad");data=d;save();toast("Backup imported.");}catch(err){toast("Invalid backup JSON.");}e.target.value="";});
$("resetData").addEventListener("click",()=>{if(!confirm("Reset all tournaments and registrations to demo data?"))return;data={tournaments:starter.map(x=>({...x})),registrations:[]};save();toast("Demo data reset.");});
render();