"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// 打字机文字：shadcn 风格组件，纯 CSS（无逐帧 setInterval），SSR 输出即稳定文本。
//
// 布局要点（旧实现的 bug）：以前用 --typing-width（按字符数估算的 em 宽度）
// 控制展开宽度，估算值偏窄时文本先在一行显示，动画越过估算宽度后才换行，
// 于是"首次加载先一行、之后才自动换行"。现在改为三层同步动画：
//   1) 备位层  完整文本 + visibility:hidden —— 撑出真实的换行与高度
//   2) 揭示层  与备位层重叠，clip-path 从左到右揭示（只影响绘制，不影响布局）
//   3) 光标层  width 0→100%，把 ::after 光标推到"当前打字位置"
// 三层的字体/宽度完全一致，且揭示与光标用同一个 steps 时序，
// 因此换行位置从第一帧起就是最终结果，不会回流。
export interface TypingAnimationProps
  extends React.ComponentPropsWithoutRef<"span"> {
  /** 逐字打字速度（毫秒/字），仅用于换算动画时长 */
  duration?: number
  /** 打字完成前的延迟（毫秒） */
  delay?: number
  /** 是否显示光标 */
  showCursor?: boolean
  /** 渲染成指定标签（如 h1 / p） */
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3"
  /** 光标字符 */
  cursorText?: string
}

function TypingAnimation({
  children,
  className,
  duration = 100,
  delay = 0,
  showCursor = true,
  as = "span",
  cursorText = "|",
  style,
  ...props
}: TypingAnimationProps) {
  const text = typeof children === "string" ? children : String(children ?? "")
  const steps = Math.max([...text].length, 1)
  const Comp = as

  return (
    <Comp
      data-slot="typing-animation"
      className={cn("relative grid", className)}
      data-cursor={cursorText}
      style={
        {
          "--typing-duration": `calc(${steps} * ${duration}ms)`,
          "--typing-steps": steps,
          animationDelay: `${delay}ms`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* 读屏用文本：视觉上不可见，保证可访问名称只出现一次 */}
      <span className="sr-only">{text}</span>

      {/* 1) 备位层：不可见但参与布局，保证换行/高度从首帧即最终形态 */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
      </span>

      {/* 2) 揭示层：与备位层完全重叠，clip-path 逐步揭示 */}
      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 motion-safe:animate-type-reveal"
      >
        {text}
      </span>

      {/* 3) 光标层：宽度随打字进度增长，::after 光标贴在右缘 */}
      {showCursor && (
        <span
          aria-hidden="true"
          data-cursor={cursorText}
          className={cn(
            "col-start-1 row-start-1 block w-0 motion-safe:animate-typing-grow",
            "after:ml-0.5 after:inline-block after:animate-caret-blink after:font-normal after:text-primary after:content-[attr(data-cursor)]"
          )}
        />
      )}
    </Comp>
  )
}

export { TypingAnimation }
