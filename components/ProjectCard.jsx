import {QuietGlass} from './QuietEffects'
import {Badge} from '@astryxdesign/core/Badge'
import {ClickableCard} from '@astryxdesign/core/ClickableCard'
import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {Icon} from '@astryxdesign/core/Icon'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'

// 状态 → 徽章颜色
export const statusVariant = {
  进行中: 'info',
  已完成: 'success',
  已归档: 'neutral',
}

// 项目卡片：图标 + 名称 + 一句话 + 年份/状态 + 技术栈
export default function ProjectCard({project}) {
  return (
    <ClickableCard
      href={`/projects/${project.slug}`}
      label={`查看项目：${project.name}`}
      elevation="low"
    >
      <Stack gap={3}>
        {project.coverUrl && <QuietGlass><img src={project.coverUrl} alt="" loading="lazy" style={{width: '100%', aspectRatio: '16 / 9', maxHeight: 280, objectFit: 'cover', borderRadius: 12, marginBottom: 12}} /></QuietGlass>}
        <HStack gap={3} vAlign="center">
          <Icon icon={project.icon} size="lg" style={{width: 28, height: 28}} />
          <Heading level={3}>{project.name}</Heading>
        </HStack>
        <Text type="supporting" maxLines={2}>
          {project.tagline}
        </Text>
        <HStack gap={3} vAlign="center" wrap="wrap">
          <Text type="supporting" hasTabularNumbers>
            {project.year}
          </Text>
          <Badge variant={statusVariant[project.status]} label={project.status} />
        </HStack>
        <HStack gap={1} wrap="wrap">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="blue" label={tech} />
          ))}
        </HStack>
      </Stack>
    </ClickableCard>
  )
}
