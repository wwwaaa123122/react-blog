# UI 规范

本站界面是「直角 + 发丝描边 + 单一主色」的平面风格。这份文档是唯一的口径：
新增页面时按这里的层级与组件取用，不再各自写一套字号和间距。

> 落地方式：`src/components/page.tsx` 提供 `PageHeader` / `SectionHeading` /
> `SectionLabel` / `MetaRow` / `MetaItem` / `PostMeta` / `TagList`。
> 页面只组合这几样，排版细节不散落在页面里。

## 1. 颜色与表面

| 用途 | Token | 说明 |
| --- | --- | --- |
| 页面底色 | `bg-background` | 浅色 `#f6f8fb`，深色 `#0a0d13` |
| 卡片 | `bg-card` + `ring-1 ring-foreground/10` | 由 `Card` 组件提供，不要手写 border |
| 卡片内嵌区块 | `bg-card-nested` | 代码模板框、版权信息框 |
| 次级填充 | `bg-muted` / `bg-secondary` | 徽章、标签、行 hover |
| 主色浅底 | `bg-accent` / `bg-primary-soft` | 图标方块、导航选中态（两者同值，按语义取用） |
| 正文 | `text-foreground` | |
| 次要文字 | `text-muted-foreground` | 描述、元信息、说明 |
| 强调 | `text-primary` | 链接、选中、图标 |

规则：

- 文字只用上面三档颜色，不要临时加 `text-muted-foreground/60` 之类的透明度。
- 分隔线统一 `border-border`；不要用 `/50`、`/60` 这类随手透明度。
- 页面内容不使用投影：卡片、导航栏、悬浮按钮一律靠描边与底色分层。
- 只有浮层（下拉菜单、对话框、Toast、跳转链接提示）保留阴影表达高度。
- 唯一例外：`AvatarBadge` 的在线圆点、列表符号圆点用 `rounded-full`，其余全部直角。

## 2. 字号层级

| 角色 | 字号 / 字重 | 组件 |
| --- | --- | --- |
| 页面标题 h1 | 30 → 36px（md）/ 700 / `tracking-tight` | `PageHeader` |
| 区块标题 h2 | 18px / 700 / `tracking-tight` | `SectionHeading` |
| 正文分节 h3 | 16px / 700 | `SectionHeading as="h3"` |
| 卡片标题 | 16px / 600 | `CardTitle` |
| 列表标题 | 18px / 600 | `ItemTitle variant="lg"` |
| 正文 | 14px / 400 / `leading-relaxed` | 页面文案 |
| 长文正文 | 16 → 17px（lg）/ 1.8 | `.markdown` |
| 元信息 | 12px / 400 / `tabular-nums` | `MetaRow` / `MetaItem` |
| 小标签 | 12px / 600 / `tracking-wider` / `uppercase` | `SectionLabel` |
| 徽章文字 | 12px / 500 | `Badge` |
| 统计数字 | 20px / 600 / `tabular-nums` | `HeroStat`（首页头版） |

- 不再出现 20px、22px、26px 这类中间字号；`h2` 不允许大于 18px。
- 英文标题与中文标题同号，靠字重与颜色拉层级，不靠字号堆叠。
- 日期、字数、阅读时长等数字用 `tabular-nums`。

## 3. 间距节奏

| 位置 | 间距 |
| --- | --- |
| 页面标题区 → 内容 | `mb-10`（标题区自带 `border-b` 收口） |
| 区块标题 → 内容 | `mb-3` / `mb-4` |
| 卡片内边距 | 16px（`p-4`，由 `Card` 的 padding 提供） |
| 网格 / 卡片间距 | `gap-4` |
| 侧栏分组 | 发丝线分隔 + 上下 `py-5` |
| 同组元素 | `gap-1.5` / `gap-2` |

- 页面主容器由 `Layout` 统一：`max-w-230 md:max-w-250 lg:max-w-280` + `px-5`。
- 文章页外层 `max-w-248`（992px，为右侧目录留位），正文列在其中 `max-w-180`（720px）居中；
  面包屑与正文左边缘对齐，不要一层贴容器左沿、一层再居中。
