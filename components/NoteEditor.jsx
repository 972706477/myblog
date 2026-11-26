'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@astryxdesign/core/Button'
import {Card} from '@astryxdesign/core/Card'
import {Divider} from '@astryxdesign/core/Divider'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {Markdown} from '@astryxdesign/core/Markdown'
import {MultiSelector} from '@astryxdesign/core/MultiSelector'
import {Stack, StackItem} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {TextArea} from '@astryxdesign/core/TextArea'
import {TextInput} from '@astryxdesign/core/TextInput'
import {useMediaQuery} from '@astryxdesign/core/hooks'
import {useToast} from '@astryxdesign/core/Toast'
import {api} from '@/lib/api'
import MarkdownImport from './MarkdownImport'

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
  const [savedOptions, setSavedOptions] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')

  // 加载已有选项以及当前编辑的内容
  useEffect(() => {
    let alive = true
    api.listNotes().then((list) => {
      const found = list.find((n) => n.slug === slug)
      if (!alive) return
      setSavedOptions([...new Set(list.flatMap(item => item.tags ?? []))])
      if (isNew) return
      if (found) {
        setForm(found)
      } else {
        setError('没有找到这篇笔记')
      }
    }).catch(error => {
      if (alive) setError(error.message)
    }).finally(() => {
      if (alive) {
        setLoading(false)
        setOptionsLoading(false)
      }
    })
    return () => {
      alive = false
    }
  }, [slug, isNew])

  const update = (key) => (value) => setForm((prev) => ({...prev, [key]: value}))

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
                  <MultiSelector
                    label="标签"
                    options={[...new Set([...savedOptions, ...(form.tags ?? [])])]}
                    value={form.tags ?? []}
                    onChange={update('tags')}
                    hasSearch
                    hasCreate
                    isLoading={optionsLoading}
                    triggerDisplay="badges"
                    placeholder="选择或新增标签"
                    searchPlaceholder="搜索或输入新标签"
                    width="100%"
                  />
                </Stack>
              </HStack>
              <TextInput
                label="阅读时长（分钟）"
                type="number"
                value={String(form.readingTime ?? '')}
                onChange={update('readingTime')}
              />
              <Divider />
              <MarkdownImport
                content={form.content}
                onImport={update('content')}
                importing={importing}
                setImporting={setImporting}
                saving={saving}
                setError={setError}
              />
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
