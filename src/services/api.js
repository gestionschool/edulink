// src/services/api.ts
const API = import.meta.env.DEV ? '/api' : '/api' // garde /api si tu utilises le proxy

async function get(path, params = {}) {
  const q = new URLSearchParams(params).toString()
  const url = `${API}${path}${q ? `?${q}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`)
  return res.json()
}

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`)
  return res.json()
}

async function patch(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`PATCH ${path} -> ${res.status}`)
  return res.json()
}

async function del(path) {
  const res = await fetch(`${API}${path}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE ${path} -> ${res.status}`)
  return true
}

export const api = { get, post, patch, del }
