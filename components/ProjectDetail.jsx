'use client'

import {useEffect, useMemo, useState} from 'react'
import {useRouter} from 'next/navigation'
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
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList'
import {Outline, useOutlineFromMarkdown} from '@astryxdesign/core/Outline'
import {ProgressBar} from '@astryxdesign/core/ProgressBar'
import {Stack, StackItem} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {useMediaQuery} from '@astryxdesign/core/hooks'
import {author} from '@/author.js'
import {statusVariant} from './ProjectCard.jsx'

// 项目详情视图：左侧正文 + 右侧信息栏（项目信息 + 目录）
// 数据由服务端页面传入（构建时从数据库读取）
export default function ProjectDetail({project, newer, older}) {
  const router = useRouter()

  // 让 Markdown 的标题带上锚点 id，目录才能跳转和滚动监听
  const headingPlugins = useMemo(() => [createMarkdownHeadingLinks()], [])
  const tocItems = useOutlineFromMarkdown(project.content, {plugins: headingPlugins})

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
  const hasLinks = project.demoUrl || project.repoUrl

  return (
    <Stack gap={6} paddingBlock={6} maxWidth={1200} style={{marginInline: 'auto'}}>
      <ProgressBar value={progress} max={100} label="阅读进度" isLabelHidden />

      {/* 标题区 */}
      <Stack gap={4}>
        <Link href="/projects" isStandalone>
          <HStack gap={1} vAlign="center">
            <Icon icon="chevronLeft" size="sm" />
            <Text type="supporting">返回作品列表</Text>
          </HStack>
        </Link>
        <Heading level={1} type="display-2">
          {project.name}
        </Heading>
        <Text type="large">{project.tagline}</Text>
        <HStack gap={3} vAlign="center" wrap="wrap">
          <Badge variant={statusVariant[project.status]} label={project.status} />
          <HStack gap={1} vAlign="center">
            <Icon icon="calendar" size="sm" />
            <Text type="supporting" hasTabularNumbers>
              {project.year}
            </Text>
          </HStack>
        </HStack>
        <HStack gap={1} wrap="wrap">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="blue" label={tech} />
          ))}
        </HStack>
      </Stack>

      <Divider />

      {/* 正文 + 右侧信息栏 */}
      <HStack gap={8} vAlign="start" wrap="wrap">
        <StackItem size="fill" style={{flex: '1 1 640px', minWidth: 0}}>
          <Markdown headingLevelStart={2} plugins={headingPlugins}>
            {project.content}
          </Markdown>
        </StackItem>

        {isWide && (
          <Stack width={240} gap={5} style={{position: 'sticky', top: 88}}>
            {/* 项目信息卡 */}
            <Card padding={5}>
              <Stack gap={3}>
                <Heading level={3}>项目信息</Heading>
                <MetadataList>
                  <MetadataListItem label="年份">{project.year}</MetadataListItem>
                  <MetadataListItem label="状态">{project.status}</MetadataListItem>
                  <MetadataListItem label="作者">{author.name}</MetadataListItem>
                  <MetadataListItem label="技术栈">{project.stack.join('、')}</MetadataListItem>
                </MetadataList>
                {hasLinks && (
                  <Stack gap={2}>
                    {project.demoUrl && (
                      <Button label="在线演示" as="a" href={project.demoUrl} target="_blank" variant="primary" />
                    )}
                    {project.repoUrl && (
                      <Button label="源代码" as="a" href={project.repoUrl} target="_blank" variant="secondary" />
                    )}
                  </Stack>
                )}
              </Stack>
            </Card>

            {/* 本页目录 */}
            {tocItems.length > 0 && (
              <Stack gap={3}>
                <Text type="label">本页目录</Text>
                <Outline items={tocItems} density="compact" label="项目详情目录" />
              </Stack>
            )}
          </Stack>
        )}
      </HStack>

      <Divider />

      {/* 上一个 / 下一个项目 */}
      <HStack justify="between" wrap="wrap" gap={4}>
        {older ? (
          <Link href={`/projects/${older.slug}`} isStandalone>
            <Stack gap={1}>
              <HStack gap={1} vAlign="center">
                <Icon icon="chevronLeft" size="sm" />
                <Text type="supporting">更早的项目</Text>
              </HStack>
              <Text>{older.name}</Text>
            </Stack>
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link href={`/projects/${newer.slug}`} isStandalone>
            <Stack gap={1} hAlign="end">
              <HStack gap={1} vAlign="center">
                <Text type="supporting">更新的项目</Text>
                <Icon icon="chevronRight" size="sm" />
              </HStack>
              <Text>{newer.name}</Text>
            </Stack>
          </Link>
        ) : (
          <span />
        )}
      </HStack>

      {/* 回到全部作品 */}
      <HStack>
        <Button label="回到全部作品" variant="secondary" onClick={() => router.push('/projects')} />
      </HStack>
    </Stack>
  )
}
