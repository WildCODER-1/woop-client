import { useState } from "react";
import { brandCss, MapView, TopOverlay, PanelLogo, Badge, JOBS, BARS, DAYS } from "../../../components/Shared";

const CHECKLIST = ["Rinse vehicle","Apply shampoo","Scrub exterior","Rinse soap","Dry exterior","Polish windows","Vacuum interior","Wipe dashboard"];

export default function WasherApp({ user, onLogout }) {
  const [tab, setTab]     = useState("jobs");
  const [avail, setAvail] = useState(true);
  const [jobs, setJobs]   = useState(JOBS.filter(j => j.washer === "Carlos M."));
  const [checks, setChecks] = useState(Array(8).fill(false).map((_,i) => i >= 4));
  const done = checks.filter(Boolean).length;

  const TABS = [["jobs","Jobs"],["checklist","Checklist"],["earnings","Earnings"]];

  // ── JOBS ──
  const Jobs = () => (
    <div className="ds-body fade-slide">
      <div className={`avail-row${avail?" online":""}`}>
        <div>
          <div className="avail-status">{avail ? "You're online 🟢" : "You're offline"}</div>
          <div className="avail-sub">{avail ? "Ready to receive jobs" : "Toggle to go online"}</div>
        </div>
        <div className={`toggle${avail?" on":""}`} onClick={() => setAvail(a => !a)}/>
      </div>
      <div className="kpi-row">
        {[["$100","Today","2 jobs"],["$480","This week","12 jobs"]].map(([v,l,s]) => (
          <div className="kpi-u" key={l}>
            <div className="kpi-u-val">{v}</div>
            <div className="kpi-u-lbl">{l}</div>
            <div className="kpi-u-chg">{s}</div>
          </div>
        ))}
      </div>
      <div className="ds-section-title">Today's Jobs</div>
      {jobs.map(j => (
        <div key={j.id} className={`job-card-u${j.status==="active"?" active":""}`}>
          <div className="jcu-top">
            <div>
              <div className="jcu-car">{j.car}</div>
              <div className="jcu-svc">{j.svc}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="jcu-price">${j.price}</div>
              <Badge s={j.status}/>
            </div>
          </div>
          <div className="jcu-addr">📍 {j.addr} · 🕐 {j.time}</div>
          {j.status === "active" && (
            <div style={{marginBottom:12}}>
              <div style={{height:4,background:"var(--border)",borderRadius:2}}>
                <div style={{height:"100%",width:"60%",background:"var(--mint)",borderRadius:2,transition:"width 0.5s"}}/>
              </div>
            </div>
          )}
          <div className="jcu-actions">
            {j.status === "pending" && (
              <button className="jcu-btn primary"
                onClick={() => setJobs(p => p.map(x => x.id===j.id ? {...x, status:"active"} : x))}>
                ▶ Start Job
              </button>
            )}
            {j.status === "active" && (
              <button className="jcu-btn primary" onClick={() => setTab("checklist")}>
                📋 Open Checklist
              </button>
            )}
            {j.status === "done" && <button className="jcu-btn secondary">📄 Receipt</button>}
            <button className="jcu-btn secondary">🗺 Navigate</button>
          </div>
        </div>
      ))}
    </div>
  );

  // ── CHECKLIST ──
  const Checklist = () => (
    <div className="ds-body fade-slide">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <div style={{fontFamily:"var(--display)",fontSize:20,fontWeight:800,letterSpacing:"-0.5px"}}>Wash Checklist</div>
          <div style={{fontSize:13,color:"var(--muted)",fontWeight:600,marginTop:2}}>Tesla Model 3 · Full Woop</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"var(--display)",fontSize:22,fontWeight:800}}>{done}/{CHECKLIST.length}</div>
          <div style={{fontSize:11,color:"var(--muted)",fontWeight:600,marginTop:1}}>complete</div>
        </div>
      </div>
      <div style={{height:6,background:"var(--border)",borderRadius:3,overflow:"hidden",marginBottom:18}}>
        <div style={{height:"100%",width:`${done/CHECKLIST.length*100}%`,background:"linear-gradient(90deg,var(--mint),var(--zap))",borderRadius:3,transition:"width 0.5s"}}/>
      </div>
      {CHECKLIST.map((item, i) => (
        <div key={i} className="cl-item" onClick={() => setChecks(p => p.map((c,j) => j===i ? !c : c))}>
          <div className={`cl-box${checks[i]?" chk":""}`}>
            {checks[i] && <svg width="10" height="8" fill="none" viewBox="0 0 10 8">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>}
          </div>
          <span className={`cl-label${checks[i]?" done":""}`}>{item}</span>
        </div>
      ))}
      <button className="cta-btn" style={{marginTop:20}}
        onClick={() => { setJobs(p => p.map(j => j.status==="active" ? {...j, status:"done"} : j)); setTab("jobs"); }}>
        ✓ Complete Woop
      </button>
    </div>
  );

  // ── EARNINGS ──
  const Earnings = () => (
    <div className="ds-body fade-slide">
      <div className="earn-hero">
        <div className="earn-lbl">THIS MONTH</div>
        <div className="earn-val">$1,840</div>
        <div className="earn-chg">↑ +12% vs last month</div>
      </div>
      <div className="kpi-row">
        {[["$100","Today","2 jobs"],["$480","Week","12 jobs"],["$9.2k","All time","203 jobs"],["4.9★","Rating","Top 5%"]].map(([v,l,s]) => (
          <div className="kpi-u" key={l}>
            <div className="kpi-u-val">{v}</div>
            <div className="kpi-u-lbl">{l}</div>
            <div className="kpi-u-chg">{s}</div>
          </div>
        ))}
      </div>
      <div className="ds-section-title">This Week</div>
      <div className="bar-chart-u">
        {BARS.map((h,i) => <div key={i} className={`bar-u${i===5?" on":""}`} style={{height:`${h}%`}}/>)}
      </div>
      <div className="bar-lbls">{DAYS.map((l,i) => <div key={i} className="bar-l">{l}</div>)}</div>
    </div>
  );

  const CONTENT = { jobs:<Jobs/>, checklist:<Checklist/>, earnings:<Earnings/> };

  return (
    <>
      <style>{brandCss}</style>
      <div className="shell">
        {/* DESKTOP */}
        <aside className="desktop-side">
          <PanelLogo user={user} onLogout={onLogout} tabs={TABS} activeTab={tab} onTab={setTab}/>
          {CONTENT[tab]}
        </aside>

        {/* MAP */}
        <MapView phase="washer"/>
        <TopOverlay user={user}/>

        {/* MOBILE SHEET */}
        <div className="sheet-wrap mobile-sheet">
          <div className="sheet">
            <div className="sheet-handle"/>
            <div className="sheet-inner">
              <div className="sheet-tabs">
                {TABS.map(([id,lb]) => (
                  <button key={id} className={`ds-nav-btn${tab===id?" on":""}`} onClick={() => setTab(id)} style={{padding:"12px 0"}}>{lb}</button>
                ))}
              </div>
              {CONTENT[tab]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}