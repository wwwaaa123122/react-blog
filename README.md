# React Blog · 星辰旅人

基于 **React 19 API + Vite 8 + TypeScript** 重写的个人博客（运行时是 Preact 11 的 compat 兼容层），内容与数据来源于原仓库 Firefly（Fuwari/Astro 主题）。

## 页面与功能

| 路由 | 说明 |
| --- | --- |
| `/` | 首页：个人资料（头像 / 名字 / 签名 / 社交链接 / 站点统计）+ 最新文章 |
| `/posts` | 文章列表：关键词搜索、分类/标签筛选、分页（状态可分享到 URL） |
| `/posts/:slug` | 文章详情：Markdown 渲染、代码高亮、目录、阅读时间 |
| `/friends` | 友链：友链卡片（头像/描述/标签）、本站信息（一键复制）、申请模板、注意事项 |
| `/about` | 关于我：自我介绍、联系方式、成年倒计时 |
| `/archive` | 归档：按年份分组 |
| `/components` | 全组件预览：shadcn/ui 组件库每个组件一格（不在导航中，直接访问） |
| `*` | 404 页面 |

### 其它特性
- 🌗 默认跟随系统的亮 / 暗主题切换（记忆偏好，可手动固定亮色或深色）
- 🔍 全文搜索 + 🏷️ 分类/标签筛选 + 分页（搜索与页码同步到 URL）
- 📖 文章目录（TOC）、滚动高亮、阅读时长、字数统计
- ⬆️ 回到顶部、响应式移动端菜单
- 📋 代码块语法高亮 + 一键复制
- 🖼️ 图片路径自动重写（`../images/` → `/images/`）

## 技术栈
Preact 11（`preact/compat`，源码按 React 19 API 编写）· 自研极简路由 · **shadcn/ui + Tailwind v4 + Radix UI** · react-markdown + remark-gfm + rehype-highlight（仅构建期）· Vite 8 · TypeScript

### UI 组件库（shadcn/ui）

界面全部由 shadcn/ui 组件搭建，不使用手写的样式型控件：

- 组件源码统一放在 `src/components/ui/`（rdx-nova 风格，`components.json` 中 `style: radix-nova`），
  页面只负责组合，不再自己拼装按钮、卡片、表单控件；
- 主题走 shadcn 官方推荐方案：`next-themes` 的 `ThemeProvider`（`src/components/theme-provider.tsx`）
  切换 `<html class="dark">`，配色 token 定义在 `src/index.css`（亮/暗双套）；
- 反馈统一用 Sonner（`toast`），浮层统一用 Dialog/Sheet/Drawer/Popover/Tooltip；
- 文章正文的提示块（`:::warning` 等）与代码块也使用组件库：`Alert` / `Badge` / `Button` / `Separator`；
- `/components` 页面把全部组件按 acofork 风格的「编号 + 网格」逐个预览，
  示例集中在 `src/components/showcase/demos.tsx`；
- 视觉规则以 [`docs/ui-guidelines.md`](docs/ui-guidelines.md) 为唯一口径（颜色/表面、字号层级、
  间距节奏、组件用法、页面骨架、动效）；页面标题、区块标题、小标签、元信息、标签组这五种固定排版角色
  由 `src/components/page.tsx` 的原语（`PageHeader` / `SectionHeading` / `SectionLabel` /
  `MetaRow` / `PostMeta` / `TagList`）提供，页面只做组合，不再各写一套。

组件源码来自官方 registry，由脚本拉取并按本项目规则适配（别名 `@/lib/utils`、
registry 内部导入改写、`IconPlaceholder` 展开为 lucide-react 图标）：

```bash
node scripts/fetch-shadcn.mjs dialog sheet table tabs   # 拉取 / 更新指定组件
```

## 快速开始

```bash
pnpm install
pnpm dev        # 开发服务器 http://localhost:5173
pnpm build      # 生产构建 → dist/
pnpm preview    # 预览生产构建
```

### 文章内容的构建期编译

文章是静态内容，所以 Markdown **不在浏览器里解析**：`pnpm dev` / `pnpm build` 会先运行
`scripts/build-content.mts`，把 `src/posts/*.md` 编译成 `src/generated/` 下的产物（已被 git 忽略）：

