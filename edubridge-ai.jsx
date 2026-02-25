import { useState, useEffect, useRef } from "react";

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0d0d14;
    --paper: #f5f3ee;
    --saffron: #ff6b1a;
    --sky: #00c2ff;
    --lime: #b8ff47;
    --violet: #7c3aed;
    --rose: #ff3e7f;
    --gold: #ffd000;
    --card-bg: #ffffff;
    --muted: #6b7280;
    --border: #e5e2da;
    --sidebar-w: 240px;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
  }

  h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--saffron); border-radius: 99px; }

  /* Animations */
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: .6; }
    70%  { transform: scale(1.25); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes blobMove {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(.6); }
    to   { opacity: 1; transform: scale(1); }
  }

  .animate-up   { animation: slideUp .45s cubic-bezier(.16,1,.3,1) both; }
  .animate-fade { animation: fadeIn .4s ease both; }

  /* Card hover lift */
  .card {
    background: var(--card-bg);
    border-radius: 20px;
    border: 1.5px solid var(--border);
    transition: transform .2s, box-shadow .2s;
  }
  .card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.09); }

  /* Pill badge */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 600; letter-spacing: .04em;
    padding: 3px 10px; border-radius: 99px; text-transform: uppercase;
  }

  /* Button base */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
    padding: 11px 22px; border-radius: 12px; border: none; cursor: pointer;
    transition: transform .15s, box-shadow .15s, filter .15s;
  }
  .btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.12); }
  .btn:active { transform: scale(.97); }

  .btn-primary {
    background: var(--saffron); color: #fff;
  }
  .btn-ghost {
    background: transparent; color: var(--ink);
    border: 1.5px solid var(--border);
  }
  .btn-sky   { background: var(--sky);    color: #fff; }
  .btn-violet{ background: var(--violet); color: #fff; }
  .btn-lime  { background: var(--lime);   color: var(--ink); }

  /* Input */
  .input {
    width: 100%; padding: 12px 16px; border-radius: 12px;
    border: 1.5px solid var(--border); background: var(--paper);
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--ink); outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .input:focus { border-color: var(--saffron); box-shadow: 0 0 0 3px rgba(255,107,26,.15); }

  /* Sidebar */
  .sidebar {
    position: fixed; left: 0; top: 0; bottom: 0;
    width: var(--sidebar-w);
    background: var(--ink);
    display: flex; flex-direction: column;
    z-index: 100; padding: 28px 16px;
    border-right: 1px solid rgba(255,255,255,.06);
  }

  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 12px; cursor: pointer;
    color: rgba(255,255,255,.55); font-size: 14px; font-weight: 500;
    transition: background .15s, color .15s;
    border: none; background: transparent; width: 100%; text-align: left;
  }
  .nav-item:hover { background: rgba(255,255,255,.07); color: #fff; }
  .nav-item.active { background: var(--saffron); color: #fff; }

  /* Main content */
  .main { margin-left: var(--sidebar-w); padding: 36px 40px; min-height: 100vh; }

  /* Progress bar */
  .progress-bar {
    height: 8px; border-radius: 99px;
    background: var(--border); overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 99px;
    transition: width .6s cubic-bezier(.16,1,.3,1);
  }

  /* Stat card glow */
  .stat-glow::after {
    content: ''; position: absolute; inset: 0; border-radius: 20px;
    opacity: 0; transition: opacity .3s;
    background: radial-gradient(circle at 50% 0%, var(--accent-glow,rgba(255,107,26,.3)), transparent 70%);
  }
  .stat-glow:hover::after { opacity: 1; }

  /* Heatmap cell */
  .heatmap-cell {
    width: 36px; height: 36px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700;
    transition: transform .15s;
    cursor: default;
  }
  .heatmap-cell:hover { transform: scale(1.15); }

  /* Tag cloud */
  .tag {
    padding: 6px 14px; border-radius: 99px;
    font-size: 12px; font-weight: 600;
    display: inline-block; cursor: pointer;
    transition: transform .15s, box-shadow .15s;
  }
  .tag:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,.12); }

  /* Blob decoration */
  .blob {
    position: absolute; border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    animation: blobMove 7s ease-in-out infinite;
    filter: blur(0);
    pointer-events: none;
    z-index: 0;
  }

  /* Toast */
  .toast {
    position: fixed; bottom: 28px; right: 28px;
    background: var(--ink); color: #fff;
    padding: 14px 20px; border-radius: 14px;
    font-size: 14px; font-weight: 500;
    box-shadow: 0 8px 30px rgba(0,0,0,.2);
    z-index: 999;
    animation: slideUp .35s cubic-bezier(.16,1,.3,1) both;
    display: flex; align-items: center; gap: 10px;
  }
`;

// ─── ICONS (inline SVG helpers) ──────────────────────────────────────────────
const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  home:    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  book:    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  quiz:    "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  chart:   "M18 20V10 M12 20V4 M6 20v-6",
  map:     "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16 M16 6v16",
  speak:   "M11 5L6 9H2v6h4l5 4V5z M19.07 4.93a10 10 0 0 1 0 14.14 M15.54 8.46a5 5 0 0 1 0 7.07",
  logout:  "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  brain:   "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z",
  zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  user:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  check:   "M20 6L9 17l-5-5",
  translate:"M5 8l6 6 M4 14l6-6 2-2 M2 5h12 M7 2h1 M22 22l-5-10-5 10 M14 18h6",
  upload:  "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  award:   "M12 15l-2 5 2-1 2 1-2-5 M8.21 13.89A7 7 0 1 1 15.79 13.89",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard",    icon: "home"  },
  { id: "learn",     label: "Learn",         icon: "book"  },
  { id: "quiz",      label: "Quiz",           icon: "quiz"  },
  { id: "analytics", label: "Analytics",     icon: "chart" },
  { id: "roadmap",   label: "Roadmap",        icon: "map"   },
];

const statsData = [
  { label: "Topics Covered", value: "24", suffix: "", color: "#ff6b1a", bg: "#fff3ee", icon: "book"  },
  { label: "Quiz Score",     value: "87", suffix: "%", color: "#00c2ff", bg: "#e8f9ff", icon: "star"  },
  { label: "Weak Concepts",  value: "3",  suffix: "",  color: "#7c3aed", bg: "#f0ebff", icon: "brain" },
  { label: "Study Streak",   value: "12", suffix: "d", color: "#b8ff47", bg: "#f4ffe8", icon: "zap"   },
];

const heatmapData = [
  { topic: "Maths",     scores: [90, 45, 70, 85, 30, 60, 95] },
  { topic: "Physics",   scores: [60, 80, 35, 75, 90, 50, 65] },
  { topic: "Chemistry", scores: [40, 55, 80, 30, 70, 85, 45] },
  { topic: "CS",        scores: [95, 70, 55, 90, 40, 75, 80] },
  { topic: "English",   scores: [30, 50, 65, 45, 80, 35, 70] },
];

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const quizQuestions = [
  {
    q: "What does OOP stand for?",
    options: ["Object Oriented Programming","Only One Process","Open Object Platform","Ordered Operation Protocol"],
    ans: 0,
  },
  {
    q: "Which data structure uses LIFO?",
    options: ["Queue","Stack","Tree","Graph"],
    ans: 1,
  },
  {
    q: "TCP/IP stands for?",
    options: ["Transfer Control Protocol / Internet Protocol","Technical Computer Protocol / IP","Transmission Control Protocol / Internet Protocol","Transfer Copy Protocol / Internet Protocol"],
    ans: 2,
  },
];

const roadmapItems = [
  { title: "Python Basics",    status: "done",    color: "#b8ff47", weeks: "Week 1-2" },
  { title: "Data Structures",  status: "done",    color: "#b8ff47", weeks: "Week 3-4" },
  { title: "Algorithms",       status: "current", color: "#ff6b1a", weeks: "Week 5-6" },
  { title: "OOP Concepts",     status: "pending", color: "#00c2ff", weeks: "Week 7-8" },
  { title: "Web Fundamentals", status: "pending", color: "#7c3aed", weeks: "Week 9-10"},
  { title: "Projects & Portfolio", status: "pending", color: "#ff3e7f", weeks: "Week 11-12"},
];

// Score → heatmap colour
function heatColor(score) {
  if (score >= 80) return { bg: "#b8ff47", text: "#1a3300" };
  if (score >= 60) return { bg: "#ffd000", text: "#3a2a00" };
  if (score >= 40) return { bg: "#ff9966", text: "#3a1500" };
  return                  { bg: "#ff3e7f", text: "#fff"    };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

// Sidebar
function Sidebar({ active, setActive, role }) {
  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#ff6b1a,#ff3e7f)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Icon d={icons.brain} size={18} stroke="#fff" />
          </div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:"#fff", lineHeight:1 }}>EduBridge</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", letterSpacing:".1em", textTransform:"uppercase" }}>AI Platform</div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ marginBottom:24 }}>
        <span className="badge" style={{ background:"rgba(255,107,26,.18)", color:"#ff6b1a" }}>
          ● {role}
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
        {navItems.map(item => (
          <button key={item.id} className={`nav-item${active===item.id?" active":""}`}
            onClick={() => setActive(item.id)} aria-current={active===item.id?"page":undefined}>
            <Icon d={icons[item.icon]} size={16} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:16, marginTop:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{
            width:34, height:34, borderRadius:"50%",
            background:"linear-gradient(135deg,#7c3aed,#00c2ff)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:700, color:"#fff"
          }}>A</div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Arjun Kumar</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>arjun@edu.in</div>
          </div>
        </div>
        <button className="nav-item" style={{ width:"100%", fontSize:13 }}>
          <Icon d={icons.logout} size={14} /> Log out
        </button>
      </div>
    </aside>
  );
}

// Stat card
function StatCard({ stat, delay }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { setTimeout(() => setShown(true), delay); }, [delay]);
  return (
    <div className="card stat-glow" style={{
      padding:"22px 24px", position:"relative", overflow:"hidden",
      background: stat.bg,
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(20px)",
      transition: "opacity .45s, transform .45s",
      transitionDelay: `${delay}ms`,
    }} aria-label={`${stat.label}: ${stat.value}${stat.suffix}`}>
      <div style={{ position:"absolute", top:-12, right:-12, width:60, height:60,
        borderRadius:"50%", background: stat.color, opacity:.12 }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", color: stat.color, marginBottom:6 }}>{stat.label}</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:38, lineHeight:1, color: stat.color }}>
            {stat.value}<span style={{ fontSize:20 }}>{stat.suffix}</span>
          </div>
        </div>
        <div style={{ width:42, height:42, borderRadius:12, background: stat.color,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon d={icons[stat.icon]} size={20} stroke="#fff" />
        </div>
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

// Dashboard
function DashboardPage() {
  return (
    <div className="animate-up">
      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <span style={{ fontSize:28 }}>🌅</span>
          <h1 style={{ fontSize:28, fontWeight:800 }}>Good Morning, Arjun!</h1>
        </div>
        <p style={{ color:"var(--muted)", fontSize:15 }}>You have 3 weak concepts to review today. Let's bridge the gap!</p>
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
        {statsData.map((s, i) => <StatCard key={s.label} stat={s} delay={i*80} />)}
      </div>

      {/* Two col row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>

        {/* Recent topics */}
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <h3 style={{ fontWeight:700, fontSize:16 }}>Recent Topics</h3>
            <span className="badge" style={{ background:"#fff3ee", color:"#ff6b1a" }}>Last 7 days</span>
          </div>
          {[
            { name:"Binary Trees",      score:92, color:"#b8ff47" },
            { name:"Ohm's Law",         score:67, color:"#ffd000" },
            { name:"Acid-Base Theory",  score:41, color:"#ff3e7f" },
            { name:"Python Functions",  score:88, color:"#b8ff47" },
            { name:"Newton's Laws",     score:55, color:"#ff9966" },
          ].map((t, i) => (
            <div key={t.name} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10,
              animationDelay:`${i*60}ms`, animation:"slideUp .4s both" }}>
              <div style={{ width:36, height:36, borderRadius:10,
                background:"rgba(0,0,0,.04)", display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:700, color:"var(--muted)" }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{t.name}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${t.score}%`, background: t.color }} />
                </div>
              </div>
              <div style={{ fontWeight:700, fontSize:13, color: t.score>=80?"#3a7a00":t.score>=60?"#7a5a00":"#9a0030" }}>
                {t.score}%
              </div>
            </div>
          ))}
        </div>

        {/* Weak concepts */}
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <h3 style={{ fontWeight:700, fontSize:16 }}>Weak Concepts 🚨</h3>
            <span className="badge" style={{ background:"#fce8ee", color:"#ff3e7f" }}>Needs Attention</span>
          </div>
          {[
            { name:"Recursion",         level:"High",   subject:"CS"      },
            { name:"Electrochemistry",  level:"Medium", subject:"Chem"    },
            { name:"Thermodynamics",    level:"Medium", subject:"Physics" },
          ].map((c, i) => (
            <div key={c.name} className="card" style={{
              marginBottom:10, padding:"14px 16px", border:"1.5px solid var(--border)",
              display:"flex", alignItems:"center", gap:12,
              animation:`slideUp .4s ${i*80}ms both`
            }}>
              <div style={{ width:10, height:10, borderRadius:"50%",
                background: c.level==="High"?"#ff3e7f":"#ffd000",
                boxShadow: `0 0 0 4px ${c.level==="High"?"rgba(255,62,127,.2)":"rgba(255,208,0,.2)"}` }} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{c.name}</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>{c.subject}</div>
              </div>
              <span className="badge" style={{ background: c.level==="High"?"#fce8ee":"#fffbe6", color: c.level==="High"?"#ff3e7f":"#aa7700" }}>
                {c.level}
              </span>
              <button className="btn btn-primary" style={{ padding:"7px 14px", fontSize:12 }}>Review</button>
            </div>
          ))}

          {/* AI suggestion bubble */}
          <div style={{ marginTop:14, padding:"14px 16px", borderRadius:14,
            background:"linear-gradient(135deg,#7c3aed22,#00c2ff11)",
            border:"1.5px solid rgba(124,58,237,.2)", display:"flex", gap:10 }}>
            <span style={{ fontSize:20 }}>🤖</span>
            <p style={{ fontSize:13, color:"#3a2060", lineHeight:1.5 }}>
              <strong>AI Tip:</strong> Practice 5 recursion problems daily for 3 days to overcome this concept gap.
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ padding:24 }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Quick Actions</h3>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {[
            { label:"Explain a Topic",   icon:"book",      cls:"btn-primary" },
            { label:"Start a Quiz",      icon:"quiz",      cls:"btn-sky"     },
            { label:"Translate Content", icon:"translate", cls:"btn-violet"  },
            { label:"Hear Explanation",  icon:"speak",     cls:"btn-lime"    },
          ].map(a => (
            <button key={a.label} className={`btn ${a.cls}`} aria-label={a.label}>
              <Icon d={icons[a.icon]} size={15} />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Learn Page
function LearnPage() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("te");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("simplified");

  const simulate = () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult({
        simplified: "A binary tree is like a family tree where each parent has at most 2 children. Starting from the root (top), each node can have a left child and a right child. It is widely used in computer science for searching and sorting operations efficiently.",
        translated: lang === "te"
          ? "బైనరీ ట్రీ అనేది ఒక కుటుంబ చెట్టు వంటిది, దీనిలో ప్రతి తల్లిదండ్రులకు గరిష్టంగా 2 పిల్లలు ఉంటారు."
          : "बाइनरी ट्री एक परिवार के पेड़ की तरह होता है जहाँ हर माता-पिता के अधिकतम 2 बच्चे हो सकते हैं।",
      });
    }, 2200);
  };

  return (
    <div className="animate-up">
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>AI Learning Hub 📚</h1>
      <p style={{ color:"var(--muted)", marginBottom:28 }}>Paste any complex academic text and get simplified, multilingual explanations.</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Input panel */}
        <div className="card" style={{ padding:24 }}>
          <label style={{ fontWeight:700, fontSize:14, display:"block", marginBottom:10 }}>
            📋 Paste Your Content
          </label>
          <textarea className="input" placeholder="e.g. A binary tree is a hierarchical data structure…"
            value={text} onChange={e => setText(e.target.value)}
            style={{ resize:"vertical", minHeight:160, marginBottom:16 }} aria-label="Academic content input" />

          <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
            <label style={{ fontWeight:600, fontSize:13, whiteSpace:"nowrap" }}>🌐 Translate to:</label>
            <select className="input" style={{ flex:1 }} value={lang} onChange={e => setLang(e.target.value)}
              aria-label="Target language">
              <option value="te">Telugu</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="kn">Kannada</option>
            </select>
          </div>

          <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }}
            onClick={simulate} disabled={loading} aria-label="Generate AI explanation">
            {loading
              ? <><span style={{ width:16,height:16,border:"2px solid #fff",borderTop:"2px solid transparent",borderRadius:"50%",animation:"spin .6s linear infinite",display:"inline-block" }} /> Generating…</>
              : <><Icon d={icons.brain} size={16} /> Generate Explanation</>}
          </button>

          {/* TTS button */}
          {result && (
            <button className="btn btn-ghost" style={{ width:"100%", justifyContent:"center", marginTop:10 }}
              onClick={() => { const u = new SpeechSynthesisUtterance(result.simplified); window.speechSynthesis.speak(u); }}
              aria-label="Listen to explanation">
              <Icon d={icons.speak} size={16} />
              🔊 Listen (Text-to-Speech)
            </button>
          )}
        </div>

        {/* Output panel */}
        <div className="card" style={{ padding:24 }}>
          {!result && !loading && (
            <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
              <div style={{ fontSize:48, animation:"float 3s ease-in-out infinite" }}>🧠</div>
              <p style={{ color:"var(--muted)", fontSize:14, textAlign:"center" }}>Your AI explanation will appear here.</p>
            </div>
          )}

          {loading && (
            <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
              <div style={{ width:60, height:60, borderRadius:"50%", border:"3px solid #f0ebff", borderTop:"3px solid #7c3aed", animation:"spin .8s linear infinite" }} />
              <p style={{ color:"var(--muted)", fontSize:13 }}>AI is simplifying your content…</p>
            </div>
          )}

          {result && (
            <div className="animate-fade">
              {/* Tab switcher */}
              <div style={{ display:"flex", gap:6, marginBottom:16, background:"var(--paper)", padding:4, borderRadius:12 }}>
                {[["simplified","✨ Simplified"],["translated","🌐 Translated"]].map(([id,label]) => (
                  <button key={id} onClick={()=>setTab(id)}
                    style={{ flex:1, padding:"8px 10px", borderRadius:9, border:"none", cursor:"pointer",
                      fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12,
                      background: tab===id ? "var(--saffron)" : "transparent",
                      color: tab===id ? "#fff" : "var(--muted)",
                      transition:"all .2s" }}>{label}</button>
                ))}
              </div>

              <div style={{ padding:16, borderRadius:14, background: tab==="simplified"?"#fff3ee":"#f0ebff",
                lineHeight:1.7, fontSize:14, color:"var(--ink)" }}>
                {tab === "simplified" ? result.simplified : result.translated}
              </div>

              {/* Tags */}
              <div style={{ marginTop:16 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"var(--muted)", marginBottom:8 }}>KEY CONCEPTS</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {["Binary Tree","Root Node","Leaf Node","Hierarchy","Recursion"].map((t,i) => (
                    <span key={t} className="tag" style={{ background:["#fff3ee","#e8f9ff","#f0ebff","#f4ffe8","#ffe8f0"][i%5], color:["#ff6b1a","#0099cc","#7c3aed","#4a7a00","#cc0055"][i%5] }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Quiz Page
function QuizPage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  const q = quizQuestions[current];
  const score = answers.filter((a,i) => a === quizQuestions[i]?.ans).length;

  const choose = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
  };
  const next = () => {
    const newAnswers = [...answers, selected];
    if (current + 1 >= quizQuestions.length) {
      setAnswers(newAnswers); setDone(true);
    } else {
      setAnswers(newAnswers); setSelected(null); setCurrent(c => c+1);
    }
  };

  if (!started) return (
    <div className="animate-up" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"70vh", gap:20 }}>
      <div style={{ fontSize:64, animation:"float 3s ease-in-out infinite" }}>🎯</div>
      <h1 style={{ fontSize:30, fontWeight:800, textAlign:"center" }}>Adaptive Quiz</h1>
      <p style={{ color:"var(--muted)", textAlign:"center", maxWidth:360 }}>Test your understanding of Computer Science fundamentals. The AI will detect your weak spots!</p>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center" }}>
        {[["Computer Science","#ff6b1a"],["Physics","#00c2ff"],["Mathematics","#7c3aed"]].map(([s,c])=>(
          <button key={s} className="btn" style={{ background:c, color:"#fff" }}
            onClick={() => setStarted(true)}>{s}</button>
        ))}
      </div>
    </div>
  );

  if (done) {
    const pct = Math.round((score/quizQuestions.length)*100);
    return (
      <div className="animate-up" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, paddingTop:40 }}>
        <div style={{ fontSize:72 }}>{pct >= 70 ? "🏆" : pct >= 50 ? "😊" : "😅"}</div>
        <h2 style={{ fontSize:28, fontWeight:800 }}>Quiz Complete!</h2>
        <div style={{ width:160, height:160, borderRadius:"50%", position:"relative",
          background:`conic-gradient(var(--saffron) ${pct*3.6}deg, var(--border) 0)`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:130, height:130, borderRadius:"50%", background:"#fff",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:36, color:"var(--saffron)" }}>{pct}%</span>
            <span style={{ fontSize:12, color:"var(--muted)" }}>{score}/{quizQuestions.length} correct</span>
          </div>
        </div>
        {pct < 70 && (
          <div style={{ padding:"16px 20px", borderRadius:14, background:"#fff3ee", border:"1.5px solid #ffd0b0", maxWidth:360, textAlign:"center" }}>
            <p style={{ fontSize:14, color:"#cc4400" }}>🤖 <strong>AI detected weak area:</strong> Recursion & Stack concepts. Added to your study plan!</p>
          </div>
        )}
        <button className="btn btn-primary" onClick={()=>{setStarted(false);setCurrent(0);setSelected(null);setAnswers([]);setDone(false);}}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-up" style={{ maxWidth:620, margin:"0 auto" }}>
      {/* Progress */}
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13, fontWeight:600 }}>
        <span>Question {current+1} of {quizQuestions.length}</span>
        <span style={{ color:"var(--saffron)" }}>{Math.round(((current)/quizQuestions.length)*100)}% done</span>
      </div>
      <div className="progress-bar" style={{ marginBottom:28 }}>
        <div className="progress-fill" style={{ width:`${((current)/quizQuestions.length)*100}%`, background:"var(--saffron)" }} />
      </div>

      {/* Question */}
      <div className="card" style={{ padding:28, marginBottom:20 }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#fff3ee",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Syne',sans-serif", fontWeight:800, color:"var(--saffron)", flexShrink:0 }}>Q</div>
          <p style={{ fontSize:17, fontWeight:600, lineHeight:1.5 }}>{q.q}</p>
        </div>
      </div>

      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.ans;
          const isSelected = selected === i;
          let bg = "var(--card-bg)", border = "var(--border)", color = "var(--ink)";
          if (selected !== null) {
            if (isCorrect) { bg="#f4ffe8"; border="#b8ff47"; color="#2d6a00"; }
            else if (isSelected) { bg="#fce8ee"; border="#ff3e7f"; color="#880033"; }
          }
          return (
            <button key={i} onClick={() => choose(i)}
              style={{ padding:"14px 18px", borderRadius:14, border:`1.5px solid ${border}`,
                background:bg, color, cursor: selected!==null?"default":"pointer",
                textAlign:"left", fontSize:14, fontWeight:500, display:"flex", alignItems:"center", gap:12,
                transition:"all .2s", fontFamily:"'DM Sans',sans-serif" }}
              aria-label={`Option ${i+1}: ${opt}`}>
              <span style={{ width:28, height:28, borderRadius:8, background:"rgba(0,0,0,.05)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, flexShrink:0 }}>
                {["A","B","C","D"][i]}
              </span>
              {opt}
              {selected !== null && isCorrect && <span style={{ marginLeft:"auto" }}>✅</span>}
              {selected !== null && isSelected && !isCorrect && <span style={{ marginLeft:"auto" }}>❌</span>}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button className="btn btn-primary" style={{ marginTop:20, width:"100%", justifyContent:"center" }} onClick={next}>
          {current + 1 < quizQuestions.length ? "Next Question →" : "See Results 🏆"}
        </button>
      )}
    </div>
  );
}

// Analytics (Teacher view)
function AnalyticsPage() {
  return (
    <div className="animate-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Teacher Analytics 📊</h1>
          <p style={{ color:"var(--muted)" }}>Concept-wise performance heatmap across all students</p>
        </div>
        <button className="btn btn-primary">
          <Icon d={icons.award} size={15} /> Export Report
        </button>
      </div>

      {/* Class stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {[
          { label:"Students",       value:"48",  bg:"#e8f9ff", color:"#00c2ff" },
          { label:"Avg Score",      value:"73%", bg:"#f4ffe8", color:"#3a7a00" },
          { label:"At Risk",        value:"11",  bg:"#fce8ee", color:"#ff3e7f" },
          { label:"Topics Covered", value:"18",  bg:"#f0ebff", color:"#7c3aed" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:20, background:s.bg }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:s.color, marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:30, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="card" style={{ padding:24, marginBottom:20 }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Concept Weakness Heatmap</h3>
        <p style={{ fontSize:13, color:"var(--muted)", marginBottom:20 }}>Score per topic per day of the week</p>
        <div style={{ overflowX:"auto" }}>
          {/* Header */}
          <div style={{ display:"flex", gap:8, marginBottom:8, paddingLeft:80 }}>
            {days.map(d => <div key={d} style={{ width:36, textAlign:"center", fontSize:11, fontWeight:700, color:"var(--muted)" }}>{d}</div>)}
          </div>
          {heatmapData.map(row => (
            <div key={row.topic} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div style={{ width:72, fontSize:12, fontWeight:700, textAlign:"right", paddingRight:8, color:"var(--muted)" }}>{row.topic}</div>
              {row.scores.map((sc, i) => {
                const {bg, text} = heatColor(sc);
                return (
                  <div key={i} className="heatmap-cell" style={{ background:bg, color:text }}
                    title={`${row.topic} ${days[i]}: ${sc}%`}>{sc}</div>
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div style={{ display:"flex", gap:12, marginTop:16, paddingLeft:80, alignItems:"center" }}>
            <span style={{ fontSize:11, color:"var(--muted)", fontWeight:600 }}>SCORE:</span>
            {[["#b8ff47","#1a3300","≥80"],["#ffd000","#3a2a00","60–79"],["#ff9966","#3a1500","40–59"],["#ff3e7f","#fff","<40"]].map(([bg,text,label])=>(
              <div key={label} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:14,height:14,borderRadius:4,background:bg }} />
                <span style={{ fontSize:11, fontWeight:600, color:"var(--muted)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI summary */}
      <div className="card" style={{ padding:24, background:"linear-gradient(135deg,#1a0a3a,#0a1a3a)", border:"none" }}>
        <div style={{ display:"flex", gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#7c3aed,#00c2ff)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon d={icons.brain} size={20} stroke="#fff" />
          </div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"#fff", marginBottom:8 }}>
              AI Recommendation Summary
            </div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,.7)", lineHeight:1.7 }}>
              <strong style={{ color:"#ff9966" }}>Physics Thermodynamics</strong> shows consistent weakness (red cells) across Mon–Wed. 
              Recommend scheduling a <em>remedial session</em> before Week 7. 
              <strong style={{ color:"#b8ff47" }}>CS</strong> students are performing well — consider advancing to Algorithm Design topics.
              11 students are below 40% threshold and need immediate intervention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Roadmap Page
function RoadmapPage() {
  return (
    <div className="animate-up">
      <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>Personalized Roadmap 🗺️</h1>
      <p style={{ color:"var(--muted)", marginBottom:28 }}>AI-curated learning path based on your quiz performance and weak concepts.</p>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        {/* Timeline */}
        <div className="card" style={{ padding:28 }}>
          <h3 style={{ fontWeight:700, fontSize:16, marginBottom:24 }}>12-Week Learning Journey</h3>
          <div style={{ position:"relative" }}>
            {/* vertical line */}
            <div style={{ position:"absolute", left:17, top:0, bottom:0, width:2, background:"var(--border)" }} />
            {roadmapItems.map((item, i) => (
              <div key={item.title} style={{ display:"flex", gap:16, marginBottom:24, position:"relative",
                animation:`slideUp .4s ${i*70}ms both` }}>
                {/* Dot */}
                <div style={{ width:36, height:36, borderRadius:"50%", background: item.status==="done"?"#b8ff47":item.status==="current"?"#ff6b1a":"var(--border)",
                  border:`3px solid ${item.status==="done"?"#88cc00":item.status==="current"?"#ff6b1a":"var(--border)"}`,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1,
                  boxShadow: item.status==="current"?"0 0 0 6px rgba(255,107,26,.2)":"none" }}>
                  {item.status==="done" && <Icon d={icons.check} size={14} stroke="#1a3300" />}
                  {item.status==="current" && <div style={{ width:8,height:8,borderRadius:"50%",background:"#fff" }} />}
                </div>
                {/* Content */}
                <div style={{ flex:1, paddingTop:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15 }}>{item.title}</span>
                    {item.status==="current" && <span className="badge" style={{ background:"#fff3ee", color:"#ff6b1a" }}>Current</span>}
                    {item.status==="done" && <span className="badge" style={{ background:"#f4ffe8", color:"#3a7a00" }}>Done ✓</span>}
                  </div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{item.weeks}</div>
                  <div style={{ marginTop:8, height:4, borderRadius:99, background:"var(--border)", overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:99, background: item.color,
                      width: item.status==="done"?"100%":item.status==="current"?"55%":"0%" ,
                      transition:"width .8s" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div className="card" style={{ padding:20 }}>
            <h3 style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>🎓 Certifications</h3>
            {[
              { name:"Python Essentials",       issuer:"Cisco",    color:"#ff6b1a" },
              { name:"CS50x",                   issuer:"Harvard",  color:"#00c2ff" },
              { name:"Google IT Support",       issuer:"Google",   color:"#b8ff47" },
              { name:"Data Science Foundations",issuer:"IBM",      color:"#7c3aed" },
            ].map((cert,i) => (
              <div key={cert.name} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12,
                animation:`slideUp .4s ${i*60}ms both` }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:cert.color, flexShrink:0 }} />
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{cert.name}</div>
                  <div style={{ fontSize:11, color:"var(--muted)" }}>{cert.issuer}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding:20, background:"linear-gradient(135deg,#fff3ee,#ffe8f0)" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🔥</div>
            <h3 style={{ fontWeight:800, fontSize:15, marginBottom:6 }}>AI Career Path</h3>
            <p style={{ fontSize:13, color:"#cc4400", lineHeight:1.6 }}>
              Based on your strengths, you're well-suited for <strong>Full Stack Development</strong> or <strong>Data Analytics</strong>.
            </p>
            <button className="btn btn-primary" style={{ marginTop:14, fontSize:12, padding:"9px 16px" }}>
              Explore Paths →
            </button>
          </div>

          <div className="card" style={{ padding:20 }}>
            <h3 style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Skill Radar</h3>
            {[
              { skill:"Problem Solving", pct:78, color:"#ff6b1a" },
              { skill:"Mathematics",     pct:55, color:"#ffd000" },
              { skill:"Programming",     pct:82, color:"#b8ff47" },
              { skill:"Communication",   pct:65, color:"#00c2ff" },
            ].map(s => (
              <div key={s.skill} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:600, marginBottom:4 }}>
                  <span>{s.skill}</span><span style={{ color:s.color }}>{s.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${s.pct}%`, background:s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("student");

  return (
    <div style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr" }}>
      {/* Left panel */}
      <div style={{ background: "var(--ink)", display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"60px 56px", position:"relative", overflow:"hidden" }}>
        {/* Blobs */}
        <div className="blob" style={{ width:260, height:260, background:"rgba(255,107,26,.25)", top:-60, left:-60 }} />
        <div className="blob" style={{ width:200, height:200, background:"rgba(0,194,255,.15)", bottom:80, right:-40, animationDelay:"2s" }} />
        <div className="blob" style={{ width:150, height:150, background:"rgba(124,58,237,.2)", top:"50%", left:"50%", animationDelay:"4s" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:48 }}>
            <div style={{ width:48, height:48, borderRadius:14,
              background:"linear-gradient(135deg,#ff6b1a,#ff3e7f)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon d={icons.brain} size={24} stroke="#fff" />
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:"#fff" }}>EduBridge AI</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", letterSpacing:".12em", textTransform:"uppercase" }}>Inclusive Learning Platform</div>
            </div>
          </div>

          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:42, color:"#fff", lineHeight:1.1, marginBottom:16 }}>
            Bridge the<br /><span style={{ color:"var(--saffron)" }}>Knowledge Gap</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,.6)", fontSize:15, lineHeight:1.7, marginBottom:40, maxWidth:360 }}>
            AI-powered learning platform for first-year engineering students from rural and non-English backgrounds.
          </p>

          {/* Feature pills */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              ["🌐","Multilingual explanations (Telugu, Hindi)"],
              ["🎯","Adaptive quizzes + weak concept detection"],
              ["🗺️","AI-personalized study roadmaps"],
              ["📊","Real-time teacher analytics"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <span style={{ color:"rgba(255,255,255,.75)", fontSize:13 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
        <div style={{ width:"100%", maxWidth:400, animation:"slideUp .5s cubic-bezier(.16,1,.3,1) both" }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, marginBottom:6 }}>Welcome back 👋</h3>
          <p style={{ color:"var(--muted)", fontSize:14, marginBottom:28 }}>Sign in to continue your learning journey</p>

          {/* Role toggle */}
          <div style={{ display:"flex", gap:6, background:"var(--paper)", padding:4, borderRadius:12, marginBottom:24 }}>
            {["student","teacher"].map(r => (
              <button key={r} onClick={() => setRole(r)}
                style={{ flex:1, padding:"9px", borderRadius:9, border:"none", cursor:"pointer",
                  fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, textTransform:"capitalize",
                  background: role===r ? "var(--saffron)" : "transparent",
                  color: role===r ? "#fff" : "var(--muted)",
                  transition:"all .2s" }}>{r==="student"?"👨‍🎓 Student":"👨‍🏫 Teacher"}</button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
            <div>
              <label style={{ fontWeight:600, fontSize:13, marginBottom:6, display:"block" }}>Email Address</label>
              <input className="input" type="email" placeholder="arjun@example.com"
                value={email} onChange={e=>setEmail(e.target.value)} aria-label="Email address" />
            </div>
            <div>
              <label style={{ fontWeight:600, fontSize:13, marginBottom:6, display:"block" }}>Password</label>
              <input className="input" type="password" placeholder="••••••••"
                value={pass} onChange={e=>setPass(e.target.value)} aria-label="Password" />
            </div>
          </div>

          <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"13px", fontSize:15 }}
            onClick={() => onLogin(role)} aria-label="Sign in">
            Sign In →
          </button>

          <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"var(--muted)" }}>
            Don't have an account? <span style={{ color:"var(--saffron)", fontWeight:700, cursor:"pointer" }}>Register free</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole]         = useState("student");
  const [active, setActive]     = useState("dashboard");
  const [toast, setToast]       = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (r) => {
    setRole(r);
    setLoggedIn(true);
    showToast(`Signed in as ${r} ✅`);
  };

  const pages = {
    dashboard: <DashboardPage />,
    learn:     <LearnPage />,
    quiz:      <QuizPage />,
    analytics: <AnalyticsPage />,
    roadmap:   <RoadmapPage />,
  };

  return (
    <>
      <style>{globalStyles}</style>

      {!loggedIn
        ? <LoginScreen onLogin={handleLogin} />
        : (
          <>
            <Sidebar active={active} setActive={setActive} role={role} />
            <main className="main" role="main" aria-label="Main content">
              {/* Top bar */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
                <div style={{ fontSize:13, color:"var(--muted)" }}>
                  EduBridge AI / <span style={{ color:"var(--ink)", fontWeight:600, textTransform:"capitalize" }}>{active}</span>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  {role === "teacher" && active !== "analytics" && (
                    <button className="btn btn-ghost" style={{ fontSize:12, padding:"8px 14px" }}
                      onClick={() => setActive("analytics")}>
                      <Icon d={icons.chart} size={14} /> Teacher View
                    </button>
                  )}
                  <div style={{ width:36, height:36, borderRadius:"50%",
                    background:"linear-gradient(135deg,#7c3aed,#00c2ff)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer" }}>A</div>
                </div>
              </div>

              {pages[active]}
            </main>
          </>
        )
      }

      {toast && (
        <div className="toast" role="alert" aria-live="polite">
          <span>✅</span> {toast}
        </div>
      )}
    </>
  );
}
