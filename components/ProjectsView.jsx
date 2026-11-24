'use client'

import {useState} from 'react'
import {Button} from '@astryxdesign/core/Button'
import {EmptyState} from '@astryxdesign/core/EmptyState'
import {Grid} from '@astryxdesign/core/Grid'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import ProjectCard from './ProjectCard.jsx'

// 作品列表视图：按技术栈筛选（数据由服务端页面传入）
export default function ProjectsView({projects}) {
  const [activeTag, setActiveTag] = useState('全部')
  const allTags = [...new Set(projects.flatMap((p) => p.stack))]
  const visible = activeTag === '全部' ? projects : projects.filter((p) => p.stack.includes(activeTag))

  return (
    <Stack gap={6} paddingBlock={6}>
      <Stack gap={2} maxWidth={720}>
        <Heading level={1} type="display-2">
          我的作品
        </Heading>
        <Text type="large">做过的项目和折腾过的玩意，每个都写了背景、技术点和踩坑记录。</Text>
      </Stack>

      <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
        <SegmentedControl value={activeTag} onChange={setActiveTag} label="按技术栈筛选项目">
          <SegmentedControlItem value="全部" label="全部" />
          {allTags.map((tag) => (
            <SegmentedControlItem key={tag} value={tag} label={tag} />
          ))}
        </SegmentedControl>
        <Text type="supporting">共 {visible.length} 个项目</Text>
      </HStack>

      {visible.length === 0 ? (
        <EmptyState
          title="这个技术栈下还没有项目"
          description="换一个标签看看。"
          actions={<Button label="查看全部项目" variant="secondary" onClick={() => setActiveTag('全部')} />}
        />
      ) : (
        <Grid columns={{minWidth: 280, max: 2}} gap={4}>
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Grid>
      )}
    </Stack>
  )
}
