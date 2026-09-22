"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// 打字机文字：shadcn 风格组件。
// 与旧的 magicui 实现相比去掉了逐帧 setInterval，改为纯 CSS：
//   - 外层用 --typing-width 控制展开宽度（index.css 的 @keyframes typing）
//   - 光标用 ::after + @keyframes caret-blink（Twitch 的 animate-caret-blink 亦可）
// 这样 SSR 输出即稳定文本（爬虫可读），也不需要逐字操作 DOM。
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
  // 宽度按字符数估算：中文/全角按 1em，其余按 0.55em（近似半个西文字符宽）。
  // 允许有一点误差（宁可略宽也不要截断），因为动画只作用于可见宽度，
  // 布局宽度始终由真实文本占位，不依赖这个估算值。
  const widthEm = [...text].reduce((sum, ch) => {
    const full = /[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\u3000-\u303F]/.test(ch);
    return sum + (full ? 1 : 0.55);
  }, 0)
  const steps = Math.max([...text].length, 1)
  const Comp = as

  return (
    <Comp
      data-slot="typing-animation"
      className={cn(
        "inline-flex items-baseline",
        showCursor &&
          "after:ml-0.5 after:animate-caret-blink after:text-primary after:content-[attr(data-cursor)]",
        className
      )}
      data-cursor={cursorText}
      style={
        {
          "--typing-duration": `calc(${steps} * ${duration}ms)`,
          "--typing-steps": steps,
          "--typing-width": `${widthEm.toFixed(2)}em`,
          animationDelay: `${delay}ms`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* 完整文本直接保留在 DOM 中（爬虫/读屏可读），只有视觉展开由动画控制；
          prefers-reduced-motion 下不播放动画，文本直接完整显示 */}
      <span
        className="inline-block overflow-hidden whitespace-nowrap align-bottom motion-safe:animate-typing"
        style={{ width: "var(--typing-width)" }}
      >
        {text}
      </span>
    </Comp>
  )
}

export { TypingAnimation }
