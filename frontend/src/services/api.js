const BASE = 'http://localhost:8080/api';

// ── Profile ──────────────────────────────────────
export const profileApi = {
  getAll: () => fetch(`${BASE}/profile`).then(r => r.json()),
  update: (id, data) => fetch(`${BASE}/profile/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
};

// ── Projects ─────────────────────────────────────
export const projectApi = {
  getAll: () => fetch(`${BASE}/projects`).then(r => r.json()),
  create: (data) => fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  delete: (id) => fetch(`${BASE}/projects/${id}`, { method: 'DELETE' }),
};

// ── Messages (Guestbook) ──────────────────────────
export const messageApi = {
  getAll: () => fetch(`${BASE}/messages`).then(r => r.json()),
  create: (data) => fetch(`${BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  delete: (id) => fetch(`${BASE}/messages/${id}`, { method: 'DELETE' }),
};