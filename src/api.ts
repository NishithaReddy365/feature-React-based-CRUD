import { User } from './types'

// By default use same-origin requests (no localhost access from deployed site).
// Set `VITE_API_BASE` in your deployment environment to point to an external API.
const API_BASE = import.meta.env.VITE_API_BASE || ''

async function request(path: string, opts: RequestInit = {}) {
  const url = API_BASE ? API_BASE.replace(/\/$/, '') + path : path
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  listUsers: () => request('/users'),
  getUser: (id: number) => request(`/users/${id}`),
  createUser: (u: User) => request('/users', { method: 'POST', body: JSON.stringify(u) }),
  updateUser: (id: number, u: User) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(u) }),
  deleteUser: (id: number) => request(`/users/${id}`, { method: 'DELETE' })
}
