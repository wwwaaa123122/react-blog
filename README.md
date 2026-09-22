# React Blog · 星辰旅人

基于 **React 19 + Vite 8 + TypeScript** 重写的个人博客，内容与数据来源于原仓库 Firefly（Fuwari/Astro 主题）。

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
React 19 · React Router 7 · **shadcn/ui + Tailwind v4 + Radix UI** · react-markdown + remark-gfm + rehype-highlight · Vite 8 · TypeScript

### UI 组件库（shadcn/ui）

界面全部由 shadcn/ui 组件搭建，不使用手写的样式型控件：

- 组件源码统一放在 `src/components/ui/`（rdx-nova 风格，`components.json` 中 `style: radix-nova`），
  页面只负责组合，不再自己拼装按钮、卡片、表单控件；
- 主题走 shadcn 官方推荐方案：`next-themes` 的 `ThemeProvider`（`src/components/theme-provider.tsx`）
  切换 `<html class="dark">`，配色 token 定义在 `src/index.css`（亮/暗双套）；
- 反馈统一用 Sonner（`toast`），浮层统一用 Dialog/Sheet/Drawer/Popover/Tooltip；
- 文章正文的提示块（`:::warning` 等）与代码块也使用组件库：`Alert` / `Badge` / `Button` / `Separator`；
- `/components` 页面把全部组件按 acofork 风格的「编号 + 网格」逐个预览，
  示例集中在 `src/components/showcase/demos.tsx`。

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
