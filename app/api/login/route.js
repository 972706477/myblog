import {NextResponse} from 'next/server'
import {signToken, verifyPassword} from '@/lib/auth'

// POST /api/login —— 后台登录，密码正确则签发 token
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: '请求格式错误'}, {status: 400})
  }

  if (!verifyPassword(body.password)) {
    return NextResponse.json({error: '密码错误'}, {status: 401})
  }

  return NextResponse.json({token: signToken()})
}
