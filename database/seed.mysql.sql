-- ============================================================================
-- 种子数据：把当前 projects.js / notes.js 的内容导入数据库
-- 在 database/schema.mysql.sql 之后执行。重复执行不会产生重复数据
-- 由 scripts/generate-seed.mjs 自动生成，请勿手改
-- ============================================================================

INSERT INTO projects
  (slug, name, tagline, year, status, stack, featured, icon, demo_url, repo_url, content)
VALUES
  ('astryx-blog', '这个博客本身', '用 Next.js + React + Astryx 从零搭的个人站点：作品展示、技术笔记、SSG 静态生成、7 套主题、全局搜索。', '2026', '进行中', JSON_ARRAY('Next.js', 'React', 'Astryx'), 1, 'wrench', NULL, NULL, '## 为什么做它

学 React 一段时间后，想有一个真正属于自己的地方：既能晒做过的项目和玩意，又能写学习笔记。市面上的模板要么太重要么太素，干脆自己搭一个。

## 做了什么

- **作品和笔记双内容线**：首页突出项目，笔记退居二线但保持完整
- **7 套主题实时切换**：Astryx 官方主题，选择存 localStorage
- **Ctrl/⌘+K 全局搜索**：CommandPalette 对话框，搜标题和标签
- **文章页体验**：阅读进度条、右侧悬浮目录、上一篇/下一篇

## 技术要点

主题切换是最有意思的部分。每套主题的 CSS 按 `data-astryx-theme` 属性隔离，同时引入互不冲突：

```css
/* index.css：7 套主题的 CSS 一起引入 */
@import ''@astryxdesign/theme-neutral/theme.css'';
@import ''@astryxdesign/theme-gothic/theme.css'';
/* ... */
```

```jsx
// 切换时只需要换 <Theme> 的 theme 对象
<Theme theme={themeMap[themeName]} mode={mode}>
```

搜索面板用 `createStaticSource` 提供数据源，选中后通过 `onValueChange` 跳转。

## 踩坑与收获

- **Card 不是万能的**：Astryx 文档反复强调 Card 只用于“独立可移除的物品”，页面分区要用 Section，照做之后层级反而更清晰
- **Hook 顺序**：曾经把 useEffect 写在“文章不存在就 return”的分支后面，直接报错——所有 Hook 必须在组件顶层，后来拆出了 PostContent 子组件
- **Markdown 标题锚点**：目录能跳转的前提是给 Markdown 传 `createMarkdownHeadingLinks()` 插件，而且 Outline 的 hook 要传同一个插件实例

## 下一步

给项目页加封面图、把数据挪到 Markdown 文件里、接一个访问统计。'),
  ('pixel-weather', '像素天气桌面小组件', '一块 240×240 的像素风天气看板，放在桌面上，数据来自公开天气 API。', '2025', '已完成', JSON_ARRAY('React', 'Canvas', 'Node.js'), 0, 'viewColumns', NULL, NULL, '## 起因

喜欢像素风，又嫌弃系统自带的天气插件信息密度低。干脆自己写一个：一个正方形窗口，固定大小，永远置顶，一眼看完天气。

## 做了什么

- 240×240 的固定窗口，像素字体 + 手绘像素图标
- 当前温度、体感、未来 6 小时预报、降水概率条
- 整点自动刷新，失败时显示“数据走丢了”像素小人
- 数据来自公开天气 API，Node 小服务做中转和缓存

## 技术要点

天气图标全是手绘的 16×16 像素图，在 Canvas 里按 `imageSmoothingEnabled = false` 放大，保持锐利边缘：

```js
ctx.imageSmoothingEnabled = false
ctx.drawImage(sprite, sx, sy, 16, 16, 0, 0, 240, 240)
```

React 负责 UI 和状态，Canvas 只负责画像素层，两者通过 ref 通信，避免每帧重渲染。

## 踩坑与收获

- 一开始把天气数据塞进 React state 每分钟全量重渲染，界面会规律性卡一下——后来改成 Canvas 自己按帧画，React 只在数据变化时更新
- 学会了用 `devicePixelRatio` 处理高分屏，像素风在高分屏上必须按整数倍缩放，否则图标发虚'),
  ('cli-todo', '命令行待办 todo', '一个不用鼠标的待办工具：终端里增删改查，数据存本地 JSON。', '2025', '已完成', JSON_ARRAY('Node.js', 'TypeScript'), 0, 'checkDouble', NULL, NULL, '## 起因

写代码的时候不想切到别的窗口记待办。命令行才是写代码时的家，那就把待办搬进终端。

## 做了什么

- `todo add "改博客暗色模式"`、`todo done 3`、`todo ls` 几个子命令
- 支持优先级、标签、截止日期
- 彩色终端输出，完成的任务划掉置灰
- 数据存在 `~/.todo.json`，无依赖、无网络

## 技术要点

整个工具只有一个文件，用 Node 内置的 `readline` 解析参数，自己实现了迷你参数解析器（拒绝引入一整个框架）：

```js
const [command, ...rest] = process.argv.slice(2)
switch (command) {
  case ''add'': return addTask(rest.join('' ''))
  case ''done'': return doneTask(Number(rest[0]))
  // ...
}
```

## 踩坑与收获

- 第一次写 CLI 不知道要处理 `SIGINT`，Ctrl+C 直接把没写完的 JSON 文件破坏了——学会了先写临时文件再原子重命名
- 明白了“小工具也是产品”：输出对齐、错误提示友好，这些细节决定了愿不愿意天天用它'),
  ('keyboard-trainer', '键盘指法练习', '一个帮自己摆脱“二指禅”的网页小工具，实时高亮该按哪个键。', '2024', '已归档', JSON_ARRAY('JavaScript', 'CSS'), 0, 'stop', NULL, NULL, '## 起因

看室友打字飞快，羡慕。试了几个在线练习网站，不是要登录就是广告太多，自己写一个干净的。

## 做了什么

- 虚拟键盘实时高亮下一个该按的键
- 统计 WPM（每分钟词数）和准确率
- 常用词库 + 代码片段两种练习模式
- 纯静态页面，无依赖

## 技术要点

键盘高亮本质是一个状态机：每个词元对应期望按键，监听 `keydown` 后推进状态、计算准确率：

```js
document.addEventListener(''keydown'', (e) => {
  if (e.key === expectedKey) {
    advance()
  } else {
    recordMistake(e.key)
  }
})
```

## 踩坑与收获

- 忽略了 `e.preventDefault()`，按空格键页面会滚动——从此记住表单和键盘交互里该拦 default 的一个不能少
- 这是第一个“从想法到上线”的完整小项目，虽然代码现在看很糙，但建立了“我能做出来”的信心'),
  ('markdown-notes', '本地 Markdown 笔记器', '双栏编辑器：左边写 Markdown，右边实时预览，文件都在本地。', '2024', '进行中', JSON_ARRAY('React', 'Vite', 'marked'), 0, 'menu', NULL, NULL, '## 起因

用了一段时间云端笔记，开始担心数据和隐私。想要一个够简单、数据在自己手里的笔记工具。

## 做了什么

- 双栏布局：左编辑右预览，滚动同步
- 文件树管理笔记，全部存本地文件夹
- 支持代码块高亮和图片粘贴
- 深色模式

## 技术要点

预览用 marked 解析 Markdown，自己包了一层渲染组件，给标题加锚点、给外链加图标。滚动同步用比例映射：编辑器滚了 50%，预览也滚 50%——简单但够用。

## 踩坑与收获

- 比例同步在“一边长一边短”的场景会漂移，后来改成按可见区块对齐，复杂但正确
- 深刻体会到“本地优先”应用的难点：文件监听、冲突处理、大文件性能，每一个都不简单

## 下一步

接入文件系统 API 实现真正的文件夹读写，替换掉现在的内存存储。')
ON DUPLICATE KEY UPDATE name = VALUES(name), updated_at = CURRENT_TIMESTAMP;

INSERT INTO notes
  (slug, title, excerpt, date, reading_time, tags, content)
VALUES
  ('hello-react', 'React 新手第一天：JSX 到底是什么', 'JSX 看起来像 HTML，其实是 JavaScript 的语法扩展。这篇文章用最小例子讲清楚它到底发生了什么。', '2026-11-20', 4, JSON_ARRAY('React', '入门'), '很多人第一次写 React，都会被 `JSX` 搞糊涂：这到底是 HTML 还是 JavaScript？

答案：**它是 JavaScript**。JSX 只是给 “创建元素” 这行代码换了一种写法。

## 没有 JSX 的时候

React 底层有一个叫 `createElement` 的函数，长这样：

```jsx
const title = React.createElement(''h1'', null, ''你好，React'')
```

每次写页面都这样写，很快就没法读了，于是有了 JSX：

```jsx
const title = <h1>你好，React</h1>
```

两行代码**完全等价**。构建工具（本项目用 Next.js 内置的编译器）会把 JSX “翻译” 成 `createElement` 调用。

## 三条最容易踩的规则

1. `class` 要写成 `className`，因为 `class` 是 JavaScript 保留字
2. 只能有一个根元素，多个元素要用 `<></>`（Fragment）包起来
3. 属性里要写动态值，用花括号：`<img src={url} />`

## 花括号里能放什么

凡是 JavaScript 表达式都能放进花括号：

```jsx
const name = ''Alex''
const el = <p>你好，{name}，今天是 {new Date().getFullYear()} 年</p>
```

记住 “表达式” 这个词：`if/else`、`for` 这种语句不能直接放进去，要用三元运算符或者 map。

## 小结

- JSX 是 `createElement` 的语法糖
- 由构建工具在构建时编译，浏览器根本不认识 JSX
- 花括号是 “从 JSX 回到 JavaScript 世界” 的大门

下一篇会讲 `useState`——让页面 “动” 起来的第一个 Hook。'),
  ('usestate-intro', 'useState 入门：让页面记住事情', '普通变量一刷新就忘了，useState 让组件自己记住状态，状态一变，页面自动重新渲染。', '2026-11-22', 5, JSON_ARRAY('React', 'Hooks'), 'React 组件本质是一个函数：输入 props，输出 JSX。但页面需要 “记忆” 时怎么办？比如一个计数器。

## 为什么普通变量不行

```jsx
function Counter() {
  let count = 0
  const onClick = () => {
    count = count + 1
    console.log(count) // 数字确实变了
  }
  return <button onClick={onClick}>{count}</button>
}
```

点击后 `count` 确实加了 1，但**画面不会变**。因为 React 不知道 `count` 变了，就没有重新执行这个函数。

## useState 登场

```jsx
import {useState} from ''react''

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

- `useState(0)`：初始值是 0
- 返回值是一个数组：`[当前值, 设置函数]`
- 调用 `setCount` 时，React 会重新执行组件函数，用新值渲染

## 三条使用守则

1. **只能原地更新，不能修改**：数组/对象要传一个新值，比如 `setList([...list, item])`
2. **更新是异步的**：调用 `setCount` 后马上读 `count`，拿到的还是旧值
3. **Hook 只能在组件顶层调用**，不能放进 `if`、循环或普通函数里

## 受控组件小例子

输入框的值由 state 驱动，这就是 “受控”：

```jsx
function NameInput() {
  const [name, setName] = useState('''')
  return <input value={name} onChange={(e) => setName(e.target.value)} />
}
```

本博客的暗色模式开关就是这么实现的：一个 `mode` 状态，切换后由 Astryx 的 `<Theme>` 组件改变全局配色。'),
  ('vite-react-astryx', '用 Next.js + Astryx 从零搭一个博客', '记录这个博客的搭建过程：Next.js App Router、接入 Meta 开源设计系统 Astryx、文章页 SSG 静态生成。', '2026-11-24', 6, JSON_ARRAY('Next.js', 'Astryx', '工程'), '这个博客本身就是一篇教程——它的代码你都能在项目里看到。

## 技术选型

| 角色 | 选择 |
| --- | --- |
| 框架 | Next.js 15（App Router，文章页 SSG） |
| UI 框架 | React 19 |
| 设计系统 | [Astryx](https://github.com/meta/astryx)（Meta 开源） |
| 路由 | Next 文件路由（app/ 目录） |

## 接入 Astryx 只要三步

**1. 安装**

```bash
npm install @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
```

**2. 引入样式**（`app/globals.css`，顺序不能换）

```css
@import ''@astryxdesign/theme-neutral/fonts.css'';
@import ''@astryxdesign/core/reset.css'';
@import ''@astryxdesign/core/astryx.css'';
@import ''@astryxdesign/theme-neutral/theme.css'';
```

**3. 用 Theme 包住应用**

```jsx
// app/providers.jsx（''use client''）
import {Theme} from ''@astryxdesign/core/theme''
import {neutralTheme} from ''@astryxdesign/theme-neutral/built''

<Theme theme={neutralTheme} mode={mode}>
  {/* 你的应用 */}
</Theme>
```

不需要任何构建插件、不需要 PostCSS/Babel 配置——Astryx 直接发布编译好的 CSS。

## 页面跳转

Next.js 用**文件路由**：`app/projects/[slug]/page.jsx` 就对应 `/projects/xxx`，不需要手写路由表。Astryx 的链接组件默认渲染 `<a>` 标签（会整页刷新），用 `LinkProvider` 把它们换成 `next/link`：

```jsx
import Link from ''next/link''
import {LinkProvider} from ''@astryxdesign/core/Link''

<LinkProvider component={Link}>{/* 应用 */}</LinkProvider>
```

## 文章页 SSG

文章数据是静态的，所以用 `generateStaticParams` 在**构建时**把每篇文章渲染成 HTML：

```jsx
export function generateStaticParams() {
  return projects.map((p) => ({slug: p.slug}))
}
```

好处：首屏快、SEO 友好、不消耗服务器资源。加内容后重新 `npm run build` 即可。

## 小结

对新手来说，最舒服的一点是：**HTML/CSS 基础直接复用**，Astryx 提供现成的卡片、导航、排版组件，不用从零写样式。'),
  ('markdown-blog', '为什么文章正文用 Markdown 写', 'Markdown 让写文章和写代码一样自然，Astryx 的 Markdown 组件直接把它渲染成漂亮的排版。', '2026-11-24', 3, JSON_ARRAY('Markdown', '写作'), '这个博客的每篇笔记，正文都存在 `notes.js` 里，是一段 Markdown 字符串。

## Markdown 是什么

一种纯文本格式，用简单的符号表示排版：

```markdown
## 这是一个标题

- 列表项一
- 列表项二

**加粗** 和 *斜体* 也很简单
```

## 为什么适合写博客

1. **写作时不用碰鼠标**：全程键盘，不用在编辑器里点来点去
2. **格式即内容**：纯文本，方便版本管理（git diff 看得懂）
3. **一处编写，到处渲染**：同一份文本能渲染成网页、PDF

## 在 React 里渲染

Astryx 提供了 `<Markdown>` 组件，直接吃字符串：

```jsx
import {Markdown} from ''@astryxdesign/core/Markdown''

<Markdown headingLevelStart={2}>{post.content}</Markdown>
```

`headingLevelStart={2}` 是因为页面标题已经是 `h1` 了，正文里的 `##` 从二级标题开始，保证页面大纲层级不乱。

## 小结

- 笔记存在 `src/notes.js`，加一个对象就是一篇新文章
- 正文用 Markdown 写，由 Astryx 渲染
- 想换编辑器，任何支持 Markdown 的都可以（VS Code、Typora、Obsidian）')
ON DUPLICATE KEY UPDATE title = VALUES(title), updated_at = CURRENT_TIMESTAMP;
