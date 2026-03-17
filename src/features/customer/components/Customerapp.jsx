import { useState } from "react";
import { brandCss, MapView, TopOverlay, PanelLogo, Badge, SVCS, JOBS } from "../../../components/Shared";
// import StripeCheckout from "./CheckoutForm";
import TrackingMap from '../../tracking/components/TrackingMap';
import AddressPicker from '../../tracking/components/AddressPicker';
import * as api from "../../../services/api/api";
const TIMES = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM"];

export default function CustomerApp({ user, onLogout }) {
  const [view, setView]     = useState("home");
  const [sel, setSel]       = useState(null);
  const [addr, setAddr]     = useState("");
  const [date, setDate]     = useState("");
  const [time, setTime]     = useState("");

  const myJobs = JOBS.filter(j => j.washer === "Carlos M." || j.status === "active");
  const activeJob = myJobs.find(j => j.status === "active");
  const mapPhase = ["tracking","success"].includes(view) ? "tracking" : "home";

  // ── HOME ──
  const HomeView = () => (
    <div className="ds-body fade-slide">
      <div style={{marginBottom:22}}>
        <div style={{fontFamily:"var(--display)",fontSize:22,fontWeight:800,letterSpacing:"-0.7px",marginBottom:3}}>
          Good morning, {user.name.split(" ")[0]} 👋
        </div>
        <div style={{fontSize:14,color:"var(--muted)",fontWeight:600}}>Austin, TX · Ready to Woop?</div>
      </div>

      {/* Active booking card */}
      {activeJob && (
        <div
          onClick={() => setView("tracking")}
          style={{background:"linear-gradient(135deg,var(--ink),var(--ink2))",borderRadius:18,padding:18,marginBottom:18,cursor:"pointer",position:"relative",overflow:"hidden",border:"1px solid rgba(0,200,150,0.18)"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(0,200,150,0.12)"}}/>
          <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.4)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,position:"relative",zIndex:1}}>Active Woop</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:1,marginBottom:14}}>
            <div>
              <div style={{fontFamily:"var(--display)",fontSize:17,fontWeight:800,color:"white",letterSpacing:"-0.5px"}}>{activeJob.car}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:600,marginTop:3}}>{activeJob.svc} · Carlos en route</div>
            </div>
            <div style={{background:"rgba(0,200,150,0.18)",color:"var(--mint)",padding:"5px 11px",borderRadius:30,fontSize:11,fontWeight:800}}>🟢 Live</div>
          </div>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:600}}>En route</span>
              <span style={{fontSize:13,fontWeight:800,color:"var(--zap)"}}>~12 min</span>
            </div>
            <div style={{height:4,background:"rgba(255,255,255,0.1)",borderRadius:2}}>
              <div style={{height:"100%",width:"40%",background:"var(--mint)",borderRadius:2}}/>
            </div>
          </div>
          <div style={{position:"relative",zIndex:1,marginTop:12,fontSize:12,color:"rgba(255,255,255,0.3)",fontWeight:600}}>Tap to track live →</div>
        </div>
      )}

      <button className="cta-btn" style={{marginBottom:18}} onClick={() => setView("step1")}>
        Book a new Woop 🚗
      </button>

      <div className="ds-section-title">Services</div>
      <div className="svc-row">
        {SVCS.map(s => (
          <div key={s.id} className={`svc-chip${sel?.id===s.id?" sel":""}`} onClick={() => { setSel(s); setView("step1"); }}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-name">{s.name}</div>
            <div className="sc-price">${s.price}</div>
            <div className="sc-dur">{s.dur}</div>
          </div>
        ))}
      </div>

      <div className="ds-section-title" style={{marginTop:4}}>Recent Woops</div>
      {JOBS.slice(0,3).map(j => (
        <div className="admin-job-row" key={j.id}>
          <div className="ajr-icon">🚗</div>
          <div><div className="ajr-car">{j.car}</div><div className="ajr-svc">{j.svc}</div></div>
          <div className="ajr-right"><div className="ajr-price">${j.price}</div><Badge s={j.status}/></div>
        </div>
      ))}
    </div>
  );

  // ── STEP 1: SERVICE ──
  const Step1 = () => (
    <div className="ds-body fade-slide">
      <div className="step-header">
        <button className="back-btn" onClick={() => setView("home")}>←</button>
        <div className="step-title">Choose service</div>
        <div className="step-dots">{[0,1,2,3].map(i=><div key={i} className={`step-dot${i===0?" on":""}`}/>)}</div>
      </div>
      <div className="option-list">
        {SVCS.map(s => (
          <div key={s.id} className={`option-row${sel?.id===s.id?" sel":""}`} onClick={() => setSel(s)}>
            <div className="opt-icon">{s.icon}</div>
            <div><div className="opt-name">{s.name} Woop</div><div className="opt-desc">{s.desc} · {s.dur}</div></div>
            {sel?.id===s.id
              ? <div className="sel-check"><svg width="10" height="8" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              : <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontFamily:"var(--display)",fontSize:18,fontWeight:800}}>${s.price}</div><div style={{fontSize:11,color:"var(--muted)",fontWeight:600}}>{s.dur}</div></div>
            }
          </div>
        ))}
      </div>
      <button className="cta-btn" onClick={() => sel && setView("step2")} disabled={!sel}>
        {sel ? `Continue with ${sel.name} →` : "Select a service"}
      </button>
    </div>
  );

  // ── STEP 2: LOCATION ──
  const Step2 = () => (
    <div className="ds-body fade-slide">
      <div className="step-header">
        <button className="back-btn" onClick={() => setView("step1")}>←</button>
        <div className="step-title">Your location</div>
        <div className="step-dots">{[0,1,2,3].map(i=><div key={i} className={`step-dot${i===1?" on":""}`}/>)}</div>
      </div>
      <AddressPicker onSelect={(selectedAddr) => setAddr(selectedAddr)} />
      <div className="addr-input-row">
        <div className="addr-dot"/>
        <input className="addr-text" placeholder="Enter your address" value={addr} onChange={e=>setAddr(e.target.value)}/>
      </div>
      <input className="input-field" placeholder="Apt, unit, gate code (optional)" style={{marginBottom:16}}/>
      <div className="ds-section-title">Saved places</div>
      {[["🏠","Home","14 Maple St, Austin TX"],["💼","Work","200 Congress Ave, Austin TX"]].map(([ic,n,a])=>(
        <div key={n} className="option-row" style={{marginBottom:8}} onClick={()=>setAddr(a)}>
          <div className="opt-icon">{ic}</div>
          <div><div className="opt-name">{n}</div><div className="opt-desc">{a}</div></div>
        </div>
      ))}
      <button className="cta-btn" style={{marginTop:16}} onClick={() => addr && setView("step3")} disabled={!addr}>
        {addr ? "Confirm location →" : "Enter your address"}
      </button>
    </div>
  );

  // ── STEP 3: SCHEDULE ──
  const Step3 = () => (
    <div className="ds-body fade-slide">
      <div className="step-header">
        <button className="back-btn" onClick={() => setView("step2")}>←</button>
        <div className="step-title">When?</div>
        <div className="step-dots">{[0,1,2,3].map(i=><div key={i} className={`step-dot${i===2?" on":""}`}/>)}</div>
      </div>
      <input className="input-field" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      <div className="ds-section-title" style={{marginTop:6}}>Available times</div>
      <div className="time-grid">
        {TIMES.map(t => <button key={t} className={`time-chip${time===t?" sel":""}`} onClick={()=>setTime(t)}>{t}</button>)}
      </div>
      <div className="ds-section-title">Car</div>
      <div className="option-row" style={{marginBottom:18}}>
        <div className="opt-icon">🚗</div>
        <div><div className="opt-name">Tesla Model 3</div><div className="opt-desc">Plate: ABC 1234</div></div>
        <div style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:"var(--mint)"}}>Change</div>
      </div>
      <button className="cta-btn" onClick={() => date && time && setView("confirm")} disabled={!date||!time}>
        {date&&time ? "Review booking →" : "Pick date & time"}
      </button>
    </div>
  );

  // ── STEP 4: CONFIRM + STRIPE PAYMENT ──
  const Confirm = () => (
    <div className="ds-body fade-slide">
      <div className="step-header">
        <button className="back-btn" onClick={() => setView("step3")}>←</button>
        <div className="step-title">Review & pay</div>
        <div className="step-dots">{[0,1,2,3].map(i=><div key={i} className={`step-dot${i===3?" on":""}`}/>)}</div>
      </div>
      {sel && <>
        {/* Order summary */}
        <div style={{border:"2px solid var(--border)",borderRadius:16,padding:16,marginBottom:16}}>
          <div className="summary-row"><span className="sr-key">Service</span><span className="sr-val">{sel.icon} {sel.name} Woop</span></div>
          <div className="summary-row"><span className="sr-key">Duration</span><span className="sr-val">{sel.dur}</span></div>
          <div className="summary-row"><span className="sr-key">Location</span><span className="sr-val">{addr}</span></div>
          <div className="summary-row"><span className="sr-key">When</span><span className="sr-val">{date} · {time}</span></div>
          <div className="summary-row"><span className="sr-key">Car</span><span className="sr-val">Tesla Model 3</span></div>
          <div className="total-row"><span className="total-key">Total</span><span className="total-val">${sel.price}</span></div>
        </div>

        {/* Real Stripe payment form */}
        <div style={{ border: '2px solid var(--border)', borderRadius: 16, padding: 16, textAlign: 'center' }}>
          <button 
            className="cta-btn"
            onClick={async () => {
              // Payment confirmed by Stripe — now save the booking in your backend
              await api.createBooking({
                service_id:   sel.id,
                address:      addr,
                scheduled_at: `${date}T${time}`,
                price:        sel.price,
              });
              setView("success");
            }}
          >
            Pay ${sel.price} 💳
          </button>
        </div>
      </>}
    </div>
  );

  // ── SUCCESS ──
  const Success = () => (
    <div className="ds-body fade-slide" style={{textAlign:"center",paddingTop:24}}>
      <div className="success-icon">✓</div>
      <div className="success-title">Woop booked!</div>
      <div className="success-sub">Carlos M. is confirmed.<br/>You'll get SMS updates along the way.</div>
      <div className="washer-confirm-card">
        <div className="w-ava">C</div>
        <div style={{textAlign:"left"}}>
          <div style={{fontWeight:800,fontSize:15}}>Carlos M.</div>
          <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,marginTop:2}}>⭐ 4.9 · 142 Woops done</div>
          <div style={{fontSize:12,fontWeight:800,color:"var(--mint)",marginTop:4}}>Full Woop · Arriving ~12 min</div>
        </div>
      </div>
      <button className="cta-btn" onClick={() => setView("tracking")}>Track live →</button>
      <button className="sec-btn" style={{width:"100%",marginTop:10}} onClick={() => setView("home")}>Back to home</button>
    </div>
  );

  // ── TRACKING ──
  const Tracking = () => (
    <div className="ds-body fade-slide">
      <div className="step-header" style={{marginBottom:18}}>
        <button className="back-btn" onClick={() => setView("home")}>←</button>
        <div className="step-title">Live Tracking</div>
      </div>
      <TrackingMap
        customerLocation={{ lat: 30.2672, lng: -97.7431 }}
        washerLocation={{ lat: 30.2700, lng: -97.7400 }}
      />
      <div className="washer-bar" style={{marginTop:16}}>
        <div className="w-ava">C</div>
        <div style={{flex:1}}>
          <div className="w-name">Carlos M.</div>
          <div className="w-sub">⭐ 4.9 · Full Woop</div>
        </div>
        <div className="w-actions">
          <button className="w-act-btn">📞</button>
          <button className="w-act-btn">💬</button>
        </div>
      </div>
      <div className="eta-bar">
        <div><div className="eta-val">12 min</div><div className="eta-lbl">Estimated arrival</div></div>
        <div style={{textAlign:"right"}}><div className="eta-dist">2.4 km away</div><div className="eta-status">En route</div></div>
      </div>
      <div className="prog-track"><div className="prog-fill" style={{width:"40%"}}/></div>
      <div className="prog-labels">
        {["Confirmed","En route","Washing","Done"].map((l,i)=>(
          <span key={l} className={`prog-lbl${i<=1?" on":""}`}>{l}</span>
        ))}
      </div>
      <div className="action-row-2">
        <button className="sec-btn">🔔 Updates</button>
        <button className="sec-btn danger">✕ Cancel</button>
      </div>
    </div>
  );

  const VIEWS = { home:<HomeView/>, step1:<Step1/>, step2:<Step2/>, step3:<Step3/>, confirm:<Confirm/>, success:<Success/>, tracking:<Tracking/> };

  const Content = () => VIEWS[view] || <HomeView/>;

  return (
    <>
      <style>{brandCss}</style>
      <div className="shell">
        {/* DESKTOP */}
        <aside className="desktop-side">
          <PanelLogo user={user} onLogout={onLogout}/>
          <Content/>
        </aside>

        {/* MAP */}
        <MapView phase={mapPhase}/>
        <TopOverlay user={user}/>

        {/* MOBILE SHEET */}
        <div className="sheet-wrap mobile-sheet">
          <div className="sheet">
            <div className="sheet-handle"/>
            <div className="sheet-inner"><Content/></div>
          </div>
        </div>
      </div>
    </>
  );
}