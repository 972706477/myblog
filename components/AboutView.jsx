'use client'

import {Avatar} from '@astryxdesign/core/Avatar'
import {Badge} from '@astryxdesign/core/Badge'
import {Divider} from '@astryxdesign/core/Divider'
import {Grid} from '@astryxdesign/core/Grid'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {ProfileParticles} from './QuietEffects'

// 关于页视图：宽屏下用两列布局（数据由服务端页面传入）
export default function AboutView({projects, notes, author}) {
  const finished = projects.filter((p) => p.status === '已完成').length
  const building = projects.filter((p) => p.status === '进行中').length

  return (
    <Stack gap={6} paddingBlock={6} maxWidth={1200} style={{marginInline: 'auto'}}>
      {/* 个人介绍：通栏 */}
      <Stack gap={4}>
        <HStack gap={4} vAlign="center" wrap="wrap">
          <Avatar name={author.name} size="lg" />
          <Stack gap={2}>
            <Heading level={1} type="display-2">
              关于我
            </Heading>
            <Text type="large">{author.bio}</Text>
          </Stack>
        </HStack>
        <Text type="supporting">
          {author.role} · 已完成 {finished} 个项目，{building} 个正在进行 · 写下 {notes.length} 篇笔记
        </Text>
      </Stack>

      <Divider />

      <ProfileParticles />

      {/* 两列：左边在做什么，右边常用技术 */}
      <Grid columns={{minWidth: 340, max: 2}} gap={8}>
        <Stack gap={3}>
          <Heading level={2}>我在做什么</Heading>
          <Text>
            一半时间在做小玩意：桌面小组件、命令行工具、本地笔记器——都是给自己用、
            解决具体问题的东西。另一半时间在学 React，把学到的东西写成笔记。
            这个站点就是两者的交汇处。
          </Text>
          <HStack gap={1} wrap="wrap">
            {['小工具', '桌面应用', '命令行', '网页', 'React'].map((item) => (
              <Badge key={item} variant="teal" label={item} />
            ))}
          </HStack>
        </Stack>

        <Stack gap={3}>
          <Heading level={2}>常用的技术</Heading>
          <MetadataList>
            <MetadataListItem label="主力框架">React 19 + Next.js</MetadataListItem>
            <MetadataListItem label="设计系统">Astryx（Meta 开源，150+ 组件）</MetadataListItem>
            <MetadataListItem label="语言">JavaScript / TypeScript</MetadataListItem>
            <MetadataListItem label="其他">Node.js、Canvas、Markdown</MetadataListItem>
            <MetadataListItem label="在学">React 深入、工程化、交互细节</MetadataListItem>
          </MetadataList>
        </Stack>
      </Grid>

      <Divider />

      {/* 联系我：通栏 */}
      <Stack gap={3}>
        <Heading level={2}>联系我</Heading>
        <Text>对某个项目感兴趣，或者有改进建议？欢迎通过笔记页面找到我，或者来 GitHub 上交流。</Text>
      </Stack>
    </Stack>
  )
}
