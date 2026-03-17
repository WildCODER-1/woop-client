import { useState } from "react";
import { login, register } from "../services/Auth";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

// ── Replace these values with your real Firebase config ──────────
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const app            = initializeApp(firebaseConfig);
const auth           = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider  = new OAuthProvider("apple.com");

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0D1F1A; --ink2: #1A3A30;
    --mint: #00C896; --mint-d: #00A87D; --mint-l: #E6FBF4;
    --zap: #FFE134;
    --off: #F4FBF8; --border: #D6EFE6; --muted: #5A7A6E;
    --red: #FF4757;
    --font: 'Nunito', sans-serif; --display: 'Syne', sans-serif;
  }
  html, body { height: 100%; font-family: var(--font); background: var(--ink); -webkit-font-smoothing: antialiased; }

  .login-shell { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }

  /* LEFT PANEL */
  .login-left {
    background: linear-gradient(160deg, var(--ink) 0%, var(--ink2) 100%);
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 48px; position: relative; overflow: hidden;
  }
  .login-left::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 20% 80%, rgba(0,200,150,0.1), transparent 70%),
                radial-gradient(ellipse 60% 40% at 80% 20%, rgba(255,225,52,0.06), transparent 60%);
  }
  .login-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(0,200,150,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,150,0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 80%);
  }
  .ll-logo { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
  .ll-logo-mark { width: 40px; height: 40px; border-radius: 12px; background: var(--mint); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 18px rgba(0,200,150,0.4); }
  .ll-logo-word { font-family: var(--display); font-size: 26px; font-weight: 800; color: white; letter-spacing: -0.5px; }
  .ll-hero { position: relative; z-index: 1; }
  .ll-tagline { font-family: var(--display); font-size: clamp(32px, 3.5vw, 52px); font-weight: 800; color: white; line-height: 1.05; letter-spacing: -2px; margin-bottom: 18px; }
  .ll-tagline .accent { background: linear-gradient(90deg, var(--mint), var(--zap)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .ll-sub { font-size: 16px; color: rgba(255,255,255,0.45); font-weight: 600; line-height: 1.7; margin-bottom: 36px; }
  .ll-stats { display: flex; gap: 28px; }
  .ll-stat-val { font-family: var(--display); font-size: 26px; font-weight: 800; color: white; }
  .ll-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
  .ll-footer { font-size: 12px; color: rgba(255,255,255,0.2); font-weight: 600; position: relative; z-index: 1; }

  /* RIGHT PANEL */
  .login-right { background: white; display: flex; align-items: center; justify-content: center; padding: 48px; }
  .login-box { width: 100%; max-width: 400px; }

  /* TITLES */
  .lb-title { font-family: var(--display); font-size: 28px; font-weight: 800; color: var(--ink); letter-spacing: -1px; margin-bottom: 6px; }
  .lb-sub { font-size: 15px; color: var(--muted); font-weight: 600; margin-bottom: 24px; line-height: 1.6; }

  /* MAIN INPUT */
  .main-input {
    width: 100%; padding: 16px 18px; border-radius: 14px;
    border: 2px solid var(--border); font-size: 16px;
    font-family: var(--font); color: var(--ink); background: white;
    outline: none; font-weight: 600; transition: border 0.18s; margin-bottom: 12px;
  }
  .main-input:focus { border-color: var(--mint); }
  .main-input.err { border-color: var(--red); }
  .main-input::placeholder { color: #aac4b8; font-weight: 500; }

  /* CONTINUE BUTTON */
  .continue-btn {
    width: 100%; padding: 16px; border-radius: 14px;
    background: var(--mint); color: var(--ink);
    font-size: 16px; font-weight: 900; border: none; cursor: pointer;
    font-family: var(--font); transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(0,200,150,0.3);
    display: flex; align-items: center; justify-content: center; gap: 9px;
    margin-bottom: 20px;
  }
  .continue-btn:hover { background: var(--mint-d); transform: translateY(-1px); }
  .continue-btn:active { transform: scale(0.98); }
  .continue-btn:disabled { background: var(--border); color: var(--muted); box-shadow: none; cursor: not-allowed; transform: none; }

  /* DIVIDER */
  .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .divider span { font-size: 12px; color: var(--muted); font-weight: 700; }

  /* SOCIAL BUTTONS */
  .social-btn {
    width: 100%; padding: 14px 18px; border-radius: 14px;
    border: 2px solid var(--border); background: white;
    font-size: 15px; font-weight: 700; color: var(--ink);
    cursor: pointer; font-family: var(--font);
    display: flex; align-items: center; justify-content: center; gap: 12px;
    transition: all 0.18s; margin-bottom: 10px;
  }
  .social-btn:hover { background: var(--off); border-color: #c0d8cf; transform: translateY(-1px); }
  .social-btn:active { transform: scale(0.98); }
  .social-btn.apple { background: var(--ink); color: white; border-color: var(--ink); }
  .social-btn.apple:hover { background: var(--ink2); border-color: var(--ink2); }

  /* BACK LINK */
  .back-link {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 800; color: var(--muted);
    cursor: pointer; margin-bottom: 20px; transition: color 0.15s;
    background: none; border: none; font-family: var(--font); padding: 0;
  }
  .back-link:hover { color: var(--ink); }

  /* WHO BADGE */
  .who-badge {
    display: flex; align-items: center; gap: 8px;
    background: var(--off); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 10px 14px; margin-bottom: 20px;
  }
  .who-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--mint); flex-shrink: 0; }
  .who-text { font-size: 14px; font-weight: 700; color: var(--ink); }

  /* ERROR */
  .error-msg { background: #FFF0F0; border: 1.5px solid #FFCDD2; border-radius: 10px; padding: 11px 14px; font-size: 13px; font-weight: 700; color: var(--red); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }

  /* SPINNER */
  .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(13,31,26,0.2); border-top-color: var(--ink); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* FORM FIELDS */
  .fg { margin-bottom: 12px; }
  .fg label { display: block; font-size: 11px; font-weight: 800; color: var(--ink); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
  .fg input { width: 100%; padding: 14px 16px; border-radius: 12px; border: 2px solid var(--border); font-size: 15px; font-family: var(--font); color: var(--ink); background: white; outline: none; font-weight: 600; transition: border 0.18s; }
  .fg input:focus { border-color: var(--mint); }

  /* FOOTER */
  .auth-footer { font-size: 12px; color: var(--muted); text-align: center; margin-top: 20px; line-height: 1.8; font-weight: 600; }
  .auth-footer a { color: var(--mint); font-weight: 800; text-decoration: none; cursor: pointer; }
  .auth-footer a:hover { text-decoration: underline; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .login-shell { grid-template-columns: 1fr; }
    .login-left { display: none; }
    .login-right { padding: 40px 24px; min-height: 100vh; align-items: flex-start; padding-top: 64px; }
  }
`;

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{flexShrink:0}}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{flexShrink:0}}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export default function LoginPage({ onLogin }) {
  const [screen, setScreen]     = useState("enter");
  const [input, setInput]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const isEmail = input.includes("@");
  const isPhone = /^[\d\s\+\-\(\)]{7,}$/.test(input.trim());
  const inputValid = isEmail || isPhone;

  const reset = () => { setError(""); setPassword(""); };

  // ── Social login (Google or Apple) ──
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // In production: send firebaseUser.uid + email to your backend
      // to create/fetch the user record and return your own JWT
      // For now we create a session directly
      const user = {
        name:  firebaseUser.displayName || "User",
        email: firebaseUser.email,
        role:  "customer",
        init:  (firebaseUser.displayName || "U")[0].toUpperCase(),
      };
      localStorage.setItem("woop_token", btoa(JSON.stringify(user)));
      onLogin(user);
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        // User closed popup — not an error
      } else if (err.code === "auth/configuration-not-found") {
        setError("Firebase not configured yet. Add your config to firebase.js");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── SCREEN 1: phone or email ──
  const EnterScreen = () => (
    <>
      <div className="lb-title">Welcome to Woop 👋</div>
      <div className="lb-sub">Sign in or create an account to get started.</div>

      <input
        className={`main-input${error?" err":""}`}
        type="text"
        placeholder="Phone number or email"
        value={input}
        onChange={e => { setInput(e.target.value); setError(""); }}
        autoFocus
        onKeyDown={e => e.key === "Enter" && inputValid && (setScreen("password"), reset())}
      />

      {error && <div className="error-msg">⚠️ {error}</div>}

      <button
        className="continue-btn"
        disabled={!inputValid}
        onClick={() => {
          if (!inputValid) { setError("Enter a valid email or phone number."); return; }
          setScreen("password"); reset();
        }}
      >
        Continue →
      </button>

      {/* Sign up CTA — visible and clear */}
      <button
        onClick={() => { setScreen("signup"); reset(); }}
        style={{
          width:"100%", padding:"15px", borderRadius:14,
          background:"var(--off)", border:"2px solid var(--border)",
          fontSize:15, fontWeight:800, color:"var(--ink)",
          cursor:"pointer", fontFamily:"var(--font)",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          marginBottom:20, transition:"all 0.18s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor="var(--mint)"; e.currentTarget.style.background="var(--mint-l)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.background="var(--off)"; }}
      >
        ✨ Create a new account
      </button>

      <div className="divider"><span>or</span></div>

      <button className="social-btn" onClick={() => handleSocialLogin(googleProvider)}>
        <GoogleIcon/> Continue with Google
      </button>

      <button className="social-btn apple" onClick={() => handleSocialLogin(appleProvider)}>
        <AppleIcon/> Continue with Apple
      </button>

      <div className="auth-footer">
        By continuing you agree to our <a>Terms</a> and <a>Privacy Policy</a>
      </div>
    </>
  );

  // ── SCREEN 2: password (sign in) ──
  const PasswordScreen = () => (
    <>
      <button className="back-link" onClick={() => { setScreen("enter"); reset(); }}>← Back</button>

      <div className="who-badge">
        <div className="who-dot"/>
        <div className="who-text">{input}</div>
      </div>

      <div className="lb-title">Enter your password</div>
      <div className="lb-sub">Sign in to your Woop account.</div>

      {error && <div className="error-msg">⚠️ {error}</div>}

      <div className="fg">
        <label>Password</label>
        <input
          type="password" placeholder="••••••••"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(""); }}
          autoFocus
          onKeyDown={e => e.key === "Enter" && !loading && handleSignIn()}
        />
      </div>

      <button
        className="continue-btn" style={{marginTop:8}}
        disabled={!password || loading}
        onClick={handleSignIn}
      >
        {loading ? <><div className="spinner"/>Signing in…</> : "Sign in →"}
      </button>

      <div className="auth-footer">
        No account? <a onClick={() => { setScreen("signup"); reset(); }}>Sign up free</a>
        &nbsp;·&nbsp;<a>Forgot password?</a>
      </div>
    </>
  );

  // ── SCREEN 3: sign up ──
  const SignupScreen = () => (
    <>
      <button className="back-link" onClick={() => { setScreen("enter"); reset(); }}>← Back</button>

      <div className="lb-title">Create your account</div>
      <div className="lb-sub">Join Woop and get your car gleaming. ✨</div>

      {error && <div className="error-msg">⚠️ {error}</div>}

      <div className="fg">
        <label>Full name</label>
        <input type="text" placeholder="Sarah Johnson" value={name}
          onChange={e => setName(e.target.value)} autoFocus/>
      </div>
      <div className="fg">
        <label>Email or phone</label>
        <input type="text" placeholder="you@example.com" value={input}
          onChange={e => setInput(e.target.value)}/>
      </div>
      <div className="fg">
        <label>Password</label>
        <input type="password" placeholder="Min. 8 characters" value={password}
          onChange={e => { setPassword(e.target.value); setError(""); }}/>
      </div>

      <button
        className="continue-btn" style={{marginTop:8}}
        disabled={!name || !input || !password || loading}
        onClick={handleSignUp}
      >
        {loading ? <><div className="spinner"/>Creating account…</> : "Create account →"}
      </button>

      <div className="auth-footer">
        Already have an account? <a onClick={() => { setScreen("password"); reset(); }}>Sign in</a>
      </div>
    </>
  );

  const handleSignIn = async () => {
    setLoading(true); 
    setError("");
    try {
      const user = await login(input, password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally { 
      setLoading(false); 
    }
  };

  const handleSignUp = async () => {
    if (password.length < 8) { 
      setError("Password must be at least 8 characters."); 
      return; 
    }
    setLoading(true); 
    setError("");
    try {
      const user = await register(name, input, password, 'customer');
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally { 
      setLoading(false); 
    }
  };

  const SCREENS = { enter: <EnterScreen/>, password: <PasswordScreen/>, signup: <SignupScreen/> };

  return (
    <>
      <style>{css}</style>
      <div className="login-shell">

        {/* LEFT */}
        <div className="login-left">
          <div className="login-grid"/>
          <div className="ll-logo">
            <div className="ll-logo-mark">
              <svg width="20" height="14" viewBox="0 0 54 36" fill="none">
                <path d="M2 7 Q9.5 30 16 20 Q22.5 10 27 20 Q31.5 30 38 20 Q44.5 10 52 7"
                  stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div className="ll-logo-word">woop</div>
          </div>
          <div className="ll-hero">
            <h1 className="ll-tagline">Your car,<br/><span className="accent">gleaming</span><br/>at your door.</h1>
            <p className="ll-sub">On-demand hand car wash.<br/>Book in 60 seconds. Track live. Pay online.</p>
            <div className="ll-stats">
              {[["12,400+","Woops done"],["4.9★","Avg rating"],["8","Cities"]].map(([v,l])=>(
                <div key={l}>
                  <div className="ll-stat-val">{v}</div>
                  <div className="ll-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="ll-footer">© 2026 Woop Inc · Austin, TX</div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-box">
            {SCREENS[screen]}
          </div>
        </div>

      </div>
    </>
  );
}