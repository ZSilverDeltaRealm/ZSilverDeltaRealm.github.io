const PINKEY = "sd-desk-pin";
const UNLOCK = "sd-desk-open";

function unlockDesk() {
  const gate = document.getElementById("gate");
  const pinEl = document.getElementById("gate-pin");
  const copy = document.getElementById("gate-copy");
  const go = document.getElementById("gate-go");
  if (!gate) return;
  const saved = localStorage.getItem(PINKEY);
  if (sessionStorage.getItem(UNLOCK) === "1") {
    gate.hidden = true;
    return;
  }
  copy.textContent = saved ? "Enter desk code." : "Set a desk code for this phone.";
  go.onclick = () => {
    const v = (pinEl.value || "").replace(/\D/g, "");
    if (v.length < 4) {
      copy.textContent = "Use 4–8 digits.";
      return;
    }
    if (!saved) {
      localStorage.setItem(PINKEY, v);
      sessionStorage.setItem(UNLOCK, "1");
      gate.hidden = true;
      return;
    }
    if (v === saved) {
      sessionStorage.setItem(UNLOCK, "1");
      gate.hidden = true;
      return;
    }
    copy.textContent = "Wrong code.";
    pinEl.value = "";
  };
  pinEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") go.click();
  });
}
unlockDesk();

const SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const LONG = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const ON = [2,3,5,6];
const KEY = "sd-desk-v2";
const MEMBERS = [
  {id:"M001", short:"Forge"},
  {id:"M002", short:"Colin"},
  {id:"M003", short:"Kass"},
  {id:"M004", short:"Troy"},
];
const NAMES = {NE:"Patriots",SEA:"Seahawks",SF:"49ers",LAR:"Rams",ATL:"Falcons",PIT:"Steelers",BAL:"Ravens",IND:"Colts",BUF:"Bills",HOU:"Texans",CHI:"Bears",CAR:"Panthers",CLE:"Browns",JAX:"Jaguars",NO:"Saints",DET:"Lions",NYJ:"Jets",TEN:"Titans",TB:"Buccaneers",CIN:"Bengals",ARI:"Cardinals",LAC:"Chargers",GB:"Packers",MIN:"Vikings",MIA:"Dolphins",LV:"Raiders",WSH:"Commanders",PHI:"Eagles",DAL:"Cowboys",NYG:"Giants",DEN:"Broncos",KC:"Chiefs"};
const WEEK1 = [
  ["401872656","2026-09-09","8:20 PM ET","NE","SEA","NBC"],
  ["401872657","2026-09-10","8:35 PM ET","SF","LAR","Netflix"],
  ["401872658","2026-09-13","1:00 PM ET","ATL","PIT","FOX"],
  ["401872659","2026-09-13","1:00 PM ET","BAL","IND","CBS"],
  ["401872660","2026-09-13","1:00 PM ET","BUF","HOU","CBS"],
  ["401872661","2026-09-13","1:00 PM ET","CHI","CAR","FOX"],
  ["401872922","2026-09-13","1:00 PM ET","CLE","JAX","CBS"],
  ["401872923","2026-09-13","1:00 PM ET","NO","DET","FOX"],
  ["401872924","2026-09-13","1:00 PM ET","NYJ","TEN","CBS"],
  ["401872925","2026-09-13","1:00 PM ET","TB","CIN","FOX"],
  ["401872926","2026-09-13","4:25 PM ET","ARI","LAC","CBS"],
  ["401872927","2026-09-13","4:25 PM ET","GB","MIN","CBS"],
  ["401872928","2026-09-13","4:25 PM ET","MIA","LV","FOX"],
  ["401872929","2026-09-13","4:25 PM ET","WSH","PHI","FOX"],
  ["401872930","2026-09-13","8:20 PM ET","DAL","NYG","NBC"],
  ["401872931","2026-09-14","8:15 PM ET","DEN","KC","ESPN"],
];
const COMING = [
  ["2026-09-07","Family cookout — dad shops food"],
  ["2026-09-07","Mow lawn 9:45 AM"],
  ["2026-09-08","Trash out Tuesday night"],
  ["2026-09-09","Dispatch close · Pats at SEA"],
  ["2026-09-14","Trash + recycle Week B"],
  ["2026-09-20","Kass $20 W3+W4"],
  ["2026-09-27","Jeep front tires"],
  ["2026-09-30","MA inspection"],
];
const SEED = [
  {id:"i01",title:"Empty bedroom and bathroom bins",due:"2026-09-06",status:"inbox"},
  {id:"i02",title:"Orange Taunton bag / kitchen bin",due:"2026-09-06",status:"inbox"},
  {id:"i03",title:"Fold dried laundry",due:"2026-09-06",status:"inbox"},
  {id:"i04",title:"Finish bathroom clean",due:"2026-09-06",status:"inbox"},
  {id:"i07",title:"Mow lawn Monday 9:45",due:"2026-09-07",status:"inbox"},
  {id:"i08",title:"Family cookout",due:"2026-09-07",status:"inbox"},
  {id:"i11",title:"Kass $20 Wednesday — confirm only",due:"2026-09-09",status:"parked"},
  {id:"i12",title:"Jeep front tires",due:"2026-09-27",status:"inbox"},
  {id:"i13",title:"MA inspection",due:"2026-09-30",status:"inbox"},
];

