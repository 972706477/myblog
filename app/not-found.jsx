import {HStack} from '@astryxdesign/core/HStack'
import {Heading} from '@astryxdesign/core/Heading'
import {Link} from '@astryxdesign/core/Link'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'

// 404 页面（Next.js 约定：app/not-found.jsx）
export default function NotFound() {
  return (
    <Stack gap={4} paddingBlock={6}>
      <Heading level={1}>404，页面走丢了</Heading>
      <Text>你访问的地址不存在。可以去首页看看，或者翻翻作品和笔记。</Text>
      <HStack gap={4} wrap="wrap">
        <Link href="/" isStandalone>
          ← 返回首页
        </Link>
        <Link href="/projects" isStandalone>
          看看作品
        </Link>
        <Link href="/notes" isStandalone>
          读读笔记
        </Link>
      </HStack>
    </Stack>
  )
}
