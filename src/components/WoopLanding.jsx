import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --mint: #00C896;
    --mint-d: #00A87D;
    --mint-l: #E6FBF4;
    --zap: #FFE134;
    --ink: #0D1F1A;
    --ink2: #1A3A30;
    --slate: #5A7A6E;
    --foam: #ffffff;
    --max: 1200px;
  }

  html { scroll-behavior: smooth; }
  body {
    font-family: 'Nunito', sans-serif;
    background: var(--ink);
    color: var(--foam);
    overflow-x: hidden;
  }

  .container { max-width: var(--max); margin: 0 auto; padding: 0 40px; }
  @media (max-width: 768px) { .container { padding: 0 20px; } }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    padding: 0 40px; height: 68px;
    display: flex; align-items: center; justify-content: space-between;
    transition: all 0.3s;
  }
  nav.scrolled {
    background: rgba(13,31,26,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    height: 60px;
  }
  .nav-logo {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 24px;
    letter-spacing: -1px; color: white; text-decoration: none;
    display: flex; align-items: center; gap: 10px;
  }
  .nav-logo-mark {
    width: 34px; height: 34px; border-radius: 10px;
    background: var(--mint); display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(0,200,150,0.4);
  }
  .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .nav-links a {
    color: rgba(255,255,255,0.5); font-size: 14px; font-weight: 700;
    text-decoration: none; transition: color 0.2s; letter-spacing: 0.2px;
  }
  .nav-links a:hover { color: white; }
  .nav-cta {
    background: var(--mint) !important; color: var(--ink) !important;
    padding: 9px 20px; border-radius: 11px; font-weight: 900 !important;
    box-shadow: 0 4px 16px rgba(0,200,150,0.35);
  }
  .nav-cta:hover { background: var(--zap) !important; }

  @media (max-width: 768px) {
    nav { padding: 0 20px; }
    .nav-links { display: none; }
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 60px;
    padding: 100px 40px 80px;
    max-width: var(--max);
    margin: 0 auto;
    position: relative;
  }

  .hero-left { position: relative; z-index: 1; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(0,200,150,0.1); border: 1px solid rgba(0,200,150,0.22);
    color: var(--mint); padding: 6px 14px; border-radius: 30px;
    font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;
    margin-bottom: 24px; animation: fadeUp 0.6s ease both;
  }

  .hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(44px, 5.5vw, 76px);
    font-weight: 800; line-height: 1.0; letter-spacing: -2.5px;
    margin-bottom: 22px; animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-title .accent {
    background: linear-gradient(90deg, var(--mint), var(--zap));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .hero-sub {
    font-size: 17px; font-weight: 600; color: rgba(255,255,255,0.45);
    line-height: 1.75; margin-bottom: 36px; max-width: 480px;
    animation: fadeUp 0.6s 0.2s ease both;
  }
  .hero-sub strong { color: rgba(255,255,255,0.8); font-weight: 800; }

  .hero-actions {
    display: flex; gap: 12px; flex-wrap: wrap;
    margin-bottom: 52px; animation: fadeUp 0.6s 0.3s ease both;
  }
  .btn-hero {
    padding: 15px 32px; border-radius: 14px; font-size: 15px; font-weight: 900;
    cursor: pointer; border: none; font-family: 'Nunito', sans-serif;
    transition: all 0.2s; letter-spacing: 0.2px; display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-hero-primary { background: var(--mint); color: var(--ink); box-shadow: 0 6px 28px rgba(0,200,150,0.38); }
  .btn-hero-primary:hover { background: var(--zap); transform: translateY(-2px); }
  .btn-hero-ghost {
    background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7);
    border: 1.5px solid rgba(255,255,255,0.12);
  }
  .btn-hero-ghost:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.22); color: white; }

  .hero-stats {
    display: flex; gap: 0;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px; overflow: hidden;
    animation: fadeUp 0.6s 0.4s ease both;
    width: fit-content;
  }
  .hstat {
    padding: 18px 32px;
    border-right: 1px solid rgba(255,255,255,0.08);
  }
  .hstat:last-child { border-right: none; }
  .hstat-val {
    font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800;
    color: white; line-height: 1;
  }
  .hstat-val em { color: var(--mint); font-style: normal; }
  .hstat-lbl { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

  .hero-right {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: center;
  }

  @media (max-width: 768px) {
    .hero {
      grid-template-columns: 1fr;
      min-height: auto;
      padding: 60px 20px 80px;
      gap: 40px;
    }
    .hero-title {
      font-size: clamp(32px, 7vw, 54px);
      letter-spacing: -1.5px;
      margin-bottom: 16px;
    }
    .hero-sub {
      font-size: 15px;
      margin-bottom: 28px;
      max-width: 100%;
    }
    .hero-actions {
      flex-direction: column;
      gap: 10px;
    }
    .btn-hero {
      width: 100%;
      justify-content: center;
      padding: 13px 20px;
    }
    .hero-right {
      width: 100%;
    }
    .mockup-card {
      width: 100%;
    }
  }

  .mockup-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px; padding: 28px;
    backdrop-filter: blur(12px);
  }

  .mockup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
  .mockup-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; }
  .mockup-pill {
    background: rgba(0,200,150,0.15); color: var(--mint);
    padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800;
    display: flex; align-items: center; gap: 5px;
  }

  .mockup-map {
    width: 100%; height: 160px; border-radius: 16px;
    background: linear-gradient(135deg, #0D2820, #1A3A30);
    position: relative; overflow: hidden; margin-bottom: 18px;
  }

  .mockup-jobs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .mockup-job {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px; padding: 14px;
  }
  .mj-car { font-weight: 900; font-size: 13px; margin-bottom: 4px; }
  .mj-svc { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; margin-bottom: 10px; }
  .mj-price { font-weight: 900; color: var(--mint); font-size: 16px; font-family: 'Syne', sans-serif; }

  /* ── SECTIONS ── */
  .section { padding: 100px 40px; max-width: var(--max); margin: 0 auto; }
  @media (max-width: 768px) { .section { padding: 70px 20px; } }

  .eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 3px; color: var(--mint); text-transform: uppercase; text-align: center; margin-bottom: 12px; }
  .sec-title {
    font-family: 'Syne', sans-serif; font-size: clamp(30px, 4vw, 48px);
    font-weight: 800; letter-spacing: -1.5px; text-align: center;
    margin-bottom: 12px; line-height: 1.1;
  }
  .sec-sub { text-align: center; color: rgba(255,255,255,0.38); font-size: 16px; font-weight: 600; line-height: 1.7; max-width: 460px; margin: 0 auto 56px; }

  .steps-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 2px; border-radius: 24px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
  }
  .step-item {
    background: #0D1F1A; padding: 44px 36px;
    position: relative; overflow: hidden; transition: background 0.3s;
  }
  .step-item:hover { background: #122A20; }
  .step-n {
    font-family: 'Syne', sans-serif; font-size: 72px; font-weight: 800;
    color: rgba(0,200,150,0.08); line-height: 1; margin-bottom: 12px;
  }
  .step-ic { font-size: 36px; margin-bottom: 16px; display: block; }
  .step-t { font-family: 'Syne', sans-serif; font-size: 21px; font-weight: 700; margin-bottom: 10px; }
  .step-d { font-size: 14px; color: rgba(255,255,255,0.38); line-height: 1.75; font-weight: 600; }

  @media (max-width: 900px) { .steps-row { grid-template-columns: 1fr; } }

  /* ── SERVICES ── */
  .services-sec { padding: 0 40px 100px; max-width: var(--max); margin: 0 auto; }
  @media (max-width: 768px) { .services-sec { padding: 0 20px 70px; } }

  .svc-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .svc-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 22px; padding: 32px 26px;
    cursor: pointer; transition: all 0.25s;
  }
  .svc-card:hover { border-color: rgba(0,200,150,0.28); transform: translateY(-8px); }
  .svc-emoji { font-size: 40px; margin-bottom: 18px; display: block; }
  .svc-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: white; margin-bottom: 8px; }
  .svc-desc { font-size: 13px; color: rgba(255,255,255,0.35); font-weight: 600; margin-bottom: 24px; line-height: 1.65; }
  .svc-price { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; color: var(--mint); }
  .svc-dur { font-size: 11px; color: rgba(255,255,255,0.28); font-weight: 700; margin-top: 4px; }

  @media (max-width: 1024px) { .svc-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 560px) { .svc-grid { grid-template-columns: 1fr; } }

  /* ── REVIEWS ── */
  .reviews-sec {
    padding: 100px 40px; max-width: var(--max); margin: 0 auto;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  @media (max-width: 768px) { .reviews-sec { padding: 70px 20px; } }

  .reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .review-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 22px; padding: 30px; transition: border-color 0.3s;
  }
  .review-card:hover { border-color: rgba(0,200,150,0.22); }
  .rev-stars { color: var(--zap); font-size: 14px; margin-bottom: 16px; letter-spacing: 2px; }
  .rev-text { font-size: 15px; color: rgba(255,255,255,0.55); line-height: 1.75; font-weight: 600; margin-bottom: 22px; font-style: italic; }
  .rev-author { display: flex; align-items: center; gap: 12px; }
  .rev-ava {
    width: 38px; height: 38px; border-radius: 11px;
    background: linear-gradient(135deg, var(--mint), var(--ink2));
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: 15px; color: white; flex-shrink: 0;
  }
  .rev-name { font-weight: 800; font-size: 14px; }
  .rev-loc { font-size: 12px; color: rgba(255,255,255,0.28); font-weight: 600; }
  @media (max-width: 900px) { .reviews-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .reviews-grid { grid-template-columns: 1fr; } }

  /* ── CTA ── */
  .cta-wrap {
    margin: 0 40px 80px; border-radius: 28px; overflow: hidden;
    max-width: calc(var(--max) - 80px); margin-left: auto; margin-right: auto;
    background: linear-gradient(135deg, #0D2820, #1A3A30);
    border: 1px solid rgba(0,200,150,0.18);
    padding: 80px 60px; text-align: center;
  }
  .cta-title { font-family: 'Syne', sans-serif; font-size: clamp(32px, 5vw, 58px); font-weight: 800; letter-spacing: -2px; margin-bottom: 14px; }
  .cta-sub { color: rgba(255,255,255,0.4); font-size: 17px; font-weight: 600; margin-bottom: 40px; }
  .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .app-dl {
    display: flex; align-items: center; gap: 11px;
    background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 14px; padding: 13px 22px; cursor: pointer; transition: all 0.2s;
    color: white; font-family: 'Nunito', sans-serif;
  }
  .app-dl:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.22); }
  .app-dl-icon { font-size: 28px; }
  .app-dl-sub { font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 700; display: block; }
  .app-dl-name { font-size: 16px; font-weight: 900; display: block; }
  @media (max-width: 768px) { .cta-wrap { margin: 0 20px 60px; padding: 50px 24px; } }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 48px 40px;
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 40px; max-width: var(--max); margin: 0 auto;
  }
  .foot-logo { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: white; margin-bottom: 10px; }
  .foot-tagline { font-size: 13px; color: rgba(255,255,255,0.3); font-weight: 600; line-height: 1.65; }
  .foot-col-title { font-size: 12px; font-weight: 800; letter-spacing: 1.5px; color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 16px; }
  .foot-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .foot-links a { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; }
  .foot-links a:hover { color: var(--mint); }
  .foot-bottom {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 20px 40px; max-width: var(--max); margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
  }
  .foot-copy { font-size: 13px; color: rgba(255,255,255,0.2); font-weight: 600; }
  .foot-mint { font-size: 13px; color: rgba(0,200,150,0.4); font-weight: 700; }
  @media (max-width: 900px) {
    footer { grid-template-columns: 1fr 1fr; padding: 40px 20px; }
    .foot-bottom { padding: 20px; flex-direction: column; gap: 8px; text-align: center; }
  }
  @media (max-width: 560px) { footer { grid-template-columns: 1fr; } }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SVCS = [
  { icon:"💧", name:"Express Woop", desc:"Exterior quick-clean", price:25, dur:"30 min" },
  { icon:"✨", name:"Full Woop", desc:"Interior + exterior", price:75, dur:"90 min" },
  { icon:"🏆", name:"Deep Woop", desc:"Full detail", price:120, dur:"2 hrs" },
  { icon:"🪣", name:"Inside Woop", desc:"Interior only", price:45, dur:"60 min" },
];

