"use strict";
const EVENTS = [
  {id:1,name:"CodeStorm Hackathon",cat:"Tech",date:"2026-12-12T09:00",venue:"Tech Park Auditorium, Bhubaneswar",price:"Free",emoji:"💻",c:["#6c4cf1","#3b82f6"],desc:"A 24-hour hackathon where teams build innovative solutions to real-world problems. Mentors, snacks and prizes included.",short:"24-hour team hackathon with exciting prizes."},
  {id:2,name:"Rhythm Night Live",cat:"Music",date:"2026-12-20T18:30",venue:"Open Air Theatre, Cuttack",price:"₹499",emoji:"🎸",c:["#e84fa0","#f59e0b"],desc:"An electrifying evening of live bands, indie artists and a surprise headliner under the stars.",short:"Live bands and indie artists under the stars."},
  {id:3,name:"UI/UX Design Workshop",cat:"Workshop",date:"2027-01-08T10:00",venue:"Design Studio, KIIT Campus",price:"₹299",emoji:"🎨",c:["#14b8a6","#6366f1"],desc:"Hands-on workshop covering Figma, design thinking and building a portfolio-ready case study.",short:"Hands-on Figma and design thinking session."},
  {id:4,name:"Startup Pitch Summit",cat:"Business",date:"2027-01-18T11:00",venue:"Convention Centre, Bhubaneswar",price:"₹199",emoji:"🚀",c:["#f97316","#ef4444"],desc:"Watch early-stage founders pitch to investors, then network with entrepreneurs and mentors.",short:"Founders pitch to investors; network with mentors."},
  {id:5,name:"Inter-College Sports Meet",cat:"Sports",date:"2027-02-05T08:00",venue:"Kalinga Stadium, Bhubaneswar",price:"Free",emoji:"🏆",c:["#22c55e","#0ea5e9"],desc:"Cricket, football, badminton and athletics — compete or cheer for your college.",short:"Cricket, football, athletics and more."},
  {id:6,name:"Cultural Fest: Rang Utsav",cat:"Cultural",date:"2027-02-21T16:00",venue:"Rabindra Mandap, Bhubaneswar",price:"₹99",emoji:"🎭",c:["#a855f7","#ec4899"],desc:"Dance, drama, art and food stalls celebrating the colours of Odisha's culture.",short:"Dance, drama, art and food stalls."},
  {id:7,name:"AI & Data Science Bootcamp",cat:"Tech",date:"2027-03-06T10:00",venue:"Online (Zoom)",price:"₹399",emoji:"🤖",c:["#0ea5e9","#6c4cf1"],desc:"A beginner-friendly bootcamp on Python, machine learning basics and data storytelling.",short:"Python, ML basics and data storytelling."},
  {id:8,name:"Acoustic Sunday",cat:"Music",date:"2027-03-14T17:00",venue:"Cafe Verve, Bhubaneswar",price:"₹149",emoji:"🎤",c:["#f59e0b","#e84fa0"],desc:"A cosy open-mic and acoustic evening. Perform, or simply relax and enjoy.",short:"Cosy open-mic and acoustic evening."}
];
const $ = id => document.getElementById(id);
const KEY = "eventsphere_registrations";
let category = "All", current = null, timer = null;

const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = list => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} };
const fmtDate = d => new Date(d).toLocaleString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit"});
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const bg = e => `background:linear-gradient(135deg,${e.c[0]},${e.c[1]})`;

/* ---------- Theme ---------- */
function setTheme(t){ document.documentElement.dataset.theme = t; $("themeBtn").textContent = t === "dark" ? "☀️" : "🌙"; try{localStorage.setItem("eventsphere_theme",t);}catch{} }
let saved = null; try { saved = localStorage.getItem("eventsphere_theme"); } catch {}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
$("burger").onclick = () => $("menu").classList.toggle("open");
$("menu").onclick = () => $("menu").classList.remove("open");

/* ---------- Filters & grid ---------- */
const cats = ["All", ...new Set(EVENTS.map(e => e.cat))];
$("filters").innerHTML = cats.map(c => `<button class="chip${c==="All"?" active":""}" data-cat="${c}">${c}</button>`).join("");
$("filters").onclick = e => {
  const b = e.target.closest(".chip"); if (!b) return;
  category = b.dataset.cat;
  document.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x === b));
  render();
};
$("search").oninput = render;

function render(){
  const q = $("search").value.trim().toLowerCase();
  const list = EVENTS.filter(e => (category==="All" || e.cat===category) && (e.name+e.venue+e.desc+e.cat).toLowerCase().includes(q));
  $("grid").innerHTML = list.map((e,i) => `
    <article class="card" style="animation-delay:${i*60}ms">
      <div class="banner" style="${bg(e)}"><span class="tag">${e.cat}</span>${e.emoji}</div>
      <div class="card-body">
        <h3>${esc(e.name)}</h3>
        <div class="info">📅 ${fmtDate(e.date)}</div>
        <div class="info">📍 ${esc(e.venue)}</div>
        <p>${esc(e.short)}</p>
        <button class="btn" data-id="${e.id}">View Details &amp; Register</button>
      </div>
    </article>`).join("");
  $("empty").hidden = list.length > 0;
}
$("grid").onclick = e => { const b = e.target.closest("button[data-id]"); if (b) openModal(+b.dataset.id); };

