import crypto from 'node:crypto'

// ============================================================================
// 后台登录认证：HMAC 签名 token（无状态，不需要 session 存储）
//
// 流程：POST /api/login 带密码 → 密码对 → 签发 token（7 天有效）
//       后台之后每个请求带 Authorization: Bearer <token> → 验签
//
// 环境变量：
//   ADMIN_PASSWORD  后台登录密码
//   ADMIN_SECRET    token 签名密钥（一长串随机字符）
// ============================================================================

const SECRET = process.env.ADMIN_SECRET || 'dev-insecure-secret-change-me'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 天

function sign(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
}

// 恒定时间比较，防时序攻击
function safeEqual(a, b) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD || 'admin'
  return safeEqual(String(password ?? ''), expected)
}

export function signToken() {
  const exp = Date.now() + MAX_AGE_MS
  const payload = `admin.${exp}`
  return `${payload}.${sign(payload)}`
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return false
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex <= 0) return false
  const payload = token.slice(0, dotIndex)
  const sig = token.slice(dotIndex + 1)
  if (!safeEqual(sig, sign(payload))) return false
  const exp = Number(payload.split('.')[1])
  return Number.isFinite(exp) && exp > Date.now()
}

// 从请求头里取 token 并校验
export function isAuthed(request) {
  const header = request.headers.get('authorization') ?? ''
  const token = header.replace(/^Bearer\s+/i, '')
  return verifyToken(token)
}