const REVIEWS = [
  { text:"Booked a Full Woop at 8am. Carlos was at my door by 9 and my car looked brand new.", name:"Sarah K.", loc:"Austin, TX", init:"S" },
  { text:"I don't think I'll ever drive to a car wash again. This is just better in every way.", name:"Mike R.", loc:"Austin, TX", init:"M" },
  { text:"The Deep Woop is worth every penny. I'm a customer for life.", name:"Emily D.", loc:"Austin, TX", init:"E" },
];

export default function WoopLanding({ onBook = () => {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState({ w: 0, c: 0, r: 0 });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const targets = { w: 12400, c: 8, r: 4.9 };
    let step = 0; const steps = 60;
    const t = setInterval(() => {
      step++;
      const p = 1 - Math.pow(1 - step / steps, 3);
      setCount({ w: Math.round(targets.w * p), c: Math.round(targets.c * p), r: Math.round(targets.r * p * 10) / 10 });
      if (step >= steps) clearInterval(t);
    }, 2000 / steps);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">
            <svg width="18" height="12" viewBox="0 0 54 36" fill="none">
              <path d="M2 7 Q9.5 30 16 20 Q22.5 10 27 20 Q31.5 30 38 20 Q44.5 10 52 7" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          woop
        </a>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#" className="nav-cta">Book Now →</a></li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", overflow: "hidden", paddingTop: "80px" }}>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-badge">✓ Now live in Austin, TX</div>
            <h1 className="hero-title">
              Your car,<br />
              <span className="accent">gleaming</span><br />
              at your door.
            </h1>
            <p className="hero-sub">
              Book a professional hand wash in <strong>60 seconds</strong>.
              We come to you — driveway, parking lot, anywhere.
            </p>
            <div className="hero-actions">
              <button className="btn-hero btn-hero-primary" onClick={onBook}>Book a Woop 🚗</button>
              <button className="btn-hero btn-hero-ghost" onClick={onBook}>Sign in →</button>
            </div>
            <div className="hero-stats">
              <div className="hstat">
                <div className="hstat-val">{count.w.toLocaleString()}<em>+</em></div>
                <div className="hstat-lbl">Woops done</div>
              </div>
              <div className="hstat">
                <div className="hstat-val">{count.c}</div>
                <div className="hstat-lbl">Cities</div>
              </div>
              <div className="hstat">
                <div className="hstat-val">{count.r}<em>★</em></div>
                <div className="hstat-lbl">Avg rating</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="mockup-card">
              <div className="mockup-header">
                <div className="mockup-title">Live Jobs</div>
                <div className="mockup-pill">🟢 2 active</div>
              </div>
              <div className="mockup-map"></div>
              <div className="mockup-jobs">
                {[{car:"Tesla Model 3",svc:"Full Woop",price:75},{car:"Ford F-150",svc:"Express Woop",price:25}].map(j=>(
                  <div className="mockup-job" key={j.car}>
                    <div className="mj-car">{j.car}</div>
                    <div className="mj-svc">{j.svc}</div>
                    <div className="mj-price">${j.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div id="how" className="section">
        <div className="eyebrow">How it works</div>
        <h2 className="sec-title">Three steps to spotless</h2>
        <p className="sec-sub">No driving, no waiting, no hassle.</p>
        <div className="steps-row">
          {[
            {n:"01",ic:"📍",t:"Drop a pin",d:"Enter your address. We come to you — anywhere."},
            {n:"02",ic:"🧴",t:"Pick your Woop",d:"Choose Express, Full, Deep, or Inside service."},
            {n:"03",ic:"✨",t:"We woop it",d:"Professional hand-wash. Live updates the whole time."},
          ].map(s=>(
            <div className="step-item" key={s.n}>
              <div className="step-n">{s.n}</div>
              <span className="step-ic">{s.ic}</span>
              <div className="step-t">{s.t}</div>
              <div className="step-d">{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <div id="services" className="services-sec">
        <div className="eyebrow">Services</div>
        <h2 className="sec-title">Pick your Woop</h2>
        <div className="svc-grid">
          {SVCS.map(s=>(
            <div className="svc-card" key={s.name}>
              <span className="svc-emoji">{s.icon}</span>
              <div className="svc-name">{s.name}</div>
              <div className="svc-desc">{s.desc}</div>
              <div className="svc-price">${s.price}</div>
              <div className="svc-dur">⏱ {s.dur}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <div id="reviews" className="reviews-sec">
        <div className="eyebrow">Reviews</div>
        <h2 className="sec-title">People love their Woops</h2>
        <div className="reviews-grid">
          {REVIEWS.map(r=>(
            <div className="review-card" key={r.name}>
              <div className="rev-stars">★★★★★</div>
              <div className="rev-text">"{r.text}"</div>
              <div className="rev-author">
                <div className="rev-ava">{r.init}</div>
                <div><div className="rev-name">{r.name}</div><div className="rev-loc">{r.loc}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="cta-wrap">
        <h2 className="cta-title">Ready to Woop?</h2>
        <p className="cta-sub">Download the app or book online.</p>
        <div className="cta-btns">
          <button className="btn-hero btn-hero-primary" onClick={onBook} style={{flex:1}}>Start booking now →</button>
          <button className="btn-hero btn-hero-ghost" onClick={onBook} style={{flex:1}}>Sign in</button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div>
          <div className="foot-logo">woop.</div>
          <div className="foot-tagline">Your car, gleaming at your door. On-demand hand car wash in Austin, TX.</div>
        </div>
        <div>
          <div className="foot-col-title">Product</div>
          <ul className="foot-links">
            {["How it works","Services","Pricing"].map(l=><li key={l}><a href="#">{l}</a></li>)}
          </ul>
        </div>
        <div>
          <div className="foot-col-title">Company</div>
          <ul className="foot-links">
            {["About","Blog","Careers"].map(l=><li key={l}><a href="#">{l}</a></li>)}
          </ul>
        </div>
        <div>
          <div className="foot-col-title">Legal</div>
          <ul className="foot-links">
            {["Privacy","Terms","Contact"].map(l=><li key={l}><a href="#">{l}</a></li>)}
          </ul>
        </div>
      </footer>
      <div className="foot-bottom">
        <div className="foot-copy">© 2026 Woop Inc. All rights reserved.</div>
        <div className="foot-mint">Made with 💧 in Austin, TX</div>
      </div>
    </>
  );
}
