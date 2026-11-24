import './globals.css'
import {Providers} from './providers'

export const metadata = {
  title: {
    default: '我的博客',
    template: '%s · 我的博客',
  },
  description: '作品 + 笔记：做过的项目、折腾过的玩意，以及前端学习记录。',
}

// Next.js 根布局：所有页面共用。主题和链接配置在 Providers（客户端组件）里
export default function RootLayout({children}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
