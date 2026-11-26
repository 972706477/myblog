import mysql from 'mysql2/promise'
import {existsSync} from 'node:fs'

if (existsSync('.env.local')) process.loadEnvFile('.env.local')
if (!process.env.DB_NAME || !process.env.DB_USER) {
  console.log('数据库未配置，跳过封面字段升级')
  process.exit(0)
}
const db = await mysql.createConnection({host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME})
try {
  for (const table of ['projects', 'notes']) {
    const [columns] = await db.query('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?', [table, 'cover_url'])
    if (!columns.length) await db.query(`ALTER TABLE ${table} ADD COLUMN cover_url VARCHAR(1024) NULL`)
  }
  await db.beginTransaction()
  const [pins] = await db.query('SELECT id FROM projects WHERE featured = 1 ORDER BY id DESC FOR UPDATE')
  if (pins.length > 1) await db.query('UPDATE projects SET featured = 0 WHERE featured = 1 AND id <> ?', [pins[0].id])
  await db.commit()
  console.log('封面字段与单项目置顶升级完成')
} finally {await db.end()}
