// 技术笔记。想发新笔记，在这里加一个对象即可。
// content 是 Markdown 格式的正文，页面会用 Astryx 的 Markdown 组件渲染。
import {author} from './author.js'

export {author}

export const notes = [
  {
    slug: 'hello-react',
    title: 'React 新手第一天：JSX 到底是什么',
    excerpt: 'JSX 看起来像 HTML，其实是 JavaScript 的语法扩展。这篇文章用最小例子讲清楚它到底发生了什么。',
    date: '2026-11-20',
    readingTime: 4,
    tags: ['React', '入门'],
    content: `很多人第一次写 React，都会被 \`JSX\` 搞糊涂：这到底是 HTML 还是 JavaScript？

答案：**它是 JavaScript**。JSX 只是给 “创建元素” 这行代码换了一种写法。

## 没有 JSX 的时候

React 底层有一个叫 \`createElement\` 的函数，长这样：

\`\`\`jsx
const title = React.createElement('h1', null, '你好，React')
\`\`\`

每次写页面都这样写，很快就没法读了，于是有了 JSX：

\`\`\`jsx
const title = <h1>你好，React</h1>
\`\`\`

两行代码**完全等价**。构建工具（本项目用 Next.js 内置的编译器）会把 JSX “翻译” 成 \`createElement\` 调用。

## 三条最容易踩的规则

1. \`class\` 要写成 \`className\`，因为 \`class\` 是 JavaScript 保留字
2. 只能有一个根元素，多个元素要用 \`<></>\`（Fragment）包起来
3. 属性里要写动态值，用花括号：\`<img src={url} />\`

## 花括号里能放什么

凡是 JavaScript 表达式都能放进花括号：

\`\`\`jsx
const name = 'Alex'
const el = <p>你好，{name}，今天是 {new Date().getFullYear()} 年</p>
\`\`\`

记住 “表达式” 这个词：\`if/else\`、\`for\` 这种语句不能直接放进去，要用三元运算符或者 map。

## 小结

- JSX 是 \`createElement\` 的语法糖
- 由构建工具在构建时编译，浏览器根本不认识 JSX
- 花括号是 “从 JSX 回到 JavaScript 世界” 的大门

下一篇会讲 \`useState\`——让页面 “动” 起来的第一个 Hook。`,
  },
  {
    slug: 'usestate-intro',
    title: 'useState 入门：让页面记住事情',
    excerpt: '普通变量一刷新就忘了，useState 让组件自己记住状态，状态一变，页面自动重新渲染。',
    date: '2026-11-22',
    readingTime: 5,
    tags: ['React', 'Hooks'],
    content: `React 组件本质是一个函数：输入 props，输出 JSX。但页面需要 “记忆” 时怎么办？比如一个计数器。

## 为什么普通变量不行

\`\`\`jsx
function Counter() {
  let count = 0
  const onClick = () => {
    count = count + 1
    console.log(count) // 数字确实变了
  }
  return <button onClick={onClick}>{count}</button>
}
\`\`\`

点击后 \`count\` 确实加了 1，但**画面不会变**。因为 React 不知道 \`count\` 变了，就没有重新执行这个函数。

## useState 登场

\`\`\`jsx
import {useState} from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
\`\`\`

- \`useState(0)\`：初始值是 0
- 返回值是一个数组：\`[当前值, 设置函数]\`
- 调用 \`setCount\` 时，React 会重新执行组件函数，用新值渲染

## 三条使用守则

1. **只能原地更新，不能修改**：数组/对象要传一个新值，比如 \`setList([...list, item])\`
2. **更新是异步的**：调用 \`setCount\` 后马上读 \`count\`，拿到的还是旧值
3. **Hook 只能在组件顶层调用**，不能放进 \`if\`、循环或普通函数里

## 受控组件小例子

输入框的值由 state 驱动，这就是 “受控”：

\`\`\`jsx
function NameInput() {
  const [name, setName] = useState('')
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}
\`\`\`

本博客的暗色模式开关就是这么实现的：一个 \`mode\` 状态，切换后由 Astryx 的 \`<Theme>\` 组件改变全局配色。`,
  },
  {
    slug: 'vite-react-astryx',
    title: '用 Next.js + Astryx 从零搭一个博客',
    excerpt: '记录这个博客的搭建过程：Next.js App Router、接入 Meta 开源设计系统 Astryx、文章页 SSG 静态生成。',
    date: '2026-11-24',
    readingTime: 6,
    tags: ['Next.js', 'Astryx', '工程'],
    content: `这个博客本身就是一篇教程——它的代码你都能在项目里看到。

## 技术选型

| 角色 | 选择 |
| --- | --- |
| 框架 | Next.js 15（App Router，文章页 SSG） |
| UI 框架 | React 19 |
| 设计系统 | [Astryx](https://github.com/meta/astryx)（Meta 开源） |
| 路由 | Next 文件路由（app/ 目录） |

## 接入 Astryx 只要三步

**1. 安装**

\`\`\`bash
npm install @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
\`\`\`

**2. 引入样式**（\`app/globals.css\`，顺序不能换）

\`\`\`css
@import '@astryxdesign/theme-neutral/fonts.css';
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/theme.css';
\`\`\`

**3. 用 Theme 包住应用**

\`\`\`jsx
// app/providers.jsx（'use client'）
import {Theme} from '@astryxdesign/core/theme'
import {neutralTheme} from '@astryxdesign/theme-neutral/built'

<Theme theme={neutralTheme} mode={mode}>
  {/* 你的应用 */}
</Theme>
\`\`\`

不需要任何构建插件、不需要 PostCSS/Babel 配置——Astryx 直接发布编译好的 CSS。

## 页面跳转

Next.js 用**文件路由**：\`app/projects/[slug]/page.jsx\` 就对应 \`/projects/xxx\`，不需要手写路由表。Astryx 的链接组件默认渲染 \`<a>\` 标签（会整页刷新），用 \`LinkProvider\` 把它们换成 \`next/link\`：

\`\`\`jsx
import Link from 'next/link'
import {LinkProvider} from '@astryxdesign/core/Link'

<LinkProvider component={Link}>{/* 应用 */}</LinkProvider>
\`\`\`

## 文章页 SSG

文章数据是静态的，所以用 \`generateStaticParams\` 在**构建时**把每篇文章渲染成 HTML：

\`\`\`jsx
export function generateStaticParams() {
  return projects.map((p) => ({slug: p.slug}))
}
\`\`\`

好处：首屏快、SEO 友好、不消耗服务器资源。加内容后重新 \`npm run build\` 即可。

## 小结

对新手来说，最舒服的一点是：**HTML/CSS 基础直接复用**，Astryx 提供现成的卡片、导航、排版组件，不用从零写样式。`,
  },
  {
    slug: 'markdown-blog',
    title: '为什么文章正文用 Markdown 写',
    excerpt: 'Markdown 让写文章和写代码一样自然，Astryx 的 Markdown 组件直接把它渲染成漂亮的排版。',
    date: '2026-11-24',
    readingTime: 3,
    tags: ['Markdown', '写作'],
    content: `这个博客的每篇笔记，正文都存在 \`notes.js\` 里，是一段 Markdown 字符串。

## Markdown 是什么

一种纯文本格式，用简单的符号表示排版：

\`\`\`markdown
## 这是一个标题

- 列表项一
- 列表项二

**加粗** 和 *斜体* 也很简单
\`\`\`

## 为什么适合写博客

1. **写作时不用碰鼠标**：全程键盘，不用在编辑器里点来点去
2. **格式即内容**：纯文本，方便版本管理（git diff 看得懂）
3. **一处编写，到处渲染**：同一份文本能渲染成网页、PDF

## 在 React 里渲染

Astryx 提供了 \`<Markdown>\` 组件，直接吃字符串：

\`\`\`jsx
import {Markdown} from '@astryxdesign/core/Markdown'

<Markdown headingLevelStart={2}>{post.content}</Markdown>
\`\`\`

\`headingLevelStart={2}\` 是因为页面标题已经是 \`h1\` 了，正文里的 \`##\` 从二级标题开始，保证页面大纲层级不乱。

## 小结

- 笔记存在 \`src/notes.js\`，加一个对象就是一篇新文章
- 正文用 Markdown 写，由 Astryx 渲染
- 想换编辑器，任何支持 Markdown 的都可以（VS Code、Typora、Obsidian）`,
  },
]

// 全部笔记用到的标签
export const allNoteTags = [...new Set(notes.flatMap((n) => n.tags))]
