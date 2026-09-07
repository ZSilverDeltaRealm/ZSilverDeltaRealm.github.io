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
const DESK_VER = "2.2";
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
  if (!s.pack) s.pack = {
    wake:"07:30", punchIn:"09:45", punchOut:"19:45", wedOut:"21:00",
    workDays:[2,3,5,6], kassNext:"2026-09-20", tiresDate:"2026-09-27",
    inspectDate:"2026-09-30", patsDate:"2026-09-09",
    houseNote:"Taunton. Ozzie. Cleo. Dad · Darian · Kass.",
    moneyNote:"Kass $10/wk · $20 every two NFL weeks. Next 2026-09-20.",
    coming: COMING.map(c=>({date:c[0], title:c[1]})),
    reup:["Coke","Plates","Dog food","Cat food"],
    bits:[{id:"bit-form",title:"Google Form / To_Do Plus",body:"Paste four sections. Empty skip."},{id:"bit-stat",title:"Stat Sheet / Expo",body:"Paste in Forge → Expo. Do not invent stats."}],
    scripts:[{id:"sc-reset",name:"Reset morning checks",kind:"resetChecks",payload:""}],
    habits:[{id:"h-pet",label:"Pet food — Ozzie + Cleo",dates:[]},{id:"h-bird",label:"Kaytee bird mix",dates:[]}],
    nights:[],
    expo:null,
    tests:[],
    growth:[],
    copy:{}
  };
  if (!s.pack.habits) s.pack.habits = [{id:"h-pet",label:"Pet food — Ozzie + Cleo",dates:[]},{id:"h-bird",label:"Kaytee bird mix",dates:[]}];
  if (!s.pack.tests) s.pack.tests = [];
  if (!s.pack.growth) s.pack.growth = [];
  if (!s.pack.copy) s.pack.copy = {};
  if (!s.log) s.log = [];
  return s;
}

const COPY_DEF = {
  realm:"Silver Delta Realm", face:"Clerk", desk:"Night desk",
  "room.today":"Today","room.inbox":"Inbox","room.work":"Work","room.money":"Money",
  "room.track":"NerdTrack","room.trackShort":"Track","room.house":"House","room.forge":"Forge",
  "room.map":"Map","room.expo":"Expo"
};
function t(key){
  const c = (state().pack && state().pack.copy) || {};
  const v = c[key];
  if (typeof v === "string" && v.trim()) return v.trim();
  return COPY_DEF[key] || key;
}

let ROOM = "today";
let MEMBER = "M001";
let TAB = "board";
let FTAB = "guide";

