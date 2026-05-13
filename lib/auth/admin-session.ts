import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const COOKIE = 'zs_panel'

function getSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s || s.length < 24) return null
  return s
}

type Payload = { v: 1; exp: number }

function sign(payload: Payload): string {
  const secret = getSecret()
  if (!secret) throw new Error('ADMIN_SESSION_SECRET must be set (min 24 characters)')
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const sig = createHmac('sha256', secret).update(body).digest('base64url')
  return `${body}.${sig}`
}

function verify(token: string): Payload | null {
  const secret = getSecret()
  if (!secret) return null

  const dot = token.indexOf('.')
  if (dot <= 0) return null
  const body = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = createHmac('sha256', secret).update(body).digest('base64url')

  try {
    const a = Buffer.from(sig, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }

  try {
    const json = Buffer.from(body, 'base64url').toString('utf8')
    const payload = JSON.parse(json) as Payload
    if (payload.v !== 1 || typeof payload.exp !== 'number') return null
    if (payload.exp <= Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<boolean> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return false
  return verify(token) !== null
}

export async function setAdminSession() {
  const jar = await cookies()
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000
  const token = sign({ v: 1, exp })
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAdminSession() {
  const jar = await cookies()
  jar.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}

export function randomAdminSessionSecret() {
  return randomBytes(32).toString('hex')
}
