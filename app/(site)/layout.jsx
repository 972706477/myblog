'use client'

import {AppShell} from '@astryxdesign/core/AppShell'
import {Stack, StackItem} from '@astryxdesign/core/Stack'
import BlogNav from '@/components/BlogNav'
import Footer from '@/components/Footer'
import {usePathname} from 'next/navigation'

// 公共站点外壳：顶部导航 + 内容 + 页脚
// Stack 撑满高度，让内容区生长、页脚贴在屏幕底部
export default function SiteLayout({children}) {
  const pathname = usePathname()
  return (
    <AppShell height="auto" contentPadding={pathname === '/' ? 0 : 4} topNav={<BlogNav />}>
      <Stack height="100%" minHeight="calc(100dvh - 4rem)" gap={0}>
        <StackItem size="fill">{children}</StackItem>
        <Footer />
      </Stack>
    </AppShell>
  )
}
