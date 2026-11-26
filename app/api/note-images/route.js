import {createHash} from 'node:crypto'
import {mkdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {NextResponse} from 'next/server'
import {isAuthed} from '@/lib/auth'

const directory = path.resolve(process.env.NOTE_IMAGE_DIR || '.note-images')
const maxBytes = 5 * 1024 * 1024
const types = {png: 'image/png', jpg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp'}

function imageExtension(bytes) {
  if (bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') return 'png'
  if (bytes.subarray(0, 3).toString('hex') === 'ffd8ff') return 'jpg'
  if (/^GIF8[79]a$/.test(bytes.subarray(0, 6).toString('ascii'))) return 'gif'
  if (bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') return 'webp'
}

export async function POST(request) {
  if (!isAuthed(request)) return NextResponse.json({error: '请重新登录后台'}, {status: 401})
  if (Number(request.headers.get('content-length')) > maxBytes + 65536) {
    return NextResponse.json({error: '图片不能超过 5 MB'}, {status: 413})
  }
  try {
    const file = (await request.formData()).get('image')
    if (!file || typeof file === 'string' || file.size > maxBytes) {
      return NextResponse.json({error: '请选择 5 MB 以内的图片'}, {status: 400})
    }
    const bytes = Buffer.from(await file.arrayBuffer())
    const extension = imageExtension(bytes)
    if (!extension) return NextResponse.json({error: '支持 PNG、JPEG、GIF 和 WebP 图片'}, {status: 415})
    const name = createHash('sha256').update(bytes).digest('hex') + '.' + extension
    await mkdir(directory, {recursive: true})
    await writeFile(path.join(directory, name), bytes, {flag: 'wx'}).catch(error => {
      if (error.code !== 'EEXIST') throw error
    })
    return NextResponse.json({url: '/api/note-images?file=' + name})
  } catch {
    return NextResponse.json({error: '图片上传失败，请检查站点图片目录的写入权限'}, {status: 500})
  }
}

export async function GET(request) {
  const name = new URL(request.url).searchParams.get('file') ?? ''
  const match = /^[a-f0-9]{64}\.(png|jpg|gif|webp)$/.exec(name)
  if (!match) return new Response(null, {status: 404})
  try {
    const bytes = await readFile(path.join(directory, name))
    return new Response(bytes, {headers: {
      'Content-Type': types[match[1]],
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=31536000, immutable',
    }})
  } catch {
    return new Response(null, {status: 404})
  }
}
