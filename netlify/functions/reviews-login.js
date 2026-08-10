import { createSessionCookie, safeEqual } from './lib/auth.js'

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON' })
  }

  const password = (body.password || '').toString()
  const expected = process.env.REVIEWS_PASSWORD

  if (!expected) {
    return json(500, { error: 'Server not configured' })
  }

  if (!password || !safeEqual(password, expected)) {
    return json(401, { error: 'Incorrect password' })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': createSessionCookie()
    }
  })
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}
