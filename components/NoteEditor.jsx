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
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    setError('')
    if (!/\.(md|markdown)$/i.test(file.name)) {
      setError('请选择 .md 或 .markdown 文件')
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
      update('content')(content)
      setImportedFile(file.name)
    } catch {
      setError('无法读取 Markdown 文件，请确认文件使用 UTF-8 编码')
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
                label="标题"
                isRequired
                value={form.title}
                onChange={update('title')}
                placeholder="例如：useState 入门"
              />
              <TextInput
                label="网址后缀（slug）"
                value={form.slug}
                onChange={update('slug')}
                placeholder="留空则根据标题自动生成"
                description="前台地址：/notes/<后缀>"
              />
              <TextArea
                label="摘要"
                value={form.excerpt}
                onChange={update('excerpt')}
                rows={2}
                placeholder="列表页显示的简介"
              />
              <HStack gap={4} vAlign="start" wrap="wrap">
                <Stack gap={4} style={{flex: '1 1 200px', minWidth: 0}}>
                  <TextInput
                    label="发布日期"
                    value={form.date}
                    onChange={update('date')}
                    placeholder="2026-11-24"
                  />
                  <TextInput
                    label="阅读时长（分钟）"
                    type="number"
                    value={String(form.readingTime ?? '')}
                    onChange={update('readingTime')}
                  />
                </Stack>
                <Stack gap={4} style={{flex: '1 1 200px', minWidth: 0}}>
                  <TextInput
                    label="标签"
                    value={tagsText}
                    onChange={setTagsText}
                    placeholder="React，Hooks"
                    description="用逗号分隔，会显示成标签"
                  />
                </Stack>
              </HStack>
              <Divider />
              <label>
                导入 Markdown 文件{' '}
                <input type="file" accept=".md,.markdown" onChange={importMarkdown} disabled={importing || saving} />
              </label>
              <div role="status">
                {importing ? '正在读取文件…' : importedFile ? `已导入 ${importedFile}` : ''}
              </div>
              <TextArea
                label="正文（Markdown）"
                isDisabled={importing}
                value={form.content}
                onChange={update('content')}
                rows={16}
                placeholder={'## 起因\n\n…'}
                description="支持标题、列表、代码块等 Markdown 语法"
              />
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
