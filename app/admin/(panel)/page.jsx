'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Badge} from '@astryxdesign/core/Badge'
import {Button} from '@astryxdesign/core/Button'
import {Card} from '@astryxdesign/core/Card'
import {Divider} from '@astryxdesign/core/Divider'
import {Grid} from '@astryxdesign/core/Grid'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {api} from '@/lib/api'

// 仪表盘：数据统计 + 最近内容 + 快捷操作
export default function Dashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [notes, setNotes] = useState([])

  useEffect(() => {
    let alive = true
    Promise.all([api.listProjects(), api.listNotes()]).then(([p, n]) => {
      if (alive) {
        setProjects(p)
        setNotes(n)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  const building = projects.filter((p) => p.status === '进行中').length
  const done = projects.filter((p) => p.status === '已完成').length

  // 最近内容：项目和笔记混排，取前 5 条
  const recent = [
    ...projects.map((p) => ({type: '项目', name: p.name, date: p.year, href: `/admin/projects/${p.slug}`})),
    ...notes.map((n) => ({type: '笔记', name: n.title, date: n.date, href: `/admin/notes/${n.slug}`})),
  ].slice(0, 5)

  return (
    <Stack gap={6}>
      <Heading level={1} type="display-2">
        仪表盘
      </Heading>

      {/* 统计卡片 */}
      <Grid columns={{minWidth: 200, max: 4}} gap={4}>
        <Card padding={5}>
          <Stack gap={1}>
            <Text type="supporting">项目总数</Text>
            <Heading level={2}>{projects.length}</Heading>
          </Stack>
        </Card>
        <Card padding={5}>
          <Stack gap={1}>
            <Text type="supporting">进行中 / 已完成</Text>
            <Heading level={2}>
              {building} / {done}
            </Heading>
          </Stack>
        </Card>
        <Card padding={5}>
          <Stack gap={1}>
            <Text type="supporting">笔记总数</Text>
            <Heading level={2}>{notes.length}</Heading>
          </Stack>
        </Card>
        <Card padding={5}>
          <Stack gap={1}>
            <Text type="supporting">置顶项目</Text>
            <Heading level={2}>{projects.filter((p) => p.featured).length}</Heading>
          </Stack>
        </Card>
      </Grid>

      {/* 快捷操作 */}
      <HStack gap={2} wrap="wrap">
        <Button label="新建项目" variant="primary" onClick={() => router.push('/admin/projects/new')} />
        <Button label="新建笔记" variant="secondary" onClick={() => router.push('/admin/notes/new')} />
        <Button label="管理项目" variant="ghost" onClick={() => router.push('/admin/projects')} />
        <Button label="管理笔记" variant="ghost" onClick={() => router.push('/admin/notes')} />
      </HStack>

      {/* 最近内容 */}
      <Stack gap={3}>
        <Heading level={2}>最近内容</Heading>
        <Card padding={0}>
          <Stack gap={0}>
            {recent.map((item, i) => (
              <Stack key={`${item.type}-${item.name}`} gap={0}>
                {i > 0 && <Divider />}
                <HStack gap={3} vAlign="center" wrap="wrap" padding={4}>
                  <Badge variant={item.type === '项目' ? 'blue' : 'teal'} label={item.type} />
                  <Text type="label">{item.name}</Text>
                  <Text type="supporting" hasTabularNumbers>
                    {item.date}
                  </Text>
                  <Button label="编辑" variant="ghost" size="sm" onClick={() => router.push(item.href)} />
                </HStack>
              </Stack>
            ))}
          </Stack>
        </Card>
      </Stack>
    </Stack>
  )
}
