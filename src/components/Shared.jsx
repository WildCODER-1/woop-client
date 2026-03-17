// ── Shared brand CSS injected into every app ──────────────────
export const brandCss = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0D1F1A; --ink2: #1A3A30;
    --white: #ffffff; --off: #F4FBF8; --border: #D6EFE6; --muted: #5A7A6E;
    --mint: #00C896; --mint-d: #00A87D; --mint-l: #E6FBF4;
    --zap: #FFE134; --zap-d: #F5C800;
    --red: #FF4757;
    --font: 'Nunito', sans-serif; --display: 'Syne', sans-serif;
  }
  html, body { height: 100%; overflow: hidden; }
  body { font-family: var(--font); background: var(--ink); color: var(--ink); -webkit-font-smoothing: antialiased; }

  .shell { width: 100%; max-width: 1440px; height: 100vh; margin: 0 auto; display: flex; background: white; position: relative; overflow: hidden; }

  /* MAP */
  .map-layer { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
  .map-bg {
    position: absolute; inset: 0;
    background: linear-gradient(rgba(0,200,150,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,150,0.04) 1px, transparent 1px);
    background-size: 40px 40px; background-color: #1A3020;
  }
  .map-road { position: absolute; background: rgba(0,200,150,0.12); }
  .map-block { position: absolute; background: #152818; border-radius: 3px; }
  .map-park  { position: absolute; background: #1E3D1A; border-radius: 4px; }
  .map-water { position: absolute; background: #0D2830; border-radius: 8px; }
  .pin { position: absolute; display: flex; flex-direction: column; align-items: center; transform: translate(-50%,-100%); animation: pinDrop 0.4s cubic-bezier(0.34,1.56,0.64,1); cursor: pointer; z-index: 10; }
  @keyframes pinDrop { from{transform:translate(-50%,-130%);opacity:0} to{transform:translate(-50%,-100%);opacity:1} }
  .pin-bubble { background: var(--ink); color: white; padding: 7px 12px; border-radius: 10px; font-size: 12px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 6px; border: 1px solid rgba(0,200,150,0.2); }
  .pin-tail { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid var(--ink); }
  .pin-home .pin-bubble { background: var(--mint); border-color: var(--mint-d); }
  .pin-home .pin-tail { border-top-color: var(--mint); }
  .car-pin { position: absolute; font-size: 28px; transform: translate(-50%,-50%); filter: drop-shadow(0 3px 8px rgba(0,0,0,0.4)); z-index: 10; animation: carMove 0.6s ease; }
  @keyframes carMove { from{transform:translate(-50%,-50%) scale(0.8)} to{transform:translate(-50%,-50%) scale(1)} }
  .route-line { position: absolute; pointer-events: none; top:0; left:0; width:100%; height:100%; }

  /* TOP OVERLAY */
  .top-overlay { position: absolute; top:0; left:0; right:0; z-index:100; padding:20px 20px 0; display:flex; justify-content:space-between; align-items:flex-start; pointer-events:none; }
  .top-overlay > * { pointer-events: all; }
  .topbar-pill { background: var(--ink); border-radius: 14px; padding: 10px 16px; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 16px rgba(0,0,0,0.3); border: 1px solid rgba(0,200,150,0.18); }
  .tp-logo { font-size: 15px; font-weight: 800; letter-spacing: -0.5px; color: white; font-family: var(--display); }
  .tp-sep { width: 1px; height: 16px; background: rgba(255,255,255,0.12); }
  .tp-addr { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.45); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tp-addr strong { color: white; font-weight: 700; }
  .top-right { display: flex; gap: 9px; flex-direction: column; align-items: flex-end; }
  .map-btn { width: 42px; height: 42px; border-radius: 12px; background: var(--ink); border: 1px solid rgba(0,200,150,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 12px rgba(0,0,0,0.3); transition: transform 0.15s; }
  .map-btn:active { transform: scale(0.93); }

  /* SIDE PANEL */
  .desktop-side { width: 400px; flex-shrink: 0; height: 100vh; overflow-y: auto; position: relative; z-index: 50; background: white; box-shadow: 2px 0 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
  .desktop-side::-webkit-scrollbar { display: none; }
  .ds-top { padding: 22px 24px 0; position: sticky; top: 0; background: var(--ink); z-index: 10; padding-bottom: 0; border-bottom: 1px solid rgba(0,200,150,0.15); }
  .ds-logo { font-family: var(--display); font-size: 20px; font-weight: 800; color: white; letter-spacing: -0.5px; display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .ds-logo-mark { width: 30px; height: 30px; border-radius: 9px; background: var(--mint); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 12px rgba(0,200,150,0.4); flex-shrink: 0; }
  .ds-user-row { display: flex; align-items: center; gap: 10px; padding: 12px 0 14px; border-top: 1px solid rgba(255,255,255,0.07); }
  .ds-user-ava { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg,var(--mint),var(--ink2)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 12px; flex-shrink: 0; }
  .ds-user-name { font-size: 12px; font-weight: 800; color: white; }
  .ds-user-role { font-size: 10px; color: rgba(255,255,255,0.3); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .ds-logout { margin-left: auto; background: none; border: none; cursor: pointer; font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.25); font-family: var(--font); transition: color 0.15s; padding: 4px 8px; border-radius: 6px; }
  .ds-logout:hover { color: var(--red); background: rgba(255,71,87,0.08); }
  .ds-nav { display: flex; }
  .ds-nav-btn { flex: 1; padding: 11px 6px; background: none; border: none; cursor: pointer; font-family: var(--font); font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.35); border-bottom: 2px solid transparent; transition: all 0.18s; letter-spacing: 0.2px; }
  .ds-nav-btn.on { color: var(--mint); border-bottom-color: var(--mint); }
  .ds-body { padding: 22px 24px; flex: 1; }
  .ds-section-title { font-size: 10px; font-weight: 800; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; }

  /* BOTTOM SHEET (mobile) */
  .sheet-wrap { position: absolute; bottom: 0; left: 0; right: 0; z-index: 200; pointer-events: none; }
  .sheet { background: white; border-radius: 20px 20px 0 0; pointer-events: all; box-shadow: 0 -4px 30px rgba(0,0,0,0.15); }
  .sheet-handle { width: 36px; height: 4px; background: var(--border); border-radius: 2px; margin: 12px auto 0; }
  .sheet-inner { padding: 14px 20px 32px; }
  .sheet-tabs { display: flex; background: var(--ink); margin: -14px -20px 16px; padding: 0 20px; border-radius: 20px 20px 0 0; border-bottom: 1px solid rgba(0,200,150,0.15); }

  /* BUTTONS */
  .cta-btn { width: 100%; padding: 16px; border-radius: 14px; background: var(--mint); color: var(--ink); font-size: 15px; font-weight: 900; border: none; cursor: pointer; font-family: var(--font); transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 18px rgba(0,200,150,0.28); }
  .cta-btn:hover { background: var(--mint-d); transform: translateY(-1px); }
  .cta-btn:active { transform: scale(0.98); }
  .cta-btn.zap { background: var(--zap); color: var(--ink); box-shadow: 0 4px 18px rgba(255,225,52,0.28); }
  .cta-btn.zap:hover { background: var(--zap-d); }
  .cta-btn.ink { background: var(--ink); color: white; box-shadow: none; }
  .cta-btn.ink:hover { background: var(--ink2); }
  .cta-btn:disabled { background: var(--border); color: var(--muted); box-shadow: none; cursor: not-allowed; transform: none; }
  .sec-btn { padding: 13px; border-radius: 14px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: var(--font); transition: all 0.18s; border: 2px solid var(--border); background: white; display: flex; align-items: center; justify-content: center; gap: 7px; }
  .sec-btn:hover { background: var(--off); border-color: var(--mint); }
  .sec-btn.danger { color: var(--red); border-color: #ffe5e5; background: #fff5f5; }
  .sec-btn.danger:hover { background: #ffe5e5; border-color: var(--red); }
  .back-btn { width: 38px; height: 38px; border-radius: 50%; background: var(--off); border: none; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; }
  .back-btn:hover { background: var(--border); }
  .jcu-btn { flex: 1; padding: 11px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: var(--font); border: none; transition: all 0.18s; }
  .jcu-btn.primary { background: var(--mint); color: var(--ink); font-weight: 900; }
  .jcu-btn.primary:hover { background: var(--mint-d); }
  .jcu-btn.secondary { background: var(--off); color: var(--ink); border: 1.5px solid var(--border); }
  .jcu-btn.secondary:hover { background: var(--border); }
  .assign-btn { padding: 7px 14px; border-radius: 30px; background: var(--mint); color: var(--ink); font-size: 12px; font-weight: 800; border: none; cursor: pointer; font-family: var(--font); transition: all 0.18s; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,200,150,0.3); }
  .assign-btn:hover { background: var(--mint-d); }

  /* FORM */
  .step-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .step-title { font-family: var(--display); font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
  .step-dots { display: flex; gap: 6px; margin-left: auto; }
  .step-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); transition: background 0.3s; }
  .step-dot.on { background: var(--mint); }
  .input-field { width: 100%; padding: 14px 16px; border-radius: 13px; border: 2px solid var(--border); font-size: 15px; font-family: var(--font); color: var(--ink); background: white; outline: none; font-weight: 600; margin-bottom: 10px; transition: border 0.18s; }
  .input-field:focus { border-color: var(--mint); }
  .addr-input-row { display: flex; align-items: center; gap: 10px; background: var(--off); border-radius: 14px; padding: 14px 16px; cursor: pointer; margin-bottom: 10px; transition: background 0.15s; border: 2px solid transparent; }
  .addr-input-row:focus-within { border-color: var(--mint); background: white; }
  .addr-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--mint); flex-shrink: 0; }
  .addr-text { font-size: 15px; font-weight: 600; color: var(--ink); flex: 1; background: none; border: none; outline: none; font-family: var(--font); }
  .addr-text::placeholder { color: var(--muted); font-weight: 500; }
  .time-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 18px; }
  .time-chip { padding: 12px 8px; border-radius: 12px; text-align: center; font-size: 13px; font-weight: 700; cursor: pointer; border: 2px solid var(--border); background: white; transition: all 0.18s; font-family: var(--font); }
  .time-chip:hover { border-color: var(--mint); }
  .time-chip.sel { background: var(--mint); color: var(--ink); border-color: var(--mint); font-weight: 900; }
  .option-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
  .option-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; border: 2px solid var(--border); cursor: pointer; transition: all 0.18s; background: white; }
  .option-row:hover { border-color: var(--mint); }
  .option-row.sel { border-color: var(--mint); background: var(--mint-l); }
  .opt-icon { font-size: 24px; width: 42px; height: 42px; border-radius: 12px; background: var(--off); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .opt-name { font-size: 15px; font-weight: 700; }
  .opt-desc { font-size: 12px; color: var(--muted); margin-top: 1px; font-weight: 500; }
  .sel-check { margin-left: auto; width: 22px; height: 22px; border-radius: 50%; background: var(--mint); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .svc-row { display: flex; gap: 10px; margin-bottom: 18px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
  .svc-row::-webkit-scrollbar { display: none; }
  .svc-chip { flex-shrink: 0; background: var(--off); border: 2px solid transparent; border-radius: 14px; padding: 14px 16px; cursor: pointer; transition: all 0.18s; text-align: center; min-width: 96px; }
  .svc-chip:hover { background: var(--border); }
  .svc-chip.sel { background: var(--ink); border-color: var(--mint); }
  .svc-chip.sel .sc-name { color: white; }
  .svc-chip.sel .sc-price { color: var(--mint); }
  .svc-chip.sel .sc-dur { color: rgba(255,255,255,0.45); }
  .sc-icon { font-size: 24px; margin-bottom: 5px; }
  .sc-name { font-size: 12px; font-weight: 700; }
  .sc-price { font-size: 15px; font-weight: 900; margin-top: 2px; }
  .sc-dur { font-size: 10px; color: var(--muted); margin-top: 1px; font-weight: 600; }

  /* SUMMARY */
  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 13px 0; border-bottom: 1px solid var(--border); }
  .summary-row:last-child { border-bottom: none; }
  .sr-key { font-size: 14px; color: var(--muted); font-weight: 600; }
  .sr-val { font-size: 14px; font-weight: 700; text-align: right; max-width: 55%; }
  .total-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 4px; }
  .total-key { font-size: 17px; font-weight: 800; }
  .total-val { font-family: var(--display); font-size: 28px; font-weight: 800; color: var(--mint); }

  /* STATUS */
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
  .badge-pending { background: #FFF3E0; color: #E65100; }
  .badge-active  { background: var(--mint-l); color: var(--mint-d); }
  .badge-done    { background: var(--off); color: var(--muted); }

  /* KPI */
  .kpi-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
  .kpi-u { background: var(--off); border-radius: 14px; padding: 15px; border: 1.5px solid var(--border); }
  .kpi-u-val { font-family: var(--display); font-size: 24px; font-weight: 800; letter-spacing: -1px; }
  .kpi-u-lbl { font-size: 10px; font-weight: 700; color: var(--muted); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
  .kpi-u-chg { font-size: 11px; font-weight: 800; color: var(--mint); margin-top: 4px; }

  /* JOB CARDS */
  .job-card-u { border: 2px solid var(--border); border-radius: 16px; padding: 16px; margin-bottom: 10px; cursor: pointer; transition: all 0.18s; }
  .job-card-u:hover { border-color: var(--mint); }
  .job-card-u.active { border-color: var(--mint); background: var(--mint-l); }
  .jcu-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .jcu-car { font-family: var(--display); font-size: 15px; font-weight: 800; letter-spacing: -0.3px; }
  .jcu-svc { font-size: 12px; color: var(--muted); font-weight: 600; margin-top: 2px; }
  .jcu-price { font-family: var(--display); font-size: 19px; font-weight: 800; color: var(--mint); }
  .jcu-addr { font-size: 12px; color: var(--muted); font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 5px; }
  .jcu-actions { display: flex; gap: 8px; }

  /* ADMIN JOB ROW */
  .admin-job-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); cursor: pointer; transition: all 0.15s; }
  .admin-job-row:last-child { border-bottom: none; }
  .admin-job-row:hover { padding-left: 4px; }
  .ajr-icon { width: 38px; height: 38px; border-radius: 11px; background: var(--off); border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
  .ajr-car { font-size: 14px; font-weight: 800; }
  .ajr-svc { font-size: 11px; color: var(--muted); font-weight: 600; margin-top: 1px; }
  .ajr-right { margin-left: auto; text-align: right; }
  .ajr-price { font-family: var(--display); font-size: 15px; font-weight: 800; color: var(--mint); }

  /* WASHER ROW */
  .washer-row-u { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--border); }
  .washer-row-u:last-child { border-bottom: none; }
  .wu-ava { width: 37px; height: 37px; border-radius: 11px; background: linear-gradient(135deg,var(--mint),var(--ink2)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 14px; flex-shrink: 0; }
  .wu-name { font-size: 14px; font-weight: 800; }
  .wu-status { font-size: 11px; color: var(--muted); font-weight: 600; margin-top: 1px; display: flex; align-items: center; gap: 5px; }
  .wu-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .wu-rating { margin-left: auto; font-size: 12px; font-weight: 800; }

  /* TOGGLE */
  .toggle { width: 52px; height: 30px; border-radius: 15px; background: var(--border); position: relative; cursor: pointer; transition: background 0.25s; flex-shrink: 0; }
  .toggle.on { background: var(--mint); }
  .toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: white; transition: left 0.25s; box-shadow: 0 1px 6px rgba(0,0,0,0.15); }
  .toggle.on::after { left: 25px; }

  /* CHECKLIST */
  .cl-item { display: flex; align-items: center; gap: 14px; padding: 13px 0; border-bottom: 1px solid var(--border); cursor: pointer; }
  .cl-box { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
  .cl-box.chk { background: var(--mint); border-color: var(--mint); }
  .cl-label { font-size: 15px; font-weight: 600; transition: color 0.18s; }
  .cl-label.done { color: var(--muted); text-decoration: line-through; }

  /* TRACKING */
  .washer-bar { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
  .w-ava { width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg,var(--mint),var(--ink2)); color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; flex-shrink: 0; }
  .w-name { font-family: var(--display); font-size: 17px; font-weight: 800; }
  .w-sub { font-size: 13px; color: var(--muted); font-weight: 600; margin-top: 2px; }
  .w-actions { display: flex; gap: 8px; }
  .w-act-btn { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border); background: white; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .w-act-btn:hover { background: var(--off); border-color: var(--mint); }
  .eta-bar { background: linear-gradient(135deg,var(--ink),var(--ink2)); border-radius: 14px; padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border: 1px solid rgba(0,200,150,0.15); }
  .eta-val { font-family: var(--display); font-size: 28px; font-weight: 800; color: white; letter-spacing: -1px; }
  .eta-lbl { font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 600; margin-top: 2px; }
  .eta-dist { font-size: 14px; font-weight: 800; color: var(--mint); }
  .eta-status { font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 600; margin-top: 2px; }
  .prog-track { height: 4px; background: var(--border); border-radius: 2px; margin-bottom: 8px; }
  .prog-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg,var(--mint),var(--zap)); transition: width 0.8s ease; }
  .prog-labels { display: flex; justify-content: space-between; margin-bottom: 18px; }
  .prog-lbl { font-size: 10px; font-weight: 700; color: var(--muted); }
  .prog-lbl.on { color: var(--mint); font-weight: 800; }
  .action-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  /* SUCCESS */
  .success-icon { width: 72px; height: 72px; border-radius: 50%; background: var(--mint); display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 8px auto 18px; animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 8px 30px rgba(0,200,150,0.35); }
  @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
  .success-title { font-family: var(--display); font-size: 26px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 8px; text-align: center; }
  .success-sub { font-size: 15px; color: var(--muted); font-weight: 600; line-height: 1.6; margin-bottom: 24px; text-align: center; }
  .washer-confirm-card { display: flex; align-items: center; gap: 14px; background: var(--off); border-radius: 16px; padding: 16px; margin-bottom: 20px; border: 1.5px solid var(--border); }

  /* EARNINGS */
  .earn-hero { background: linear-gradient(135deg,var(--ink),var(--ink2)); border-radius: 18px; padding: 22px; margin-bottom: 18px; position: relative; overflow: hidden; border: 1px solid rgba(0,200,150,0.15); }
  .earn-hero::before { content: ''; position: absolute; top:-40px; right:-40px; width:160px; height:160px; border-radius:50%; background: rgba(0,200,150,0.15); }
  .earn-lbl { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4); margin-bottom: 5px; letter-spacing: 1px; text-transform: uppercase; position: relative; z-index:1; }
  .earn-val { font-family: var(--display); font-size: 42px; font-weight: 800; color: white; letter-spacing: -2px; line-height: 1; position: relative; z-index:1; }
  .earn-chg { font-size: 13px; font-weight: 700; color: var(--mint); margin-top: 5px; position: relative; z-index:1; }
  .bar-chart-u { display: flex; align-items: flex-end; gap: 6px; height: 70px; }
  .bar-u { flex: 1; border-radius: 5px 5px 0 0; background: var(--border); transition: background 0.2s; cursor: pointer; }
  .bar-u:hover { background: var(--mint-d); opacity: 0.7; }
  .bar-u.on { background: var(--mint); }
  .bar-lbls { display: flex; gap: 6px; padding-top: 5px; }
  .bar-l { flex: 1; text-align: center; font-size: 9px; color: var(--muted); font-weight: 700; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(13,31,26,0.6); backdrop-filter: blur(4px); z-index: 9000; display: flex; align-items: flex-end; justify-content: flex-start; }
  .modal-panel { background: white; border-radius: 24px 24px 0 0; padding: 24px 24px 36px; width: 400px; animation: slideUp 0.3s cubic-bezier(0.32,0.72,0,1); }
  @media(max-width:900px){ .modal-panel{width:100%;} }
  @keyframes slideUp { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
  .modal-handle { width: 32px; height: 3px; background: var(--border); border-radius: 2px; margin: 0 auto 20px; }
  .modal-title { font-family: var(--display); font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 5px; }
  .modal-sub { font-size: 14px; color: var(--muted); font-weight: 600; margin-bottom: 18px; }
  .washer-pick-row { display: flex; align-items: center; gap: 12px; padding: 13px 15px; border: 2px solid var(--border); border-radius: 14px; margin-bottom: 8px; cursor: pointer; transition: all 0.18s; }
  .washer-pick-row:hover { border-color: var(--mint); }

  /* AVAIL ROW */
  .avail-row { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--off); border-radius: 16px; margin-bottom: 16px; border: 1.5px solid var(--border); }
  .avail-row.online { background: var(--mint-l); border-color: var(--border); }
  .avail-status { font-family: var(--display); font-size: 15px; font-weight: 800; }
  .avail-sub { font-size: 12px; color: var(--muted); font-weight: 600; margin-top: 2px; }

  /* RESPONSIVE */
  @media (min-width: 900px) { .desktop-side{display:flex;} .mobile-sheet{display:none;} .map-layer{left:400px;} .top-overlay{left:400px;} }
  @media (max-width: 899px) { .desktop-side{display:none;} .mobile-sheet{display:block;} .map-layer{left:0;} }

  @keyframes fadeSlide { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
  .fade-slide { animation: fadeSlide 0.2s ease; }
`;

// ── Shared Map component ────────────────────────────────────────
export function MapView({ phase, jobs = [] }) {
  return (
    <div className="map-layer">
      <div className="map-bg"/>
      {[[0,45,100,12],[0,55,100,10],[0,30,100,8]].map(([l,t,w,h],i)=>(
        <div key={i} className="map-road" style={{left:`${l}%`,top:`${t}%`,width:`${w}%`,height:`${h}px`,position:"absolute"}}/>
      ))}
      {[[25,0,8,100],[60,0,10,100],[75,0,8,100]].map(([l,t,w,h],i)=>(
        <div key={i} className="map-road" style={{left:`${l}%`,top:`${t}%`,width:`${w}px`,height:`${h}%`,position:"absolute"}}/>
      ))}
      {[[5,8,18,20],[30,8,20,18],[56,8,16,20],[78,8,18,18],[5,62,15,22],[26,62,22,20],[55,62,18,22],[80,62,15,22]].map(([l,t,w,h],i)=>(
        <div key={i} className="map-block" style={{left:`${l}%`,top:`${t}%`,width:`${w}%`,height:`${h}%`}}/>
      ))}
      <div className="map-park"  style={{left:"42%",top:"10%",width:"12%",height:"17%"}}/>
      <div className="map-water" style={{left:"3%",top:"34%",width:"20%",height:"8%"}}/>

      {(phase==="tracking") && (
        <>
          <svg className="route-line" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 68 70 Q 65 55 62 50 Q 58 44 55 48" stroke="rgba(0,200,150,0.7)" strokeWidth="0.5" fill="none" strokeDasharray="2 1.5"/>
          </svg>
          <div className="pin pin-home" style={{left:"55%",top:"50%"}}>
            <div className="pin-bubble">🏠 Your location</div>
            <div className="pin-tail"/>
          </div>
          <div className="car-pin" style={{left:"68%",top:"70%"}}>🚗</div>
        </>
      )}
      {phase==="washer" && (
        <>
          <div className="pin" style={{left:"55%",top:"50%"}}>
            <div className="pin-bubble">📍 14 Maple St</div>
            <div className="pin-tail"/>
          </div>
          <div className="car-pin" style={{left:"68%",top:"70%"}}>🧹</div>
        </>
      )}
      {phase==="admin" && jobs.filter(j=>j.status!=="done").map((j,i)=>(
        <div key={j.id} className="pin" style={{left:`${38+i*16}%`,top:`${38+i*12}%`}}>
          <div className="pin-bubble">🚗 {j.car.split(" ").pop()}</div>
          <div className="pin-tail"/>
        </div>
      ))}
    </div>
  );
}

// ── Shared TopOverlay ───────────────────────────────────────────
export function TopOverlay({ user }) {
  return (
    <div className="top-overlay">
      <div className="topbar-pill">
        <div className="tp-logo">woop</div>
        <div className="tp-sep"/>
        <div className="tp-addr"><strong>Austin, TX</strong> · {user.name}</div>
      </div>
      <div className="top-right">
        <button className="map-btn">📍</button>
        <button className="map-btn">🔍</button>
      </div>
    </div>
  );
}

// ── Shared Logo in panel ────────────────────────────────────────
export function PanelLogo({ user, onLogout, tabs, activeTab, onTab }) {
  return (
    <div className="ds-top">
      <div className="ds-logo">
        <div className="ds-logo-mark">
          <svg width="14" height="10" viewBox="0 0 54 36" fill="none">
            <path d="M2 7 Q9.5 30 16 20 Q22.5 10 27 20 Q31.5 30 38 20 Q44.5 10 52 7"
              stroke="white" strokeWidth="6.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        woop
      </div>
      {tabs && (
        <div className="ds-nav">
          {tabs.map(([id,lb]) => (
            <button key={id} className={`ds-nav-btn${activeTab===id?" on":""}`} onClick={()=>onTab(id)}>{lb}</button>
          ))}
        </div>
      )}
      <div className="ds-user-row">
        <div className="ds-user-ava">{user.init}</div>
        <div>
          <div className="ds-user-name">{user.name}</div>
          <div className="ds-user-role">{user.role}</div>
        </div>
        <button className="ds-logout" onClick={onLogout}>Sign out</button>
      </div>
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────
export function Badge({ s }) {
  const m = { pending:"badge-pending ⏳", active:"badge-active 🟢", done:"badge-done ✅" };
  const [cls,...rest] = (m[s]||m.done).split(" ");
  return <span className={`badge ${cls}`}>{rest.join(" ")} {s[0].toUpperCase()+s.slice(1)}</span>;
}

// ── Data ────────────────────────────────────────────────────────
export const SVCS = [
  { id:1, icon:"💧", name:"Express", desc:"Exterior clean", dur:"30 min", price:25 },
  { id:2, icon:"✨", name:"Full",    desc:"In + out",       dur:"90 min", price:75 },
  { id:3, icon:"🏆", name:"Deep",   desc:"Detail + polish", dur:"2 hrs",  price:120 },
  { id:4, icon:"🪣", name:"Inside", desc:"Interior only",  dur:"60 min", price:45 },
];
export const JOBS = [
  { id:1, car:"Tesla Model 3",  addr:"14 Maple St",  svc:"Full Woop",    price:75,  time:"9:00 AM",  status:"active",  washer:"Carlos M.", init:"C" },
  { id:2, car:"Ford F-150",     addr:"89 Oak Ave",   svc:"Express Woop", price:25,  time:"11:30 AM", status:"pending", washer:"Unassigned",init:"?" },
  { id:3, car:"BMW 5 Series",   addr:"52 Pine Rd",   svc:"Deep Woop",    price:120, time:"2:00 PM",  status:"pending", washer:"Unassigned",init:"?" },
  { id:4, car:"Honda Civic",    addr:"7 Cedar Blvd", svc:"Inside Woop",  price:45,  time:"Yesterday",status:"done",    washer:"Carlos M.", init:"C" },
];
export const WASHERS = [
  { n:"Carlos M.", status:"On job",   r:4.9, jobs:142, init:"C", dot:"#FF9F43" },
  { n:"Priya S.",  status:"Available",r:4.8, jobs:98,  init:"P", dot:"#00C896" },
  { n:"Luca B.",   status:"Available",r:4.7, jobs:67,  init:"L", dot:"#00C896" },
  { n:"Aisha K.",  status:"Off duty", r:5.0, jobs:203, init:"A", dot:"#D6EFE6" },
];
export const BARS = [40,65,55,80,70,90,75];
export const DAYS = ["M","T","W","T","F","S","S"];