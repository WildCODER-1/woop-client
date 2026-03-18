// ── AUTH HELPERS ──────────────────────────────────────────────
// In production these call your real backend.
// For now they simulate JWT login with role detection.

export const DEMO_USERS = [
  { email: "sarah@email.com",  password: "woop123", role: "customer", name: "Sarah K.",  init: "S" },
  { email: "carlos@woop.app",  password: "woop123", role: "washer",   name: "Carlos M.", init: "C" },
  { email: "admin@woop.app",   password: "woop123", role: "admin",    name: "Admin",     init: "A" },
];

export function login(email, password) {
  const user = DEMO_USERS.find(
    u => u.email === email && u.password === password
  );
  if (!user) throw new Error("Invalid email or password.");
  // In production: return fetch('/auth/login', { method:'POST', body: JSON.stringify({email,password}) })
  const token = btoa(JSON.stringify({ role: user.role, name: user.name, init: user.init, email: user.email }));
  localStorage.setItem("woop_token", token);
  return user;
}

export function logout() {
  localStorage.removeItem("woop_token");
}

export function getSession() {
  try {
    const token = localStorage.getItem("woop_token");
    if (!token) return null;

    // Real JWT has 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length === 3) {
      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      return {
        id:    payload.id,
        name:  payload.name,
        email: payload.email,
        role:  payload.role,
        init:  payload.name?.[0]?.toUpperCase() || "U",
      };
    }

    // Legacy base64 token (demo mode)
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}