/* ---------- Modal ---------- */
function openModal(id){
  current = EVENTS.find(e => e.id === id);
  $("mBanner").style.cssText = bg(current) + ";height:170px;display:grid;place-items:center;font-size:4rem;border-radius:20px 20px 0 0";
  $("mBanner").textContent = current.emoji;
  $("mCat").textContent = current.cat;
  $("mTitle").textContent = current.name;
  $("mDate").textContent = fmtDate(current.date);
  $("mVenue").textContent = current.venue;
  $("mPrice").textContent = current.price;
  $("mDesc").textContent = current.desc;
  $("eventSel").innerHTML = `<option value="">-- Select an event --</option>` + EVENTS.map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join("");
  $("eventSel").value = id;
  $("regForm").reset(); $("eventSel").value = id;
  clearErrors();
  $("regForm").hidden = false; $("success").hidden = true;
  $("modal").hidden = false; document.body.style.overflow = "hidden";
  startCountdown();
}
function closeModal(){ $("modal").hidden = true; document.body.style.overflow = ""; clearInterval(timer); }
$("closeBtn").onclick = closeModal; $("doneBtn").onclick = closeModal;
$("modal").onclick = e => { if (e.target === $("modal")) closeModal(); };
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("modal").hidden) closeModal(); });
$("eventSel").onchange = () => { const e = EVENTS.find(x => x.id === +$("eventSel").value); if (e){ current = e; $("mTitle").textContent = e.name; $("mDate").textContent = fmtDate(e.date); $("mVenue").textContent = e.venue; $("mPrice").textContent = e.price; $("mDesc").textContent = e.desc; $("mCat").textContent = e.cat; $("mBanner").style.background = bg(e).replace("background:",""); $("mBanner").textContent = e.emoji; startCountdown(); } };

function startCountdown(){
  clearInterval(timer);
  const tick = () => {
    let s = Math.floor((new Date(current.date) - Date.now()) / 1000);
    if (s <= 0){ $("countdown").innerHTML = "<p>This event has started or ended.</p>"; clearInterval(timer); return; }
    const p = [["Days",86400],["Hours",3600],["Mins",60],["Secs",1]].map(([l,n]) => { const v = Math.floor(s/n); s %= n; return `<div><b>${String(v).padStart(2,"0")}</b><span>${l}</span></div>`; });
    $("countdown").innerHTML = p.join("");
  };
  tick(); timer = setInterval(tick, 1000);
}

/* ---------- Validation ---------- */
const rules = {
  name:  v => !v ? "Please enter your name." : !/^[A-Za-z][A-Za-z .'-]{2,49}$/.test(v) ? "Use 3–50 letters only (no digits)." : "",
  email: v => !v ? "Please enter your email." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Enter a valid email, e.g. you@example.com." : "",
  phone: v => !v ? "Please enter your phone number." : !/^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s+/g,"").replace(/^(\+91)-?/,"$1")) ? "Enter a valid 10-digit mobile number (starts with 6–9)." : "",
  event: v => !v ? "Please select an event." : ""
};
const fields = {name:"name", email:"email", phone:"phone", event:"eventSel"};
function clearErrors(){ Object.keys(fields).forEach(k => { $(k+"Err").textContent = ""; $(fields[k]).classList.remove("invalid"); }); }
function check(k){ const el = $(fields[k]); const msg = rules[k](el.value.trim()); $(k+"Err").textContent = msg; el.classList.toggle("invalid", !!msg); return !msg; }
Object.keys(fields).forEach(k => $(fields[k]).addEventListener("blur", () => check(k)));

$("regForm").onsubmit = e => {
  e.preventDefault();
  const ok = Object.keys(fields).map(check).every(Boolean);
  if (!ok) return;
  const ev = EVENTS.find(x => x.id === +$("eventSel").value);
  const list = load();
  if (list.some(r => r.eventId === ev.id && r.email.toLowerCase() === $("email").value.trim().toLowerCase())){
    $("emailErr").textContent = "This email is already registered for this event."; $("email").classList.add("invalid"); return;
  }
  list.push({ eventId: ev.id, name: $("name").value.trim(), email: $("email").value.trim(), phone: $("phone").value.trim(), at: Date.now() });
  save(list);
  $("successMsg").textContent = `Thank you, ${$("name").value.trim()}! You are registered for "${ev.name}". A confirmation will be sent to ${$("email").value.trim()}.`;
  $("regForm").hidden = true; $("success").hidden = false;
  renderRegs();
};

/* ---------- My registrations ---------- */
function renderRegs(){
  const list = load();
  $("statReg").textContent = list.length;
  $("regList").innerHTML = list.length ? list.map((r,i) => {
    const ev = EVENTS.find(e => e.id === r.eventId);
    return `<div class="reg-item"><div><b>${ev ? esc(ev.name) : "Event"}</b><small>${esc(r.name)} · ${esc(r.email)} · ${esc(r.phone)}</small></div><button data-i="${i}">Cancel</button></div>`;
  }).join("") : `<p class="sub">You haven't registered for any events yet.</p>`;
}
$("regList").onclick = e => { const b = e.target.closest("button[data-i]"); if (!b) return; const l = load(); l.splice(+b.dataset.i,1); save(l); renderRegs(); };

$("statEvents").textContent = EVENTS.length;
render(); renderRegs();