function ny() {
  const p = new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",weekday:"short",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
  const g = t => p.find(x=>x.type===t).value;
  return { weekday: SHORT.indexOf(g("weekday")), ymd:`${g("year")}-${g("month")}-${g("day")}`, hm:`${g("hour")}:${g("minute")}` };
}
function clock(hm){ const [h,m]=hm.split(":").map(Number); const h12=((h+11)%12)+1; return `${h12}:${String(m).padStart(2,"0")} ${h<12?"AM":"PM"}`; }
function daysUntil(ymd, today){ return Math.round((Date.parse(ymd+"T12:00:00-04:00")-Date.parse(today+"T12:00:00-04:00"))/86400000); }
function dlab(n){ return n===0?"today":n===1?"tomorrow":n<0?`${-n}d ago`:`in ${n}d`; }
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch{ return {}; } }
function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
function state(){
  const s = load();
  if (!s.inbox) s.inbox = SEED;
  if (!s.picks) s.picks = {};
  if (!s.check) s.check = [{id:"c1",label:"Shower",done:false},{id:"c2",label:"Brush teeth",done:false},{id:"c3",label:"Work prep",done:false}];
  return s;
}

let ROOM = "today";
let MEMBER = "M001";
let TAB = "board";

function fileLine(title){
  const s = state();
  s.inbox = [{id:"in-"+Date.now(), title, status:"inbox"}, ...s.inbox];
  save(s); render();
}
function setPick(mid, gid, side){
  const s = state();
  s.picks[mid] = s.picks[mid] || {};
  s.picks[mid][gid] = side;
  save(s); render();
}
function done(id){
  const s = state();
  s.inbox = s.inbox.map(r => r.id===id ? {...r,status:"done"} : r);
  save(s); render();
}

function hero(n){
  const work = ON.includes(n.weekday);
  const tomorrow = (n.weekday+1)%7;
  const sleep = ON.includes(tomorrow) ? "Midnight" : "1–2 AM";
  const s = state();
  const due = s.inbox.filter(r=>r.status==="inbox" && r.due && r.due<=n.ymd);
  const fp = s.picks.M001 || {};
  const pn = Object.keys(fp).length;
  return `<span class="kicker">${work?"KAC van":"Home block"}</span>
    <h2>${work?"Work day":"Day off"}</h2>
    <p class="muted">${work?"Punch 9:45 AM → 7:45 PM":"No punch. Desk, yard, realm."}</p>
    <div class="hero-grid">
      <div class="stat"><span>Wake</span><b>7:30 AM</b></div>
      <div class="stat"><span>Tonight</span><b>${sleep}</b></div>
      <div class="stat"><span>Due now</span><b>${due.length}</b></div>
      <div class="stat"><span>Forge picks</span><b>${pn}/16</b></div>
    </div>`;
}

