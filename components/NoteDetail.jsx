'use client'

import {useEffect, useMemo, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Avatar} from '@astryxdesign/core/Avatar'
import {Badge} from '@astryxdesign/core/Badge'
import {Button} from '@astryxdesign/core/Button'
import {Card} from '@astryxdesign/core/Card'
import {Divider} from '@astryxdesign/core/Divider'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {Icon} from '@astryxdesign/core/Icon'
import {Link} from '@astryxdesign/core/Link'
import {Markdown} from '@astryxdesign/core/Markdown'
import {createMarkdownHeadingLinks} from '@astryxdesign/core/Markdown/plugins'
import {Outline, useOutlineFromMarkdown} from '@astryxdesign/core/Outline'
import {ProgressBar} from '@astryxdesign/core/ProgressBar'
import {Stack, StackItem} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {useMediaQuery} from '@astryxdesign/core/hooks'
import {author} from '@/author.js'

// 笔记详情视图：正文 + 右侧悬浮目录
// 数据由服务端页面传入（构建时从数据库读取）
export default function NoteDetail({note, newer, older, recommendations}) {
  const router = useRouter()

  // 让 Markdown 的标题带上锚点 id，目录才能跳转和滚动监听
  const headingPlugins = useMemo(() => [createMarkdownHeadingLinks()], [])
  const tocItems = useOutlineFromMarkdown(note.content, {plugins: headingPlugins})

  // 阅读进度
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      setProgress(scrollable > 0 ? Math.round((doc.scrollTop / scrollable) * 100) : 0)
    }
    window.addEventListener('scroll', updateProgress)
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  const isWide = useMediaQuery('(min-width: 1024px)')

  return (
    <Stack gap={6} paddingBlock={6} maxWidth={1200} style={{marginInline: 'auto'}}>
      <ProgressBar value={progress} max={100} label="阅读进度" isLabelHidden />

      {/* 标题区 */}
      <Stack gap={4}>
        <Link href="/notes" isStandalone>
          <HStack gap={1} vAlign="center">
            <Icon icon="chevronLeft" size="sm" />
            <Text type="supporting">返回笔记列表</Text>
          </HStack>
        </Link>
        <Heading level={1} type="display-2">
          {note.title}
        </Heading>
        <HStack gap={3} vAlign="center" wrap="wrap">
          <Avatar name={author.name} size="sm" />
          <Text type="supporting">{author.name}</Text>
          <HStack gap={1} vAlign="center">
            <Icon icon="calendar" size="sm" />
            <Text type="supporting">{note.date}</Text>
          </HStack>
          <HStack gap={1} vAlign="center">
            <Icon icon="clock" size="sm" />
            <Text type="supporting">{note.readingTime} 分钟读完</Text>
          </HStack>
        </HStack>
        <HStack gap={1} wrap="wrap">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="blue" label={tag} />
          ))}
        </HStack>
      </Stack>

      <Divider />

      {/* 正文 + 右侧悬浮目录 */}
      <HStack gap={8} vAlign="start" wrap="wrap">
        <StackItem size="fill" style={{flex: '1 1 640px', minWidth: 0}}>
          {/* headingLevelStart={2} 让正文标题从 h2 开始，保证页面大纲层级正确 */}
          <Markdown headingLevelStart={2} plugins={headingPlugins} contentWidth="100%">
            {note.content}
          </Markdown>
        </StackItem>
        {isWide && tocItems.length > 0 && (
          <Stack width={220} gap={3} style={{position: 'sticky', top: 88}}>
            <Text type="label">本页目录</Text>
            <Outline items={tocItems} density="compact" label="笔记目录" />
          </Stack>
        )}
      </HStack>

      <Divider />

      {/* 作者卡片 */}
      <Card padding={5}>
        <HStack gap={4} vAlign="center" wrap="wrap">
          <Avatar name={author.name} size="lg" />
          <Stack gap={2} style={{flex: '1 1 240px'}}>
            <Heading level={3}>{author.name}</Heading>
            <Text type="supporting">{author.bio}</Text>
          </Stack>
          <Button label="看看我的作品" variant="secondary" onClick={() => router.push('/projects')} />
        </HStack>
      </Card>

      {/* 上一篇 / 下一篇 */}
      <HStack justify="between" wrap="wrap" gap={4}>
        {older ? (
          <Link href={`/notes/${older.slug}`} isStandalone>
            <Stack gap={1}>
              <HStack gap={1} vAlign="center">
                <Icon icon="chevronLeft" size="sm" />
                <Text type="supporting">更早一篇</Text>
              </HStack>
              <Text>{older.title}</Text>
            </Stack>
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link href={`/notes/${newer.slug}`} isStandalone>
            <Stack gap={1} hAlign="end">
              <HStack gap={1} vAlign="center">
                <Text type="supporting">更新一篇</Text>
                <Icon icon="chevronRight" size="sm" />
              </HStack>
              <Text>{newer.title}</Text>
            </Stack>
          </Link>
        ) : (
          <span />
        )}
      </HStack>
      {recommendations}
    </Stack>
  )
}
