// 数据库连接测试：读取 .env.local，尝试连接并查询三张表的行数
// 用法：node scripts/test-db.mjs
// 只在本地运行，不会打印密码
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'
import mysql from 'mysql2/promise'

// 手工解析 .env.local（不依赖 dotenv）
function loadEnv(file) {
  const env = {}
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return env
}

const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local')
let env
try {
  env = loadEnv(envPath)
} catch {
  console.error('❌ 找不到 .env.local，请先在项目根目录创建它（可参考 .env.example）')
  process.exit(1)
}

const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
const missing = required.filter((key) => !env[key] || env[key].startsWith('在这里填'))
if (missing.length > 0) {
  console.error(`❌ .env.local 里这些还没填：${missing.join('、')}`)
  process.exit(1)
}

console.log(`正在连接 ${env.DB_HOST}:${env.DB_PORT || 3306} 数据库 ${env.DB_NAME} …`)

try {
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT || 3306),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    connectTimeout: 10000,
  })

  const [tables] = await connection.query('SHOW TABLES')
  const tableNames = tables.map((row) => Object.values(row)[0])
  console.log(`✅ 连接成功！数据库里有 ${tableNames.length} 张表：${tableNames.join('、') || '（空）'}`)

  for (const table of ['projects', 'notes', 'site_settings']) {
    if (!tableNames.includes(table)) {
      console.log(`⚠️  缺少表 ${table}——请先在 phpMyAdmin 导入 database/schema.mysql.sql`)
      continue
    }
    const [rows] = await connection.query(`SELECT COUNT(*) AS n FROM ${table}`)
    console.log(`   ${table}: ${rows[0].n} 行`)
  }

  if (!tableNames.includes('projects')) {
    console.log('\n下一步：phpMyAdmin → 选中数据库 → 导入 schema.mysql.sql，再导入 seed.mysql.sql')
  } else {
    console.log('\n全部就绪：重启 npm run dev，后台保存就会写入这张表。')
  }

  await connection.end()
} catch (error) {
  console.error(`❌ 连接失败：${error.message}`)
  if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('   账号或密码不对（注意：宝塔里如果访问权限选了“本地服务器”，外地连接会被拒）')
  }
  if (error.code === 'ER_BAD_DB_ERROR') {
    console.error('   数据库不存在——检查 DB_NAME 是否和宝塔里建的一致')
  }
  if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
    console.error('   连不上主机——检查 DB_HOST、3306 端口是否放行、数据库访问权限是否允许你的 IP')
  }
  process.exit(1)
}