| 产物 | 用途 | 谁下载 |
| --- | --- | --- |
| `posts-meta.json` | 标题 / 日期 / 标签 / 字数（约 3 KB） | 所有页面 |
| `posts/<slug>.json` | 单篇正文 HTML + 目录锚点 | 只有该文章的读者 |
| `search-index.json` | 全文搜索文本索引 | 列表页碰搜索框时 |

因此客户端不再需要 `react-markdown` / `remark` / `rehype` / `highlight.js`；代码高亮、目录锚点、
提示卡片都在构建期完成。文章页首屏直接复用预渲染好的 DOM（`primeFromPrerenderedDom`），
站内跳转时才按需下载对应文章的 chunk。

> 改了 Markdown 之后需要重新生成内容：`pnpm content`（或重启 `pnpm dev`）。
> `pnpm typecheck` 也会先补齐这一步。

### 首屏只加载必要的东西

首屏 JS 大约 45 KB（gzip），其中已经没有 react-dom —— 运行时换成了 Preact。几条刻意的取舍：

| 做法 | 位置 | 省下的 |
| --- | --- | --- |
| 运行时换成 Preact 11（`preact/compat` 兼容层） | `vite.config.ts` | 每页约 50 KB gzip（react-dom 整块消失） |
| 自研极简路由（约 360 行，覆盖本站用到的全部 API） | `src/lib/router.tsx` | 每页约 11 KB gzip |
| 手写下拉菜单替代 Radix DropdownMenu | `src/components/ui/menu.tsx` | 约 13 KB，且不再给 `<body>` 注入滚动锁补偿 |
| toast 只在第一次触发时加载 sonner | `src/lib/toast.ts` / `toast-host.tsx` | 约 10 KB |
| 全文索引改为「碰搜索框才下载」 | `src/pages/Posts.tsx` | 不与首屏封面图抢带宽 |

Markdown 渲染链（`react-markdown` / `remark` / `rehype` / `highlight.js`）已经完全不在客户端。

### 为什么运行时是 Preact

`@preact/preset-vite` 在构建时把 `react` / `react-dom` / `react/jsx-runtime` 别名到
`preact/compat`，业务源码仍按 React 19 的写法、用 `@types/react` 做类型检查；预渲染脚本
（`scripts/prerender.tsx`）与 `tsc` 依旧跑在真正的 React 上，互不影响。

- 首屏 JS：94 KB → 45 KB（gzip）；文章页 105 KB → 56 KB；
- 实测 LCP：首页 −21%、列表页 −21%、文章页 −15%（Slow 4G + 4× CPU，7 轮中位数）；
- 代价：Preact 是同步渲染，首屏会压出一个较长的任务（4× CPU 下约 0.6 s），
  TBT 指标比 React 的时间切片高；但总主线程耗时更低，正文（LCP）出现得更早。

两条硬约束，都有自动化兜底：

1. **不要用 React 19 新增 API**（`use` / `useActionState` / `useOptimistic` / `cache` …）：
   类型检查能过，但 Preact compat 没有实现，线上会白屏。ESLint 的
   `no-restricted-syntax` 会在 `pnpm lint` 时直接报错。
2. **Radix 的「集合 + 索引」类组件要单独验证**：Slider 依赖 `useEffect` 注册集合、再按索引
   取 value，而 Preact 在 ref 回调里的 setState 会先于 passive effect 刷新，索引恒为 -1，
   滑块被 `display:none`。`src/components/ui/slider.tsx` 因此改为原生指针 / 键盘实现；
   `scripts/smoke-test.mjs` 会检查 `/components` 里所有滑块的实际尺寸。

## 目录结构

```
src/
├── config/          # 站点、个人资料、友链配置（数据来自 Firefly）
├── lib/             # 文章加载与 frontmatter 解析、主题小工具
├── components/
│   ├── ui/          # shadcn/ui 组件库（唯一样式来源）
│   ├── showcase/    # /components 预览页的示例单元
│   └── ...          # 布局与业务组件（Navbar / Footer / Markdown / Seo …）
├── pages/           # 各路由页面
├── posts/           # Markdown 文章（从 Firefly 迁移）
└── styles/          # 内容排版样式（正文 / 代码高亮）
```

