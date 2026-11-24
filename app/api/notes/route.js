import {NextResponse} from 'next/server'
import {isAuthed} from '@/lib/auth'
import * as db from '@/lib/db'
import {getAllNotes} from '@/lib/data'

// GET /api/notes —— 笔记列表（公开）
export async function GET() {
  try {
    return NextResponse.json(await getAllNotes())
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}

// POST /api/notes —— 新建笔记（需要登录）
export async function POST(request) {
  if (!isAuthed(request)) {
    return NextResponse.json({error: '未登录或登录已过期'}, {status: 401})
  }
  try {
    const body = await request.json()
    if (!body.title?.trim()) {
      return NextResponse.json({error: '标题不能为空'}, {status: 400})
    }
    if (!db.isDbConfigured()) {
      return NextResponse.json({error: '数据库未配置，请先按 README 配置 .env.local'}, {status: 503})
    }
    const created = await db.dbCreateNote(body)
    return NextResponse.json(created, {status: 201})
  } catch (error) {
    const message = error.code === 'ER_DUP_ENTRY' ? '网址后缀已被使用，请换一个' : error.message
    return NextResponse.json({error: message}, {status: 400})
  }
}
