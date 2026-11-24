'use client'

import {useEffect, useState} from 'react'
import {usePathname, useRouter} from 'next/navigation'
import {AppShell} from '@astryxdesign/core/AppShell'
import {Banner} from '@astryxdesign/core/Banner'
import {Button} from '@astryxdesign/core/Button'
import {SideNav, SideNavItem, SideNavSection} from '@astryxdesign/core/SideNav'
import {Stack} from '@astryxdesign/core/Stack'
import {ToastViewport} from '@astryxdesign/core/Toast'
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav'
import {api} from '@/lib/api'

// 后台外壳：登录守卫 + 侧边导航 + 顶栏
export default function AdminLayout({children}) {
  const pathname = usePathname()
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  // 登录守卫：客户端挂载后才能读 localStorage，所以先渲染空壳再决定跳转
  useEffect(() => {
    const token = api.getToken()
    setAuthed(!!token)
    setChecked(true)
    if (!token) router.replace('/admin/login')
  }, [router])

  const handleLogout = async () => {
    await api.logout()
    router.replace('/admin/login')
  }

  if (!checked || !authed) {
    return <Stack paddingBlock={10} />
  }

  const navItems = [
    {label: '仪表盘', href: '/admin', icon: 'viewColumns', match: (p) => p === '/admin'},
    {label: '项目管理', href: '/admin/projects', icon: 'wrench', match: (p) => p.startsWith('/admin/projects')},
    {label: '笔记管理', href: '/admin/notes', icon: 'copy', match: (p) => p.startsWith('/admin/notes')},
    {label: '站点设置', href: '/admin/settings', icon: 'menu', match: (p) => p.startsWith('/admin/settings')},
  ]

  return (
    <AppShell
      height="fill"
      contentPadding={6}
      sideNav={
        <SideNav label="后台导航">
          <SideNavSection label="内容">
            {navItems.map((item) => (
              <SideNavItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                isSelected={item.match(pathname)}
              />
            ))}
          </SideNavSection>
        </SideNav>
      }
      topNav={
        <TopNav
          label="后台顶栏"
          heading={<TopNavHeading heading="发布后台" headingHref="/admin" />}
          endContent={
            <>
              <TopNavItem label="返回前台" href="/" />
              <Button label="退出登录" variant="ghost" onClick={handleLogout} />
            </>
          }
        />
      }
    >
      <Stack gap={4}>
        {/* 数据来源提示：配好 .env.local 后内容直接进 MySQL；没配则无法保存 */}
        <Banner
          status="info"
          title="发布后台"
          description="内容直接保存到服务器 MySQL 数据库。如果保存时提示「数据库未配置」，请按 README 配置项目根目录的 .env.local。"
        />
        {children}
      </Stack>
      {/* Toast 通知的挂载点（保存成功、删除成功等提示） */}
      <ToastViewport />
    </AppShell>
  )
}
