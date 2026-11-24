'use client'

import {useRouter} from 'next/navigation'
import {Avatar} from '@astryxdesign/core/Avatar'
import {Badge} from '@astryxdesign/core/Badge'
import {Button} from '@astryxdesign/core/Button'
import {Center} from '@astryxdesign/core/Center'
import {ClickableCard} from '@astryxdesign/core/ClickableCard'
import {Grid, GridSpan} from '@astryxdesign/core/Grid'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {Icon} from '@astryxdesign/core/Icon'
import {Link} from '@astryxdesign/core/Link'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import NoteList from './NoteList.jsx'
import ProjectCard, {statusVariant} from './ProjectCard.jsx'

// 首页视图：个人介绍 + 精选作品 + 最新笔记（数据由服务端页面传入）
export default function HomeView({projects, notes, author}) {
  const router = useRouter()
  const featured = projects.find((p) => p.featured) ?? projects[0]
  const otherProjects = projects.filter((p) => p !== featured)
  const latestNotes = notes.slice(0, 4)

  return (
    <Stack gap={8} paddingBlock={6}>
      {/* 个人介绍 */}
      <Stack gap={4}>
        <HStack gap={4} vAlign="center" wrap="wrap">
          <Avatar name={author.name} size="lg" />
          <Stack gap={2} maxWidth={640}>
            <Heading level={1} type="display-1">
              你好，我是 {author.name}
            </Heading>
            <Text type="large">{author.bio}</Text>
          </Stack>
        </HStack>
        <Text type="supporting">
          {projects.length} 个项目 · {notes.length} 篇笔记 · 从 2024 年折腾到现在
        </Text>
        <Text type="supporting">提示：按 Ctrl / ⌘ + K 可以随时搜索文章</Text>
        <HStack gap={2} wrap="wrap">
          <Button label="看看我的作品" variant="primary" onClick={() => router.push('/projects')} />
          <Button label="读读技术笔记" variant="secondary" onClick={() => router.push('/notes')} />
        </HStack>
      </Stack>

      {/* 精选作品：置顶项目横卡 + 其余项目网格 */}
      <Stack gap={4}>
        <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
          <Heading level={2}>精选作品</Heading>
          <Link href="/projects" isStandalone>
            查看全部 {projects.length} 个项目 →
          </Link>
        </HStack>

        <Grid columns={{minWidth: 280, max: 2}} gap={4}>
          <GridSpan span={2}>
            <ClickableCard
              href={`/projects/${featured.slug}`}
              label={`查看项目：${featured.name}`}
              padding={0}
              elevation="low"
            >
              <HStack gap={0} vAlign="stretch" wrap="wrap">
                {/* 左侧图标区 */}
                <Center width={200} padding={6}>
                  <Icon icon={featured.icon} size="lg" style={{width: 56, height: 56}} />
                </Center>
                {/* 右侧内容 */}
                <Stack gap={3} padding={6} style={{flex: '1 1 320px', minWidth: 0}}>
                  <HStack gap={3} vAlign="center" wrap="wrap">
                    <Badge variant="info" label="置顶项目" />
                    <Badge variant={statusVariant[featured.status]} label={featured.status} />
                    <Text type="supporting" hasTabularNumbers>
                      {featured.year}
                    </Text>
                  </HStack>
                  <Heading level={2}>{featured.name}</Heading>
                  <Text type="body">{featured.tagline}</Text>
                  <HStack gap={1} wrap="wrap">
                    {featured.stack.map((tech) => (
                      <Badge key={tech} variant="blue" label={tech} />
                    ))}
                  </HStack>
                  <HStack gap={1} vAlign="center">
                    <Text type="supporting">查看项目详情</Text>
                    <Icon icon="chevronRight" size="sm" />
                  </HStack>
                </Stack>
              </HStack>
            </ClickableCard>
          </GridSpan>
          {otherProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Grid>
      </Stack>

      {/* 最新笔记：编辑式列表 */}
      <Stack gap={4}>
        <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
          <Heading level={2}>最新笔记</Heading>
          <Link href="/notes" isStandalone>
            查看全部 {notes.length} 篇 →
          </Link>
        </HStack>
        <NoteList list={latestNotes} />
      </Stack>
    </Stack>
  )
}
