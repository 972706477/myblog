import {author as staticAuthor} from '@/author.js'
import {notes as staticNotes} from '@/notes.js'
import {projects as staticProjects} from '@/projects.js'
import * as db from './db.js'

// ============================================================================
// 统一数据访问层：优先读 MySQL，没配数据库（或读取失败）时退回静态文件
//
// 使用方：
//   - 前台 SSG 页面（构建时查询）
//   - 公开 API 路由（GET，无需登录）
// 写操作不走这里（写必须走数据库，见 lib/db.js）
// ============================================================================

let warnedFallback = false

function fallbackWarning() {
  if (!warnedFallback) {
    warnedFallback = true
    console.warn('[data] 数据库未配置或不可用，使用静态文件数据（projects.js / notes.js）')
  }
}

async function withFallback(dbFn, staticValue) {
  if (!db.isDbConfigured()) {
    fallbackWarning()
    return staticValue
  }
  try {
    return await dbFn()
  } catch (error) {
    // 数据库配置了但连不上：构建时直接报错，避免把旧数据发布出去
    throw new Error(`数据库读取失败：${error.message}`)
  }
}

// ---- 项目 ----
export function getAllProjects() {
  return withFallback(db.dbGetProjects, staticProjects)
}

export async function getProject(slug) {
  if (!db.isDbConfigured()) {
    fallbackWarning()
    return staticProjects.find((p) => p.slug === slug) ?? null
  }
  return db.dbGetProject(slug)
}

// ---- 笔记 ----
export function getAllNotes() {
  return withFallback(db.dbGetNotes, staticNotes)
}

export async function getNote(slug) {
  if (!db.isDbConfigured()) {
    fallbackWarning()
    return staticNotes.find((n) => n.slug === slug) ?? null
  }
  return db.dbGetNote(slug)
}

// ---- 站点信息（作者等）----
export async function getSiteInfo() {
  if (!db.isDbConfigured()) {
    fallbackWarning()
    return {siteTitle: '我的博客', author: staticAuthor}
  }
  try {
    const settings = await db.dbGetSettings()
    if (!settings) return {siteTitle: '我的博客', author: staticAuthor}
    return {
      siteTitle: settings.siteTitle,
      author: {
        name: settings.authorName,
        bio: settings.authorBio,
        role: staticAuthor.role, // 角色只在静态文件里维护
      },
    }
  } catch (error) {
    throw new Error(`数据库读取失败：${error.message}`)
  }
}
