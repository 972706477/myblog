'use client'

import {useEffect, useState} from 'react'
import {usePathname} from 'next/navigation'
import {HStack} from '@astryxdesign/core/HStack'
import {Icon} from '@astryxdesign/core/Icon'
import {IconButton} from '@astryxdesign/core/IconButton'
import {Selector} from '@astryxdesign/core/Selector'
import {Switch} from '@astryxdesign/core/Switch'
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav'
import {useSiteTheme} from '@/app/providers'
import {themes} from '@/themes.js'
import SearchPalette from './SearchPalette.jsx'

// 顶部导航栏：博客名 + 菜单 + 搜索按钮 + 主题切换 + 暗色模式开关
export default function BlogNav() {
  const pathname = usePathname()
  const {themeName, changeTheme, mode, changeMode} = useSiteTheme()
  const [searchOpen, setSearchOpen] = useState(false)

  // 菜单项：isSelected 让当前所在分区高亮
  // 注意：后台入口不放在导航里，直接访问 /admin 进入
  const menuItems = [
    {label: '首页', href: '/', match: (p) => p === '/'},
    {label: '作品', href: '/projects', match: (p) => p.startsWith('/projects')},
    {label: '笔记', href: '/notes', match: (p) => p.startsWith('/notes')},
    {label: '关于', href: '/about', match: (p) => p === '/about'},
  ]

  // 监听 Ctrl/⌘ + K 快捷键打开搜索面板
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <TopNav
        label="主导航"
        heading={<TopNavHeading heading="我的博客" headingHref="/" />}
        startContent={
          <>
            {menuItems.map((item) => (
              <TopNavItem
                key={item.href}
                label={item.label}
                href={item.href}
                isSelected={item.match(pathname)}
              />
            ))}
          </>
        }
        endContent={
          <HStack gap={3} vAlign="center" wrap="wrap">
            <IconButton
              label="搜索"
              icon={<Icon icon="search" />}
              variant="ghost"
              tooltip="搜索项目和笔记（Ctrl/⌘ + K）"
              onClick={() => setSearchOpen(true)}
            />
            <Selector
              label="主题"
              isLabelHidden
              variant="ghost"
              value={themeName}
              onChange={changeTheme}
              options={themes.map((t) => ({value: t.name, label: t.label}))}
            />
            <Switch
              label="暗色模式"
              value={mode === 'dark'}
              onChange={(value) => changeMode(value ? 'dark' : 'light')}
            />
          </HStack>
        }
      />
      <SearchPalette isOpen={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
