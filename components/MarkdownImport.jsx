'use client'

import {useRef, useState} from 'react'
import {Button} from '@astryxdesign/core/Button'
import {Stack} from '@astryxdesign/core/Stack'
import {api} from '@/lib/api'
import {resolveMarkdownImages} from '@/lib/markdown-images'

async function readEntry(entry) {
  if (entry.isFile) {
    const file = await new Promise((resolve, reject) => entry.file(resolve, reject))
    Object.defineProperty(file, 'webkitRelativePath', {value: entry.fullPath.replace(/^\//, '')})
    return [file]
  }
  const reader = entry.createReader()
  const files = []
  // Directory readers return batches; keep reading until exhausted.
  while (true) {
    const entries = await new Promise((resolve, reject) => reader.readEntries(resolve, reject))
    if (!entries.length) return files
    for (const child of entries) files.push(...await readEntry(child))
  }
}

export default function MarkdownImport({content: existingContent, onImport, importing, setImporting, saving, setError}) {
  const picker = useRef(null)
  const [importedFile, setImportedFile] = useState('')
  const [missingImages, setMissingImages] = useState([])
  const [dragging, setDragging] = useState(false)
  const busy = useRef(false)

  const importMarkdown = async (getFiles) => {
    if (busy.current || importing || saving) return
    busy.current = true
    setError('')
    setImporting(true)
    try {
      const files = await getFiles()
      if (!files.length) return
      const markdownFiles = files.filter(file => /\.(md|markdown)$/i.test(file.name))
      if (!markdownFiles.length) throw new Error('文件夹里没有找到 Markdown 文件')
      if (markdownFiles.length > 1) throw new Error('文件夹里有多篇 Markdown，请选择只包含一篇文章的文件夹')

      const [file] = markdownFiles
      const content = new TextDecoder('utf-8', {fatal: true}).decode(await file.arrayBuffer())
      if (!content.trim()) throw new Error('Markdown 文件没有正文')
      if (existingContent.trim() && !window.confirm('导入会替换当前正文，是否继续？')) return

      const result = await resolveMarkdownImages(content, file.webkitRelativePath || file.name, files, async image => {
        const body = new FormData()
        body.append('image', image)
        const response = await fetch('/api/note-images', {
          method: 'POST',
          headers: {Authorization: `Bearer ${api.getToken() ?? ''}`},
          body,
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || !data.url) throw new Error(`${image.name}：${data.error || '上传失败'}`)
        return data.url
      })
      onImport(result.content)
      setImportedFile(file.name)
      setMissingImages(result.missing)
    } catch (error) {
      setError(error instanceof TypeError ? '无法读取文件或连接服务器，请检查 UTF-8 编码和网络' : error.message)
    } finally {
      busy.current = false
      setImporting(false)
    }
  }

  return (
    <Stack gap={3}>
      <div
        onDragOver={event => {event.preventDefault(); if (!importing && !saving) setDragging(true)}}
        onDragLeave={event => {if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false)}}
        onDrop={event => {
          event.preventDefault()
          setDragging(false)
          const entries = Array.from(event.dataTransfer.items).map(item => item.webkitGetAsEntry?.()).filter(Boolean)
          const fallback = Array.from(event.dataTransfer.files)
          void importMarkdown(async () => entries.length ? (await Promise.all(entries.map(readEntry))).flat() : fallback)
        }}
        style={{padding: 24, border: `2px dashed ${dragging ? '#007aff' : '#888'}`, borderRadius: 12, background: dragging ? 'rgba(0,122,255,.12)' : 'transparent'}}
        aria-busy={importing}
      >
        <p style={{margin: '0 0 8px', fontWeight: 600}}>把文章文件夹拖到这里</p>
        <p style={{margin: '0 0 16px', fontSize: 14}}>包含一篇 Markdown 和配套图片，支持子文件夹。也可以点击选择。</p>
        <Button
          label="导入 Markdown 文件夹"
          variant="secondary"
          isDisabled={importing || saving}
          onClick={() => picker.current?.click()}
        />
        <input
          ref={picker}
          hidden
          type="file"
          webkitdirectory=""
          onChange={event => {
            const files = Array.from(event.currentTarget.files ?? [])
            event.currentTarget.value = ''
            void importMarkdown(async () => files)
          }}
        />
      </div>
      <div role="status">
        {importing ? '正在读取文章并上传图片…' : importedFile ? `已导入 ${importedFile}` : ''}
        {!importing && missingImages.length > 0 && (
          <p>未找到图片：{missingImages.join('、')}。请选择同时包含 Markdown 文件和这些图片的文件夹。</p>
        )}
      </div>
    </Stack>
  )
}