function fileLine(title){
  const s = state();
  const n = ny();
  function log(kind, text){ s.log = [{id:"lg-"+Date.now(), ymd:n.ymd, hm:n.hm, kind, text}, ...(s.log||[])].slice(0,200); }
  if (title === "/done") {
    const first = s.inbox.find(r=>r.status==="inbox" && r.due && r.due<=n.ymd);
    if (first) { s.inbox = s.inbox.map(r => r.id===first.id ? {...r,status:"done"} : r); log("inbox", "Done "+first.title); }
    save(s); render(); return;
  }
  if (title.startsWith("/check ")) {
    s.check = s.check || [];
    s.check.push({id:"ck-"+Date.now(), label:title.slice(7).trim(), done:false});
    log("check", title.slice(7).trim());
    save(s); render(); return;
  }
  if (title.startsWith("/coming ")) {
    const m = title.slice(8).trim().match(/^(\d{4}-\d{2}-\d{2})\s+(.+)/);
    if (m) { s.pack.coming.push({date:m[1], title:m[2]}); s.pack.coming.sort((a,b)=>a.date.localeCompare(b.date)); log("coming", m[2]); save(s); render(); }
    return;
  }
  if (title.startsWith("/night ")) {
    const ymd = n.ymd;
    s.pack.nights = [{date:ymd, body:title.slice(7).trim()}, ...(s.pack.nights||[]).filter(x=>x.date!==ymd)];
    log("night", title.slice(7).trim());
    save(s); render(); return;
  }
  if (title.startsWith("/habit ")) {
    s.pack.habits = s.pack.habits || [];
    s.pack.habits.push({id:"hb-"+Date.now(), label:title.slice(7).trim(), dates:[]});
    log("habit", title.slice(7).trim());
    save(s); render(); return;
  }
  s.inbox = [{id:"in-"+Date.now(), title, status:"inbox"}, ...s.inbox];
  log("inbox", title);
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

function toMin(hm){ const [h,m]=hm.split(":").map(Number); return h*60+m; }
function beatOf(n, p){
  const now = toMin(n.hm);
  const wake = toMin(p.wake||"07:30");
  const pin = toMin(p.punchIn||"09:45");
  const work = (p.workDays||ON).includes(n.weekday);
  const out = toMin(n.weekday===3 ? (p.wedOut||"21:00") : (p.punchOut||"19:45"));
  if (now < wake) return {label:"Night watch", kicker: work?"Work morning coming":"Home morning coming", hint:"File it. Sleep it.", next:"Wake "+clock(p.wake||"07:30")};
  if (work && now < pin) return {label:"Morning prep", kicker:"KAC van", hint:"Checks, then punch.", next:"Punch "+clock(p.punchIn||"09:45")};
  if (work && now < out) return {label: n.weekday===3?"Dispatch close":"On shift", kicker:"KAC van", hint:"Night desk after punch.", next:"Out "+clock(n.weekday===3?(p.wedOut||"21:00"):(p.punchOut||"19:45"))};
  if (now >= 22*60) return {label:"Wind down", kicker: work?"After punch":"Home night", hint:"Lights out midnight if work tomorrow, else 1–2 AM.", next:"Sleep"};
  if (work) return {label:"Night desk", kicker:"After punch", hint:"Inbox, picks, house.", next:"Wind down"};
  return {label:"Home block", kicker:"Day off", hint:"Desk, yard, realm. No punch.", next:"Night"};
}
function hero(n){
  const s = state();
  const p = s.pack;
  const b = beatOf(n, p);
  const due = s.inbox.filter(r=>r.status==="inbox" && r.due && r.due<=n.ymd);
  const fp = s.picks.M001 || {};
  const pn = Object.keys(fp).length;
  return `<span class="kicker">${b.kicker}</span>
    <h2>${b.label}</h2>
    <p class="muted">${b.hint}</p>
    <div class="hero-grid">
      <div class="stat"><span>Next</span><b>${b.next}</b></div>
      <div class="stat"><span>Wake</span><b>${clock(p.wake||"07:30")}</b></div>
      <div class="stat"><span>Due now</span><b>${due.length}</b></div>
      <div class="stat"><span>Forge picks</span><b>${pn}/16</b></div>
    </div>`;
}

function viewToday(n){
  const s = state();
  const p = s.pack;
  const due = s.inbox.filter(r=>r.status==="inbox" && r.due && r.due<=n.ymd);
  const fp = s.picks.M001 || {};
  const ticks = WEEK1.map(g=>`<i class="${fp[g[0]]?"on":""}"></i>`).join("");
  const dueHtml = due.length ? `<div class="card"><h3>Due today / overdue</h3>${due.map(r=>`<div class="due-row"><span>${r.title}</span><button onclick="done('${r.id}')">Done</button></div>`).join("")}</div>` : "";
  const coming = (p.coming||[]).filter(c=>c.date>=n.ymd).slice(0,6);
  const habits = (p.habits||[]).map(h=>{
    const on = (h.dates||[]).includes(n.ymd);
    return `<li><button data-habit="${h.id}">${on?"✓":"○"} ${h.label}</button></li>`;
  }).join("");
  const night = (p.nights||[]).find(x=>x.date===n.ymd);
  return `<div class="rail">
      <div><span class="muted">Pats</span><b>${dlab(daysUntil(p.patsDate,n.ymd))}</b></div>
      <div><span class="muted">Kass $20</span><b>${dlab(daysUntil(p.kassNext,n.ymd))}</b></div>
      <div><span class="muted">Tires</span><b>${dlab(daysUntil(p.tiresDate,n.ymd))}</b></div>
    </div>
    <div class="card" id="wx-card"><h3>Sky</h3><p class="muted">Taunton · Little Compton — loading</p></div>
    ${dueHtml}
    <div class="card"><h3>Habits</h3><ul>${habits}</ul></div>
    <div class="card"><h3>Night log</h3><p>${night?night.body:"One line — use /night …"}</p></div>
    ${(p && (s.log||[]).length)?`<div class="card"><h3>Ledger</h3><ul>${s.log.slice(0,5).map(r=>`<li><span class="when">${clock(r.hm)}</span> ${r.text}</li>`).join("")}</ul></div>`:""}
    <div class="grid-2">
      <div class="card"><h3>Coming</h3><ul>${coming.map(c=>`<li><span class="when">${c.date.slice(5)}</span> — ${c.title}</li>`).join("")}</ul></div>
      <div class="card"><h3>Locked</h3><ul><li>Dad $50: No</li><li>Kass next cash ${p.kassNext}</li><li>Night desk look</li></ul></div>
    </div>
    <div class="card"><h3>NerdTrack · Week 1</h3>
      <div class="ticks">${ticks}</div>
      <p>Pats at Seahawks. Your pick: <b>${fp["401872656"]?NAMES[fp["401872656"]==="away"?"NE":"SEA"]:"none yet"}</b></p>
      <p><a href="#" data-go="track">Open the pool board</a></p>
    </div>
    <div class="card"><h3>Forge</h3><p class="muted">Guide, Life, Bits, Scripts, Expo, Pack — customize in the app. Same URL on phone and desktop.</p><p><a href="#" data-go="slots">Open Forge</a></p></div>`;
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
    <button data-tab="board">Board</button> <button data-tab="sheet">Sheet</button> <button data-tab="sox">Sox</button> <button data-tab="pats">Pats</button></p>
    <p class="muted">Filing for ${MEMBER}. ${Object.keys(mine).length}/16 in.</p>`;
  if (TAB==="sheet"){
    const head = `<tr><th>Game</th>${MEMBERS.map(m=>`<th>${m.short}</th>`).join("")}</tr>`;
    const body = WEEK1.map(g=>`<tr><td>${g[3]}@${g[4]}</td>${MEMBERS.map(m=>{const p=(s.picks[m.id]||{})[g[0]]; return `<td>${p?(p==="away"?g[3]:g[4]):"·"}</td>`;}).join("")}</tr>`).join("");
    return `<h2>NerdTrack</h2>${tabs}<div class="card sheet"><table>${head}${body}</table></div>`;
  }
  if (TAB==="sox"){
    return `<h2>NerdTrack</h2>${tabs}
      <div class="card"><h3>Pulse · W36 LIVE</h3>
        <p>Sox 4–0 this week · swept BAL 15–6 · season OPS .727 ERA 3.60</p>
        <p>Remaining: LAA at Fenway 9/7 · 9/8 · 9/9</p>
        <p class="muted">W37 NEXT = KC Fenway 11–13 · at TEX 15–16. Schedule only. No invented scores.</p>
      </div>
      <div class="card"><h3>Week OPS (boxscores)</h3>
        <ul><li>Adley Rutschman 1.083</li><li>Jahmai Jones 1.000</li><li>Mickey Gasper .925</li><li>Eli White .875</li></ul>
        <p class="muted">as_of 2026-09-07 · MLB Stats API</p>
      </div>`;
  }
  if (TAB==="pats"){
    return `<h2>NerdTrack</h2>${tabs}
      <div class="card"><h3>W01 DRAFT · at SEA</h3>
        <p>Wed 9/9 · 8:20 ET · Lumen · NBC. Leaders empty until FINAL.</p>
        <p>Roster: 53-man + IR + PS as of 9/6. Do not invent cuts.</p>
      </div>
      <div class="card"><h3>Injury · 9/6 report</h3>
        <ul><li>TreVeyon Henderson RB · DNP · ankle</li><li>Ben Brown C · DNP · knee</li><li>Christian Barmore DT · DNP · knee</li></ul>
      </div>
      <div class="card"><h3>Season</h3>
        <p>W2 PIT home · W3 @ JAX · W4 @ BUF · W10 DET Munich 9:30 · W11 BYE · W17/18 times TBD.</p>
      </div>`;
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

function viewMap(){
  const s = state();
  const tests = [
    ["t-today","Today — beat label matches the clock"],
    ["t-cap","Capture — file a line, it lands in Inbox"],
    ["t-sox","NerdTrack — Sox W36 is LIVE, W37 is NEXT only"],
    ["t-pats","NerdTrack — Season has 18 weeks, W11 BYE"],
    ["t-pack","Forge — download full desk JSON, version 1.4"],
    ["t-phone","Phone — Add to Home Screen, import the file"]
  ];
  const ticks = (s.pack.tests||[]);
  return `<h2>${t("room.map")}</h2>
    <div class="card"><h3>${t("realm")} · ${t("face")} · v${DESK_VER}</h3>
      <p>One desk. Sports, house, money sit under it. This phone is the same engine as the laptop. Database = this browser. Pack JSON is the file you move.</p>
      <p class="muted">Robinhood live pull is next. Connector auth expired. Do not invent a portfolio.</p>
    </div>
    <div class="card"><h3>Local test ${ticks.length}/${tests.length}</h3>
      <ul>${tests.map(([id,label])=>`<li><button data-test="${id}">${ticks.includes(id)?"✓":"○"} ${label}</button></li>`).join("")}</ul>
    </div>
    <div class="card"><h3>Import a desk file</h3>
      <p><input id="desk-file" type="file" accept="application/json,.json" /></p>
      <p class="muted">Download from laptop Forge → Pack, then pick it here.</p>
    </div>`;
}
function viewWork(){
  const s = state();
  const p = s.pack;
  const names=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const on = names.filter((_,i)=>p.workDays.includes(i)).join(" · ");
  return `<h2>Work</h2><div class="card"><p>On: ${on}</p><p>Punch ${p.punchIn}–${p.punchOut} · Wed close ${p.wedOut} · Wake ${p.wake}</p><p class="muted">Edit in Forge → Life.</p></div>
    <div class="card"><h3>Morning checklist</h3><ul>${s.check.map(c=>`<li><button data-ck="${c.id}">${c.done?"✓":"○"} ${c.label}</button></li>`).join("")}</ul></div>`;
}
function viewMoney(){
  if (sessionStorage.getItem("sd-vault-open") !== "1" && sessionStorage.getItem("sd-house-open") !== "1") {
    return `<h2>Money</h2>
      <div class="card"><h3>Vault</h3>
        <p class="muted">Same four digits as House. Coin book stays with Mint — not on this public page.</p>
        <p><input id="money-code" inputmode="numeric" maxlength="8" placeholder="Code" /></p>
        <p><button id="money-go">Open</button></p>
        <p class="muted" id="money-err"></p>
      </div>`;
  }
  const p = state().pack;
  return `<h2>Money</h2>
    <p><button id="money-lock">Lock</button></p>
    <div class="card"><h3>Mint — Keeper of the Seed</h3>
      <p>Mint strikes the seed. You keep the hammer.</p>
      <p class="muted">Last stub Fri 9/4 · net $1,065.60 · 401k 4%. Robinhood stale. VTI $12 queued — fill blank. Coin book is on the Clerk desk, not here.</p>
    </div>
    <div class="card"><h3>Kass</h3><p>${p.moneyNote}</p><p>Next cash ${p.kassNext}</p></div>`;
}
function viewHouse(){
  if (sessionStorage.getItem("sd-house-open") !== "1") {
    return `<h2>House Book</h2>
      <div class="card"><h3>Vault</h3>
        <p class="muted">Four digits. Screen lock — not encryption.</p>
        <p><input id="house-code" inputmode="numeric" maxlength="8" placeholder="Code" /></p>
        <p><button id="house-go">Open</button></p>
        <p class="muted" id="house-err"></p>
      </div>`;
  }
  const p = state().pack;
  return `<h2>House Book</h2>
    <p><button id="house-lock">Lock</button></p>
    <div class="card"><p>${p.houseNote}</p><p class="muted">Living house. Full 127-person archive is on the Clerk desk, not this public phone page.</p></div>
    <div class="card"><h3>Jeep</h3><p>Tires by ${p.tiresDate} · inspect by ${p.inspectDate}</p></div>
    <div class="card"><h3>Queue</h3><p>Stat Sheet Update Script / Expo. Do not bury.</p></div>`;
}
function viewSlots(){
  const s = state();
  const p = s.pack;
  const tabs = ["guide","life","bits","scripts","expo","words","pack"].map(t0=>`<button data-ftab="${t0}" class="${FTAB===t0?"on":""}">${t0[0].toUpperCase()+t0.slice(1)}</button>`).join(" ");
  let body = "";
  if (FTAB==="guide"){
    body = `<div class="card"><h3>What this desk is</h3><p>Clerk is the face. File first. Phone and desktop use the same site. Pack JSON moves Life/scripts between devices. Inbox and picks stay on that browser.</p></div>
      <div class="card"><h3>Where to edit</h3><ul><li>Life — wake, punch, work days, Kass, tires, coming dates</li><li>Bits — named open slots</li><li>Scripts — saved functions (file lines, add date, reset checks)</li><li>Pack — copy/paste JSON to the other device</li></ul></div>
      <div class="card"><h3>How you brief Clerk</h3><p>Name the room. Name the field. Give the exact text or date. Sunday is the build day.</p></div>`;
  } else if (FTAB==="life"){
    body = `<div class="card"><h3>Clock</h3>
      <p>Wake <input id="lf-wake" value="${p.wake}" /></p>
      <p>Punch in <input id="lf-in" value="${p.punchIn}" /></p>
      <p>10-hr out <input id="lf-out" value="${p.punchOut}" /></p>
      <p>Wed close <input id="lf-wed" value="${p.wedOut}" /></p>
      <p>Kass next <input id="lf-kass" value="${p.kassNext}" /></p>
      <p>Tires <input id="lf-tires" value="${p.tiresDate}" /></p>
      <p><button id="save-life">Save Life</button></p></div>
      <div class="card"><h3>Coming</h3>
        <p><input id="ev-date" type="date" /> <input id="ev-title" placeholder="Title" /> <button id="add-coming">Add</button></p>
        <ul>${p.coming.map((c,i)=>`<li><span class="when">${c.date}</span> ${c.title} <button data-dropc="${i}">Drop</button></li>`).join("")}</ul>
      </div>
      <div class="card"><h3>Notes</h3>
        <p>House</p><textarea id="lf-house" rows="3">${p.houseNote}</textarea>
        <p>Money</p><textarea id="lf-money" rows="3">${p.moneyNote}</textarea>
        <p><button id="save-life2">Save notes</button></p>
      </div>`;
  } else if (FTAB==="bits"){
    body = p.bits.map(b=>`<div class="card"><h3>${b.title}</h3><textarea data-bit="${b.id}" rows="4">${b.body}</textarea><p><button data-savebit="${b.id}">Save bit</button></p></div>`).join("")
      + `<div class="card"><h3>New bit</h3><p><input id="nb-title" placeholder="Name" /></p><textarea id="nb-body" rows="3"></textarea><p><button id="add-bit">Add bit</button></p></div>`;
  } else if (FTAB==="scripts"){
    body = `<div class="card"><h3>Run</h3>${p.scripts.map(sc=>`<p>${sc.name} <button data-runsc="${sc.id}">Run</button></p>`).join("")}<p class="muted" id="sc-msg"></p></div>
      <div class="card"><h3>New script</h3>
        <p><input id="ns-name" placeholder="Name" /></p>
        <p><select id="ns-kind"><option value="fileInbox">File inbox lines</option><option value="addComing">Add coming date</option><option value="addCheck">Add checklist</option><option value="resetChecks">Reset checks</option><option value="expo">Apply stat sheet</option><option value="note">Saved note</option></select></p>
        <textarea id="ns-pay" rows="4" placeholder="Payload"></textarea>
        <p><button id="add-script">Save script</button></p>
      </div>`;
  } else if (FTAB==="expo"){
    const ex = p.expo;
    body = `<div class="card"><h3>Paste a sheet</h3>
      <textarea id="expo-raw" rows="7" placeholder="player,stat,value"></textarea>
      <p><button id="apply-expo">Apply sheet</button></p>
      <p class="muted">Clerk stores what you paste. No invented stats.</p></div>
      ${ex?`<div class="card"><h3>${ex.title||"Last"} · ${ex.at||""}</h3><p class="muted">${(ex.headers||[]).length} cols · ${(ex.rows||[]).length} rows</p></div>`:""}`;
  } else if (FTAB==="words"){
    const copy = p.copy || {};
    const keys = [["realm","Realm name"],["face","Face"],["desk","Desk title"],["room.today","Today"],["room.inbox","Inbox"],["room.work","Work"],["room.money","Money"],["room.track","NerdTrack"],["room.house","House"],["room.forge","Forge"],["room.map","Map"]];
    body = `<div class="card"><h3>Rename the desk</h3>
      <p class="muted">Empty = default. Saves on this phone. Other people keep the engine.</p>
      ${keys.map(([k,lab])=>`<p>${lab}<br/><input data-copy="${k}" value="${String(copy[k]||"").replace(/"/g,""")}" placeholder="${COPY_DEF[k]||""}" /></p>`).join("")}
      <p><button id="save-copy">Save words</button></p>
    </div>`;
  } else {
    body = `<div class="card"><h3>To_Do Plus</h3><textarea id="plus" rows="5" placeholder="TO DO\n- "></textarea><p><button id="fileplus">File into Inbox</button></p></div>
      <div class="card"><h3>Export pack</h3><textarea id="pack-out" rows="8" readonly></textarea><p class="muted">Life only.</p></div>
      <div class="card"><h3>Export full desk v${DESK_VER}</h3><textarea id="desk-out" rows="8" readonly></textarea><p class="muted">Inbox, picks, gas, ledger. Copy onto the other device.</p></div>
      <div class="card"><h3>Import pack</h3>
        <p><input id="desk-file" type="file" accept="application/json,.json" /></p>
        <textarea id="pack-in" rows="6" placeholder="Paste SD-Pack JSON"></textarea>
        <p><button id="apply-pack">Apply pack</button></p>
      </div>`;
  }
  return `<h2>Forge</h2><p>${tabs}</p>${body}`;
}

function loadWx(){
  const el = document.getElementById("wx-card");
  if (!el) return;
  const sites = [{n:"Taunton",lat:41.9001,lon:-71.0898},{n:"Little Compton",lat:41.51,lon:-71.1714}];
  Promise.all(sites.map(s => fetch(`https://api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lon}&daily=weather_code,temperature_2m_max,precipitation_probability_max&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=7`).then(r=>r.json()).then(j=>({s,j}))))
    .then(rows => {
      el.innerHTML = `<h3>Sky · week</h3>` + rows.map(({s,j}) => {
        const d = j.daily;
        return `<p><b>${s.n}</b></p><ul>` + d.time.map((t,i) => `<li>${t.slice(5)} · ${d.precipitation_probability_max[i]}% · ${Math.round(d.temperature_2m_max[i])}°</li>`).join("") + `</ul>`;
      }).join("");
    })
    .catch(() => { el.innerHTML = `<h3>Sky</h3><p class="muted">Weather did not load.</p>`; });
}

function render(){
  const n = ny();
  document.getElementById("clock").innerHTML = `<div class="day">${LONG[n.weekday]}</div><div>${clock(n.hm)} ET</div>`;
  const brand = document.querySelector(".eyebrow");
  if (brand && !brand.closest("#gate")) brand.textContent = `${t("realm")} · ${t("face")} · v${DESK_VER}`;
  const h1 = document.querySelector(".sky h1");
  if (h1) h1.textContent = t("desk");
  document.getElementById("week").innerHTML = SHORT.map((name,i)=>`<div class="wd${ON.includes(i)?" on":""}${i===n.weekday?" now":""}">${name}</div>`).join("");
  document.getElementById("rooms").innerHTML = ["today","inbox","work","money","track","house","map","slots"].map(r=>`<button data-room="${r}" class="${ROOM===r?"on":""}">${r==="track"?t("room.trackShort"):r==="slots"?t("room.forge"):r==="map"?t("room.map"):t("room."+r)}</button>`).join("");
  document.getElementById("hero").innerHTML = ROOM==="today" ? hero(n) : "";
  const panel = {
    today: () => viewToday(n),
    inbox: viewInbox,
    work: viewWork,
    money: viewMoney,
    track: viewTrack,
    house: viewHouse,
    map: viewMap,
    slots: viewSlots,
  }[ROOM]();
  document.getElementById("panel").innerHTML = panel;
  if (ROOM==="today") loadWx();
  if (ROOM==="slots" && FTAB==="pack") {
    const el = document.getElementById("pack-out");
    if (el) el.value = JSON.stringify(state().pack, null, 2);
    const de = document.getElementById("desk-out");
    const st = state();
    if (de) de.value = JSON.stringify({v:2, version:DESK_VER, at:ny().ymd, pack:st.pack, inbox:st.inbox, checklist:st.check, gas:st.gas||[], picks:st.picks, results:{}, log:st.log||[]}, null, 2);
  }
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
  const ftab = e.target.closest("[data-ftab]"); if(ftab){ FTAB=ftab.dataset.ftab; render(); return; }
  const pk = e.target.closest("[data-gid]"); if(pk){ setPick(MEMBER, pk.dataset.gid, pk.dataset.side); return; }
  const ck = e.target.closest("[data-ck]"); if(ck){
    const s=state(); s.check=s.check.map(c=>c.id===ck.dataset.ck?{...c,done:!c.done}:c); save(s); render();
  }
  const hb = e.target.closest("[data-habit]");
  if(hb){
    const s=state();
    const ymd = ny().ymd;
    s.pack.habits = (s.pack.habits||[]).map(h=>{
      if(h.id!==hb.dataset.habit) return h;
      const on = (h.dates||[]).includes(ymd);
      return {...h, dates: on ? h.dates.filter(d=>d!==ymd) : [...(h.dates||[]), ymd]};
    });
    save(s); render();
  }
  if(e.target.id==="fileplus"){
    const text = document.getElementById("plus").value;
    const lines = text.split(/\n/).map(x=>x.replace(/^[-*]\s*/,"").trim()).filter(x=>x && !/^(TO DO|NOTES|BUDGET|DATES)/i.test(x));
    lines.forEach(fileLine);
  }
  if(e.target.id==="save-life" || e.target.id==="save-life2"){
    const s=state();
    const g=id=> (document.getElementById(id)||{}).value;
    if (document.getElementById("lf-wake")) {
      s.pack.wake=g("lf-wake"); s.pack.punchIn=g("lf-in"); s.pack.punchOut=g("lf-out");
      s.pack.wedOut=g("lf-wed"); s.pack.kassNext=g("lf-kass"); s.pack.tiresDate=g("lf-tires");
    }
    if (document.getElementById("lf-house")) {
      s.pack.houseNote=g("lf-house"); s.pack.moneyNote=g("lf-money");
    }
    save(s); render();
  }
  if(e.target.id==="add-coming"){
    const date=document.getElementById("ev-date").value;
    const title=document.getElementById("ev-title").value.trim();
    if(date&&title){ const s=state(); s.pack.coming.push({date,title}); s.pack.coming.sort((a,b)=>a.date.localeCompare(b.date)); save(s); render(); }
  }
  const dropc=e.target.closest("[data-dropc]");
  if(dropc){ const s=state(); s.pack.coming.splice(Number(dropc.dataset.dropc),1); save(s); render(); }
  const savebit=e.target.closest("[data-savebit]");
  if(savebit){
    const ta=document.querySelector(`[data-bit="${savebit.dataset.savebit}"]`);
    const s=state();
    s.pack.bits=s.pack.bits.map(b=>b.id===savebit.dataset.savebit?{...b,body:ta.value}:b);
    save(s); render();
  }
  if(e.target.id==="add-bit"){
    const title=document.getElementById("nb-title").value.trim();
    const body=document.getElementById("nb-body").value;
    if(title){ const s=state(); s.pack.bits.push({id:"bit-"+Date.now(),title,body}); save(s); render(); }
  }
  if(e.target.id==="add-script"){
    const name=document.getElementById("ns-name").value.trim();
    const kind=document.getElementById("ns-kind").value;
    const payload=document.getElementById("ns-pay").value;
    if(name){ const s=state(); s.pack.scripts.push({id:"sc-"+Date.now(),name,kind,payload}); save(s); render(); }
  }
  const runsc=e.target.closest("[data-runsc]");
  if(runsc){
    const s=state();
    const sc=s.pack.scripts.find(x=>x.id===runsc.dataset.runsc);
    if(sc && sc.kind==="resetChecks"){ s.check=s.check.map(c=>({...c,done:false})); save(s); render(); }
    if(sc && sc.kind==="addCheck" && sc.payload.trim()){ s.check.push({id:"ck-"+Date.now(),label:sc.payload.trim(),done:false}); save(s); render(); }
    if(sc && sc.kind==="fileInbox"){
      sc.payload.split(/\n/).map(x=>x.replace(/^[-*]\s*/,"").trim()).filter(x=>x).forEach(fileLine);
    }
    if(sc && sc.kind==="addComing"){
      const m=sc.payload.trim().match(/^(\d{4}-\d{2}-\d{2})\s+(.+)/);
      if(m){ s.pack.coming.push({date:m[1],title:m[2]}); save(s); render(); }
    }
  }
  if(e.target.id==="house-go"){
    const v = ((document.getElementById("house-code")||{}).value||"").replace(/\D/g,"");
    if (v === "2355") { sessionStorage.setItem("sd-house-open","1"); sessionStorage.setItem("sd-vault-open","1"); render(); }
    else {
      const err = document.getElementById("house-err");
      if (err) err.textContent = "Wrong code.";
    }
    return;
  }
  if(e.target.id==="house-lock"){
    sessionStorage.removeItem("sd-house-open");
    sessionStorage.removeItem("sd-vault-open");
    render();
    return;
  }
  if(e.target.id==="money-go"){
    const v = ((document.getElementById("money-code")||{}).value||"").replace(/\D/g,"");
    if (v === "2355") { sessionStorage.setItem("sd-vault-open","1"); sessionStorage.setItem("sd-house-open","1"); render(); }
    else {
      const err = document.getElementById("money-err");
      if (err) err.textContent = "Wrong code.";
    }
    return;
  }
  if(e.target.id==="money-lock"){
    sessionStorage.removeItem("sd-vault-open");
    sessionStorage.removeItem("sd-house-open");
    render();
    return;
  }
  if(e.target.id==="apply-expo"){
    const raw = (document.getElementById("expo-raw")||{}).value || "";
    const lines = raw.split(/\n/).map(x=>x.trimEnd()).filter(x=>x.trim());
    if(lines.length){
      const delim = lines[0].includes("\t") ? "\t" : ",";
      const headers = lines[0].split(delim);
      const rows = lines.slice(1,201).map(l=>l.split(delim));
      const s=state();
      s.pack.expo = { at: ny().ymd, title: "Phone dump", headers, rows, note:"" };
      save(s); render();
    }
  }
  const tst = e.target.closest("[data-test]");
  if (tst) {
    const s = state();
    const id = tst.dataset.test;
    s.pack.tests = s.pack.tests || [];
    s.pack.tests = s.pack.tests.includes(id) ? s.pack.tests.filter(x=>x!==id) : [...s.pack.tests, id];
    save(s); render();
    return;
  }
  if(e.target.id==="save-copy"){
    const s=state();
    s.pack.copy = s.pack.copy || {};
    document.querySelectorAll("[data-copy]").forEach(inp=>{ s.pack.copy[inp.dataset.copy]=inp.value; });
    save(s); render();
    return;
  }
  if(e.target.id==="apply-pack"){
    try{
      const next=JSON.parse(document.getElementById("pack-in").value);
      const s=state();
      if (next && next.v===2 && next.pack) {
        s.pack={...s.pack,...next.pack};
        if (next.inbox) s.inbox=next.inbox;
        if (next.picks) s.picks=next.picks;
        if (next.checklist) s.check=next.checklist;
        if (next.gas) s.gas=next.gas;
        if (next.log) s.log=next.log;
      } else {
        s.pack={...s.pack,...next};
      }
      save(s); render();
    }catch(err){ /* leave */ }
  }
});
document.getElementById("panel").addEventListener("change", e=>{
  const el = e.target;
  if (!el || el.id !== "desk-file" || !el.files || !el.files[0]) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const next = JSON.parse(String(reader.result||""));
      const s = state();
      if (next && next.v===2 && next.pack) {
        s.pack={...s.pack,...next.pack};
        if (next.inbox) s.inbox=next.inbox;
        if (next.picks) s.picks=next.picks;
        if (next.checklist) s.check=next.checklist;
        if (next.gas) s.gas=next.gas;
        if (next.log) s.log=next.log;
      } else if (next && typeof next === "object") {
        s.pack={...s.pack,...(next.pack||next)};
      }
      save(s); render();
    } catch (err) { /* leave */ }
  };
  reader.readAsText(el.files[0]);
});
window.done = done;
render();
setInterval(render, 30000);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
