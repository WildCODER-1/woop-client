const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const api = {
  // ── AUTH ────────────────────────────────────────────────────────────────────
  register: (data) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  login: (data) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  createPaymentIntent: (amount) =>
    fetch(`${BASE}/payments/create-intent`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ amount })
    }).then(r => r.json()),

  // ── BOOKINGS ────────────────────────────────────────────────────────────────
  getBookings: () =>
    fetch(`${BASE}/bookings`, {
      headers: headers()
    }).then(r => r.json()),

  createBooking: (data) =>
    fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateBooking: (id, data) =>
    fetch(`${BASE}/bookings/${id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteBooking: (id) =>
    fetch(`${BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: headers()
    }).then(r => r.json()),

  // ── WASHERS ─────────────────────────────────────────────────────────────────
  getWashers: () =>
    fetch(`${BASE}/washers`, {
      headers: headers()
    }).then(r => r.json()),

  toggleAvailability: (id) =>
    fetch(`${BASE}/washers/${id}/availability`, {
      method: 'PATCH',
      headers: headers()
    }).then(r => r.json()),

  // ── SERVICES ────────────────────────────────────────────────────────────────
  getServices: () =>
    fetch(`${BASE}/services`).then(r => r.json()),
}