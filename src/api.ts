import { User } from './types'
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
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  return res.json()
}

// Simple localStorage fallback for demo deployments with no backend.
const STORE_KEY = 'react_crud_users_v1'
function readStore(): User[] {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
function writeStore(items: User[]) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(items)) } catch {}
}

function mkId(items: User[]) {
  const max = items.reduce((m, i) => (i.id && i.id > m ? i.id : m), 0)
  return max + 1
}

export const api = {
  async listUsers() {
    try {
      return await request('/users')
    } catch (err) {
      // fallback to localStorage
      return readStore()
    }
  },
  async getUser(id: number) {
    try { return await request(`/users/${id}`) } catch (err) {
      return readStore().find(u => u.id === id)
    }
  },
  async createUser(u: User) {
    try {
      return await request('/users', { method: 'POST', body: JSON.stringify(u) })
    } catch (err) {
      const items = readStore()
      const id = mkId(items)
      const out = { ...u, id }
      items.push(out)
      writeStore(items)
      return out
    }
  },
  async updateUser(id: number, u: User) {
    try {
      return await request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(u) })
    } catch (err) {
      const items = readStore()
      const idx = items.findIndex(it => it.id === id)
      if (idx >= 0) { items[idx] = { ...items[idx], ...u }; writeStore(items); return items[idx] }
      throw err
    }
  },
  async deleteUser(id: number) {
    try {
      return await request(`/users/${id}`, { method: 'DELETE' })
    } catch (err) {
      const items = readStore().filter(it => it.id !== id)
      writeStore(items)
      return { ok: true }
    }
  }
}
