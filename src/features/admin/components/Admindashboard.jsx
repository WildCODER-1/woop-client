import { useState } from "react";
import { JOBS, WASHERS } from "../../../components/Shared";

// ── Extra mock data for the full dashboard ─────────────────────
const CUSTOMERS = [
  { id:1, name:"Sarah K.",   email:"sarah@email.com",  phone:"+1 512 000 1111", bookings:8,  spent:480,  joined:"Jan 2026", status:"active" },
  { id:2, name:"James L.",   email:"james@email.com",  phone:"+1 512 000 2222", bookings:3,  spent:195,  joined:"Feb 2026", status:"active" },
  { id:3, name:"Mia T.",     email:"mia@email.com",    phone:"+1 512 000 3333", bookings:12, spent:890,  joined:"Dec 2025", status:"active" },
  { id:4, name:"Omar S.",    email:"omar@email.com",   phone:"+1 512 000 4444", bookings:1,  spent:25,   joined:"Mar 2026", status:"inactive" },
  { id:5, name:"Chloe R.",   email:"chloe@email.com",  phone:"+1 512 000 5555", bookings:6,  spent:390,  joined:"Jan 2026", status:"active" },
  { id:6, name:"Ben A.",     email:"ben@email.com",    phone:"+1 512 000 6666", bookings:2,  spent:150,  joined:"Feb 2026", status:"active" },
];

const REVENUE_MONTHLY = [
  { m:"Oct", r:1200 }, { m:"Nov", r:1800 }, { m:"Dec", r:2400 },
  { m:"Jan", r:3100 }, { m:"Feb", r:2700 }, { m:"Mar", r:3800 },
];
const REVENUE_WEEKLY = [
  { m:"Mon", r:320 }, { m:"Tue", r:480 }, { m:"Wed", r:410 },
  { m:"Thu", r:650 }, { m:"Fri", r:590 }, { m:"Sat", r:820 }, { m:"Sun", r:530 },
];

