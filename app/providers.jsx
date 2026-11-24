'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {Theme} from '@astryxdesign/core/theme'
import {LinkProvider} from '@astryxdesign/core/Link'
import {themeMap} from '@/themes.js'

// 全局 Provider：Astryx 主题 + 链接组件（换成 next/link，走前端路由）
//
// 注意：主题/暗色模式的初始值在服务端和客户端首屏必须一致（避免 hydration 报错），
// 所以统一用默认值渲染，挂载后再从 localStorage 恢复上次的选择。
export function Providers({children}) {
  const [themeName, setThemeName] = useState('neutral')
  const [mode, setMode] = useState('system')

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('blog-theme')
      const savedMode = localStorage.getItem('blog-mode')
      if (savedTheme) setThemeName(savedTheme)
      if (savedMode) setMode(savedMode)
    } catch {
      // 隐私模式等场景下 localStorage 不可用，忽略
    }
  }, [])

  const changeTheme = (name) => {
    setThemeName(name)
    try {
      localStorage.setItem('blog-theme', name)
    } catch {}
  }

  const changeMode = (nextMode) => {
    setMode(nextMode)
    try {
      localStorage.setItem('blog-mode', nextMode)
    } catch {}
  }

  return (
    <Theme theme={themeMap[themeName] ?? themeMap.neutral} mode={mode}>
      <LinkProvider component={Link}>
        <ThemeContext.Provider value={{themeName, changeTheme, mode, changeMode}}>
          {children}
        </ThemeContext.Provider>
      </LinkProvider>
    </Theme>
  )
}

// 把主题状态通过 context 传给导航栏（避免 props 一层层传）
import {createContext, useContext} from 'react'

const ThemeContext = createContext(null)

export function useSiteTheme() {
  return useContext(ThemeContext)
}