function viewToday(n){
  const s = state();
  const due = s.inbox.filter(r=>r.status==="inbox" && r.due && r.due<=n.ymd);
  const fp = s.picks.M001 || {};
  const ticks = WEEK1.map(g=>`<i class="${fp[g[0]]?"on":""}"></i>`).join("");
  const dueHtml = due.length ? `<div class="card"><h3>Due today / overdue</h3>${due.map(r=>`<div class="due-row"><span>${r.title}</span><button onclick="done('${r.id}')">Done</button></div>`).join("")}</div>` : "";
  return `<div class="rail">
      <div><span class="muted">Pats</span><b>${dlab(daysUntil("2026-09-09",n.ymd))}</b></div>
      <div><span class="muted">Kass $20</span><b>${dlab(daysUntil("2026-09-20",n.ymd))}</b></div>
      <div><span class="muted">Tires</span><b>${dlab(daysUntil("2026-09-27",n.ymd))}</b></div>
    </div>
    ${dueHtml}
    <div class="grid-2">
      <div class="card"><h3>Coming</h3><ul>${COMING.filter(c=>c[0]>=n.ymd).slice(0,6).map(c=>`<li><span class="when">${c[0].slice(5)}</span> — ${c[1]}</li>`).join("")}</ul></div>
      <div class="card"><h3>Locked</h3><ul><li>Dad $50: No</li><li>Kass next cash 2026-09-20</li><li>Night desk look</li></ul></div>
    </div>
    <div class="card"><h3>NerdTrack · Week 1</h3>
      <div class="ticks">${ticks}</div>
      <p>Pats at Seahawks Wed 8:20 PM. Your pick: <b>${fp["401872656"]?NAMES[fp["401872656"]==="away"?"NE":"SEA"]:"none yet"}</b></p>
      <p><a href="#" data-go="track">Open the pool board</a></p>
    </div>`;
}

function viewInbox(){
  const s = state();
  const rows = s.inbox.filter(r=>r.status!=="done");
  return `<h2>Inbox</h2><div class="card"><ul>${rows.map(r=>`<li>${r.title} <span class="muted">${r.due||""} ${r.status}</span> <button onclick="done('${r.id}')">Done</button></li>`).join("")||"<li>Empty</li>"}</ul></div>`;
}

function viewTrack(){
  const s = state();
  const mine = s.picks[MEMBER] || {};
  const tabs = `<p>${MEMBERS.map(m=>`<button data-mem="${m.id}">${m.short}</button>`).join(" ")}
    <button data-tab="board">Board</button> <button data-tab="sheet">Sheet</button></p>
    <p class="muted">Filing for ${MEMBER}. ${Object.keys(mine).length}/16 in.</p>`;
  if (TAB==="sheet"){
    const head = `<tr><th>Game</th>${MEMBERS.map(m=>`<th>${m.short}</th>`).join("")}</tr>`;
    const body = WEEK1.map(g=>`<tr><td>${g[3]}@${g[4]}</td>${MEMBERS.map(m=>{const p=(s.picks[m.id]||{})[g[0]]; return `<td>${p?(p==="away"?g[3]:g[4]):"·"}</td>`;}).join("")}</tr>`).join("");
    return `<h2>NerdTrack</h2>${tabs}<div class="card sheet"><table>${head}${body}</table></div>`;
  }
  const games = WEEK1.map(g=>{
    const p = mine[g[0]];
    return `<li class="card"><div class="muted">${g[1]} · ${g[2]}</div>
      <div class="pickgrid">
        <button class="pick ${p==="away"?"on":""}" data-gid="${g[0]}" data-side="away">${g[3]} ${NAMES[g[3]]}</button>
        <button class="pick ${p==="home"?"on":""}" data-gid="${g[0]}" data-side="home">${g[4]} ${NAMES[g[4]]}</button>
      </div></li>`;
  }).join("");
  return `<h2>NerdTrack</h2>${tabs}<ul>${games}</ul>`;
}