const NAV = [
  { id:"revenue",   icon:"📊", label:"Revenue"  },
  { id:"live",      icon:"🗺",  label:"Live Jobs" },
  { id:"washers",   icon:"🧹", label:"Washers"   },
  { id:"customers", icon:"👥", label:"Customers" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0D1F1A; --ink2: #1A3A30;
    --white: #fff; --off: #F4FBF8; --border: #D6EFE6; --muted: #5A7A6E;
    --mint: #00C896; --mint-d: #00A87D; --mint-l: #E6FBF4;
    --zap: #FFE134; --zap-d: #F5C800; --red: #FF4757;
    --font: 'Nunito', sans-serif; --display: 'Syne', sans-serif;
    --sidebar: 240px;
  }
  html, body { height: 100%; overflow: hidden; font-family: var(--font); background: var(--off); -webkit-font-smoothing: antialiased; }

  /* ── LAYOUT ── */
  .adm-shell { display: flex; height: 100vh; width: 100%; overflow: hidden; }

  /* ── SIDEBAR ── */
  .adm-sidebar {
    width: var(--sidebar); flex-shrink: 0; height: 100vh;
    background: var(--ink); display: flex; flex-direction: column;
    border-right: 1px solid rgba(0,200,150,0.1);
  }
  .adm-logo {
    padding: 28px 24px 24px; display: flex; align-items: center; gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .adm-logo-mark {
    width: 34px; height: 34px; border-radius: 10px; background: var(--mint);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 12px rgba(0,200,150,0.4); flex-shrink: 0;
  }
  .adm-logo-word { font-family: var(--display); font-size: 20px; font-weight: 800; color: white; letter-spacing: -0.5px; }
  .adm-logo-badge { font-size: 9px; font-weight: 800; background: rgba(0,200,150,0.15); color: var(--mint); padding: 2px 7px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase; margin-left: 2px; }

  .adm-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
  .adm-nav-item {
    display: flex; align-items: center; gap: 12px; padding: 11px 14px;
    border-radius: 12px; cursor: pointer; transition: all 0.18s;
    font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.4);
    border: none; background: none; font-family: var(--font); width: 100%; text-align: left;
  }
  .adm-nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
  .adm-nav-item.on { background: rgba(0,200,150,0.12); color: var(--mint); }
  .adm-nav-icon { font-size: 18px; width: 24px; text-align: center; }
  .adm-nav-badge { margin-left: auto; background: var(--mint); color: var(--ink); font-size: 10px; font-weight: 900; padding: 2px 7px; border-radius: 20px; }

  .adm-user {
    padding: 16px; border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 10px;
  }
  .adm-user-ava {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, var(--mint), var(--ink2));
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 900; font-size: 13px; flex-shrink: 0;
  }
  .adm-user-name { font-size: 13px; font-weight: 800; color: white; }
  .adm-user-role { font-size: 10px; color: rgba(255,255,255,0.3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px; }
  .adm-logout { margin-left: auto; background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.3; transition: opacity 0.15s; }
  .adm-logout:hover { opacity: 0.8; }

  /* ── MAIN ── */
  .adm-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .adm-topbar {
    height: 64px; background: white; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 32px;
    justify-content: space-between; flex-shrink: 0;
  }
  .adm-page-title { font-family: var(--display); font-size: 20px; font-weight: 800; color: var(--ink); letter-spacing: -0.5px; }
  .adm-topbar-right { display: flex; align-items: center; gap: 12px; }
  .adm-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--off); border: 1.5px solid var(--border);
    border-radius: 10px; padding: 8px 14px;
  }
  .adm-search input { background: none; border: none; outline: none; font-family: var(--font); font-size: 13px; font-weight: 600; color: var(--ink); width: 180px; }
  .adm-search input::placeholder { color: var(--muted); }
  .adm-icon-btn {
    width: 38px; height: 38px; border-radius: 10px; background: var(--off);
    border: 1.5px solid var(--border); cursor: pointer; display: flex;
    align-items: center; justify-content: center; font-size: 16px; transition: all 0.15s;
  }
  .adm-icon-btn:hover { background: var(--border); }
  .notif-dot { position: relative; }
  .notif-dot::after { content: ''; position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; background: var(--red); border: 2px solid white; }

  .adm-content { flex: 1; overflow-y: auto; padding: 28px 32px; }
  .adm-content::-webkit-scrollbar { width: 4px; }
  .adm-content::-webkit-scrollbar-track { background: transparent; }
  .adm-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* ── KPI CARDS ── */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card {
    background: white; border-radius: 16px; padding: 20px;
    border: 1.5px solid var(--border); transition: box-shadow 0.18s;
  }
  .kpi-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .kpi-card.highlight { background: var(--ink); border-color: var(--ink); }
  .kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .kpi-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .kpi-icon.green { background: var(--mint-l); }
  .kpi-icon.zap { background: rgba(255,225,52,0.15); }
  .kpi-icon.red { background: rgba(255,71,87,0.1); }
  .kpi-icon.dark { background: rgba(255,255,255,0.1); }
  .kpi-chg { font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 20px; }
  .kpi-chg.up { background: var(--mint-l); color: var(--mint-d); }
  .kpi-chg.down { background: rgba(255,71,87,0.1); color: var(--red); }
  .kpi-val { font-family: var(--display); font-size: 30px; font-weight: 800; letter-spacing: -1.5px; color: var(--ink); margin-bottom: 4px; }
  .kpi-card.highlight .kpi-val { color: white; }
  .kpi-lbl { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .kpi-card.highlight .kpi-lbl { color: rgba(255,255,255,0.4); }

  /* ── SECTION HEADER ── */
  .sec-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .sec-title { font-family: var(--display); font-size: 17px; font-weight: 800; color: var(--ink); letter-spacing: -0.3px; }
  .sec-link { font-size: 13px; font-weight: 800; color: var(--mint); cursor: pointer; background: none; border: none; font-family: var(--font); }
  .sec-link:hover { color: var(--mint-d); text-decoration: underline; }

  /* ── CHART ── */
  .chart-card { background: white; border-radius: 16px; padding: 24px; border: 1.5px solid var(--border); margin-bottom: 20px; }
  .chart-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
  .chart-tab { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 800; cursor: pointer; border: 1.5px solid var(--border); background: white; font-family: var(--font); color: var(--muted); transition: all 0.18s; }
  .chart-tab.on { background: var(--ink); color: white; border-color: var(--ink); }
  .chart-wrap { display: flex; align-items: flex-end; gap: 8px; height: 140px; }
  .chart-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
  .chart-bar { width: 100%; border-radius: 6px 6px 0 0; background: var(--border); transition: all 0.3s; cursor: pointer; min-height: 4px; }
  .chart-bar:hover { background: var(--mint-d); opacity: 0.8; }
  .chart-bar.on { background: linear-gradient(180deg, var(--mint), var(--mint-d)); box-shadow: 0 4px 12px rgba(0,200,150,0.3); }
  .chart-lbl { font-size: 10px; font-weight: 700; color: var(--muted); }
  .chart-val { font-size: 10px; font-weight: 800; color: var(--ink); }

  .chart-grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }

  /* SERVICE MIX */
  .mix-list { display: flex; flex-direction: column; gap: 14px; }
  .mix-row { }
  .mix-top { display: flex; justify-content: space-between; margin-bottom: 5px; }
  .mix-name { font-size: 13px; font-weight: 700; }
  .mix-pct { font-size: 13px; font-weight: 800; color: var(--mint); }
  .mix-bar-bg { height: 6px; background: var(--border); border-radius: 3px; }
  .mix-bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--mint), var(--zap)); transition: width 0.6s ease; }

  /* ── TABLE ── */
  .table-card { background: white; border-radius: 16px; border: 1.5px solid var(--border); overflow: hidden; margin-bottom: 20px; }
  .table-filters { display: flex; align-items: center; gap: 10px; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .filter-chip { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 800; cursor: pointer; border: 1.5px solid var(--border); background: white; font-family: var(--font); color: var(--muted); transition: all 0.18s; }
  .filter-chip.on { background: var(--ink); color: white; border-color: var(--ink); }
  .tbl { width: 100%; border-collapse: collapse; }
  .tbl th { padding: 12px 20px; text-align: left; font-size: 10px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; background: var(--off); border-bottom: 1px solid var(--border); }
  .tbl td { padding: 14px 20px; font-size: 14px; font-weight: 600; border-bottom: 1px solid var(--border); color: var(--ink); }
  .tbl tr:last-child td { border-bottom: none; }
  .tbl tr:hover td { background: var(--off); }
  .tbl-name { font-weight: 800; }
  .tbl-muted { color: var(--muted); font-size: 12px; margin-top: 2px; }
  .tbl-ava { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg,var(--mint),var(--ink2)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 13px; flex-shrink: 0; }

  /* ── BADGE ── */
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
  .badge-pending { background: #FFF3E0; color: #E65100; }
  .badge-active  { background: var(--mint-l); color: var(--mint-d); }
  .badge-done    { background: var(--off); color: var(--muted); }
  .badge-online  { background: var(--mint-l); color: var(--mint-d); }
  .badge-offline { background: var(--off); color: var(--muted); }
  .badge-onjob   { background: rgba(255,225,52,0.2); color: #B8860B; }

  /* ── LIVE MAP PLACEHOLDER ── */
  .live-grid { display: grid; grid-template-columns: 1fr 360px; gap: 16px; margin-bottom: 20px; }
  .map-card {
    background: var(--ink); border-radius: 16px; overflow: hidden;
    border: 1.5px solid rgba(0,200,150,0.15); position: relative; min-height: 380px;
  }
  .map-card-bg {
    position: absolute; inset: 0;
    background: linear-gradient(rgba(0,200,150,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,150,0.04) 1px, transparent 1px);
    background-size: 32px 32px; background-color: #1A3020;
  }
  .map-road-h { position: absolute; background: rgba(0,200,150,0.1); }
  .map-blk { position: absolute; background: #152818; border-radius: 3px; }
  .map-pk { position: absolute; background: #1E3D1A; border-radius: 4px; }
  .map-pin { position: absolute; display: flex; flex-direction: column; align-items: center; transform: translate(-50%,-100%); }
  .map-pin-bubble { background: var(--ink); color: white; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; border: 1px solid rgba(0,200,150,0.25); }
  .map-pin-bubble.mint { background: var(--mint); color: var(--ink); }
  .map-pin-tail { width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid var(--ink); }
  .map-pin-tail.mint { border-top-color: var(--mint); }
  .map-label { position: absolute; top: 16px; left: 16px; background: rgba(13,31,26,0.85); backdrop-filter: blur(8px); border-radius: 10px; padding: 8px 14px; border: 1px solid rgba(0,200,150,0.15); }
  .map-label-title { font-size: 11px; font-weight: 800; color: white; }
  .map-label-sub { font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 600; margin-top: 1px; }

  /* JOB QUEUE */
  .job-queue { background: white; border-radius: 16px; border: 1.5px solid var(--border); overflow: hidden; }
  .jq-header { padding: 16px 18px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .jq-title { font-family: var(--display); font-size: 15px; font-weight: 800; }
  .jq-item { padding: 14px 18px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.15s; }
  .jq-item:last-child { border-bottom: none; }
  .jq-item:hover { background: var(--off); }
  .jq-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
  .jq-car { font-size: 14px; font-weight: 800; }
  .jq-svc { font-size: 11px; color: var(--muted); font-weight: 600; margin-top: 2px; }
  .jq-price { font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--mint); }
  .jq-meta { display: flex; align-items: center; justify-content: space-between; }
  .jq-addr { font-size: 11px; color: var(--muted); font-weight: 600; }
  .assign-btn { padding: 5px 12px; border-radius: 20px; background: var(--mint); color: var(--ink); font-size: 11px; font-weight: 800; border: none; cursor: pointer; font-family: var(--font); transition: all 0.15s; }
  .assign-btn:hover { background: var(--mint-d); }

  /* WASHER CARDS */
  .washer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
  .washer-card { background: white; border-radius: 16px; padding: 20px; border: 1.5px solid var(--border); transition: all 0.18s; cursor: pointer; }
  .washer-card:hover { border-color: var(--mint); box-shadow: 0 4px 20px rgba(0,200,150,0.1); }
  .wc-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .wc-ava { width: 44px; height: 44px; border-radius: 13px; background: linear-gradient(135deg,var(--mint),var(--ink2)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 17px; flex-shrink: 0; }
  .wc-name { font-family: var(--display); font-size: 15px; font-weight: 800; }
  .wc-zone { font-size: 11px; color: var(--muted); font-weight: 600; margin-top: 2px; }
  .wc-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .wc-stat { text-align: center; background: var(--off); border-radius: 10px; padding: 8px 4px; }
  .wc-stat-val { font-family: var(--display); font-size: 15px; font-weight: 800; color: var(--ink); }
  .wc-stat-lbl { font-size: 9px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

  /* ACTIONS */
  .action-btn { padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; font-family: var(--font); border: 1.5px solid var(--border); background: white; color: var(--ink); transition: all 0.15s; }
  .action-btn:hover { background: var(--off); border-color: var(--mint); }
  .action-btn.primary { background: var(--mint); color: var(--ink); border-color: var(--mint); box-shadow: 0 2px 8px rgba(0,200,150,0.25); }
  .action-btn.primary:hover { background: var(--mint-d); }

  @keyframes fadeSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .fade-slide { animation: fadeSlide 0.22s ease; }
`;

function Badge({ s }) {
  const map = {
    pending:  ["badge-pending", "⏳ Pending"],
    active:   ["badge-active",  "🟢 Active"],
    done:     ["badge-done",    "✅ Done"],
    online:   ["badge-online",  "🟢 Online"],
    offline:  ["badge-offline", "⚫ Offline"],
    "on job": ["badge-onjob",   "🔧 On Job"],
  };
  const [cls, label] = map[s?.toLowerCase()] || ["badge-done", s];
  return <span className={`badge ${cls}`}>{label}</span>;
}

// ── REVENUE PAGE ───────────────────────────────────────────────
function RevenuePage() {
  const [period, setPeriod] = useState("monthly");
  const data = period === "monthly" ? REVENUE_MONTHLY : REVENUE_WEEKLY;
  const maxR = Math.max(...data.map(d => d.r));

  const MIX = [["Express Woop",42],["Full Woop",28],["Deep Woop",17],["Inside Woop",13]];

  return (
    <div className="fade-slide">
      {/* KPIs */}
      <div className="kpi-grid">
        {[
          { icon:"💰", cls:"green",   val:"$3,800",  lbl:"This Month",    chg:"+18%",  up:true  },
          { icon:"📦", cls:"zap",     val:"52",       lbl:"Total Bookings", chg:"+12%", up:true  },
          { icon:"⭐", cls:"green",   val:"4.9",      lbl:"Avg Rating",     chg:"stable",up:true },
          { icon:"🔁", cls:"red",     val:"$73",      lbl:"Avg Order Value",chg:"-3%",  up:false },
        ].map(k => (
          <div className={`kpi-card${k.cls==="green"&&k.lbl==="This Month"?" highlight":""}`} key={k.lbl}>
            <div className="kpi-top">
              <div className={`kpi-icon ${k.cls}`}>{k.icon}</div>
              <span className={`kpi-chg ${k.up?"up":"down"}`}>{k.up?"↑":"↓"} {k.chg}</span>
            </div>
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-lbl">{k.lbl}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart + service mix */}
      <div className="chart-grid-2">
        <div className="chart-card">
          <div className="sec-hdr" style={{marginBottom:0}}>
            <div className="sec-title">Revenue Over Time</div>
            <div className="chart-tabs">
              {["weekly","monthly"].map(p => (
                <button key={p} className={`chart-tab${period===p?" on":""}`} onClick={()=>setPeriod(p)}>
                  {p[0].toUpperCase()+p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginTop:24}}>
            <div className="chart-wrap">
              {data.map((d,i) => (
                <div key={d.m} className="chart-bar-wrap">
                  <div className="chart-val">${d.r >= 1000 ? (d.r/1000).toFixed(1)+"k" : d.r}</div>
                  <div
                    className={`chart-bar${i===data.length-1?" on":""}`}
                    style={{height:`${(d.r/maxR)*100}%`}}
                  />
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,paddingTop:8}}>
              {data.map(d => <div key={d.m} className="chart-lbl" style={{flex:1,textAlign:"center"}}>{d.m}</div>)}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="sec-title" style={{marginBottom:20}}>Service Mix</div>
          <div className="mix-list">
            {MIX.map(([n,p]) => (
              <div className="mix-row" key={n}>
                <div className="mix-top">
                  <span className="mix-name">{n}</span>
                  <span className="mix-pct">{p}%</span>
                </div>
                <div className="mix-bar-bg">
                  <div className="mix-bar-fill" style={{width:`${p*2.38}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="sec-hdr">
        <div className="sec-title">Recent Transactions</div>
        <button className="sec-link">Export CSV →</button>
      </div>
      <div className="table-card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Customer</th><th>Service</th><th>Washer</th>
              <th>Date</th><th>Amount</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {JOBS.map(j => (
              <tr key={j.id}>
                <td><div className="tbl-name">Sarah K.</div></td>
                <td>{j.svc}</td>
                <td>{j.washer}</td>
                <td style={{color:"var(--muted)",fontSize:13}}>{j.time}</td>
                <td><strong style={{color:"var(--mint)"}}>${j.price}</strong></td>
                <td><Badge s={j.status}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── LIVE JOBS PAGE ─────────────────────────────────────────────
function LivePage() {
  const [jobs, setJobs] = useState(JOBS);
  const [modal, setModal] = useState(null);

  const assign = (jobId, washerName) => {
    setJobs(p => p.map(j => j.id===jobId ? {...j, washer:washerName, status:"active"} : j));
    setModal(null);
  };

  const PINS = [
    {left:"38%",top:"42%",car:"Tesla",mint:true},
    {left:"55%",top:"55%",car:"F-150"},
    {left:"65%",top:"35%",car:"BMW"},
  ];

  return (
    <div className="fade-slide">
      <div className="kpi-grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
        {[
          {icon:"🚗",cls:"green", val:jobs.filter(j=>j.status==="active").length,  lbl:"Active Jobs"},
          {icon:"⏳",cls:"zap",   val:jobs.filter(j=>j.status==="pending").length, lbl:"Pending"},
          {icon:"🧹",cls:"green", val:3, lbl:"Washers Online"},
          {icon:"✅",cls:"red",   val:jobs.filter(j=>j.status==="done").length,    lbl:"Completed Today"},
        ].map(k => (
          <div className="kpi-card" key={k.lbl}>
            <div className="kpi-top">
              <div className={`kpi-icon ${k.cls}`}>{k.icon}</div>
            </div>
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-lbl">{k.lbl}</div>
          </div>
        ))}
      </div>

      <div className="live-grid">
        {/* Map */}
        <div className="map-card">
          <div className="map-card-bg"/>
          {[[0,43,100,10],[0,56,100,8],[24,0,8,100],[60,0,9,100]].map(([l,t,w,h],i)=>(
            <div key={i} className="map-road-h" style={{position:"absolute",left:`${l}%`,top:`${t}%`,width:`${w}%`,height:`${h}px`,background:"rgba(0,200,150,0.1)"}}/>
          ))}
          {[[5,8,17,20],[30,8,19,18],[55,8,15,20],[77,8,18,18],[5,63,14,22],[26,63,21,20],[54,63,17,22],[79,63,14,22]].map(([l,t,w,h],i)=>(
            <div key={i} className="map-blk" style={{position:"absolute",left:`${l}%`,top:`${t}%`,width:`${w}%`,height:`${h}%`}}/>
          ))}
          <div className="map-pk" style={{position:"absolute",left:"42%",top:"10%",width:"11%",height:"17%"}}/>
          {PINS.map((p,i) => (
            <div key={i} className="map-pin" style={{position:"absolute",left:p.left,top:p.top}}>
              <div className={`map-pin-bubble${p.mint?" mint":""}`}>🚗 {p.car}</div>
              <div className={`map-pin-tail${p.mint?" mint":""}`}/>
            </div>
          ))}
          <div className="map-label">
            <div className="map-label-title">Austin, TX</div>
            <div className="map-label-sub">3 active · 2 pending</div>
          </div>
        </div>

        {/* Job queue */}
        <div className="job-queue">
          <div className="jq-header">
            <div className="jq-title">Job Queue</div>
            <Badge s="active"/>
          </div>
          {jobs.map(j => (
            <div className="jq-item" key={j.id}>
              <div className="jq-top">
                <div>
                  <div className="jq-car">{j.car}</div>
                  <div className="jq-svc">{j.svc}</div>
                </div>
                <div className="jq-price">${j.price}</div>
              </div>
              <div className="jq-meta">
                <div className="jq-addr">📍 {j.addr} · 🕐 {j.time}</div>
                {j.washer === "Unassigned"
                  ? <button className="assign-btn" onClick={() => setModal(j.id)}>Assign</button>
                  : <Badge s={j.status}/>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign modal */}
      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(13,31,26,0.6)",backdropFilter:"blur(4px)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={() => setModal(null)}>
          <div style={{background:"white",borderRadius:20,padding:28,width:380,animation:"fadeSlide 0.2s ease"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"var(--display)",fontSize:20,fontWeight:800,marginBottom:6}}>Assign washer</div>
            <div style={{fontSize:13,color:"var(--muted)",fontWeight:600,marginBottom:20}}>
              {jobs.find(j=>j.id===modal)?.car} · {jobs.find(j=>j.id===modal)?.svc}
            </div>
            {WASHERS.filter(w=>w.status!=="Off duty").map(w=>(
              <div key={w.n} onClick={()=>assign(modal,w.n)}
                style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",border:"2px solid var(--border)",borderRadius:13,marginBottom:8,cursor:"pointer",transition:"all 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--mint)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
              >
                <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,var(--mint),var(--ink2))",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:900,fontSize:13}}>{w.init}</div>
                <div>
                  <div style={{fontWeight:800,fontSize:14}}>{w.n}</div>
                  <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,marginTop:1}}>⭐ {w.r} · {w.jobs} woops</div>
                </div>
                <button className="assign-btn" style={{marginLeft:"auto"}}>Assign</button>
              </div>
            ))}
            <button onClick={()=>setModal(null)} style={{width:"100%",marginTop:8,padding:12,borderRadius:11,background:"var(--off)",border:"1.5px solid var(--border)",cursor:"pointer",fontFamily:"var(--font)",fontWeight:700,fontSize:13}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── WASHERS PAGE ───────────────────────────────────────────────
function WashersPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? WASHERS : WASHERS.filter(w => w.status.toLowerCase() === filter);

  return (
    <div className="fade-slide">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div className="kpi-grid" style={{flex:1,marginBottom:0,marginRight:16}}>
          {[
            {icon:"🧹",cls:"green",val:"3/4",lbl:"Online Now"},
            {icon:"⭐",cls:"zap",  val:"4.9",lbl:"Avg Rating"},
            {icon:"📦",cls:"green",val:"510", lbl:"Total Jobs"},
            {icon:"💰",cls:"red",  val:"$980",lbl:"Paid This Week"},
          ].map(k=>(
            <div className="kpi-card" key={k.lbl}>
              <div className="kpi-top"><div className={`kpi-icon ${k.cls}`}>{k.icon}</div></div>
              <div className="kpi-val">{k.val}</div>
              <div className="kpi-lbl">{k.lbl}</div>
            </div>
          ))}
        </div>
        <button className="action-btn primary">+ Add Washer</button>
      </div>

      {/* Filter chips */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["all","All"],["available","Available"],["on job","On Job"],["off duty","Off Duty"]].map(([v,l])=>(
          <button key={v} className={`filter-chip${filter===v?" on":""}`} onClick={()=>setFilter(v)}>{l}</button>
        ))}
      </div>

      <div className="washer-grid">
        {filtered.map(w => (
          <div className="washer-card" key={w.n}>
            <div className="wc-top">
              <div className="wc-ava">{w.init}</div>
              <div style={{flex:1}}>
                <div className="wc-name">{w.n}</div>
                <div className="wc-zone">Austin Central Zone</div>
              </div>
              <Badge s={w.status}/>
            </div>
            <div className="wc-stats">
              <div className="wc-stat"><div className="wc-stat-val">⭐{w.r}</div><div className="wc-stat-lbl">Rating</div></div>
              <div className="wc-stat"><div className="wc-stat-val">{w.jobs}</div><div className="wc-stat-lbl">Jobs</div></div>
              <div className="wc-stat"><div className="wc-stat-val">$240</div><div className="wc-stat-lbl">Week</div></div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button className="action-btn" style={{flex:1}}>View</button>
              <button className="action-btn primary" style={{flex:1}}>Assign Job</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CUSTOMERS PAGE ─────────────────────────────────────────────
function CustomersPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS
    .filter(c => filter === "all" || c.status === filter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-slide">
      <div className="kpi-grid" style={{marginBottom:20}}>
        {[
          {icon:"👥",cls:"green",val:CUSTOMERS.length,       lbl:"Total Customers"},
          {icon:"🆕",cls:"zap",  val:"3",                    lbl:"New This Month"},
          {icon:"💰",cls:"green",val:"$2,130",               lbl:"Total Revenue"},
          {icon:"🔁",cls:"red",  val:"6.5",                  lbl:"Avg Bookings"},
        ].map(k=>(
          <div className="kpi-card" key={k.lbl}>
            <div className="kpi-top"><div className={`kpi-icon ${k.cls}`}>{k.icon}</div></div>
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-lbl">{k.lbl}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-filters">
          {[["all","All"],["active","Active"],["inactive","Inactive"]].map(([v,l])=>(
            <button key={v} className={`filter-chip${filter===v?" on":""}`} onClick={()=>setFilter(v)}>{l}</button>
          ))}
          <div className="adm-search" style={{marginLeft:"auto"}}>
            <span>🔍</span>
            <input placeholder="Search customers…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr><th>Customer</th><th>Contact</th><th>Bookings</th><th>Total Spent</th><th>Joined</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div className="tbl-ava">{c.name[0]}</div>
                    <div>
                      <div className="tbl-name">{c.name}</div>
                      <div className="tbl-muted">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{color:"var(--muted)",fontSize:13}}>{c.phone}</td>
                <td><strong>{c.bookings}</strong> woops</td>
                <td><strong style={{color:"var(--mint)"}}>${c.spent}</strong></td>
                <td style={{color:"var(--muted)",fontSize:13}}>{c.joined}</td>
                <td><Badge s={c.status}/></td>
                <td><button className="action-btn">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────
export default function AdminDashboard({ user, onLogout }) {
  const [page, setPage] = useState("revenue");

  const PAGE_TITLES = {
    revenue:   "Revenue & Analytics",
    live:      "Live Jobs",
    washers:   "Washer Management",
    customers: "Customer Management",
  };

  const PAGES = {
    revenue:   <RevenuePage/>,
    live:      <LivePage/>,
    washers:   <WashersPage/>,
    customers: <CustomersPage/>,
  };

  return (
    <>
      <style>{css}</style>
      <div className="adm-shell">

        {/* ── SIDEBAR ── */}
        <aside className="adm-sidebar">
          <div className="adm-logo">
            <div className="adm-logo-mark">
              <svg width="16" height="11" viewBox="0 0 54 36" fill="none">
                <path d="M2 7 Q9.5 30 16 20 Q22.5 10 27 20 Q31.5 30 38 20 Q44.5 10 52 7"
                  stroke="white" strokeWidth="6.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div className="adm-logo-word">woop</div>
            <div className="adm-logo-badge">Admin</div>
          </div>

          <nav className="adm-nav">
            {NAV.map(n => (
              <button key={n.id} className={`adm-nav-item${page===n.id?" on":""}`} onClick={() => setPage(n.id)}>
                <span className="adm-nav-icon">{n.icon}</span>
                {n.label}
                {n.id === "live" && <span className="adm-nav-badge">2</span>}
              </button>
            ))}
          </nav>

          <div className="adm-user">
            <div className="adm-user-ava">{user?.init || "A"}</div>
            <div>
              <div className="adm-user-name">{user?.name || "Admin"}</div>
              <div className="adm-user-role">Administrator</div>
            </div>
            <button className="adm-logout" onClick={onLogout} title="Sign out">🚪</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="adm-main">
          <div className="adm-topbar">
            <div className="adm-page-title">{PAGE_TITLES[page]}</div>
            <div className="adm-topbar-right">
              <div className="adm-search">
                <span style={{fontSize:14,color:"var(--muted)"}}>🔍</span>
                <input placeholder="Search…"/>
              </div>
              <button className="adm-icon-btn notif-dot">🔔</button>
              <button className="adm-icon-btn">⚙️</button>
            </div>
          </div>

          <div className="adm-content">
            {PAGES[page]}
          </div>
        </div>

      </div>
    </>
  );
}