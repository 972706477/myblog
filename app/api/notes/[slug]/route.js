import {NextResponse} from 'next/server'
import {isAuthed} from '@/lib/auth'
import * as db from '@/lib/db'

// PUT /api/notes/<slug> —— 更新笔记（需要登录）
export async function PUT(request, {params}) {
  if (!isAuthed(request)) {
    return NextResponse.json({error: '未登录或登录已过期'}, {status: 401})
  }
  const {slug} = await params
  try {
    const body = await request.json()
    if (!body.title?.trim()) {
      return NextResponse.json({error: '标题不能为空'}, {status: 400})
    }
    if (!db.isDbConfigured()) {
      return NextResponse.json({error: '数据库未配置，请先按 README 配置 .env.local'}, {status: 503})
    }
    const updated = await db.dbUpdateNote(slug, body)
    if (!updated) {
      return NextResponse.json({error: '笔记不存在'}, {status: 404})
    }
    return NextResponse.json(updated)
  } catch (error) {
    const message = error.code === 'ER_DUP_ENTRY' ? '网址后缀已被使用，请换一个' : error.message
    return NextResponse.json({error: message}, {status: 400})
  }
}

// DELETE /api/notes/<slug> —— 删除笔记（需要登录）
export async function DELETE(request, {params}) {
  if (!isAuthed(request)) {
    return NextResponse.json({error: '未登录或登录已过期'}, {status: 401})
  }
  const {slug} = await params
  if (!db.isDbConfigured()) {
    return NextResponse.json({error: '数据库未配置，请先按 README 配置 .env.local'}, {status: 503})
  }
  const ok = await db.dbDeleteNote(slug)
  if (!ok) {
    return NextResponse.json({error: '笔记不存在'}, {status: 404})
  }
  return NextResponse.json({ok: true})
}
