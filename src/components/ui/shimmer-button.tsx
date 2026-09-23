"use client"

import * as React from "react"
import { Slot } from "radix-ui"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// shadcn 风格的装饰性按钮：以 Button 为基础，叠加一层循环扫过的高光。
//
// 与旧实现（magicui）的区别：不再用 container query + conic-gradient + 旋转动画，
// 改为一个绝对定位的渐变层做 translateX 扫过。原因：
//   1) 动画只作用于 transform，不参与布局，也不会撑出横向滚动；
//   2) 不依赖 cqw/cqh 等尺寸单位，微小的按钮尺寸下也能正确铺满；
//   3) 结构更简单，不会再影响 Button 自身的 flex 居中（图标/文字不会偏向一侧）。
export interface ShimmerButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  /** 高光颜色 */
  shimmerColor?: string
  /** 扫过一次的时长（如 3s） */
  shimmerDuration?: string
  /** 底色 */
  background?: string
  /** 圆角 */
  borderRadius?: string
  /** 作为子元素渲染（配合 asChild，如渲染为链接） */
  asChild?: boolean
}

function ShimmerButton({
  shimmerColor = "hsl(0 0% 100% / 28%)",
  shimmerDuration = "3s",
  background,
  borderRadius = "9999px",
  // 深色按钮 + 白字在两种主题下保持一致（浅色页面背景上本来就是深色块）。
  // 深色模式下页面背景也很暗，靠"描白边"把按钮从背景里分出来，
  // 而不是把按钮翻成白底黑字。需要固定底色时再显式传 background（如品牌色）。
  
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <Button
      data-slot="shimmer-button"
      style={
        {
          "--shimmer-color": shimmerColor,
          "--speed": shimmerDuration,
          "--radius": borderRadius,
          "--shimmer-bg": background ?? "#111827",
        } as React.CSSProperties
      }
      className={cn(
        "group/shimmer relative isolate overflow-hidden rounded-[var(--radius)] whitespace-nowrap",
        // 固定底色：Button 默认变体带 hover:bg-primary/80，会盖掉流光底色
        "bg-[var(--shimmer-bg)] hover:bg-[var(--shimmer-bg)] text-primary-foreground",
        // 描边：浅色模式下透明（本身对比已足够），深色模式下描一圈白边
        background
          ? "border border-transparent"
          : "border border-transparent ring-1 ring-inset ring-white/0 dark:ring-white/75",
        "transition-transform duration-300 ease-in-out active:translate-y-px",
        className
      )}
      {...props}
    >
      {/*
        装饰层与内容层必须分开：
        - 高光层 absolute inset-0 + overflow-hidden 由父级提供，动画只做 translateX
        - 文案/图标交给 Button 自己的 flex 居中（asChild 时由 Slot 合并到子元素）
        - Button 的 [&_svg] 规则要求 svg 在 flex 流内才会被居中，
          因此这里绝不能用 absolute 去承载内容
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--radius)]"
      >
        <span
          className="animate-shimmer-sweep absolute inset-y-0 -left-full w-full"
          style={{
            background:
              "linear-gradient(100deg, transparent 20%, var(--shimmer-color) 50%, transparent 80%)",
          }}
        />
      </span>
      {/* asChild 时 Slot 要求唯一子元素：装饰层放在 Slottable 之外，
          children 由 Slottable 标记为真正接收合并 props 的那个元素 */}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Button>
  )
}

export { ShimmerButton }
