import crypto from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { isAuthenticated } from './lib/auth.js'

const STORE_NAME = 'guest-reviews'

const FIELDS = [
  'name',
  'checkIn',
  'checkOut',
  'nights',
  'platform',
  'guests',
  'welcomeGift',
  'occasion',
  'payout',
  'additionalInfo',
  'payment',
  'comments',
  'phone',
  'rating'
]

export default async function handler(request) {
  if (!isAuthenticated(request)) {
    return json(401, { error: 'Unauthorized' })
  }

  const store = getStore(STORE_NAME)

  if (request.method === 'GET') {
    const { blobs } = await store.list()
    const entries = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))
    entries.sort((a, b) => (b?.checkIn || '').localeCompare(a?.checkIn || ''))
    return json(200, { entries: entries.filter(Boolean) })
  }

  if (request.method === 'POST') {
    const data = await parseBody(request)
    if (!data) return json(400, { error: 'Invalid JSON' })
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const entry = { ...sanitize(data), id, createdAt: now, updatedAt: now }
    await store.setJSON(id, entry)
    return json(200, { entry })
  }

  if (request.method === 'PUT') {
    const data = await parseBody(request)
    if (!data || !data.id) return json(400, { error: 'Missing id' })
    const existing = await store.get(data.id, { type: 'json' })
    if (!existing) return json(404, { error: 'Not found' })
    const entry = { ...existing, ...sanitize(data), id: data.id, updatedAt: new Date().toISOString() }
    await store.setJSON(data.id, entry)
    return json(200, { entry })
  }

  if (request.method === 'DELETE') {
    const data = await parseBody(request)
    const id = data?.id || new URL(request.url).searchParams.get('id')
    if (!id) return json(400, { error: 'Missing id' })
    await store.delete(id)
    return json(200, { ok: true })
  }

  return json(405, { error: 'Method not allowed' })
}

async function parseBody(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

function sanitize(data) {
  const out = {}
  for (const key of FIELDS) {
    if (data[key] !== undefined) out[key] = data[key]
  }
  return out
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}
