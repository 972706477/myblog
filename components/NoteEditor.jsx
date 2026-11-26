'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@astryxdesign/core/Button'
import {Card} from '@astryxdesign/core/Card'
import {Divider} from '@astryxdesign/core/Divider'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {Markdown} from '@astryxdesign/core/Markdown'
import {Stack, StackItem} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {TextArea} from '@astryxdesign/core/TextArea'
import {TextInput} from '@astryxdesign/core/TextInput'
import {useMediaQuery} from '@astryxdesign/core/hooks'
import {useToast} from '@astryxdesign/core/Toast'
import {api} from '@/lib/api'
import {resolveMarkdownImages} from '@/lib/markdown-images'

const emptyNote = {
  title: '',
  slug: '',
  excerpt: '',
  date: new Date().toISOString().slice(0, 10),
  readingTime: 3,
  tags: [],
  content: '',
}

// 笔记编辑器：新建和编辑共用。左边表单，右边实时预览
export default function NoteEditor({slug}) {
  const router = useRouter()
  const showToast = useToast()
  const isWide = useMediaQuery('(min-width: 1024px)')
  const isNew = !slug

  const [form, setForm] = useState(emptyNote)
  const [tagsText, setTagsText] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importedFile, setImportedFile] = useState('')
  const [missingImages, setMissingImages] = useState([])
  const [error, setError] = useState('')

  // 编辑模式：加载现有数据
  useEffect(() => {
    if (isNew) return
    let alive = true
    api.listNotes().then((list) => {
      const found = list.find((n) => n.slug === slug)
      if (!alive) return
      if (found) {
        setForm(found)
        setTagsText((found.tags ?? []).join('，'))
      } else {
        setError('没有找到这篇笔记')
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [slug, isNew])

  const update = (key) => (value) => setForm((prev) => ({...prev, [key]: value}))

  const importMarkdown = async (event) => {
    const input = event.currentTarget
    const files = Array.from(input.files ?? [])
    input.value = ''
    if (!files.length) return
    setError('')
    const markdownFiles = files.filter(file => /\.(md|markdown)$/i.test(file.name))
    const matches = markdownFiles.filter(file => file.name === importedFile)
    const file = matches.length === 1 ? matches[0] : markdownFiles.length === 1 ? markdownFiles[0] : null
    if (!file) {
      setError('请选择 Markdown 文件，或选择只包含一篇 Markdown 文章的文件夹')
      return
    }
    setImporting(true)
    try {
      const content = new TextDecoder('utf-8', {fatal: true}).decode(await file.arrayBuffer())
      if (!content.trim()) {
        setError('Markdown 文件没有正文')
        return
      }
      if (form.content.trim() && !window.confirm('导入会替换当前正文，是否继续？')) return
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
      update('content')(result.content)
      setImportedFile(file.name)
      setMissingImages(result.missing)
    } catch (error) {
      setError(error instanceof TypeError ? '无法读取文件或连接服务器，请检查 UTF-8 编码和网络' : error.message)
    } finally {
      setImporting(false)
    }
  }

  const handleSave = async () => {
    setError('')
    if (!form.title.trim()) {
      setError('标题不能为空')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        readingTime: Number(form.readingTime) || 1,
        tags: tagsText
          .split(/[，,、\s]+/)
          .map((s) => s.trim())
          .filter(Boolean),
      }
      if (isNew) {
        await api.createNote(payload)
        showToast({body: '笔记已创建', type: 'info'})
      } else {
        await api.updateNote(slug, payload)
        showToast({body: '笔记已保存', type: 'info'})
      }
      router.push('/admin/notes')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Text type="supporting">加载中…</Text>

  return (
    <Stack gap={5}>
      <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
        <Heading level={1} type="display-2">
          {isNew ? '新建笔记' : `编辑：${form.title}`}
        </Heading>
        <HStack gap={2}>
          <Button label="取消" variant="ghost" onClick={() => router.push('/admin/notes')} />
          <Button
            label={saving ? '保存中…' : '保存'}
            variant="primary"
            isLoading={saving}
            isDisabled={importing}
            onClick={handleSave}
          />
        </HStack>
      </HStack>

      {error && <Text type="supporting">{error}</Text>}

      <HStack gap={6} vAlign="start" wrap="wrap">
        {/* 表单 */}
        <StackItem size="fill" style={{flex: '1 1 480px', minWidth: 0}}>
          <Card padding={6}>
            <Stack gap={5}>
              <TextInput
                label="标题（必填）"

                value={form.title}
                aria-required="true"
                onChange={update('title')}
                placeholder="例如：useState 入门"
              />
              <Stack gap={2}>
                <TextInput
                  label="网址后缀（slug）"
                  value={form.slug}
                  onChange={update('slug')}
                  placeholder="留空则根据标题自动生成"
                  aria-describedby="note-slug-help"
                />
                <Text id="note-slug-help" type="supporting">{"前台地址：/notes/<后缀>"}</Text>
              </Stack>
              <TextArea
                label="摘要"
                value={form.excerpt}
                onChange={update('excerpt')}
                rows={2}
                placeholder="列表页显示的简介"
              />
              <HStack gap={4} vAlign="start" wrap="wrap">
                <Stack gap={2} style={{flex: '1 1 200px', minWidth: 0}}>
                  <TextInput label="发布日期" value={form.date} onChange={update('date')} placeholder="2026-11-24" />
                </Stack>
                <Stack gap={2} style={{flex: '1 1 200px', minWidth: 0}}>
                  <TextInput label="标签" value={tagsText} onChange={setTagsText} placeholder="React，Hooks" aria-describedby="note-tags-help" />
                  <Text id="note-tags-help" type="supporting">用逗号分隔，会显示成标签</Text>
                </Stack>
              </HStack>
              <TextInput
                label="阅读时长（分钟）"
                type="number"
                value={String(form.readingTime ?? '')}
                onChange={update('readingTime')}
              />
              <Divider />
              <label style={{display: "grid", gap: 8}}>
                导入 Markdown 文件
                <input type="file" accept=".md,.markdown" onChange={importMarkdown} disabled={importing || saving} />
              </label>
              <label style={{display: "grid", gap: 8}}>
                导入文章及图片文件夹
                <input type="file" webkitdirectory="" onChange={importMarkdown} disabled={importing || saving} />
              </label>
              <div role="status">
                {importing ? '正在读取文章并上传图片…' : importedFile ? `已导入 ${importedFile}` : ''}
                {!importing && missingImages.length > 0 && (
                  <p>未找到图片：{missingImages.join('、')}。请选择同时包含 Markdown 文件和这些图片的文件夹。</p>
                )}
              </div>
              <Stack gap={2}>
                <TextArea
                  label="正文（Markdown）"
                  isDisabled={importing}
                  value={form.content}
                  onChange={update('content')}
                  rows={16}
                  placeholder={'## 起因\n\n…'}
                  aria-describedby="note-content-help"
                />
                <Text id="note-content-help" type="supporting">{"支持标题、列表、代码块等 Markdown 语法"}</Text>
              </Stack>
            </Stack>
          </Card>
        </StackItem>

        {/* 实时预览 */}
        {isWide && (
          <Stack width={420} gap={3} style={{position: 'sticky', top: 88}}>
            <Text type="label">实时预览</Text>
            <Card padding={6}>
              <Stack gap={4}>
                <Heading level={2}>{form.title || '（标题）'}</Heading>
                <Text type="supporting">
                  {form.date} · {form.readingTime || 0} 分钟读完
                </Text>
                <Text type="large">{form.excerpt || '（摘要）'}</Text>
                <Divider />
                <Markdown headingLevelStart={2}>
                  {form.content || '正文预览会显示在这里…'}
                </Markdown>
              </Stack>
            </Card>
          </Stack>
        )}
      </HStack>
    </Stack>
  )
}
