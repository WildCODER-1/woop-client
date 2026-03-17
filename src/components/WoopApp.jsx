import { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import AddressPicker from '../features/tracking/AddressPicker'

const stripePromise = loadStripe('pk_test_yourPublishableKey')
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0D1F1A;
    --ink: #0D1F1A;
    --ink2: #1A3A30;
    --white: #ffffff;
    --off: #F4FBF8;
    --border: #D6EFE6;
    --muted: #5A7A6E;
    --mint: #00C896;
    --mint-d: #00A87D;
    --mint-l: #E6FBF4;
    --zap: #FFE134;
    --zap-d: #F5C800;
    --red: #FF4757;
    --sheet-radius: 20px;
    --font: 'Nunito', sans-serif;
    --display: 'Syne', sans-serif;
  }

  html, body { height: 100%; overflow: hidden; }
  body { font-family: var(--font); background: var(--ink); color: var(--black); -webkit-font-smoothing: antialiased; }

  /* ── SHELL ── */
  .shell {
    width: 100%; max-width: 1440px; height: 100vh;
    margin: 0 auto; display: flex;
    background: white; position: relative; overflow: hidden;
  }

  /* ── ROLE SWITCHER (dev only) ── */
  .dev-bar {
    position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
    z-index: 9999; background: rgba(13,31,26,0.95); backdrop-filter: blur(12px);
    border-radius: 40px; padding: 6px; display: flex; gap: 4px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4); border: 1px solid rgba(0,200,150,0.15);
  }
  .dev-btn {
    padding: 7px 16px; border-radius: 30px; font-size: 12px; font-weight: 700;
    cursor: pointer; border: none; background: transparent; color: rgba(255,255,255,0.5);
    font-family: var(--font); transition: all 0.18s; letter-spacing: 0.2px;
  }
  .dev-btn.on { background: var(--mint); color: var(--ink); }

  /* ── MAP LAYER ── */
  .map-layer {
    position: absolute; inset: 0; z-index: 0;
    background: #e8e8e8;
    overflow: hidden;
  }
  .map-bg {
    position: absolute; inset: 0;
    background:
      linear-gradient(rgba(0,200,150,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,150,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    background-color: #1A3020;
  }
  .map-road-h {
    position: absolute; background: rgba(0,200,150,0.12); opacity: 0.9;
  }
  .map-road-v {
    position: absolute; background: rgba(0,200,150,0.12); opacity: 0.9;
  }
  .map-block {
    position: absolute; background: #152818; border-radius: 3px;
  }
  .map-park {
    position: absolute; background: #1E3D1A; border-radius: 4px;
  }
  .map-water {
    position: absolute; background: #0D2830; border-radius: 8px;
  }
  .pin {
    position: absolute; display: flex; flex-direction: column; align-items: center;
    transform: translate(-50%, -100%);
    animation: pinDrop 0.4s cubic-bezier(0.34,1.56,0.64,1);
    cursor: pointer; z-index: 10;
  }
  @keyframes pinDrop {
    from { transform: translate(-50%,-130%); opacity:0; }
    to { transform: translate(-50%,-100%); opacity:1; }
  }
  .pin-bubble {
    background: var(--ink); color: white; padding: 7px 12px;
    border-radius: 10px; font-size: 12px; font-weight: 700;
    white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.4);
    display: flex; align-items: center; gap: 6px;
    border: 1px solid rgba(0,200,150,0.2);
  }
  .pin-tail {
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid var(--ink);
  }
  .pin-home .pin-bubble { background: var(--mint); }
  .pin-home .pin-tail { border-top-color: var(--mint); }
  .car-pin {
    position: absolute; font-size: 28px;
    transform: translate(-50%,-50%);
    animation: carMove 0.6s ease;
    filter: drop-shadow(0 3px 8px rgba(0,0,0,0.3));
    z-index: 10;
  }
  @keyframes carMove { from{transform:translate(-50%,-50%) scale(0.8)} to{transform:translate(-50%,-50%) scale(1)} }
  .route-line {
    position: absolute; pointer-events: none;
    top: 0; left: 0; width: 100%; height: 100%;
  }

  /* ── TOP OVERLAY ── */
  .top-overlay {
    position: absolute; top: 0; left: 0; right: 0; z-index: 100;
    padding: 20px 20px 0;
    display: flex; justify-content: space-between; align-items: flex-start;
    pointer-events: none;
  }
  .top-overlay > * { pointer-events: all; }

  .topbar-pill {
    background: var(--ink); border-radius: 14px; padding: 10px 16px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.3);
    border: 1px solid rgba(0,200,150,0.18);
  }
  .tp-logo { font-size: 15px; font-weight: 800; letter-spacing: -0.5px; color: white; font-family: var(--display); }
  .tp-sep { width: 1px; height: 16px; background: rgba(255,255,255,0.12); }
  .tp-addr { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.45); max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tp-addr strong { color: white; font-weight: 700; }

  .top-right { display: flex; gap: 9px; flex-direction: column; align-items: flex-end; }
  .map-btn {
    width: 42px; height: 42px; border-radius: 12px; background: var(--ink);
    border: 1px solid rgba(0,200,150,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; box-shadow: 0 2px 12px rgba(0,0,0,0.3); transition: transform 0.15s;
  }
  .map-btn:active { transform: scale(0.93); }

  /* ── BOTTOM SHEET ── */
  .sheet-wrap {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 200;
    pointer-events: none;
  }
  .sheet {
    background: white; border-radius: var(--sheet-radius) var(--sheet-radius) 0 0;
    pointer-events: all;
    box-shadow: 0 -4px 30px rgba(0,0,0,0.12);
    transition: transform 0.4s cubic-bezier(0.32,0.72,0,1);
  }
  .sheet-handle {
    width: 36px; height: 4px; background: var(--border); border-radius: 2px;
    margin: 12px auto 0;
  }
  .sheet-inner { padding: 16px 20px 32px; }

  /* ── HOME SHEET ── */
  .hs-greeting { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 4px; }
  .hs-sub { font-size: 14px; color: var(--muted); font-weight: 500; margin-bottom: 20px; }

  .addr-input-row {
    display: flex; align-items: center; gap: 10px;
    background: var(--off); border-radius: 14px; padding: 14px 16px;
    cursor: pointer; margin-bottom: 16px; transition: background 0.15s;
    border: 2px solid transparent;
  }
  .addr-input-row:hover { background: #efefef; }
  .addr-input-row:focus-within { border-color: var(--mint); background: white; }
  .addr-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--mint); flex-shrink: 0; }
  .addr-text { font-size: 15px; font-weight: 600; color: black; flex: 1; background: none; border: none; outline: none; font-family: var(--font); }
  .addr-text::placeholder { color: var(--muted); font-weight: 500; }

  .svc-row { display: flex; gap: 10px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
  .svc-row::-webkit-scrollbar { display: none; }
  .svc-chip {
    flex-shrink: 0; background: var(--off); border: 2px solid transparent;
    border-radius: 14px; padding: 14px 16px; cursor: pointer; transition: all 0.18s;
    text-align: center; min-width: 100px;
  }
  .svc-chip:hover { background: #efefef; }
  .svc-chip.sel { background: var(--ink); border-color: var(--mint); }
  .svc-chip.sel .sc-name { color: white; }
  .svc-chip.sel .sc-price { color: var(--mint); }
  .svc-chip.sel .sc-dur { color: rgba(255,255,255,0.5); }
  .sc-icon { font-size: 26px; margin-bottom: 6px; }
  .sc-name { font-size: 13px; font-weight: 700; letter-spacing: -0.2px; }
  .sc-price { font-size: 16px; font-weight: 800; color: black; margin-top: 2px; }
  .sc-dur { font-size: 11px; color: var(--muted); margin-top: 1px; font-weight: 500; }

  .cta-btn {
    width: 100%; padding: 17px; border-radius: 14px; background: var(--mint); color: var(--ink);
    font-size: 16px; font-weight: 900; border: none; cursor: pointer;
    font-family: var(--font); letter-spacing: -0.2px;
    transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 4px 20px rgba(0,200,150,0.3);
  }
  .cta-btn:hover { background: var(--mint-d); box-shadow: 0 6px 24px rgba(0,200,150,0.4); }
  .cta-btn:active { transform: scale(0.98); }
  .cta-btn.ink { background: var(--ink); color: white; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
  .cta-btn.ink:hover { background: var(--ink2); }
  .cta-btn.zap { background: var(--zap); color: var(--ink); box-shadow: 0 4px 20px rgba(255,225,52,0.3); }
  .cta-btn.zap:hover { background: var(--zap-d); }
  .cta-btn:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; box-shadow: none; }

  /* ── BOOKING STEPS ── */
  .step-header {
    display: flex; align-items: center; gap: 14px; margin-bottom: 22px;
  }
  .back-btn {
    width: 38px; height: 38px; border-radius: 50%; background: var(--off);
    border: none; cursor: pointer; font-size: 16px; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
    transition: background 0.15s;
  }
  .back-btn:hover { background: #e8e8e8; }
  .step-title { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
  .step-dots { display: flex; gap: 6px; margin-left: auto; }
  .step-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); transition: background 0.3s; }
  .step-dot.on { background: var(--mint); }

  .option-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .option-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 14px; border: 2px solid var(--border);
    cursor: pointer; transition: all 0.18s; background: white;
  }
  .option-row:hover { border-color: var(--mint); }
  .option-row.sel { border-color: var(--mint); background: var(--mint-l); }
  .opt-icon { font-size: 24px; width: 42px; height: 42px; border-radius: 12px; background: var(--off); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .opt-name { font-size: 15px; font-weight: 700; }
  .opt-desc { font-size: 12px; color: var(--muted); margin-top: 1px; font-weight: 500; }
  .opt-price { margin-left: auto; font-size: 18px; font-weight: 800; color: var(--ink); }
  .opt-dur { font-size: 11px; color: var(--muted); text-align: right; margin-top: 1px; font-weight: 500; }
  .sel-check { margin-left: auto; width: 22px; height: 22px; border-radius: 50%; background: var(--mint); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

  .input-field {
    width: 100%; padding: 15px 16px; border-radius: 14px;
    border: 2px solid var(--border); font-size: 15px;
    font-family: var(--font); color: black; background: white; outline: none;
    font-weight: 600; margin-bottom: 10px; transition: border 0.18s;
  }
  .input-field:focus { border-color: var(--mint); }
  .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }

  .time-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 20px; }
  .time-chip {
    padding: 12px 8px; border-radius: 12px; text-align: center;
    font-size: 13px; font-weight: 700; cursor: pointer; border: 2px solid var(--border);
    background: white; transition: all 0.18s; font-family: var(--font);
  }
  .time-chip:hover { border-color: var(--mint); }
  .time-chip.sel { background: var(--mint); color: var(--ink); border-color: var(--mint); font-weight: 900; }

  /* ── SUMMARY ── */
  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 13px 0; border-bottom: 1px solid var(--border); }
  .summary-row:last-child { border-bottom: none; }
  .sr-key { font-size: 14px; color: var(--muted); font-weight: 500; }
  .sr-val { font-size: 14px; font-weight: 700; text-align: right; max-width: 60%; }
  .total-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0 0; }
  .total-key { font-size: 17px; font-weight: 800; }
  .total-val { font-size: 26px; font-weight: 800; color: var(--mint); }

  /* ── ACTIVE JOB ── */
  .active-sheet { padding: 16px 20px 32px; }
  .washer-bar {
    display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
  }
  .w-ava {
    width: 52px; height: 52px; border-radius: 16px;
    background: linear-gradient(135deg, var(--mint), var(--ink2)); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 800; flex-shrink: 0;
  }
  .w-info { flex: 1; }
  .w-name { font-size: 17px; font-weight: 800; letter-spacing: -0.3px; }
  .w-sub { font-size: 13px; color: var(--muted); font-weight: 500; margin-top: 2px; display: flex; align-items: center; gap: 6px; }
  .w-rating { color: black; font-weight: 700; }
  .w-actions { display: flex; gap: 8px; }
  .w-act-btn {
    width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border);
    background: white; cursor: pointer; font-size: 18px;
    display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }
  .w-act-btn:hover { background: var(--off); border-color: black; }

  .eta-bar {
    background: linear-gradient(135deg, var(--ink), var(--ink2)); border-radius: 14px; padding: 16px 18px;
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;
    border: 1px solid rgba(0,200,150,0.15);
  }
  .eta-left .eta-val { font-size: 28px; font-weight: 800; color: white; letter-spacing: -1px; }
  .eta-left .eta-lbl { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }
  .eta-right { text-align: right; }
  .eta-right .eta-dist { font-size: 14px; font-weight: 700; color: var(--mint); }
  .eta-right .eta-status { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 500; margin-top: 2px; }

  .prog-track { position: relative; height: 4px; background: var(--border); border-radius: 2px; margin-bottom: 8px; }
  .prog-fill { height: 100%; border-radius: 2px; background: var(--mint); transition: width 0.8s ease; }
  .prog-labels { display: flex; justify-content: space-between; }
  .prog-lbl { font-size: 10px; font-weight: 600; color: var(--muted); }
  .prog-lbl.on { color: var(--mint); font-weight: 800; }

  .action-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
  .sec-btn {
    padding: 14px; border-radius: 14px; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: var(--font); transition: all 0.18s; border: 2px solid var(--border);
    background: white; display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .sec-btn:hover { background: var(--off); border-color: black; }
  .sec-btn.danger { color: var(--red); border-color: #ffe5e5; background: #fff5f5; }
  .sec-btn.danger:hover { background: #ffe5e5; border-color: var(--red); }

  /* ── SUCCESS ── */
  .success-wrap {
    padding: 16px 20px 40px; text-align: center;
  }
  .success-icon {
    width: 72px; height: 72px; border-radius: 50%; background: var(--mint);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin: 8px auto 20px;
    animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 8px 30px rgba(0,200,150,0.4);
  }
  @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
  .success-title { font-size: 26px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 8px; }
  .success-sub { font-size: 15px; color: var(--muted); font-weight: 500; line-height: 1.6; margin-bottom: 28px; }
  .washer-confirm-card {
    display: flex; align-items: center; gap: 14px;
    background: var(--off); border-radius: 16px; padding: 16px;
    margin-bottom: 24px; text-align: left;
  }

  /* ── SIDEBAR / DESKTOP ── */
  .desktop-side {
    width: 400px; flex-shrink: 0; height: 100vh;
    overflow-y: auto; position: relative; z-index: 50;
    background: white;
    box-shadow: 2px 0 20px rgba(0,0,0,0.1);
    display: flex; flex-direction: column;
  }
  .desktop-side::-webkit-scrollbar { display: none; }

  .ds-top {
    padding: 24px 24px 0;
    position: sticky; top: 0; background: var(--ink); z-index: 10;
    padding-bottom: 16px; border-bottom: 1px solid rgba(0,200,150,0.15);
  }
  .ds-logo { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; font-family: var(--display); color: white; }
  .ds-logo-mark { width: 30px; height: 30px; border-radius: 9px; background: var(--mint); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 12px rgba(0,200,150,0.4); }

  .ds-nav { display: flex; gap: 0; }
  .ds-nav-btn {
    flex: 1; padding: 10px 8px; background: none; border: none; cursor: pointer;
    font-family: var(--font); font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.35);
    border-bottom: 2px solid transparent; transition: all 0.18s; letter-spacing: 0.2px;
  }
  .ds-nav-btn.on { color: var(--mint); border-bottom-color: var(--mint); }

  .ds-body { padding: 24px; flex: 1; }
  .ds-section-title { font-size: 11px; font-weight: 800; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 14px; }

  /* ── EMPLOYEE SIDE ── */
  .avail-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px; background: var(--off); border-radius: 16px; margin-bottom: 16px;
  }
  .avail-status { font-size: 16px; font-weight: 800; }
  .avail-sub { font-size: 13px; color: var(--muted); font-weight: 500; margin-top: 2px; }
  .toggle {
    width: 52px; height: 30px; border-radius: 15px; background: var(--border);
    position: relative; cursor: pointer; transition: background 0.25s; flex-shrink: 0;
  }
  .toggle.on { background: var(--mint); }
  .toggle::after {
    content: ''; position: absolute; top: 3px; left: 3px;
    width: 24px; height: 24px; border-radius: 50%; background: white;
    transition: left 0.25s; box-shadow: 0 1px 6px rgba(0,0,0,0.18);
  }
  .toggle.on::after { left: 25px; }

  .job-card-u {
    border: 2px solid var(--border); border-radius: 16px; padding: 16px;
    margin-bottom: 10px; cursor: pointer; transition: all 0.18s;
  }
  .job-card-u:hover { border-color: var(--mint); }
  .job-card-u.active { border-color: var(--mint); background: var(--mint-l); }
  .jcu-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .jcu-car { font-size: 16px; font-weight: 800; letter-spacing: -0.3px; }
  .jcu-svc { font-size: 13px; color: var(--muted); font-weight: 500; margin-top: 2px; }
  .jcu-price { font-size: 20px; font-weight: 800; }
  .jcu-addr { font-size: 12px; color: var(--muted); font-weight: 500; margin-bottom: 12px; display: flex; align-items: center; gap: 5px; }
  .jcu-actions { display: flex; gap: 8px; }
  .jcu-btn {
    flex: 1; padding: 11px; border-radius: 12px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: var(--font); border: none; transition: all 0.18s;
  }
  .jcu-btn.primary { background: var(--mint); color: var(--ink); font-weight: 900; }
  .jcu-btn.primary:hover { background: var(--mint-d); }
  .jcu-btn.secondary { background: var(--off); color: black; }
  .jcu-btn.secondary:hover { background: #e8e8e8; }

  /* ── STATUS BADGE ── */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 30px; font-size: 12px; font-weight: 700;
  }
  .badge-pending { background: #FFF3E0; color: #E65100; }
  .badge-active { background: #E6FBF4; color: #00A87D; }
  .badge-done { background: #f0f0f0; color: #333; }

  /* ── ADMIN SIDE ── */
  .kpi-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .kpi-u {
    background: var(--off); border-radius: 14px; padding: 16px;
  }
  .kpi-u-val { font-size: 26px; font-weight: 800; letter-spacing: -1px; }
  .kpi-u-lbl { font-size: 11px; font-weight: 600; color: var(--muted); margin-top: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
  .kpi-u-chg { font-size: 11px; font-weight: 700; color: var(--mint); margin-top: 4px; }

  .admin-job-row {
    display: flex; align-items: center; gap: 12px; padding: 13px 0;
    border-bottom: 1px solid var(--border); cursor: pointer; transition: all 0.15s;
  }
  .admin-job-row:last-child { border-bottom: none; }
  .admin-job-row:hover { padding-left: 4px; }
  .ajr-icon { width: 40px; height: 40px; border-radius: 12px; background: var(--off); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .ajr-car { font-size: 14px; font-weight: 700; }
  .ajr-svc { font-size: 12px; color: var(--muted); font-weight: 500; margin-top: 1px; }
  .ajr-right { margin-left: auto; text-align: right; }
  .ajr-price { font-size: 15px; font-weight: 800; }
  .ajr-time { font-size: 11px; color: var(--muted); font-weight: 500; margin-top: 1px; }

  .assign-btn {
    padding: 7px 14px; border-radius: 30px; background: var(--mint); color: var(--ink);
    font-size: 12px; font-weight: 800; border: none; cursor: pointer;
    font-family: var(--font); transition: all 0.18s; white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0,200,150,0.3);
  }
  .assign-btn:hover { background: var(--mint-d); }

  .washer-row-u {
    display: flex; align-items: center; gap: 12px; padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }
  .washer-row-u:last-child { border-bottom: none; }
  .wu-ava {
    width: 38px; height: 38px; border-radius: 11px;
    background: linear-gradient(135deg, var(--mint), var(--ink2));
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 800; font-size: 15px; flex-shrink: 0;
  }
  .wu-name { font-size: 14px; font-weight: 700; }
  .wu-status { font-size: 12px; color: var(--muted); font-weight: 500; margin-top: 1px; display: flex; align-items: center; gap: 5px; }
  .wu-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .wu-rating { margin-left: auto; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 3px; }

  /* ── ASSIGN MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px); z-index: 9000;
    display: flex; align-items: flex-end; justify-content: flex-start;
  }
  .modal-panel {
    background: white; border-radius: 24px 24px 0 0; padding: 24px 24px 36px;
    width: 400px; animation: slideUp 0.3s cubic-bezier(0.32,0.72,0,1);
  }
  @media (max-width: 900px) { .modal-panel { width: 100%; } }
  @keyframes slideUp { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
  .modal-handle { width: 32px; height: 3px; background: var(--border); border-radius: 2px; margin: 0 auto 20px; }
  .modal-title { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px; }
  .modal-sub { font-size: 14px; color: var(--muted); font-weight: 500; margin-bottom: 20px; }
  .washer-pick-row {
    display: flex; align-items: center; gap: 12px; padding: 14px 16px;
    border: 2px solid var(--border); border-radius: 14px; margin-bottom: 8px;
    cursor: pointer; transition: all 0.18s;
  }
  .washer-pick-row:hover { border-color: var(--mint); }

  /* ── MAP (mobile) ── */
  .mobile-map-wrap {
    position: absolute; inset: 0; z-index: 0;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── RESPONSIVE ── */
  @media (min-width: 900px) {
    .desktop-side { display: flex; }
    .mobile-sheet { display: none; }
    .dev-bar { left: 424px; transform: none; }
    .map-layer { left: 400px; }
    .top-overlay { left: 400px; }
  }
  @media (max-width: 899px) {
    .desktop-side { display: none; }
    .mobile-sheet { display: block; }
    .map-layer { left: 0; }
  }

  /* ── CHECKLIST ── */
  .cl-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid var(--border); cursor: pointer;
  }
  .cl-box {
    width: 22px; height: 22px; border-radius: 50%;
    border: 2px solid var(--border); flex-shrink: 0; display: flex;
    align-items: center; justify-content: center; transition: all 0.18s;
  }
  .cl-box.chk { background: var(--mint); border-color: var(--mint); }
  .cl-label { font-size: 15px; font-weight: 600; transition: color 0.18s; }
  .cl-label.done { color: var(--muted); text-decoration: line-through; }

  /* ── EARNINGS ── */
  .earn-hero {
    background: linear-gradient(135deg, var(--ink), var(--ink2)); border-radius: 18px; padding: 22px;
    margin-bottom: 20px; position: relative; overflow: hidden;
    border: 1px solid rgba(0,200,150,0.15);
  }
  .earn-hero::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 160px; height: 160px; border-radius: 50%;
    background: rgba(0,200,150,0.15);
  }
  .earn-lbl { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.4); margin-bottom: 6px; position: relative; z-index: 1; }
  .earn-val { font-size: 42px; font-weight: 800; color: white; letter-spacing: -2px; line-height: 1; position: relative; z-index: 1; }
  .earn-chg { font-size: 13px; font-weight: 600; color: var(--mint); margin-top: 6px; position: relative; z-index: 1; }

  .bar-chart-u { display: flex; align-items: flex-end; gap: 6px; height: 70px; }
  .bar-u { flex: 1; border-radius: 5px 5px 0 0; background: var(--border); transition: background 0.2s; cursor: pointer; }
  .bar-u:hover { background: var(--mint-d); opacity: 0.7; }
  .bar-u.on { background: var(--mint); }
  .bar-lbls { display: flex; gap: 6px; padding-top: 6px; }
  .bar-l { flex: 1; text-align: center; font-size: 9px; color: var(--muted); font-weight: 600; }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateX(12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .fade-slide { animation: fadeSlide 0.22s ease; }
`;

/* ── DATA ── */
const SVCS = [
  { id:1, icon:"💧", name:"Express", desc:"Exterior clean", dur:"30 min", price:25 },
  { id:2, icon:"✨", name:"Full", desc:"In + out", dur:"90 min", price:75 },
  { id:3, icon:"🏆", name:"Deep", desc:"Detail + polish", dur:"2 hrs", price:120 },
  { id:4, icon:"🪣", name:"Inside", desc:"Interior only", dur:"60 min", price:45 },
];
const JOBS = [
  { id:1, car:"Tesla Model 3", addr:"14 Maple St", svc:"Full Woop", price:75, time:"9:00 AM", status:"active", washer:"Carlos M.", init:"C" },
  { id:2, car:"Ford F-150", addr:"89 Oak Ave", svc:"Express Woop", price:25, time:"11:30 AM", status:"pending", washer:"Unassigned", init:"?" },
  { id:3, car:"BMW 5 Series", addr:"52 Pine Rd", svc:"Deep Woop", price:120, time:"2:00 PM", status:"pending", washer:"Unassigned", init:"?" },
  { id:4, car:"Honda Civic", addr:"7 Cedar Blvd", svc:"Inside Woop", price:45, time:"Yesterday", status:"done", washer:"Carlos M.", init:"C" },
];
const WASHERS = [
  { n:"Carlos M.", status:"On job", r:4.9, jobs:142, init:"C", dot:"#FF9F43" },
  { n:"Priya S.", status:"Available", r:4.8, jobs:98, init:"P", dot:"#00C896" },
  { n:"Luca B.", status:"Available", r:4.7, jobs:67, init:"L", dot:"#00C896" },
  { n:"Aisha K.", status:"Off duty", r:5.0, jobs:203, init:"A", dot:"#ccc" },
];
const BARS = [40,65,55,80,70,90,75];
const DAYS = ["M","T","W","T","F","S","S"];

function Badge({ s }) {
  const m={pending:"badge-pending ⏳",active:"badge-active 🟢",done:"badge-done ✅"};
  const [cls,...rest]=m[s]?.split(" ")||["badge-done","✅"];
  return <span className={`badge ${cls}`}>{rest.join(" ")} {s[0].toUpperCase()+s.slice(1)}</span>;
}

/* ════════ MAP ════════ */
function MapView({ phase, role }) {
  return (
    <div className="map-layer">
      <div className="map-bg"/>
      {/* Roads */}
      {[[0,45,100,12],[0,55,100,10],[0,30,100,8],[25,0,8,100],[60,0,10,100],[75,0,8,100]].map(([l,t,w,h],i)=>(
        <div key={i} className="map-road-h" style={{left:`${l}%`,top:`${t}%`,width:`${w}%`,height:`${h}px`,position:"absolute"}}/>
      ))}
      {/* Blocks */}
      {[[5,8,18,20],[30,8,20,18],[56,8,16,20],[78,8,18,18],[5,62,15,22],[26,62,22,20],[55,62,18,22],[80,62,15,22]].map(([l,t,w,h],i)=>(
        <div key={i} className="map-block" style={{left:`${l}%`,top:`${t}%`,width:`${w}%`,height:`${h}%`}}/>
      ))}
      {/* Park */}
      <div className="map-park" style={{left:"42%",top:"10%",width:"12%",height:"17%"}}/>
      {/* Water */}
      <div className="map-water" style={{left:"3%",top:"34%",width:"20%",height:"8%",borderRadius:8}}/>

      {/* SVG route */}
      {(phase==="tracking"||phase==="active") && (
        <svg className="route-line" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 68 70 Q 65 55 62 50 Q 58 44 55 48" stroke="rgba(0,200,150,0.7)" strokeWidth="0.5" fill="none" strokeDasharray="2 1.5" opacity="0.8"/>
        </svg>
      )}
      {/* Pins */}
      {phase!=="home" && (
        <div className="pin pin-home" style={{left:"55%",top:"50%"}}>
          <div className="pin-bubble">🏠 Your location</div>
          <div className="pin-tail"/>
        </div>
      )}
      {(phase==="tracking"||phase==="active") && (
        <div className="car-pin" style={{left:"68%",top:"70%"}}>🚗</div>
      )}
      {role==="employee" && (
        <>
          <div className="pin" style={{left:"55%",top:"50%"}}>
            <div className="pin-bubble">📍 14 Maple St</div>
            <div className="pin-tail"/>
          </div>
          <div className="car-pin" style={{left:"68%",top:"70%"}}>🧹</div>
        </>
      )}
      {role==="admin" && JOBS.filter(j=>j.status!=="done").map((j,i)=>(
        <div key={j.id} className="pin" style={{left:`${40+i*15}%`,top:`${40+i*10}%`}}>
          <div className="pin-bubble">🚗 {j.car.split(" ").slice(-1)}</div>
          <div className="pin-tail"/>
        </div>
      ))}
    </div>
  );
}

/* ════════ CUSTOMER SIDE ════════ */
function CustomerSide() {
  const [view, setView] = useState("home"); // home | step1 | step2 | step3 | confirm | active | tracking
  const [sel, setSel] = useState(null);
  const [addr, setAddr] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [checks, setChecks] = useState([]);

  const TIMES = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM"];

  const HomeView = () => (
    <div className="ds-body fade-slide">
      <div style={{marginBottom:24}}>
        <div style={{fontSize:24,fontWeight:800,letterSpacing:"-0.7px",marginBottom:4,fontFamily:"var(--display)"}}>Good morning, Sarah 👋</div>
        <div style={{fontSize:14,color:"var(--muted)",fontWeight:500}}>Austin, TX · Ready to Woop?</div>
      </div>

      {/* Active booking */}
      <div style={{background:"linear-gradient(135deg,var(--ink),var(--ink2))",borderRadius:18,padding:18,marginBottom:20,cursor:"pointer",position:"relative",overflow:"hidden",border:"1px solid rgba(0,200,150,0.15)"}} onClick={()=>setView("tracking")}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(0,200,150,0.12)"}}/>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:1,textTransform:"uppercase",marginBottom:8,position:"relative",zIndex:1}}>Active Woop</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:1,marginBottom:14}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"white",letterSpacing:"-0.5px"}}>Tesla Model 3</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",fontWeight:500,marginTop:3}}>Full Woop · Carlos en route</div>
          </div>
          <div style={{background:"rgba(0,200,150,0.2)",color:"#00C896",padding:"5px 11px",borderRadius:30,fontSize:12,fontWeight:800}}>🟢 Live</div>
        </div>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:500}}>En route</span>
            <span style={{fontSize:13,fontWeight:800,color:"var(--zap)"}}>~12 min</span>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.12)",borderRadius:2}}>
            <div style={{height:"100%",width:"40%",background:"var(--mint)",borderRadius:2}}/>
          </div>
        </div>
        <div style={{position:"relative",zIndex:1,marginTop:14,fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:500}}>Tap to track live →</div>
      </div>

      {/* Book button */}
      <button className="cta-btn" style={{marginBottom:20}} onClick={()=>setView("step1")}>
        Book a new Woop 🚗
      </button>

      {/* Quick services */}
      <div className="ds-section-title">Services</div>
      <div className="svc-row">
        {SVCS.map(s=>(
          <div key={s.id} className={`svc-chip${sel?.id===s.id?" sel":""}`} onClick={()=>{setSel(s);setView("step1");}}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-name">{s.name}</div>
            <div className="sc-price">${s.price}</div>
            <div className="sc-dur">{s.dur}</div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="ds-section-title" style={{marginTop:8}}>Recent Woops</div>
      {JOBS.filter(j=>j.status!=="active").slice(0,3).map(j=>(
        <div className="admin-job-row" key={j.id}>
          <div className="ajr-icon">🚗</div>
          <div>
            <div className="ajr-car">{j.car}</div>
            <div className="ajr-svc">{j.svc}</div>
          </div>
          <div className="ajr-right">
            <div className="ajr-price">${j.price}</div>
            <Badge s={j.status}/>
          </div>
        </div>
      ))}
    </div>
  );

  const Step1 = () => (
    <div className="ds-body fade-slide">
      <div className="step-header">
        <button className="back-btn" onClick={()=>setView("home")}>←</button>
        <div className="step-title">Choose service</div>
        <div className="step-dots">{[0,1,2,3].map(i=><div key={i} className={`step-dot${i===0?" on":""}`}/>)}</div>
      </div>
      <div className="option-list">
        {SVCS.map(s=>(
          <div key={s.id} className={`option-row${sel?.id===s.id?" sel":""}`} onClick={()=>setSel(s)}>
            <div className="opt-icon">{s.icon}</div>
            <div>
              <div className="opt-name">{s.name} Woop</div>
              <div className="opt-desc">{s.desc} · {s.dur}</div>
            </div>
            {sel?.id===s.id ? (
              <div className="sel-check"><svg width="10" height="8" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            ) : (
              <div style={{marginLeft:"auto",textAlign:"right"}}>
                <div className="opt-price">${s.price}</div>
                <div className="opt-dur">{s.dur}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="cta-btn" onClick={()=>sel&&setView("step2")} disabled={!sel}>
        {sel?`Continue with ${sel.name} Woop →`:"Select a service"}
      </button>
    </div>
  );

  const Step2 = () => (
    <div className="ds-body fade-slide">
      <div className="step-header">
        <button className="back-btn" onClick={()=>setView("step1")}>←</button>
        <div className="step-title">Your location</div>
        <div className="step-dots">{[0,1,2,3].map(i=><div key={i} className={`step-dot${i===1?" on":""}`}/>)}</div>
      </div>
      <AddressPicker onSelect={(addr) => setAddr(addr)} />
      <div className="addr-input-row" style={{marginBottom:10}}>
        <div className="addr-dot"/>
        <input className="addr-text" placeholder="Enter your address" value={addr} onChange={e=>setAddr(e.target.value)}/>
      </div>
      <input className="input-field" placeholder="Apt, floor, gate code (optional)" style={{marginBottom:20}}/>
      <div className="ds-section-title">Saved places</div>
      {[["🏠","Home","14 Maple St, Austin TX"],["💼","Work","200 Congress Ave, Austin TX"]].map(([ic,n,a])=>(
        <div key={n} className="option-row" style={{marginBottom:8}} onClick={()=>{setAddr(a);}}>
          <div className="opt-icon">{ic}</div>
          <div><div className="opt-name">{n}</div><div className="opt-desc">{a}</div></div>
        </div>
      ))}
      <button className="cta-btn" style={{marginTop:16}} onClick={()=>setView("step3")} disabled={!addr}>
        {addr?"Confirm location →":"Enter your address"}
      </button>
    </div>
  );

  const Step3 = () => (
    <div className="ds-body fade-slide">
      <div className="step-header">
        <button className="back-btn" onClick={()=>setView("step2")}>←</button>
        <div className="step-title">When?</div>
        <div className="step-dots">{[0,1,2,3].map(i=><div key={i} className={`step-dot${i===2?" on":""}`}/>)}</div>
      </div>
      <input className="input-field" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      <div className="ds-section-title" style={{marginTop:8}}>Available times</div>
      <div className="time-grid">
        {TIMES.map(t=>(
          <button key={t} className={`time-chip${time===t?" sel":""}`} onClick={()=>setTime(t)}>{t}</button>
        ))}
      </div>
      <div className="ds-section-title">Car</div>
      <div className="option-row" style={{marginBottom:20}}>
        <div className="opt-icon">🚗</div>
        <div><div className="opt-name">Tesla Model 3</div><div className="opt-desc">ABC 1234</div></div>
        <div style={{marginLeft:"auto",fontSize:12,fontWeight:600,color:"var(--muted)"}}>Change</div>
      </div>
      <button className="cta-btn" onClick={()=>setView("confirm")} disabled={!date||!time}>
        {date&&time?"Review booking →":"Pick date & time"}
      </button>
    </div>
  );

  const Confirm = () => (
    <div className="ds-body fade-slide">
      <div className="step-header">
        <button className="back-btn" onClick={()=>setView("step3")}>←</button>
        <div className="step-title">Review & pay</div>
        <div className="step-dots">{[0,1,2,3].map(i=><div key={i} className={`step-dot${i===3?" on":""}`}/>)}</div>
      </div>
      {sel&&<>
        <div style={{border:"2px solid var(--border)",borderRadius:16,padding:16,marginBottom:20}}>
          <div className="summary-row"><span className="sr-key">Service</span><span className="sr-val">{sel.icon} {sel.name} Woop</span></div>
          <div className="summary-row"><span className="sr-key">Duration</span><span className="sr-val">{sel.dur}</span></div>
          <div className="summary-row"><span className="sr-key">Location</span><span className="sr-val">{addr}</span></div>
          <div className="summary-row"><span className="sr-key">When</span><span className="sr-val">{date} · {time}</span></div>
          <div className="summary-row"><span className="sr-key">Car</span><span className="sr-val">Tesla Model 3</span></div>
          <div className="total-row"><span className="total-key">Total</span><span className="total-val">${sel.price}</span></div>
        </div>
        <div className="option-row" style={{marginBottom:16}}>
          <div className="opt-icon">💳</div>
          <div><div className="opt-name">Visa •••• 4242</div><div className="opt-desc">Expires 09/28</div></div>
          <div style={{marginLeft:"auto",fontSize:12,fontWeight:600,color:"var(--muted)"}}>Change</div>
        </div>
        <div style={{background:"var(--off)",borderRadius:12,padding:13,display:"flex",gap:9,alignItems:"center",marginBottom:20}}>
          <span style={{fontSize:16}}>🎁</span>
          <div style={{fontSize:13,fontWeight:600}}>Use code <strong>WOOP20</strong> for 20% off</div>
          <div style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:"var(--mint)"}}>Apply</div>
        </div>
        <button className="cta-btn zap" onClick={()=>setView("success")}>
          Confirm Woop · ${sel.price} 💳
        </button>
      </>}
    </div>
  );

  const Success = () => (
    <div className="success-wrap fade-slide">
      <div className="success-icon">✓</div>
      <div className="success-title">Woop confirmed!</div>
      <div className="success-sub">Carlos M. is on his way.<br/>You'll get updates via SMS.</div>
      <div className="washer-confirm-card">
        <div className="w-ava">C</div>
        <div>
          <div style={{fontWeight:800,fontSize:15}}>Carlos M.</div>
          <div style={{fontSize:13,color:"var(--muted)",fontWeight:500,marginTop:2}}>⭐ 4.9 · 142 Woops done</div>
          <div style={{fontSize:12,fontWeight:700,color:"var(--mint)",marginTop:4}}>Full Woop · Arriving ~12 min</div>
        </div>
      </div>
      <button className="cta-btn" onClick={()=>{setView("tracking");}}>
        Track live →
      </button>
      <button className="sec-btn" style={{width:"100%",marginTop:10}} onClick={()=>setView("home")}>
        Back to home
      </button>
    </div>
  );

  const Tracking = () => (
    <div className="active-sheet fade-slide">
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
        <button className="back-btn" onClick={()=>setView("home")}>←</button>
        <div style={{fontWeight:800,fontSize:18,letterSpacing:"-0.5px"}}>Live Tracking</div>
      </div>
      <div className="washer-bar">
        <div className="w-ava">C</div>
        <div className="w-info">
          <div className="w-name">Carlos M.</div>
          <div className="w-sub"><span className="w-rating">⭐ 4.9</span> · Full Woop</div>
        </div>
        <div className="w-actions">
          <button className="w-act-btn">📞</button>
          <button className="w-act-btn">💬</button>
        </div>
      </div>
      <div className="eta-bar">
        <div className="eta-left">
          <div className="eta-val">12 min</div>
          <div className="eta-lbl">Estimated arrival</div>
        </div>
        <div className="eta-right">
          <div className="eta-dist">2.4 km away</div>
          <div className="eta-status">En route</div>
        </div>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{width:"40%"}}/>
      </div>
      <div className="prog-labels" style={{marginBottom:20}}>
        {["Confirmed","En route","Washing","Done"].map((l,i)=>(
          <span key={l} className={`prog-lbl${i<=1?" on":""}`}>{l}</span>
        ))}
      </div>
      <div className="action-row-2">
        <button className="sec-btn">🔔 Notifications</button>
        <button className="sec-btn danger">✕ Cancel</button>
      </div>
    </div>
  );

  const views = { home:<HomeView/>, step1:<Step1/>, step2:<Step2/>, step3:<Step3/>, confirm:<Confirm/>, success:<Success/>, tracking:<Tracking/> };
  const mapPhase = ["tracking","active","success"].includes(view)?"tracking":view==="home"?"home":"booking";

  return { content: views[view]||<HomeView/>, mapPhase };
}

/* ════════ EMPLOYEE SIDE ════════ */
function EmployeeSide() {
  const [jobs, setJobs] = useState(JOBS.filter(j=>j.washer==="Carlos M."));
  const [avail, setAvail] = useState(true);
  const [tab, setTab] = useState("jobs");
  const [checks, setChecks] = useState([false,false,false,false,true,true,true,true]);
  const CHECKLIST = ["Rinse vehicle","Apply shampoo","Scrub exterior","Rinse soap","Dry exterior","Polish windows","Vacuum interior","Wipe dashboard"];
  const done = checks.filter(Boolean).length;

  const Jobs = () => (
    <div className="ds-body fade-slide">
      <div className="avail-row">
        <div>
          <div className="avail-status">{avail?"You're online":"You're offline"}</div>
          <div className="avail-sub">{avail?"Ready to receive jobs":"Toggle to go online"}</div>
        </div>
        <div className={`toggle${avail?" on":""}`} onClick={()=>setAvail(!avail)}/>
      </div>
      <div className="kpi-row">
        {[["$100","Today"],["$480","This week"]].map(([v,l])=>(
          <div className="kpi-u" key={l}><div className="kpi-u-val">{v}</div><div className="kpi-u-lbl">{l}</div></div>
        ))}
      </div>
      <div className="ds-section-title">Today's Jobs</div>
      {jobs.map(j=>(
        <div key={j.id} className={`job-card-u${j.status==="active"?" active":""}`}>
          <div className="jcu-top">
            <div><div className="jcu-car">{j.car}</div><div className="jcu-svc">{j.svc}</div></div>
            <div style={{textAlign:"right"}}><div className="jcu-price">${j.price}</div><Badge s={j.status}/></div>
          </div>
          <div className="jcu-addr">📍 {j.addr} · 🕐 {j.time}</div>
          {j.status==="active"&&<div style={{marginBottom:12}}><div style={{height:4,background:"var(--border)",borderRadius:2}}><div style={{height:"100%",width:"60%",background:"var(--mint)",borderRadius:2}}/></div></div>}
          <div className="jcu-actions">
            {j.status==="pending"&&<button className="jcu-btn primary" onClick={()=>setJobs(p=>p.map(x=>x.id===j.id?{...x,status:"active"}:x))}>▶ Start Job</button>}
            {j.status==="active"&&<button className="jcu-btn primary" onClick={()=>setTab("checklist")}>📋 Open Checklist</button>}
            {j.status==="done"&&<button className="jcu-btn secondary">Receipt</button>}
            <button className="jcu-btn secondary">Map</button>
          </div>
        </div>
      ))}
    </div>
  );

  const Checklist = () => (
    <div className="ds-body fade-slide">
      <div className="step-header" style={{marginBottom:18}}>
        <button className="back-btn" onClick={()=>setTab("jobs")}>←</button>
        <div>
          <div className="step-title">Wash Checklist</div>
          <div style={{fontSize:12,color:"var(--muted)",fontWeight:500,marginTop:2}}>Tesla Model 3 · Full Woop</div>
        </div>
      </div>
      <div style={{background:"var(--off)",borderRadius:14,padding:14,marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:22,fontWeight:800}}>{done}/{CHECKLIST.length}</div>
          <div style={{fontSize:12,color:"var(--muted)",fontWeight:500,marginTop:2}}>Steps complete</div>
        </div>
        <div style={{width:120}}>
          <div style={{height:6,background:"var(--border)",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${done/CHECKLIST.length*100}%`,background:"var(--mint)",borderRadius:3,transition:"width 0.5s"}}/>
          </div>
          <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",marginTop:5,textAlign:"right"}}>{Math.round(done/CHECKLIST.length*100)}% done</div>
        </div>
      </div>
      {CHECKLIST.map((item,i)=>(
        <div key={i} className="cl-item" onClick={()=>setChecks(p=>p.map((c,j)=>j===i?!c:c))}>
          <div className={`cl-box${checks[i]?" chk":""}`}>
            {checks[i]&&<svg width="10" height="8" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className={`cl-label${checks[i]?" done":""}`}>{item}</span>
        </div>
      ))}
      <button className="cta-btn" style={{marginTop:20}} onClick={()=>setTab("jobs")}>✓ Complete Woop</button>
    </div>
  );

  const Earn = () => (
    <div className="ds-body fade-slide">
      <div className="earn-hero">
        <div className="earn-lbl">THIS MONTH</div>
        <div className="earn-val">$1,840</div>
        <div className="earn-chg">↑ +12% vs last month</div>
      </div>
      <div className="kpi-row">
        {[["$100","Today","2 jobs"],["$480","Week","12 jobs"],["$9.2k","All time","203 jobs"],["4.9★","Rating","Top 5%"]].map(([v,l,s])=>(
          <div className="kpi-u" key={l}><div className="kpi-u-val">{v}</div><div className="kpi-u-lbl">{l}</div><div className="kpi-u-chg">{s}</div></div>
        ))}
      </div>
      <div className="ds-section-title">This Week</div>
      <div className="bar-chart-u">
        {BARS.map((h,i)=><div key={i} className={`bar-u${i===5?" on":""}`} style={{height:`${h}%`}}/>)}
      </div>
      <div className="bar-lbls">{DAYS.map((l,i)=><div key={i} className="bar-l">{l}</div>)}</div>
    </div>
  );

  const tabContent = { jobs:<Jobs/>, checklist:<Checklist/>, earnings:<Earn/> };
  return { content: tabContent[tab]||<Jobs/>, tab, setTab, mapPhase:"employee" };
}

/* ════════ ADMIN SIDE ════════ */
function AdminSide() {
  const [jobs, setJobs] = useState(JOBS);
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState("live");

  const assign = (id,name)=>{setJobs(p=>p.map(j=>j.id===id?{...j,washer:name,status:"active"}:j));setModal(null);};

  const Live = () => (
    <div className="ds-body fade-slide">
      <div className="kpi-row">
        {[["$220","Revenue","↑ +18%"],["4","Jobs","2 active"],["3/4","Washers","1 offline"],["4.9★","Rating","↑ stable"]].map(([v,l,c])=>(
          <div className="kpi-u" key={l}><div className="kpi-u-val">{v}</div><div className="kpi-u-lbl">{l}</div><div className="kpi-u-chg">{c}</div></div>
        ))}
      </div>
      <div className="ds-section-title">Live Jobs</div>
      {jobs.map(j=>(
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
          {j.washer==="Unassigned"&&<button className="assign-btn" onClick={()=>setModal(j.id)}>Assign</button>}
        </div>
      ))}
    </div>
  );

  const Team = () => (
    <div className="ds-body fade-slide">
      <div className="kpi-row">
        <div className="kpi-u"><div className="kpi-u-val">3/4</div><div className="kpi-u-lbl">Online</div></div>
        <div className="kpi-u"><div className="kpi-u-val">4.9</div><div className="kpi-u-lbl">Avg rating</div></div>
      </div>
      <div className="ds-section-title">Washers</div>
      {WASHERS.map(w=>(
        <div className="washer-row-u" key={w.n}>
          <div className="wu-ava">{w.init}</div>
          <div>
            <div className="wu-name">{w.n}</div>
            <div className="wu-status"><div className="wu-dot" style={{background:w.dot}}/>{w.status} · {w.jobs} woops</div>
          </div>
          <div className="wu-rating">⭐ {w.r}</div>
        </div>
      ))}
    </div>
  );

  const Analytics = () => (
    <div className="ds-body fade-slide">
      <div className="earn-hero">
        <div className="earn-lbl">WEEKLY REVENUE</div>
        <div className="earn-val">$1,540</div>
        <div className="earn-chg">↑ +12% vs last week</div>
      </div>
      <div className="bar-chart-u" style={{marginBottom:6}}>
        {BARS.map((h,i)=><div key={i} className={`bar-u${i===5?" on":""}`} style={{height:`${h}%`}}/>)}
      </div>
      <div className="bar-lbls" style={{marginBottom:20}}>{DAYS.map((l,i)=><div key={i} className="bar-l">{l}</div>)}</div>
      <div className="ds-section-title">Service Mix</div>
      {[["Express Woop",42],["Full Woop",28],["Deep Woop",17],["Inside Woop",13]].map(([n,p])=>(
        <div key={n} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:13,fontWeight:600}}>{n}</span>
            <span style={{fontSize:13,fontWeight:800}}>{p}%</span>
          </div>
          <div style={{height:5,background:"var(--border)",borderRadius:3}}><div style={{height:"100%",width:`${p*2.38}%`,background:"linear-gradient(90deg,var(--mint),var(--zap))",borderRadius:3}}/></div>
        </div>
      ))}
    </div>
  );

  const tabContent = { live:<Live/>, team:<Team/>, analytics:<Analytics/> };

  return {
    content: tabContent[tab]||<Live/>,
    tab, setTab,
    mapPhase: "admin",
    modal: modal && (
      <div className="modal-overlay" onClick={()=>setModal(null)}>
        <div className="modal-panel" onClick={e=>e.stopPropagation()}>
          <div className="modal-handle"/>
          <div className="modal-title">Assign a washer</div>
          <div className="modal-sub">{jobs.find(j=>j.id===modal)?.car} · {jobs.find(j=>j.id===modal)?.svc}</div>
          {WASHERS.filter(w=>w.status!=="Off duty").map(w=>(
            <div key={w.n} className="washer-pick-row" onClick={()=>assign(modal,w.n)}>
              <div className="wu-ava">{w.init}</div>
              <div>
                <div style={{fontWeight:800,fontSize:14}}>{w.n}</div>
                <div style={{fontSize:12,color:"var(--muted)",fontWeight:500,marginTop:2,display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:w.dot}}/>
                  {w.status} · ⭐ {w.r}
                </div>
              </div>
              <button className="assign-btn" style={{marginLeft:"auto"}}>Assign</button>
            </div>
          ))}
          <button style={{width:"100%",marginTop:10,padding:"13px",borderRadius:12,background:"var(--off)",border:"none",cursor:"pointer",fontFamily:"var(--font)",fontWeight:700,fontSize:14}} onClick={()=>setModal(null)}>Cancel</button>
        </div>
      </div>
    )
  };
}

