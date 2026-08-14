# React Blog · 星辰旅人

基于 **React 19 + Vite 8 + TypeScript** 重写的个人博客，内容与数据来源于原仓库 [/root/Firefly](https://github.com/)（Fuwari/Astro 主题）。

## 页面与功能

| 路由 | 说明 |
| --- | --- |
| `/` | 首页：个人资料（头像 / 名字 / 签名 / 社交链接 / 站点统计）+ 最新文章 |
| `/posts` | 文章列表：关键词搜索、标签筛选、分页 |
| `/posts/:slug` | 文章详情：Markdown 渲染、代码高亮、目录、阅读时间 |
| `/friends` | 友链：友链卡片、本站信息（可复制）、申请流程、注意事项 |
| `/about` | 关于我：自我介绍、联系方式、成年倒计时 |
| `/archive` | 归档：按年份分组 |
| `*` | 404 页面 |

### 其它特性
- 🌙 亮 / 暗主题切换（记忆偏好，跟随系统）
- 🔍 全文搜索 + 🏷️ 标签筛选 + 分页
- 📖 文章目录（TOC）、阅读时长、字数统计
- ⬆️ 回到顶部、响应式移动端菜单
- 🖼️ 图片路径自动重写（`../images/` → `/images/`）

## 技术栈
React 19 · React Router 7 · react-markdown + remark-gfm + rehype-highlight · Vite 8 · TypeScript

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
├── config/      # 站点、个人资料、友链、导航配置（数据来自 Firefly）
├── lib/         # 文章加载与 frontmatter 解析、主题
├── components/  # 布局与通用组件
├── pages/       # 各路由页面
├── posts/       # Markdown 文章（从 Firefly 迁移）
└── styles/      # 全局样式（亮/暗双主题）
```

## 截图
见 `docs/screenshots/`（home / posts / post / friends / about / archive）。
## Pages CMS 后台管理

本站已接入 [Pages CMS](https://pagescms.org/docs/)（基于 Git 的静态站 CMS），可以**在线编辑文章、个人资料、友链与站点配置**，保存后自动提交到仓库并由 GitHub Actions 重新构建部署。

### 使用方式

1. 访问博客的 `/admin` 页面（或直接打开 [app.pagescms.org](https://app.pagescms.org/)）；
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
- **`robots.txt`** — 允许爬虫抓取，屏蔽 `/admin` 后台，并指向 `sitemap.xml`

站点基础 URL 取自 `src/data/site.json` 的 `site_url`（默认 `https://xc-lr.cn`），部署到其他域名时修改它后重新构建即可。

页面侧还内置：
- **面包屑导航**（含 schema.org BreadcrumbList JSON-LD）— 文章 / 归档 / 友链 / 关于 / 管理页
- **每页 SEO**（`<title>` / meta description / keywords / canonical）— 由 `Seo` 组件按路由设置
- **结构化数据** — 首页 WebSite JSON-LD、文章页 Article JSON-LD
- **后台页 noindex** — `/admin` 自动加入 `meta robots: noindex, nofollow`
