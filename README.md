# 我的个人博客

用 **Next.js 15 + React 19 + Astryx**（Meta 开源设计系统）搭建的个人站点，**以作品展示为主、技术笔记为辅**，文章页使用 **SSG（静态生成）**。

功能：作品集（项目卡片 + 详情页）、技术笔记（列表 + 详情页）、关于页、暗色模式、响应式布局、**7 套主题实时切换**、**Ctrl/⌘+K 全局搜索**、**详情页悬浮目录 + 阅读进度条**、**发布后台**。

## 环境要求

- Node.js **20.19+**（推荐 22 LTS）
- npm（随 Node 自带）

## 快速开始

```bash
# 1. 进入项目目录
cd E:\reacttest

# 2. 安装依赖（第一次需要，以后不用）
npm install

# 3. 启动开发服务器
npm run dev
```

启动后，浏览器打开终端里提示的地址（默认 **http://localhost:3000**）就能看到博客。

修改代码保存后，页面会自动热更新，不用手动刷新。想停止服务器，在终端按 `Ctrl + C`。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（写代码时用这个） |
| `npm run build` | 生产构建：文章页全部预渲染成静态 HTML 到 `.next/` |
| `npm start` | 运行生产构建（先 build 再 start） |

## 目录结构（Next.js App Router）

```
E:\reacttest\
├── app/                    Next.js 路由（文件即路由）
│   ├── layout.jsx          根布局（html/body + 全局 Provider）
│   ├── providers.jsx       主题 + 链接 Provider（'use client'）
│   ├── globals.css         Astryx 样式引入（含 7 套主题）
│   ├── not-found.jsx       404 页
│   ├── (site)/             公共站点（路由组，不影响网址）
│   │   ├── layout.jsx      站点外壳：导航 + 页脚
│   │   ├── page.jsx        首页
│   │   ├── projects/       作品列表 + [slug] 详情（SSG）
│   │   ├── notes/          笔记列表 + [slug] 详情（SSG）
│   │   └── about/          关于页
│   └── admin/              发布后台
│       ├── login/          登录页
│       └── (panel)/        后台面板（带登录守卫）
│           ├── layout.jsx  侧边导航 + 守卫
│           ├── page.jsx    仪表盘
│           ├── projects/   项目管理 + 编辑器
│           ├── notes/      笔记管理 + 编辑器
│           └── settings/   站点设置
├── components/             共享组件（导航、卡片、详情页、编辑器…）
├── lib\
│   └── api.js              ★ 数据层：后台所有读写走这里（换后端只改这个文件）
├── database\
│   ├── schema.mysql.sql    数据库结构（MySQL 三张表）
│   └── seed.mysql.sql      种子数据（由 scripts 生成）
├── scripts\
│   └── generate-seed.mjs   从数据文件重新生成 seed.mysql.sql
├── projects.js             ★ 所有项目都在这里（SSG 构建时读取）
├── notes.js                ★ 所有笔记都在这里（SSG 构建时读取）
├── author.js               作者和站点信息
├── themes.js               7 套 Astryx 主题的注册表
├── next.config.mjs         Next 配置（转译 Astryx 包）
└── jsconfig.json           @ 路径别名配置
```

## SSG 是怎么工作的

文章页（`/projects/[slug]`、`/notes/[slug]`）在**构建时**生成静态 HTML：

```jsx
// app/(site)/projects/[slug]/page.jsx
export function generateStaticParams() {
  return projects.map((p) => ({slug: p.slug}))   // 构建时为每个项目生成一页
}
```

好处：用户访问时服务器直接返回现成的 HTML（首屏快、SEO 友好、不消耗服务器资源）。
在 `projects.js` / `notes.js` 里加内容 → 重新 `npm run build` → 新页面自动生成。

## 页面规划

| 网址 | 内容 |
| --- | --- |
| `/` | 个人介绍 + 置顶项目大卡 + 其他作品 + 最新 4 篇笔记 |
| `/projects` | 全部作品，按技术栈筛选 |
| `/projects/<slug>` | 项目详情：背景/技术点/踩坑 + 右侧信息栏 + 目录 |
| `/notes` | 全部笔记，按标签筛选 |
| `/notes/<slug>` | 笔记详情：正文 + 悬浮目录 + 阅读进度 |
| `/about` | 关于我 |

