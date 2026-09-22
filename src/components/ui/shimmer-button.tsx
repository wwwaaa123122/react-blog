"use client"

import * as React from "react"

import { Slot } from "radix-ui"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// shadcn 风格的装饰性按钮：以 Button 为基础，叠加一层沿边框循环的流光。
// 动效全部由 index.css 中的关键帧提供（--animate-shimmer-slide / --animate-spin-around），
// 因此不引入任何动画库。
// props 保持与旧的 magicui/shimmer-button 一致，便于页面平滑迁移。
export interface ShimmerButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  /** 流光颜色 */
  shimmerColor?: string
  /** 流光速度（如 3s / 6s） */
  shimmerDuration?: string
  /** 底色 */
  background?: string
  /** 圆角 */
  borderRadius?: string
  /** 作为子元素渲染（配合 asChild，如渲染为链接） */
  asChild?: boolean
}

function ShimmerButton({
  shimmerColor = "hsl(0 0% 100% / 35%)",
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
        "group/shimmer relative isolate overflow-hidden rounded-[var(--radius)] border border-transparent bg-[var(--shimmer-bg)] text-primary-foreground",
        "transition-transform duration-300 ease-in-out active:translate-y-px",
        className
      )}
      {...props}
    >
      {/* 流光层：容器查询尺寸 + 旋转的圆锥渐变，只做装饰，不参与点击 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-visible blur-[3px] [container-type:size]"
      >
        <span className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh]">
          <span className="animate-spin-around absolute -inset-full w-auto [background:conic-gradient(from_calc(270deg-(90deg*0.5)),transparent_0,var(--shimmer-color)_90deg,transparent_90deg)]" />
        </span>
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[var(--radius)] shadow-[inset_0_-8px_10px_#ffffff1f] transition-shadow duration-300 group-hover/shimmer:shadow-[inset_0_-6px_10px_#ffffff3f] group-active/shimmer:shadow-[inset_0_-10px_10px_#ffffff3f]"
      />
      {/* asChild 时 Slot 要求「唯一子元素」：装饰层必须放在 Slottable 之外，
          children 由 Slottable 标记为真正被合并的那个元素 */}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Button>
  )
}

export { ShimmerButton }
