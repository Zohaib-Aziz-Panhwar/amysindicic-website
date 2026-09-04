/**
 * Login for the site editor.
 *
 * The password is never stored, only a scrypt hash of it, in
 * tools/admin/credentials.local.json -- which git ignores. Sessions live in
 * memory, so restarting the editor signs you out.
 */
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const CREDENTIALS = path.join(here, 'credentials.local.json')

const SESSION_HOURS = 12
const MAX_ATTEMPTS = 6
const LOCKOUT_MINUTES = 15

const KEYLEN = 64
const SCRYPT = { N: 16384, r: 8, p: 1 }

const sessions = new Map() // token -> expiry timestamp
let failures = 0
let lockedUntil = 0

const scrypt = (password, salt) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEYLEN, SCRYPT, (err, key) =>
      err ? reject(err) : resolve(key))
  })

export async function hasCredentials() {
  try {
    const raw = JSON.parse(await fs.readFile(CREDENTIALS, 'utf8'))
    return Boolean(raw.username && raw.salt && raw.hash)
  } catch {
    return false
  }
}

export async function setCredentials(username, password) {
  const name = String(username || '').trim()
  if (name.length < 2) throw new Error('Choose a username of at least 2 characters')
  if (String(password || '').length < 8) throw new Error('Choose a password of at least 8 characters')

  const salt = crypto.randomBytes(16).toString('hex')
  const hash = (await scrypt(password, salt)).toString('hex')
  await fs.writeFile(CREDENTIALS, JSON.stringify({ username: name, salt, hash }, null, 2) + '\n', {
    mode: 0o600,
  })
  return name
}

/** Returns a session token, or throws with a message safe to show. */
export async function login(username, password) {
  if (Date.now() < lockedUntil) {
    const mins = Math.ceil((lockedUntil - Date.now()) / 60000)
    throw new Error(`Too many attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.`)
  }

  let creds
  try {
    creds = JSON.parse(await fs.readFile(CREDENTIALS, 'utf8'))
  } catch {
    throw new Error('No login has been set up yet')
  }

  const candidate = await scrypt(String(password || ''), creds.salt)
  const stored = Buffer.from(creds.hash, 'hex')
  // Compared byte by byte in constant time, and the username too, so neither
  // can be guessed from how long the answer takes.
  const nameOk = crypto.timingSafeEqual(
    crypto.createHash('sha256').update(String(username || '')).digest(),
    crypto.createHash('sha256').update(creds.username).digest(),
  )
  const passOk = candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored)

  if (!nameOk || !passOk) {
    failures += 1
    if (failures >= MAX_ATTEMPTS) {
      lockedUntil = Date.now() + LOCKOUT_MINUTES * 60000
      failures = 0
    }
    throw new Error('Wrong username or password')
  }

  failures = 0
  const token = crypto.randomBytes(32).toString('base64url')
  sessions.set(token, Date.now() + SESSION_HOURS * 3600_000)
  return token
}

export function logout(token) {
  sessions.delete(token)
}

export function isValidSession(token) {
  if (!token) return false
  const expiry = sessions.get(token)
  if (!expiry) return false
  if (Date.now() > expiry) {
    sessions.delete(token)
    return false
  }
  return true
}

export const COOKIE = 'editor_session'

export function readCookie(header, name) {
  for (const part of String(header || '').split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return null
}

export function sessionCookie(token) {
  return `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_HOURS * 3600}`
}

export const clearedCookie = `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`
