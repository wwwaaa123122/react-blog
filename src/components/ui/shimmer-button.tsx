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
  shimmerColor = "hsl(0 0% 100% / 42%)",
  shimmerDuration = "3s",
  background,
  borderRadius = "9999px",
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
          "--shimmer-bg": background ?? "var(--primary)",
        } as React.CSSProperties
      }
      className={cn(
        "group/shimmer relative isolate overflow-hidden rounded-[var(--radius)] border border-transparent",
        "bg-[var(--shimmer-bg)] text-primary-foreground whitespace-nowrap",
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