/* ════════ ROOT ════════ */
export default function WoopApp({ onBack = () => {} }) {
  const [role, setRole] = useState("customer");

  const customerSide = CustomerSide();
  const employeeSide = EmployeeSide();
  const adminSide = AdminSide();

  const sides = { customer: customerSide, employee: employeeSide, admin: adminSide };
  const current = sides[role];

  const tabs = {
    employee: [["jobs","Jobs"],["checklist","Checklist"],["earnings","Earnings"]],
    admin: [["live","Live"],["team","Team"],["analytics","Analytics"]],
  };

  return (
    <>
      <style>{css}</style>

      {/* DEV ROLE SWITCHER */}
      <div className="dev-bar">
        <button className="dev-btn" onClick={onBack}>🏠 Home</button>
        {[["customer","🧑 Customer"],["employee","🧹 Washer"],["admin","👑 Admin"]].map(([r,l])=>(
          <button key={r} className={`dev-btn${role===r?" on":""}`} onClick={()=>setRole(r)}>{l}</button>
        ))}
      </div>

      <div className="shell">
        {/* DESKTOP SIDE PANEL */}
        <aside className="desktop-side">
          <div className="ds-top">
            <div className="ds-logo">
              <div className="ds-logo-mark">
                <svg width="14" height="10" viewBox="0 0 54 36" fill="none">
                  <path d="M2 7 Q9.5 30 16 20 Q22.5 10 27 20 Q31.5 30 38 20 Q44.5 10 52 7" stroke="white" strokeWidth="6.5" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              woop
            </div>
            {tabs[role] && (
              <div className="ds-nav">
                {tabs[role].map(([id,lb])=>(
                  <button key={id} className={`ds-nav-btn${current.tab===id?" on":""}`} onClick={()=>current.setTab(id)}>{lb}</button>
                ))}
              </div>
            )}
          </div>
          {current.content}
        </aside>

        {/* MAP */}
        <MapView phase={current.mapPhase} role={role}/>

        {/* MAP TOP OVERLAY */}
        <div className="top-overlay">
          <div className="topbar-pill">
            <div className="tp-logo">woop</div>
            <div className="tp-sep"/>
            <div className="tp-addr"><strong>Austin, TX</strong> · {role==="customer"?"Sarah K.":role==="employee"?"Carlos M.":"Admin"}</div>
          </div>
          <div className="top-right">
            <button className="map-btn">📍</button>
            <button className="map-btn">🔍</button>
          </div>
        </div>

        {/* MOBILE BOTTOM SHEET */}
        <div className="sheet-wrap mobile-sheet">
          <div className="sheet">
            <div className="sheet-handle"/>
            <div className="sheet-inner">
              {tabs[role] && (
                <div style={{display:"flex",gap:0,marginBottom:18,borderBottom:"1px solid rgba(0,200,150,0.15)",background:"var(--ink)",margin:"-16px -20px 18px",padding:"0 20px",borderRadius:"20px 20px 0 0"}}>
                  {tabs[role].map(([id,lb])=>(
                    <button key={id} className={`ds-nav-btn${current.tab===id?" on":""}`} onClick={()=>current.setTab(id)} style={{padding:"12px 16px"}}>{lb}</button>
                  ))}
                </div>
              )}
              {role==="customer" && current.content}
              {role==="employee" && current.content}
              {role==="admin" && current.content}
            </div>
          </div>
        </div>

        {/* MODALS */}
        {current.modal}
      </div>
    </>
  );
}