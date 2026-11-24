import {Divider} from '@astryxdesign/core/Divider'
import {HStack} from '@astryxdesign/core/HStack'
import {Link} from '@astryxdesign/core/Link'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'

// 页脚：每个页面底部都会显示
export default function Footer() {
  return (
    <Stack gap={4} paddingBlock={6}>
      <Divider />
      <HStack justify="between" wrap="wrap" gap={3} vAlign="center">
        <Text type="supporting">© 2026 我的博客 · 作品 + 笔记 · 使用 Vite + React + Astryx 构建</Text>
        {/* 外部链接不走前端路由，用 as="a" 渲染成普通链接，新标签页打开 */}
        <Link as="a" href="https://github.com/meta/astryx" isExternalLink isStandalone>
          Astryx on GitHub
        </Link>
      </HStack>
    </Stack>
  )
}
