import {NextResponse} from 'next/server'
import {isAuthed} from '@/lib/auth'
import * as db from '@/lib/db'
import {getSiteInfo} from '@/lib/data'

// GET /api/settings —— 站点设置（公开）
export async function GET() {
  try {
    return NextResponse.json(await getSiteInfo())
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}

// PUT /api/settings —— 保存设置（需要登录）
export async function PUT(request) {
  if (!isAuthed(request)) {
    return NextResponse.json({error: '未登录或登录已过期'}, {status: 401})
  }
  if (!db.isDbConfigured()) {
    return NextResponse.json({error: '数据库未配置，请先按 README 配置 .env.local'}, {status: 503})
  }
  try {
    const body = await request.json()
    const saved = await db.dbSaveSettings({
      siteTitle: body.siteTitle ?? '我的博客',
      authorName: body.authorName ?? 'Alex',
      authorBio: body.authorBio ?? '',
    })
    return NextResponse.json(saved)
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 400})
  }
}
