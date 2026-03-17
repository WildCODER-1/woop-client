import { useState } from "react";
import { brandCss, MapView, TopOverlay, PanelLogo, Badge, JOBS, WASHERS, BARS, DAYS } from "../../../components/Shared";

export default function AdminApp({ user, onLogout }) {
  const [tab, setTab]     = useState("live");
  const [jobs, setJobs]   = useState(JOBS);
  const [modal, setModal] = useState(null);

  const TABS = [["live","Live"],["team","Team"],["analytics","Analytics"]];

  const assign = (jobId, washerName) => {
    setJobs(p => p.map(j => j.id===jobId ? {...j, washer:washerName, status:"active"} : j));
    setModal(null);
  };

  // ── LIVE ──
  const Live = () => (
    <div className="ds-body fade-slide">
      <div className="kpi-row">
        {[["$220","Revenue","↑ +18%"],["4","Jobs","2 active"],["3/4","Washers","1 offline"],["4.9★","Rating","stable"]].map(([v,l,c]) => (
          <div className="kpi-u" key={l}>
            <div className="kpi-u-val">{v}</div>
            <div className="kpi-u-lbl">{l}</div>
            <div className="kpi-u-chg">{c}</div>
          </div>
        ))}
      </div>
      <div className="ds-section-title">Live Jobs</div>
      {jobs.map(j => (
        <div className="admin-job-row" key={j.id}>
          <div className="ajr-icon">🚗</div>
          <div>
            <div className="ajr-car">{j.car}</div>
            <div className="ajr-svc">{j.svc} · {j.washer}</div>
          </div>
          <div className="ajr-right">
            <div className="ajr-price">${j.price}</div>
            <Badge s={j.status}/>
          </div>
          {j.washer === "Unassigned" && (
            <button className="assign-btn" onClick={() => setModal(j.id)}>Assign</button>
          )}
        </div>
      ))}
    </div>
  );

  // ── TEAM ──
  const Team = () => (
    <div className="ds-body fade-slide">
      <div className="kpi-row">
        <div className="kpi-u"><div className="kpi-u-val">3/4</div><div className="kpi-u-lbl">Online now</div></div>
        <div className="kpi-u"><div className="kpi-u-val">4.9</div><div className="kpi-u-lbl">Avg rating</div></div>
      </div>
      <div className="ds-section-title">Washers</div>
      {WASHERS.map(w => (
        <div className="washer-row-u" key={w.n}>
          <div className="wu-ava">{w.init}</div>
          <div>
            <div className="wu-name">{w.n}</div>
            <div className="wu-status">
              <div className="wu-dot" style={{background:w.dot}}/>
              {w.status} · {w.jobs} woops
            </div>
          </div>
          <div className="wu-rating">⭐ {w.r}</div>
        </div>
      ))}
    </div>
  );

  // ── ANALYTICS ──
  const Analytics = () => (
    <div className="ds-body fade-slide">
      <div className="earn-hero">
        <div className="earn-lbl">WEEKLY REVENUE</div>
        <div className="earn-val">$1,540</div>
        <div className="earn-chg">↑ +12% vs last week</div>
      </div>
      <div className="bar-chart-u" style={{marginBottom:6}}>
        {BARS.map((h,i) => <div key={i} className={`bar-u${i===5?" on":""}`} style={{height:`${h}%`}}/>)}
      </div>
      <div className="bar-lbls" style={{marginBottom:20}}>
        {DAYS.map((l,i) => <div key={i} className="bar-l">{l}</div>)}
      </div>
      <div className="ds-section-title">Service Mix</div>
      {[["Express Woop",42],["Full Woop",28],["Deep Woop",17],["Inside Woop",13]].map(([n,p]) => (
        <div key={n} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:13,fontWeight:700}}>{n}</span>
            <span style={{fontSize:13,fontWeight:800,color:"var(--mint)"}}>{p}%</span>
          </div>
          <div style={{height:5,background:"var(--border)",borderRadius:3}}>
            <div style={{height:"100%",width:`${p*2.38}%`,background:"linear-gradient(90deg,var(--mint),var(--zap))",borderRadius:3}}/>
          </div>
        </div>
      ))}
    </div>
  );

  const CONTENT = { live:<Live/>, team:<Team/>, analytics:<Analytics/> };

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
        <MapView phase="admin" jobs={jobs}/>
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

        {/* ASSIGN MODAL */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal-panel" onClick={e => e.stopPropagation()}>
              <div className="modal-handle"/>
              <div className="modal-title">Assign a washer</div>
              <div className="modal-sub">
                {jobs.find(j => j.id===modal)?.car} · {jobs.find(j => j.id===modal)?.svc}
              </div>
              {WASHERS.filter(w => w.status !== "Off duty").map(w => (
                <div key={w.n} className="washer-pick-row" onClick={() => assign(modal, w.n)}>
                  <div className="wu-ava">{w.init}</div>
                  <div>
                    <div style={{fontWeight:800,fontSize:14}}>{w.n}</div>
                    <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,marginTop:2,display:"flex",alignItems:"center",gap:5}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:w.dot}}/>
                      {w.status} · ⭐ {w.r}
                    </div>
                  </div>
                  <button className="assign-btn" style={{marginLeft:"auto"}}>Assign</button>
                </div>
              ))}
              <button
                style={{width:"100%",marginTop:10,padding:"13px",borderRadius:12,background:"var(--off)",border:"1.5px solid var(--border)",cursor:"pointer",fontFamily:"var(--font)",fontWeight:700,fontSize:14}}
                onClick={() => setModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}