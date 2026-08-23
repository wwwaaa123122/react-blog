import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number
  /**
   * The duration of the border beam.
   */
  duration?: number
  /**
   * The delay of the border beam.
   */
  delay?: number
  /**
   * The color of the border beam from.
   */
  colorFrom?: string
  /**
   * The color of the border beam to.
   */
  colorTo?: string
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean
  /**
   * The initial offset position (0-100).
   */
  initialOffset?: number
  /**
   * The border width of the beam.
   */
  borderWidth?: number
  /**
   * The class name of the border beam.
   */
  className?: string
}

// 纯 CSS 版本（原实现依赖 motion 库）：
// offset-distance 本身就是可动画的 CSS 属性，无需引入动画库，
// 用 @keyframes border-beam 驱动，行为与原 motion 动画一致。
export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) => {
  // offset-path: rect() 不支持的浏览器（如部分 Firefox）会渲染出静态色块，直接隐藏
  if (
    typeof CSS === "undefined" ||
    !CSS.supports?.("offset-path", "rect(0 auto auto 0 round 10px)")
  ) {
    return null
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
        } as CSSProperties
      }
    >
      <div
        className={cn(
          "border-beam-anim absolute aspect-square",
          "bg-linear-to-l from-(--beam-from) via-(--beam-to) to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--beam-from": colorFrom,
            "--beam-to": colorTo,
            "--beam-duration": `${duration}s`,
            "--beam-delay": `${delay}s`,
            "--beam-start": `${initialOffset}%`,
            "--beam-direction": reverse ? "reverse" : "normal",
          } as CSSProperties
        }
      />
    </div>
  )
}
