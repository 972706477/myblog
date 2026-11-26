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
import {Selector} from '@astryxdesign/core/Selector'
import {Stack, StackItem} from '@astryxdesign/core/Stack'
import {Switch} from '@astryxdesign/core/Switch'
import {Text} from '@astryxdesign/core/Text'
import {TextArea} from '@astryxdesign/core/TextArea'
import {TextInput} from '@astryxdesign/core/TextInput'
import {useMediaQuery} from '@astryxdesign/core/hooks'
import {useToast} from '@astryxdesign/core/Toast'
import {api} from '@/lib/api'
import MarkdownImport from './MarkdownImport'
import CoverUpload from './CoverUpload'

const STATUS_OPTIONS = ['进行中', '已完成', '已归档']

// 封面图标可选值（astryx 语义图标名）
const ICON_OPTIONS = [
  'wrench',
  'viewColumns',
  'checkDouble',
  'stop',
  'menu',
  'search',
  'upload',
  'copy',
  'clock',
  'calendar',
].map(icon => ({value: icon, label: icon, icon}))

const emptyProject = {
  name: '',
  slug: '',
  tagline: '',
  year: String(new Date().getFullYear()),
  status: '进行中',
  stack: [],
  featured: false,
  icon: 'wrench',
  demoUrl: '',
  repoUrl: '',
  content: '',
}

// 项目编辑器：新建和编辑共用。左边表单，右边实时预览
export default function ProjectEditor({slug}) {
  const router = useRouter()
  const showToast = useToast()
  const isWide = useMediaQuery('(min-width: 1024px)')
  const isNew = !slug

  const [form, setForm] = useState(emptyProject)
  const [savedOptions, setSavedOptions] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')

  // 加载已有选项以及当前编辑的内容
  useEffect(() => {
    let alive = true
    api.listProjects().then((list) => {
      const found = list.find((p) => p.slug === slug)
      if (!alive) return
      setSavedOptions([...new Set(list.flatMap(item => item.stack ?? []))])
      if (isNew) return
      if (found) {
        setForm(found)
      } else {
        setError('没有找到这个项目')
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
    if (!form.name.trim()) {
      setError('项目名称不能为空')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        demoUrl: form.demoUrl?.trim() || null,
        repoUrl: form.repoUrl?.trim() || null,
      }
      if (isNew) {
        await api.createProject(payload)
        showToast({body: '项目已创建', type: 'info'})
      } else {
        await api.updateProject(slug, payload)
        showToast({body: '项目已保存', type: 'info'})
      }
      router.push('/admin/projects')
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
          {isNew ? '新建项目' : `编辑：${form.name}`}
        </Heading>
        <HStack gap={2}>
          <Button label="取消" variant="ghost" onClick={() => router.push('/admin/projects')} />
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
                label="项目名称（必填）"
                aria-required="true"
                value={form.name}
                onChange={update('name')}
                placeholder="例如：像素天气桌面小组件"
              />
              <Stack gap={2}>
                <TextInput
                  label="网址后缀（slug）"
                  value={form.slug}
                  onChange={update('slug')}
                  placeholder="留空则根据名称自动生成"
                  aria-describedby="project-slug-help"
                />
                <Text id="project-slug-help" type="supporting">{"前台地址：/projects/<后缀>"}</Text>
              </Stack>
              <TextArea
                label="一句话介绍"
                value={form.tagline}
                onChange={update('tagline')}
                rows={2}
                placeholder="列表卡片上显示的简介"
              />
              <HStack gap={4} vAlign="start" wrap="wrap">
                <Stack gap={2} style={{flex: '1 1 200px', minWidth: 0}}>
                  <TextInput label="年份" value={form.year} onChange={update('year')} placeholder="2026" />
                </Stack>
                <Stack gap={2} style={{flex: '1 1 200px', minWidth: 0}}>
                  <MultiSelector
                    label="技术栈"
                    options={[...new Set([...savedOptions, ...(form.stack ?? [])])]}
                    value={form.stack ?? []}
                    onChange={update('stack')}
                    hasSearch
                    hasCreate
                    isLoading={optionsLoading}
                    triggerDisplay="badges"
                    placeholder="选择或新增技术栈"
                    searchPlaceholder="搜索或输入新技术栈"
                    width="100%"
                  />
                </Stack>
              </HStack>
              <HStack gap={4} vAlign="start" wrap="wrap">
                <Stack gap={2} style={{flex: '1 1 200px', minWidth: 0}}>
                  <Selector
                    label="状态"
                    value={form.status}
                    onChange={update('status')}
                    options={STATUS_OPTIONS}
                  />
                </Stack>
                <Stack gap={2} style={{flex: '1 1 200px', minWidth: 0}}>
                  <TextInput
                    label="演示地址"
                    value={form.demoUrl ?? ''}
                    onChange={update('demoUrl')}
                    placeholder="https://…（留空则不显示按钮）"
                  />
                </Stack>
              </HStack>
              <HStack gap={4} vAlign="start" wrap="wrap">
                <Stack gap={2} style={{flex: '1 1 200px', minWidth: 0}}>
                  <Selector
                    label="封面图标"
                    value={form.icon}
                    onChange={update('icon')}
                    options={ICON_OPTIONS}
                  />
                </Stack>
                <Stack gap={2} style={{flex: '1 1 200px', minWidth: 0}}>
                  <TextInput
                    label="仓库地址"
                    value={form.repoUrl ?? ''}
                    onChange={update('repoUrl')}
                    placeholder="https://…（留空则不显示按钮）"
                  />
                </Stack>
              </HStack>
              <Switch
                label="在首页置顶展示"
                value={form.featured}
                onChange={update('featured')}
                description="首页只保留一个置顶项目。保存后，其他项目会自动取消置顶。"
              />
              <Divider />
              <CoverUpload value={form.coverUrl} onChange={update('coverUrl')} disabled={saving || importing} onBusyChange={setImporting} />
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
                  placeholder={'## 为什么做它\n\n…'}
                  aria-describedby="project-content-help"
                />
                <Text id="project-content-help" type="supporting">{"支持标题、列表、代码块等 Markdown 语法"}</Text>
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
                <Heading level={2}>{form.name || '（项目名称）'}</Heading>
                <Text type="large">{form.tagline || '（一句话介绍）'}</Text>
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