function viewWork(){
  const s = state();
  return `<h2>Work</h2><div class="card"><p>On: Tue Wed Fri Sat · Off: Sun Mon Thu</p><p>10-hr 9:45 AM–7:45 PM · Wed close 9:00 PM</p></div>
    <div class="card"><h3>Morning checklist</h3><ul>${s.check.map(c=>`<li><button data-ck="${c.id}">${c.done?"✓":"○"} ${c.label}</button></li>`).join("")}</ul></div>`;
}
function viewMoney(){
  return `<h2>Money</h2><div class="card"><p>Last stub Fri 9/4 · net $1,065.60 · 401k 4%</p></div>
    <div class="card"><h3>Kass</h3><p>$20 every two NFL weeks. Paid W1+W2 9/6. Next 9/20.</p><p class="muted">Wednesday dump is confirm-only.</p></div>`;
}
function viewHouse(){
  return `<h2>House Book</h2><div class="card"><p>Taunton. Ozzie. Cleo. Dad · Darian · Kass.</p><p class="muted">Tree seed stays in the House Book pack. No invented relatives.</p></div>
    <div class="card"><h3>Jeep</h3><p>Tires by 9/27 · inspect by 9/30</p></div>`;
}
function viewSlots(){
  return `<h2>Open slots</h2><div class="card"><h3>To_Do Plus</h3><textarea id="plus" rows="5" placeholder="TO DO\n- "></textarea><p><button id="fileplus">File into Inbox</button></p></div>`;
}

function render(){
  const n = ny();
  document.getElementById("clock").innerHTML = `<div class="day">${LONG[n.weekday]}</div><div>${n.ymd} · ${clock(n.hm)} ET</div>`;
  document.getElementById("week").innerHTML = SHORT.map((name,i)=>`<div class="wd${ON.includes(i)?" on":""}${i===n.weekday?" now":""}">${name}</div>`).join("");
  document.getElementById("rooms").innerHTML = ["today","inbox","work","money","track","house","slots"].map(r=>`<button data-room="${r}" class="${ROOM===r?"on":""}">${r==="track"?"NerdTrack":r[0].toUpperCase()+r.slice(1)}</button>`).join("");
  document.getElementById("hero").innerHTML = ROOM==="today" ? hero(n) : "";
  const panel = {
    today: () => viewToday(n),
    inbox: viewInbox,
    work: viewWork,
    money: viewMoney,
    track: viewTrack,
    house: viewHouse,
    slots: viewSlots,
  }[ROOM]();
  document.getElementById("panel").innerHTML = panel;
}

document.getElementById("rooms").addEventListener("click", e=>{
  const b = e.target.closest("button"); if(!b) return; ROOM=b.dataset.room; render();
});
document.getElementById("capture").addEventListener("submit", e=>{
  e.preventDefault();
  const v = document.getElementById("cap").value.trim();
  if(!v) return; fileLine(v); document.getElementById("cap").value="";
});
document.getElementById("panel").addEventListener("click", e=>{
  const go = e.target.closest("[data-go]"); if(go){ e.preventDefault(); ROOM=go.dataset.go; render(); return; }
  const mem = e.target.closest("[data-mem]"); if(mem){ MEMBER=mem.dataset.mem; render(); return; }
  const tab = e.target.closest("[data-tab]"); if(tab){ TAB=tab.dataset.tab; render(); return; }
  const pk = e.target.closest("[data-gid]"); if(pk){ setPick(MEMBER, pk.dataset.gid, pk.dataset.side); return; }
  const ck = e.target.closest("[data-ck]"); if(ck){
    const s=state(); s.check=s.check.map(c=>c.id===ck.dataset.ck?{...c,done:!c.done}:c); save(s); render();
  }
  if(e.target.id==="fileplus"){
    const text = document.getElementById("plus").value;
    const lines = text.split(/\n/).map(x=>x.replace(/^[-*]\s*/,"").trim()).filter(x=>x && !/^(TO DO|NOTES|BUDGET|DATES)/i.test(x));
    lines.forEach(fileLine);
  }
});
window.done = done;
render();
setInterval(render, 30000);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