## 怎么发内容

**发项目**：打开 `projects.js`（项目根目录），加一个对象：

\`\`\`js
{
  slug: 'my-project',        // 网址后缀：/projects/my-project
  name: '项目名',
  tagline: '一句话介绍',
  year: '2026',
  status: '已完成',           // 进行中 / 已完成 / 已归档
  stack: ['React', 'Vite'],  // 技术栈标签
  featured: false,           // true = 首页置顶大卡
  icon: 'wrench',            // 封面图标（astryx 语义图标名）
  demoUrl: null,             // 演示地址，没有就留 null
  repoUrl: null,             // 仓库地址，没有就留 null
  content: `正文，Markdown 格式`,
}
\`\`\`

**发笔记**：打开 `notes.js`（项目根目录），同样加一个对象（slug/title/excerpt/date/readingTime/tags/content）。

> 当前项目和笔记都是**示例数据**，记得换成你自己的内容。

## 怎么换主题

Astryx 自带 7 套主题，导航栏右侧的下拉框可以**实时切换**，选择会保存在浏览器里：

`neutral`（默认）、`butter`、`chocolate`、`matcha`、`stone`、`gothic`、`y2k`

原理：每套主题的 CSS 按 `data-astryx-theme` 属性隔离（见 `src/index.css`），
`<Theme>` 组件切换主题对象时切换这个属性，整站配色、圆角、字体一起变。
主题注册表在 `src/themes.js`，想调整默认主题或顺序改这里。

## 快捷键

| 快捷键 | 作用 |
| --- | --- |
| `Ctrl + K` / `⌘ + K` | 打开全局搜索面板（搜文章标题、标签、页面） |

## 学习资料

- [React 官方教程（中文）](https://zh-hans.react.dev/learn)
- [Vite 官方文档](https://cn.vitejs.dev/)
- [Astryx GitHub 仓库](https://github.com/meta/astryx)
- [Astryx 官方文档与组件示例](https://astryx.atmeta.com)

## 发布后台（/admin）

配套的内容管理后台。**导航栏不展示入口**，直接访问地址进入（演示模式：任意账号密码可登录）：

- 本地开发：**http://localhost:3000/admin**
- 部署后：`https://你的域名/admin`

| 页面 | 功能 |
| --- | --- |
| `/admin/login` | 登录（演示模式任意账号密码） |
| `/admin` | 仪表盘：项目/笔记统计、最近内容、快捷操作 |
| `/admin/projects` | 项目管理表格（新建/编辑/删除） |
| `/admin/projects/new` · `/admin/projects/:slug` | 项目编辑器：表单 + Markdown 实时预览 |
| `/admin/notes` · 编辑器 | 笔记管理，同上 |
| `/admin/settings` | 站点设置 + 重置演示数据 |

### 数据流（已接好，按下面步骤启用）

```
后台保存 → POST /api/projects → lib/db.js → MySQL（宝塔）
前台页面 → lib/data.js → MySQL（构建时查询，SSG 预渲染）
                  └→ 没配数据库时自动退回 projects.js / notes.js 静态文件
```

**涉及的文件：**

| 文件 | 职责 |
|---|---|
| `lib/db.js` | MySQL 连接池 + 所有增删改查 |
| `lib/data.js` | 统一读取：优先数据库，未配置时退回静态文件（前台 SSG 和公开 GET 接口用） |
| `lib/auth.js` | 登录 token 签发与校验（HMAC，无额外依赖） |
| `lib/api.js` | 后台前端 ↔ `/api/*` 的所有请求 |
| `app/api/**` | Next.js 自带的后端接口（读公开、写要登录） |
| `database/*.sql` | 建表脚本 + 种子数据 |

**启用步骤（在服务器上操作）：**

