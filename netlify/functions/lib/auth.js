import crypto from 'node:crypto'

const COOKIE_NAME = 'stg_reviews_session'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000

function sign(payload) {
  const secret = process.env.REVIEWS_SESSION_SECRET
  if (!secret) throw new Error('REVIEWS_SESSION_SECRET is not configured')
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verify(token) {
  const secret = process.env.REVIEWS_SESSION_SECRET
  if (!secret || !token) return null

  const [data, sig] = token.split('.')
  if (!data || !sig) return null

  const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expected)
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
    if (!payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

function secureAttr() {
  return process.env.NETLIFY_DEV ? '' : ' Secure;'
}

export function createSessionCookie() {
  const token = sign({ exp: Date.now() + SESSION_TTL_MS })
  const maxAge = Math.floor(SESSION_TTL_MS / 1000)
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly;${secureAttr()} SameSite=Strict; Max-Age=${maxAge}`
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly;${secureAttr()} SameSite=Strict; Max-Age=0`
}

export function isAuthenticated(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
  if (!match) return false
  return verify(match.slice(COOKIE_NAME.length + 1)) !== null
}

export function safeEqual(a, b) {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}
