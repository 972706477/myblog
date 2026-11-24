'use client'

import {useEffect, useMemo, useState} from 'react'
import {useRouter} from 'next/navigation'
import {CommandPalette} from '@astryxdesign/core/CommandPalette'
import {createStaticSource} from '@astryxdesign/core/Typeahead'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'

// 固定页面条目
const pageItems = [
  {
    id: 'page:home',
    label: '首页',
    auxiliaryData: {group: '页面', hint: '精选作品和最新笔记', keywords: ['首页', '主页'], href: '/'},
  },
  {
    id: 'page:projects',
    label: '全部作品',
    auxiliaryData: {group: '页面', hint: '所有项目', keywords: ['作品', '项目'], href: '/projects'},
  },
  {
    id: 'page:notes',
    label: '全部笔记',
    auxiliaryData: {group: '页面', hint: '所有技术笔记', keywords: ['笔记', '文章'], href: '/notes'},
  },
  {
    id: 'page:about',
    label: '关于我',
    auxiliaryData: {group: '页面', hint: '我的技术栈和学习方向', keywords: ['关于'], href: '/about'},
  },
]

// Ctrl/⌘ + K 全局搜索面板：数据从 API 实时拉取
export default function SearchPalette({isOpen, onOpenChange}) {
  const router = useRouter()
  const [items, setItems] = useState(pageItems)

  // 挂载后拉取项目和笔记
  useEffect(() => {
    let alive = true
    Promise.all([
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/notes').then((r) => r.json()),
    ])
      .then(([projects, notes]) => {
        if (!alive) return
        const projectItems = (Array.isArray(projects) ? projects : []).map((project) => ({
          id: `project:${project.slug}`,
          label: project.name,
          auxiliaryData: {
            group: '项目',
            hint: `${project.year} · ${(project.stack ?? []).join(' / ')}`,
            keywords: project.stack ?? [],
            href: `/projects/${project.slug}`,
          },
        }))
        const noteItems = (Array.isArray(notes) ? notes : []).map((note) => ({
          id: `note:${note.slug}`,
          label: note.title,
          auxiliaryData: {
            group: '笔记',
            hint: `${note.date} · ${(note.tags ?? []).join(' / ')}`,
            keywords: note.tags ?? [],
            href: `/notes/${note.slug}`,
          },
        }))
        setItems([...projectItems, ...noteItems, ...pageItems])
      })
      .catch(() => {
        // 拉取失败时至少还能搜页面
      })
    return () => {
      alive = false
    }
  }, [])

  // createStaticSource：按标题 + 关键词做包含匹配的静态搜索源
  const source = useMemo(
    () =>
      createStaticSource(items, {
        keywords: (item) => item.auxiliaryData?.keywords ?? [],
      }),
    [items],
  )

  return (
    <CommandPalette
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      searchSource={source}
      label="搜索项目、笔记和页面"
      value=""
      emptySearchText="没有找到相关内容，换个关键词试试"
      onValueChange={(value) => {
        if (!value) return
        const item = items.find((i) => i.id === value)
        if (item) router.push(item.auxiliaryData.href)
      }}
      renderItem={(item) => (
        <Stack gap={1}>
          <Text type="label">{item.label}</Text>
          <Text type="supporting">
            {item.auxiliaryData.group} · {item.auxiliaryData.hint}
          </Text>
        </Stack>
      )}
    />
  )
}