1. 宝塔 → 数据库 → 添加数据库（记下库名、用户名、密码）
2. phpMyAdmin 导入 `database/schema.mysql.sql`，再导入 `database/seed.mysql.sql`
3. 复制 `.env.example` 为 `.env.local`，填数据库连接、`ADMIN_PASSWORD`（后台登录密码）、`ADMIN_SECRET`（随机长字符串）
4. `npm run build && bash scripts/deploy.sh`（详见下方「部署到自己的服务器」）

本地开发不需要配 `.env.local`：前台自动使用静态文件数据，功能完整；只有后台保存需要数据库。

## 备注

- 前台是 SSG：内容更新后需要重新 `npm run build` 才能生效（后台保存 → 重新构建 → 上线）
- 没配 `.env.local` 时前台使用静态文件数据（`projects.js` / `notes.js`），后台无法保存
- 项目里的 `astryx init` 命令（Astryx 官方推荐的初始化步骤）需要 Node.js 22.13+，且只会在项目里生成一份给 AI 助手看的指南文件，**不影响博客运行**，可跳过。

## 部署到自己的服务器（宝塔）

采用“本地开发 + 服务器部署”模式：本地不连数据库（自动用静态文件数据），数据库只在服务器上启用。

**服务器一次性配置：**

```bash
# 1. 宝塔 → 软件商店 → 安装「Node 项目」（选 Node 20+）和 PM2 管理器
# 2. 拉取代码（仓库已推送到 GitHub）
cd /www/wwwroot
git clone https://github.com/你的用户名/myblog.git
cd myblog

# 3. 创建环境配置（数据库填宝塔里建的那个，注意 DB_HOST 用 127.0.0.1）
cp .env.example .env.local
nano .env.local        # 填 DB_* 四项 + ADMIN_PASSWORD + ADMIN_SECRET，保存退出

# 4. 数据库导入（如果还没导）：phpMyAdmin → 选中库 → 导入 schema.mysql.sql → 再导 seed.mysql.sql
#    或者用命令行：mysql -u blog -p blog < database/schema.mysql.sql

# 5. 安装 pm2（宝塔 PM2 管理器会自动装；没有就手动）
npm i -g pm2

# 6. 构建并启动
npm install
npm run build          # SSG 页面在构建时查库，.env.local 必须已配好
bash scripts/deploy.sh # 之后每次更新代码，跑这个脚本即可（拉取→构建→重启）
```

**绑定域名：** 宝塔 → 网站 → 添加站点（PHP 版本选“纯静态”）→ 站点设置 → 反向代理 → 目标 URL 填 `http://127.0.0.1:3000`。之后访问域名即可，后台在 `https://你的域名/admin`。

> 本地开发不需要配 `.env.local` 的数据库部分——注释掉即可，程序自动使用静态文件数据。

## 自动化部署（GitHub Actions）

代码里已带 `.github/workflows/deploy.yml`：**每次 `git push` 到 main 分支，GitHub 会自动 SSH 上服务器，拉代码 → 装依赖 → 构建 → 重启**。配置一次，以后部署就是 `git push` 一条命令。

**一次性设置（3 步）：**

1. **生成部署专用密钥**（在服务器上执行）：
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""
   cat ~/.ssh/authorized_keys >> /dev/null  # 确保目录存在
   cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys
   cat ~/.ssh/deploy_key   # 复制输出的私钥内容
   ```
2. **在 GitHub 配 Secrets**：仓库 → Settings → Secrets and variables → Actions → New repository secret，添加：
   - `SERVER_HOST` = 服务器公网 IP
   - `SERVER_USER` = `root`
   - `SERVER_SSH_KEY` = 上一步复制的私钥全文
   - `SERVER_PORT` = SSH 端口（宝塔默认 22，改过才需要填）
   - `SERVER_PATH` = 项目目录（默认 `/www/wwwroot/myblog`，不一样才需要填）
3. **推送代码**：`git push` —— GitHub 仓库页面的 Actions 标签页能看到部署日志，绿色勾就是成功。

> 免费额度：公开仓库无限次，私有仓库每月 2000 分钟——个人博客永远用不完。
> `.env.local` 在服务器上本地保管，流水线不会碰它，密码不会外泄。
