// 全组件预览 · Component Preview
// 设计参考 acofork.com/component-preview：编号网格 + 每格一个组件，
// 但配色沿用本站主题变量（亮/暗双主题自动适配），并把每格做成 shadcn Card。
// 页面本身也完全由 UI 组件库搭建（Card / Badge / Button / Separator / Tooltip …）。
import { ArrowUpRightIcon, BoxesIcon, CodeIcon, LayersIcon, PaletteIcon } from "lucide-react"

import Seo from "../components/Seo"
import Breadcrumb from "../components/Breadcrumb"
import { demoCells } from "../components/showcase/demos"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// 两侧两位序号（01 / 02 …），与 acofork 预览页的编号风格一致
const pad = (n: number) => String(n + 1).padStart(2, "0")

const stats = [
  { icon: LayersIcon, label: "预览单元", value: `${demoCells.length}` },
  { icon: BoxesIcon, label: "组件来源", value: "shadcn/ui" },
  { icon: PaletteIcon, label: "样式基线", value: "Tailwind v4" },
]

export default function Components() {
  return (
    <>
      <Seo
        title="全组件预览"
        description="以 shadcn/ui 组件库搭建的界面组件预览：按钮、表单、数据展示、浮层与反馈等全部组件一次看全。"
        path="/components/"
      />
      <Breadcrumb items={[{ label: "组件预览", to: "/components/" }]} />

      <header className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">React 19</Badge>
          <Badge variant="secondary">shadcn/ui</Badge>
          <Badge variant="secondary">Tailwind v4</Badge>
          <Badge variant="outline">亮 / 暗双主题</Badge>
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
          全组件预览
        </h1>
        <p className="text-sm text-muted-foreground">
          本站界面全部由 shadcn/ui 组件库搭建，每个格子只演示一个组件。共{" "}
          {demoCells.length} 个预览单元。
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://ui.shadcn.com/docs/components"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <CodeIcon data-icon="inline-start" />
                    shadcn/ui 文档
                    <ArrowUpRightIcon data-icon="inline-end" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>查看组件库官方文档与用法</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <Card className="mb-8">
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <s.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <nav aria-label="组件索引" className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
          <LayersIcon className="size-4 text-muted-foreground" />
          快速定位
        </div>
        <div className="flex flex-wrap gap-1.5">
          {demoCells.map((cell, i) => (
            <Button
              key={`${cell.name}-${i}`}
              asChild
              variant="outline"
              size="xs"
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <a href={`#demo-${i + 1}`}>
                <span className="font-mono text-[10px] opacity-60">{pad(i)}</span>
                {cell.name}
              </a>
            </Button>
          ))}
        </div>
      </nav>

      <Separator className="mb-6" />

      <div className="grid gap-4 lg:grid-cols-2">
        {demoCells.map((cell, i) => (
          <Card key={`${cell.name}-${i}`} id={`demo-${i + 1}`} className="scroll-mt-20">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {pad(i)}
                </span>
                {cell.name}
              </CardTitle>
              {cell.label && (
                <div className="text-xs text-muted-foreground">{cell.label}</div>
              )}
            </CardHeader>
            <CardContent className="flex min-h-28 items-center">
              {cell.demo}
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="text-center text-xs text-muted-foreground">
        组件源码位于 <code className="font-mono">src/components/ui</code>
        ，页面只负责组合。当前主题会随系统或右上角切换实时变化。
      </div>
    </>
  )
}
