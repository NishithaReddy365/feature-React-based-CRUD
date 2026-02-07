import { User } from './types'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(API_BASE + path, {
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
