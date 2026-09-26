"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// 打字机文字：shadcn 风格组件，纯 CSS 逐字播放（无 setInterval，SSR 输出即完整文本）。
//
// 为什么重写成"逐字"（旧实现为什么会一列一列地走）：
// 旧版用 clip-path 整体从左往右揭开，光标挂在 width:0→100% 的层右缘上。
// 那个 width 是**容器宽度的百分比**，不是"已打出的文字宽度"：
//   1) 文本是折行的，第 2 行只填了半行，光标却按整块容器的百分比继续往右走，
//      于是光标位置和实际打字位置从一开始就不同步；
//   2) 盒子宽度越过一行后换行，光标跟着跳到下一行行首；
//   3) steps() 只让"百分比"离散，离散的是容器宽度，不是字。
// 三者叠加，观感就是光标在一列一列地平移，而不是一个字一个字地跳。
//
// 现在的做法：每个字符是独立的 inline-block 单元，各自带自己的 animation-delay，
// 到点由 step-start 直接切到 opacity:1（无淡入，就是"啪"地出现一个字）。
// 光标绝对定位在**该字符自己的右缘**，只在属于它的那一拍显示，
// 因此光标严格按字推进，与折行、中英混排都无关。
//
// 布局：所有字符从第一帧起就在正常文档流里占位（只是 opacity:0），
// 所以折行位置与高度从首帧就是最终形态，不会回流抖动。
//
// 注意 fill 用 forwards 而不是 both：延迟期间要回落到元素自身的 opacity-0，
// 用 both 会被 backwards 填充提前显形，等于全部文字一开始就可见。

export interface TypingAnimationProps
  extends React.ComponentPropsWithoutRef<"span"> {
  /** 逐字打字速度（毫秒/字） */
  duration?: number
  /** 打字开始前的延迟（毫秒） */
  delay?: number
  /** 是否显示光标 */
  showCursor?: boolean
  /** 渲染成指定标签（如 h1 / p） */
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3"
  /** 光标字符 */
  cursorText?: string
}

// 中日韩文字（含假名、谚文、全角标点）：逐字都允许换行，可以单独成格
const CJK_RE =
  /[\u2e80-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\ufe30-\ufe4f\uff00-\uffef\uac00-\ud7af]/

type Unit = { chars: string[]; atomic: boolean }

// 切分"排版单元"：连续的拉丁字母/数字合成一个原子词（整体不拆行），
// 其余字符（汉字、标点、空格）各自成格，可以在任意字之间换行。
function toUnits(text: string): Unit[] {
  const units: Unit[] = []
  let word: string[] = []
  const flush = () => {
    if (word.length) {
      units.push({ chars: word, atomic: true })
      word = []
    }
  }
  for (const ch of text) {
    if (/[\p{L}\p{N}]/u.test(ch) && !CJK_RE.test(ch)) {
      word.push(ch)
    } else {
      flush()
      units.push({ chars: [ch], atomic: false })
    }
  }
  flush()
  return units
}

// 光标：绝对定位（left/right:100%），不占布局宽度，否则会挤动折行。
//   side="left"  贴在所属字符的左缘 —— 打字开始前的起始位置
//   side="right" 贴在所属字符的右缘 —— 打字中／打完后的位置
// 基础 opacity-0：只有动画正在"自己那一拍"时才亮（forwards 结束后，
// persistent 的停在 1，普通的停在 0）。
function Caret({
  side,
  at,
  hold,
  cursorText,
  persistent = false,
}: {
  side: "left" | "right"
  /** 开始显示的时刻（毫秒，已含 delay） */
  at: number
  /** 显示时长（毫秒） */
  hold: number
  cursorText: string
  persistent?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-0 opacity-0 select-none font-normal text-primary",
        "motion-reduce:hidden",
        side === "left" ? "right-full" : "left-full",
        persistent ? "motion-safe:animate-typing-char" : "motion-safe:animate-typing-caret"
      )}
      style={
        {
          animationDelay: `${at}ms`,
          animationDuration: `${hold}ms`,
        } as React.CSSProperties
      }
    >
      {/* 打完后的光标持续闪烁；打字途中的光标保持常亮 —— 否则 1s 的闪烁周期
          会盖住 28ms 的单字节奏，看起来忽明忽暗 */}
      <span className={persistent ? "animate-caret-blink" : undefined}>
        {cursorText}
      </span>
    </span>
  )
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
  // 按码点切分，避免把 emoji / 代理对拆成两半
  const units = React.useMemo(() => toUnits(text), [text])
  const total = React.useMemo(
    () => units.reduce((n, u) => n + u.chars.length, 0),
    [units]
  )
  const Comp = as
  // 末尾光标与"最后一个字出现"同一时刻接上：前一字的临时光标恰在此刻熄灭，
  // 两者无缝衔接，中间不会出现 28ms 的空档
  const doneAt = delay + Math.max(total - 1, 0) * duration

  let index = 0

  return (
    <Comp
      data-slot="typing-animation"
      className={cn("relative", className)}
      data-cursor={cursorText}
      style={
        {
          "--typing-char-duration": `${duration}ms`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* 读屏用文本：视觉上不可见，保证可访问名称只出现一次
          （下面的逐字单元都标了 aria-hidden，避免被逐字念出来） */}
      <span className="sr-only">{text}</span>

      {units.map((unit, u) => {
        const cells = unit.chars.map((char) => {
          const at = index++
          const isFirst = at === 0
          const isLast = at === total - 1
          return (
            <span
              key={at}
              aria-hidden="true"
              // opacity-0 是"还没轮到"的基准态；减弱动效用户没有动画填充，
              // 必须显式给回 opacity-100，否则整段文字会一直不可见
              className="relative inline-block whitespace-pre opacity-0 motion-safe:animate-typing-char motion-reduce:opacity-100"
              style={
                {
                  animationDelay: `${delay + at * duration}ms`,
                } as React.CSSProperties
              }
            >
              {char}
              {showCursor && (
                <>
                  {/* 打字开始前，光标先在起始位置等着 */}
                  {isFirst && delay > 0 && (
                    <Caret side="left" at={0} hold={delay} cursorText={cursorText} />
                  )}
                  {/* 打字中：这一字刚出现的那一拍，光标贴在它右缘。
                      显示时长 == 单字时长，所以它熄灭的瞬间正好是下一字光标
                      亮起的瞬间 —— 相邻两拍无缝衔接，光标就是"一格格跳"而不是闪。
                      最后一字交给下面 persistent 的那个，避免同一位置叠两个字重影。 */}
                  {!isLast && (
                    <Caret
                      side="right"
                      at={delay + at * duration}
                      hold={duration}
                      cursorText={cursorText}
                    />
                  )}
                  {/* 打完：光标留在末尾持续闪烁 */}
                  {isLast && (
                    <Caret
                      side="right"
                      at={doneAt}
                      hold={duration}
                      cursorText={cursorText}
                      persistent
                    />
                  )}
                </>
              )}
            </span>
          )
        })

        // 原子词整段包一层 inline-block，内部字符不再成为换行点
        return unit.atomic ? (
          <span key={`w${u}`} className="inline-block whitespace-pre">
            {cells}
          </span>
        ) : (
          cells[0]
        )
      })}
    </Comp>
  )
}

export { TypingAnimation }
