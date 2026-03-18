// ── AUTH HELPERS ──────────────────────────────────────────────
// In production these call your real backend.
// For now they simulate JWT login with role detection.

export const DEMO_USERS = [
  { email: "sarah@email.com",  password: "woop123", role: "customer", name: "Sarah K.",  init: "S" },
  { email: "carlos@woop.app",  password: "woop123", role: "washer",   name: "Carlos M.", init: "C" },
  { email: "admin@woop.app",   password: "woop123", role: "admin",    name: "Admin",     init: "A" },
];

export async function login(email, password) {
  try {
    const response = await fetch('https://woop-server-production.up.railway.app/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('woop_token', data.token);
    localStorage.setItem('woop_user', JSON.stringify(data.user));
    return data.user;
  } catch (err) {
    throw new Error(err.message || 'Invalid email or password.');
  }
}

export async function register(name, email, password, role = 'customer') {
  try {
    const response = await fetch('https://woop-server-production.up.railway.app/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    const data = await response.json();
    localStorage.setItem('woop_token', data.token);
    localStorage.setItem('woop_user', JSON.stringify(data.user));
    return data.user;
  } catch (err) {
    throw new Error(err.message || 'Registration failed');
  }
}

export function logout() {
  localStorage.removeItem("woop_token");
}

export function getSession() {
  try {
    const userStr = localStorage.getItem('woop_user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}