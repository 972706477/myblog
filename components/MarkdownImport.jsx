'use client'

import {useRef, useState} from 'react'
import {Button} from '@astryxdesign/core/Button'
import {Stack} from '@astryxdesign/core/Stack'
import {api} from '@/lib/api'
import {resolveMarkdownImages} from '@/lib/markdown-images'

export default function MarkdownImport({content: existingContent, onImport, importing, setImporting, saving, setError}) {
  const picker = useRef(null)
  const [pending, setPending] = useState(null)
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
      let draft = pending
      let markdownPath
      if (!draft) {
        const file = files[0]
        if (!/\.(md|markdown)$/i.test(file.name)) throw new Error('请选择 Markdown 文件')
        const content = new TextDecoder('utf-8', {fatal: true}).decode(await file.arrayBuffer())
        if (!content.trim()) throw new Error('Markdown 文件没有正文')
        draft = {name: file.name, content}
        const {missing} = await resolveMarkdownImages(content, file.name, [], () => {})
        if (missing.length) {
          setPending(draft)
          return
        }
        markdownPath = file.name
      } else {
        const matches = files.filter(file => file.name === draft.name)
        if (matches.length !== 1) throw new Error('请选择包含原 Markdown 文件及其图片的文件夹')
        markdownPath = matches[0].webkitRelativePath
      }

      if (existingContent.trim() && !window.confirm('导入会替换当前正文，是否继续？')) {
        setPending(null)
        return
      }
      const result = await resolveMarkdownImages(draft.content, markdownPath, pending ? files : [], async image => {
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
      setImportedFile(draft.name)
      setPending(null)
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
          label={pending ? '选择图片所在文件夹' : '导入 Markdown 文件'}
          variant="secondary"
          isDisabled={importing || saving}
          onClick={() => picker.current?.click()}
        />
        <input
          key={pending ? 'folder' : 'markdown'}
          ref={picker}
          hidden
          type="file"
          {...(pending ? {webkitdirectory: ''} : {accept: '.md,.markdown'})}
          onChange={importMarkdown}
          onCancel={() => setPending(null)}
        />
      </div>
      <div role="status">
        {importing ? '正在读取文章并上传图片…' : pending ? '检测到本地图片，请选择包含原 Markdown 文件及图片的文件夹。' : importedFile ? `已导入 ${importedFile}` : ''}
        {!importing && missingImages.length > 0 && (
          <p>未找到图片：{missingImages.join('、')}。请选择同时包含 Markdown 文件和这些图片的文件夹。</p>
        )}
      </div>
    </Stack>
  )
}
