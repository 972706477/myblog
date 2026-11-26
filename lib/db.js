import mysql from 'mysql2/promise'

// ============================================================================
// MySQL 数据库操作层
// 连接信息从环境变量读取（.env.local，见 .env.example）
// 这个文件只被 API 路由和 lib/data.js 使用，UI 不直接碰它
// ============================================================================

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  // DATE/DATETIME 直接返回字符串（'2026-11-24'），避免 Date 对象转换麻烦
  dateStrings: true,
  charset: 'utf8mb4',
}

// 没有配数据库信息时返回 false（此时 lib/data.js 会走静态文件兜底）
// 占位符（“在这里填……”）和空值都视为未配置
export function isDbConfigured() {
  const values = [process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME]
  return values.every((v) => typeof v === 'string' && v.length > 0 && !v.startsWith('在这里填'))
}

let pool = null

function getPool() {
  if (!pool) {
    pool = mysql.createPool({...config, connectionLimit: 10, queueLimit: 0})
  }
  return pool
}

// ---- 行数据 → 前端用的对象 ----
function mapProject(row) {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    year: row.year,
    status: row.status,
    stack: Array.isArray(row.stack) ? row.stack : JSON.parse(row.stack || '[]'),
    featured: Boolean(row.featured),
    icon: row.icon,
    demoUrl: row.demo_url,
    repoUrl: row.repo_url,
    content: row.content,
    coverUrl: row.cover_url || null,
  }
}

function mapNote(row) {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.date,
    readingTime: Number(row.reading_time),
    tags: Array.isArray(row.tags) ? row.tags : JSON.parse(row.tags || '[]'),
    content: row.content,
    coverUrl: row.cover_url || null,
  }
}

async function projectWrite(write) {
  const connection = await getPool().getConnection()
  let locked = false
  try {
    const [rows] = await connection.query("SELECT GET_LOCK(CONCAT(DATABASE(), ':project-pin'), 10) AS acquired")
    if (Number(rows[0].acquired) !== 1) throw new Error('项目正在保存，请稍后重试')
    locked = true
    await connection.beginTransaction()
    const slug = await write(connection)
    await connection.commit()
    return slug === null ? null : dbGetProject(slug)
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    try { if (locked) await connection.query("SELECT RELEASE_LOCK(CONCAT(DATABASE(), ':project-pin'))") }
    finally { connection.release() }
  }
}

// ---- 项目 ----
export async function dbGetProjects() {
  const [rows] = await getPool().query('SELECT * FROM projects ORDER BY featured DESC, id DESC')
  return rows.map(mapProject)
}

export async function dbGetProject(slug) {
  const [rows] = await getPool().query('SELECT * FROM projects WHERE slug = ?', [slug])
  return rows[0] ? mapProject(rows[0]) : null
}

export async function dbCreateProject(data) {
  return projectWrite(async connection => {
  await connection.query(
    `INSERT INTO projects (slug, name, tagline, year, status, stack, featured, icon, demo_url, repo_url, content, cover_url)
     VALUES (?, ?, ?, ?, ?, CAST(? AS JSON), ?, ?, ?, ?, ?, ?)`,
    [
      data.slug,
      data.name,
      data.tagline ?? '',
      data.year ?? '',
      data.status ?? '进行中',
      JSON.stringify(data.stack ?? []),
      data.featured ? 1 : 0,
      data.icon ?? 'wrench',
      data.demoUrl || null,
      data.repoUrl || null,
      data.content ?? '',
      data.coverUrl || null,
    ],
  )
  if (data.featured) await connection.query('UPDATE projects SET featured = 0 WHERE slug <> ?', [data.slug])
  return data.slug
  })
}

export async function dbUpdateProject(slug, data) {
  return projectWrite(async connection => {
  const [existing] = await connection.query('SELECT id FROM projects WHERE slug = ?', [slug])
  if (!existing.length) return null
  await connection.query(
    `UPDATE projects SET
       name = ?, tagline = ?, year = ?, status = ?, stack = CAST(? AS JSON),
       featured = ?, icon = ?, demo_url = ?, repo_url = ?, content = ?, cover_url = ?
     WHERE slug = ?`,
    [
      data.name,
      data.tagline ?? '',
      data.year ?? '',
      data.status ?? '进行中',
      JSON.stringify(data.stack ?? []),
      data.featured ? 1 : 0,
      data.icon ?? 'wrench',
      data.demoUrl || null,
      data.repoUrl || null,
      data.content ?? '',
      data.coverUrl || null,
      slug,
    ],
  )
  if (data.featured) await connection.query('UPDATE projects SET featured = 0 WHERE slug <> ?', [slug])
  return slug
  })
}

export async function dbDeleteProject(slug) {
  const [result] = await getPool().query('DELETE FROM projects WHERE slug = ?', [slug])
  return result.affectedRows > 0
}

// ---- 笔记 ----
export async function dbGetNotes() {
  const [rows] = await getPool().query('SELECT * FROM notes ORDER BY date DESC, id DESC')
  return rows.map(mapNote)
}

export async function dbGetNote(slug) {
  const [rows] = await getPool().query('SELECT * FROM notes WHERE slug = ?', [slug])
  return rows[0] ? mapNote(rows[0]) : null
}

export async function dbCreateNote(data) {
  await getPool().query(
    `INSERT INTO notes (slug, title, excerpt, date, reading_time, tags, content, cover_url)
     VALUES (?, ?, ?, ?, ?, CAST(? AS JSON), ?, ?)`,
    [
      data.slug,
      data.title,
      data.excerpt ?? '',
      data.date,
      Number(data.readingTime) || 3,
      JSON.stringify(data.tags ?? []),
      data.content ?? '',
      data.coverUrl || null,
    ],
  )
  return dbGetNote(data.slug)
}

export async function dbUpdateNote(slug, data) {
  await getPool().query(
    `UPDATE notes SET
       title = ?, excerpt = ?, date = ?, reading_time = ?, tags = CAST(? AS JSON), content = ?, cover_url = ?
     WHERE slug = ?`,
    [
      data.title,
      data.excerpt ?? '',
      data.date,
      Number(data.readingTime) || 3,
      JSON.stringify(data.tags ?? []),
      data.content ?? '',
      data.coverUrl || null,
      slug,
    ],
  )
  return dbGetNote(data.slug?.trim() || slug)
}

export async function dbDeleteNote(slug) {
  const [result] = await getPool().query('DELETE FROM notes WHERE slug = ?', [slug])
  return result.affectedRows > 0
}

// ---- 站点设置 ----
export async function dbGetSettings() {
  const [rows] = await getPool().query('SELECT * FROM site_settings WHERE id = 1')
  if (!rows[0]) return null
  return {
    siteTitle: rows[0].site_title,
    authorName: rows[0].author_name,
    authorBio: rows[0].author_bio,
  }
}

export async function dbSaveSettings(data) {
  await getPool().query(
    `INSERT INTO site_settings (id, site_title, author_name, author_bio)
     VALUES (1, ?, ?, ?)
     ON DUPLICATE KEY UPDATE site_title = VALUES(site_title), author_name = VALUES(author_name), author_bio = VALUES(author_bio)`,
    [data.siteTitle, data.authorName, data.authorBio],
  )
  return dbGetSettings()
}
