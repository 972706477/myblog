// 做过的项目和“玩意”。想展示新项目，在这里加一个对象即可。
//
// 字段说明：
//   slug     网址后缀：/projects/<slug>
//   icon     封面图标，只能用 astryx 语义图标名（见 node_modules 里 Icon 文档）
//   status   进行中 / 已完成 / 已归档（决定徽章颜色）
//   stack    技术栈，显示成标签
//   featured true 时在首页和列表页以更大卡片展示
//   demoUrl / repoUrl  演示和仓库地址，没有就留 null（页面上不会显示对应按钮）
export const projects = [
  {
    slug: 'astryx-blog',
    name: '这个博客本身',
    tagline: '用 Next.js + React + Astryx 从零搭的个人站点：作品展示、技术笔记、SSG 静态生成、7 套主题、全局搜索。',
    year: '2026',
    status: '进行中',
    stack: ['Next.js', 'React', 'Astryx'],
    featured: true,
    icon: 'wrench',
    demoUrl: null,
    repoUrl: null,
    content: `## 为什么做它

学 React 一段时间后，想有一个真正属于自己的地方：既能晒做过的项目和玩意，又能写学习笔记。市面上的模板要么太重要么太素，干脆自己搭一个。

## 做了什么

- **作品和笔记双内容线**：首页突出项目，笔记退居二线但保持完整
- **7 套主题实时切换**：Astryx 官方主题，选择存 localStorage
- **Ctrl/⌘+K 全局搜索**：CommandPalette 对话框，搜标题和标签
- **文章页体验**：阅读进度条、右侧悬浮目录、上一篇/下一篇

## 技术要点

主题切换是最有意思的部分。每套主题的 CSS 按 \`data-astryx-theme\` 属性隔离，同时引入互不冲突：

\`\`\`css
/* index.css：7 套主题的 CSS 一起引入 */
@import '@astryxdesign/theme-neutral/theme.css';
@import '@astryxdesign/theme-gothic/theme.css';
/* ... */
\`\`\`

\`\`\`jsx
// 切换时只需要换 <Theme> 的 theme 对象
<Theme theme={themeMap[themeName]} mode={mode}>
\`\`\`

搜索面板用 \`createStaticSource\` 提供数据源，选中后通过 \`onValueChange\` 跳转。

## 踩坑与收获

- **Card 不是万能的**：Astryx 文档反复强调 Card 只用于“独立可移除的物品”，页面分区要用 Section，照做之后层级反而更清晰
- **Hook 顺序**：曾经把 useEffect 写在“文章不存在就 return”的分支后面，直接报错——所有 Hook 必须在组件顶层，后来拆出了 PostContent 子组件
- **Markdown 标题锚点**：目录能跳转的前提是给 Markdown 传 \`createMarkdownHeadingLinks()\` 插件，而且 Outline 的 hook 要传同一个插件实例

## 下一步

给项目页加封面图、把数据挪到 Markdown 文件里、接一个访问统计。`,
  },
  {
    slug: 'pixel-weather',
    name: '像素天气桌面小组件',
    tagline: '一块 240×240 的像素风天气看板，放在桌面上，数据来自公开天气 API。',
    year: '2025',
    status: '已完成',
    stack: ['React', 'Canvas', 'Node.js'],
    featured: false,
    icon: 'viewColumns',
    demoUrl: null,
    repoUrl: null,
    content: `## 起因

喜欢像素风，又嫌弃系统自带的天气插件信息密度低。干脆自己写一个：一个正方形窗口，固定大小，永远置顶，一眼看完天气。

## 做了什么

- 240×240 的固定窗口，像素字体 + 手绘像素图标
- 当前温度、体感、未来 6 小时预报、降水概率条
- 整点自动刷新，失败时显示“数据走丢了”像素小人
- 数据来自公开天气 API，Node 小服务做中转和缓存

## 技术要点

天气图标全是手绘的 16×16 像素图，在 Canvas 里按 \`imageSmoothingEnabled = false\` 放大，保持锐利边缘：

\`\`\`js
ctx.imageSmoothingEnabled = false
ctx.drawImage(sprite, sx, sy, 16, 16, 0, 0, 240, 240)
\`\`\`

React 负责 UI 和状态，Canvas 只负责画像素层，两者通过 ref 通信，避免每帧重渲染。

## 踩坑与收获

- 一开始把天气数据塞进 React state 每分钟全量重渲染，界面会规律性卡一下——后来改成 Canvas 自己按帧画，React 只在数据变化时更新
- 学会了用 \`devicePixelRatio\` 处理高分屏，像素风在高分屏上必须按整数倍缩放，否则图标发虚`,
  },
  {
    slug: 'cli-todo',
    name: '命令行待办 todo',
    tagline: '一个不用鼠标的待办工具：终端里增删改查，数据存本地 JSON。',
    year: '2025',
    status: '已完成',
    stack: ['Node.js', 'TypeScript'],
    featured: false,
    icon: 'checkDouble',
    demoUrl: null,
    repoUrl: null,
    content: `## 起因

写代码的时候不想切到别的窗口记待办。命令行才是写代码时的家，那就把待办搬进终端。

## 做了什么

- \`todo add "改博客暗色模式"\`、\`todo done 3\`、\`todo ls\` 几个子命令
- 支持优先级、标签、截止日期
- 彩色终端输出，完成的任务划掉置灰
- 数据存在 \`~/.todo.json\`，无依赖、无网络

## 技术要点

整个工具只有一个文件，用 Node 内置的 \`readline\` 解析参数，自己实现了迷你参数解析器（拒绝引入一整个框架）：

\`\`\`js
const [command, ...rest] = process.argv.slice(2)
switch (command) {
  case 'add': return addTask(rest.join(' '))
  case 'done': return doneTask(Number(rest[0]))
  // ...
}
\`\`\`

## 踩坑与收获

- 第一次写 CLI 不知道要处理 \`SIGINT\`，Ctrl+C 直接把没写完的 JSON 文件破坏了——学会了先写临时文件再原子重命名
- 明白了“小工具也是产品”：输出对齐、错误提示友好，这些细节决定了愿不愿意天天用它`,
  },
  {
    slug: 'keyboard-trainer',
    name: '键盘指法练习',
    tagline: '一个帮自己摆脱“二指禅”的网页小工具，实时高亮该按哪个键。',
    year: '2024',
    status: '已归档',
    stack: ['JavaScript', 'CSS'],
    featured: false,
    icon: 'stop',
    demoUrl: null,
    repoUrl: null,
    content: `## 起因

看室友打字飞快，羡慕。试了几个在线练习网站，不是要登录就是广告太多，自己写一个干净的。

## 做了什么

- 虚拟键盘实时高亮下一个该按的键
- 统计 WPM（每分钟词数）和准确率
- 常用词库 + 代码片段两种练习模式
- 纯静态页面，无依赖

## 技术要点

键盘高亮本质是一个状态机：每个词元对应期望按键，监听 \`keydown\` 后推进状态、计算准确率：

\`\`\`js
document.addEventListener('keydown', (e) => {
  if (e.key === expectedKey) {
    advance()
  } else {
    recordMistake(e.key)
  }
})
\`\`\`

## 踩坑与收获

- 忽略了 \`e.preventDefault()\`，按空格键页面会滚动——从此记住表单和键盘交互里该拦 default 的一个不能少
- 这是第一个“从想法到上线”的完整小项目，虽然代码现在看很糙，但建立了“我能做出来”的信心`,
  },
  {
    slug: 'markdown-notes',
    name: '本地 Markdown 笔记器',
    tagline: '双栏编辑器：左边写 Markdown，右边实时预览，文件都在本地。',
    year: '2024',
    status: '进行中',
    stack: ['React', 'Vite', 'marked'],
    featured: false,
    icon: 'menu',
    demoUrl: null,
    repoUrl: null,
    content: `## 起因

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

接入文件系统 API 实现真正的文件夹读写，替换掉现在的内存存储。`,
  },
]

// 全部项目用到的标签
export const allProjectTags = [...new Set(projects.flatMap((p) => p.stack))]
