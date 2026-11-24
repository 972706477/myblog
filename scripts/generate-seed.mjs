// 从 projects.js / notes.js 生成 MySQL 种子数据的 SQL INSERT 语句
// 用法：node scripts/generate-seed.mjs   （输出到 database/seed.mysql.sql）
import {writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import {projects} from '../projects.js'
import {notes} from '../notes.js'

// 转义 SQL 字符串（单引号翻倍）
const q = (v) => (v === null || v === undefined || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`)
// MySQL JSON 数组：JSON_ARRAY('a', 'b')
const jsonArr = (list) => `JSON_ARRAY(${(list ?? []).map(q).join(', ')})`

const projectRows = projects
  .map(
    (p) =>
      `  (${q(p.slug)}, ${q(p.name)}, ${q(p.tagline)}, ${q(p.year)}, ${q(p.status)}, ${jsonArr(p.stack)}, ${p.featured ? 1 : 0}, ${q(p.icon)}, ${q(p.demoUrl)}, ${q(p.repoUrl)}, ${q(p.content)})`,
  )
  .join(',\n')

const noteRows = notes
  .map(
    (n) =>
      `  (${q(n.slug)}, ${q(n.title)}, ${q(n.excerpt)}, ${q(n.date)}, ${n.readingTime}, ${jsonArr(n.tags)}, ${q(n.content)})`,
  )
  .join(',\n')

const sql = `-- ============================================================================
-- 种子数据：把当前 projects.js / notes.js 的内容导入数据库
-- 在 database/schema.mysql.sql 之后执行。重复执行不会产生重复数据
-- 由 scripts/generate-seed.mjs 自动生成，请勿手改
-- ============================================================================

INSERT INTO projects
  (slug, name, tagline, year, status, stack, featured, icon, demo_url, repo_url, content)
VALUES
${projectRows}
ON DUPLICATE KEY UPDATE name = VALUES(name), updated_at = CURRENT_TIMESTAMP;

INSERT INTO notes
  (slug, title, excerpt, date, reading_time, tags, content)
VALUES
${noteRows}
ON DUPLICATE KEY UPDATE title = VALUES(title), updated_at = CURRENT_TIMESTAMP;
`

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'database', 'seed.mysql.sql')
writeFileSync(outPath, sql)
console.log(`✓ database/seed.mysql.sql 已生成：${projects.length} 个项目 + ${notes.length} 篇笔记`)
