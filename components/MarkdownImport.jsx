'use client'

import {useRef, useState} from 'react'
import {Button} from '@astryxdesign/core/Button'
import {Stack} from '@astryxdesign/core/Stack'
import {api} from '@/lib/api'
import {resolveMarkdownImages} from '@/lib/markdown-images'

export default function MarkdownImport({content: existingContent, onImport, importing, setImporting, saving, setError}) {
  const picker = useRef(null)
  const [importedFile, setImportedFile] = useState('')
  const [missingImages, setMissingImages] = useState([])

  const importMarkdown = async (event) => {
    const input = event.currentTarget
    const files = Array.from(input.files ?? [])
    input.value = ''
    if (!files.length) return
    setError('')
    setImporting(true)
    try {
      const markdownFiles = files.filter(file => /\.(md|markdown)$/i.test(file.name))
      if (!markdownFiles.length) throw new Error('文件夹里没有找到 Markdown 文件')
      if (markdownFiles.length > 1) throw new Error('文件夹里有多篇 Markdown，请选择只包含一篇文章的文件夹')

      const [file] = markdownFiles
      const content = new TextDecoder('utf-8', {fatal: true}).decode(await file.arrayBuffer())
      if (!content.trim()) throw new Error('Markdown 文件没有正文')
      if (existingContent.trim() && !window.confirm('导入会替换当前正文，是否继续？')) return

      const result = await resolveMarkdownImages(content, file.webkitRelativePath, files, async image => {
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
      setImporting(false)
    }
  }

  return (
    <Stack gap={3}>
      <div>
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
          onChange={importMarkdown}
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