- 「关于」等单列内容同样用 `max-w-180` 居中。
- 侧栏统一 `w-56`，`sticky top-20`。

## 4. 组件用法

### Button

| 场景 | 写法 |
| --- | --- |
| 主操作 | `default` |
| 次操作 / 返回 / 站外链接 | `outline` |
| 图标按钮 | `variant="ghost" size="icon-lg"`（36px，导航栏内全部同款） |
| 文字型弱操作 | `ghost` / `muted` |
| 首屏唯一的主 CTA | `ShimmerButton` |

尺寸只从 `xs / sm / default / lg` 里选，按容器密度取；同一个功能区不混用两种尺寸。
按钮尺寸与内边距由变体决定，不要在 `className` 里覆盖 `size-*`、`h-*`、`p-*`
（`eslint` 的 `shadcn/no-restyle` 会拦）。

### Badge

- 标签：`variant="secondary" size="xs"`，统一由 `TagList` 渲染。
- 卡片封面上的分类：`variant="overlay" size="2xs"`（半透明底 + 描边，白底封面也读得清）。
- 步骤编号：`size="step"`（24px 方块）。
- 计数属于标题，用 `SectionHeading` 的 `meta`，不再单独放一个徽章。

### Card

- `size="flush"`：图文卡片（封面顶到边缘，封面固定 2:1，`object-cover` + 1px 描边）。
- `size="cozy"` / `size="sm"`：信息密度较高的卡片。
- `variant="interactive"`：整卡可点，悬停只改变描边颜色；标题链接用 `after` 伪元素铺满卡片，
  卡片内需要独立可点的元素（标签、按钮）要包一层 `relative z-10`。
- 卡片内不要再套卡片；需要分区时用 `border-b` 或 `Separator`。

### 列表

- 首页文章列表：`Item variant="divided"`，行间发丝线，缩略图 16:9（`w-28 sm:w-32`）；
  行内只放标题 / 摘要 / 元信息，**不再放标签**（标签在侧栏与文章页），行尾箭头 hover 才出现。
- 归档：`Card size="flush"` + `Item variant="divided"`，日期列 `w-11`。
- 筛选器：`ToggleGroup variant="outline" size="sm"`，标签内联在左侧（`w-8`），
  移动端单行横滑、md 以上换行。
- 暗色模式下小尺寸封面统一 `dark:brightness-90`，避免白底图片在暗背景上过曝。

## 5. 页面骨架

```tsx
<Seo … />
<Breadcrumb items={[{ label: "页面名", to: "/xxx/" }]} />
<PageHeader title="页面名" description="一句话说明" />
{/* 内容：区块用 SectionHeading 起头 */}
<SectionHeading meta="12 篇">最新文章</SectionHeading>
```

- 每页有且只有一个 `h1`（`smoke-test` 会检查）。
- `PageHeader` 自带底部导线（`border-b`），页面内容直接跟在下面，不要再手写分隔线。
- 面包屑末级过长时单行截断，不折行。
- 文章页的元信息用 `MetaRow`（12px 文本 + 12px 图标），标签用 `TagList`；
  两者不能长得一样，否则读者分不清「事实」和「可点标签」；标签行下方用导线收口。

## 6. 动效

- 只做 `opacity` / `transform` 动画，时长 150–300ms，缓动 `ease-out`。
- 悬停不做位移与投影；卡片靠描边变色，图片靠 `scale-105`。
- 所有动效都要被 `prefers-reduced-motion` 兜住（`index.css` 已有全局兜底）。

## 7. 提交前检查

```bash
npx tsc --noEmit
npx eslint .
pnpm build            # 含 outline / mobile-menu / layout 回归
node scripts/smoke-test.mjs   # 需先 pnpm preview
```

`eslint` 的两条自定义规则是硬约束：

- `shadcn/no-restyle`：不许改组件的排版契约（尺寸、颜色、间距），要么用变体，
  要么在 `src/components/ui/*` 里新增变体。
- `shadcn/no-arbitrary-values`：不许写 `w-[437px]` 这类魔法值，用主题 token。