## 截图
见 `docs/screenshots/`（home / posts / post / friends / about / archive）。
## 内容管理（Pages CMS）

本站已接入 [Pages CMS](https://pagescms.org/docs/)（基于 Git 的静态站 CMS），可以**在线编辑文章、个人资料、友链与站点配置**，保存后自动提交到仓库并由 GitHub Actions 重新构建部署。

### 使用方式

1. 直接打开 [app.pagescms.org](https://app.pagescms.org/)（仓库已配置 .pages.yml，无需站内后台页）；
2. 使用 GitHub 登录，并安装 **Pages CMS GitHub App** 到本仓库；
3. 打开仓库，即可看到 `.pages.yml` 中定义的 4 个内容区域：
   - **文章**（`src/posts/*.md`，frontmatter + Markdown 正文，支持上传封面图）
   - **个人资料**（`src/data/profile.json`，首页头像 / 名字 / 签名 / 社交链接）
   - **友链**（`src/data/friends.json`，友链列表 / 本站信息 / 申请模板）
   - **站点配置**（`src/data/site.json`，标题 / 副标题 / 描述等）
4. 编辑并保存，CMS 会提交到仓库，推送触发 `.github/workflows/deploy.yml` 自动构建并部署到 `pages` 分支。

> **头像说明**：顶栏 Logo、首页/关于页头像都读取 `src/data/profile.json` 的 `avatar`（当前为站内 `public/avatar.jpg`，取自 QQ 头像 `https://q2.qlogo.cn/headimg_dl?dst_uin=3385016019&spec=5`）。浏览器图标 `public/favicon.png`、`apple-touch-icon.png`、`favicon.ico` 是同一张头像的静态尺寸版本，更换头像时需要一并替换以保持一致。

> 首次使用需要把仓库推到 GitHub 并安装 Pages CMS GitHub App；若部署到 GitHub Pages，请在仓库 Settings → Pages 中选择 `pages` 分支。
## SEO 与站点文件

构建时（`pnpm build`）自动生成以下文件到 `dist/`：

- **`sitemap.xml`** — 全站 URL 列表（首页 / 列表页 / 每篇文章），含 lastmod、changefreq、priority
- **`llms.txt`** — 遵循 [llmstxt.org](https://llmstxt.org/) 规范，为 LLM 提供站点与文章索引（首页 `<link>` 与页脚均有引用）
- **`robots.txt`** — 允许爬虫抓取并指向 `sitemap.xml`
- **`src/data/cover-sizes.json`** — 构建时由 `scripts/cover-sizes.mjs` 自动解析 `public/` 下封面图尺寸，用于 OG 分享卡片（`og:image:width/height`）与 RSS `media:content` 的尺寸标注

站点基础 URL 取自 `src/data/site.json` 的 `site_url`（默认 `https://xc-lr.cn`），部署到其他域名时修改它后重新构建即可。

页面侧还内置：
- **面包屑导航**（含 schema.org BreadcrumbList JSON-LD）— 文章 / 归档 / 友链 / 关于
- **每页 SEO**（`<title>` / meta description / keywords / canonical）— 由 `Seo` 组件按路由设置
- **结构化数据** — 首页 WebSite（含 SearchAction）、文章页 Article（keywords/articleSection）、关于页 Person JSON-LD
## 部署说明

- **GitHub Pages 子路径部署**：CI（`.github/workflows/deploy.yml`）构建时传入 `VITE_BASE=/react-blog/`（与仓库名一致），产物部署到 `pages` 分支；`404.html` 已内置 SPA fallback，深链（如 `/posts/xxx`）可直接访问。
- **自定义域名（根路径）**：在仓库 Settings → Pages 绑定域名后，把 workflow 中 `VITE_BASE` 改为 `/`（或删除该环境变量）重新构建即可；`src/data/site.json` 的 `site_url` 需与域名一致（当前为 `https://xc-lr.cn`）。
- **本地开发**：直接 `pnpm dev`（默认 base `/`），无需设置 VITE_BASE。
