"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * 滑杆。
 *
 * 为什么不用 Radix Slider：它靠「集合注册（useEffect）+ 索引取 value」定位每个滑块，
 * 而 Preact 在 ref 回调里触发的 setState 会先于 passive effect 刷新 —— 索引算出来是 -1，
 * 滑块拿到 undefined 就被永久隐藏（display:none）。React 的调度顺序恰好相反，所以只在
 * Preact 下复现，且 10 / 11 两个大版本表现一致。
 *
 * 这里用原生指针 / 键盘事件实现同等交互，DOM 结构与类名保持与 Radix 版本一致
 * （data-slot、data-orientation、同一套样式类），视觉无差异。
 */
const THUMB_SIZE = 12

export interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "defaultValue" | "onChange"> {
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** 对齐到 step 并夹在 [min, max]（toFixed 消掉浮点误差，例如 0.1 的步长） */
function snap(value: number, min: number, max: number, step: number): number {
  const steps = Math.round((value - min) / step)
  return clamp(Number((min + steps * step).toFixed(10)), min, max)
}

function Slider({
  className,
  defaultValue,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onPointerDown: onPointerDownProp,
  "aria-label": ariaLabel,
  ...props
}: SliderProps) {
  const safeMax = max > min ? max : min + 1
  const safeStep = step > 0 ? step : 1
  const controlled = value !== undefined

  const [uncontrolled, setUncontrolled] = React.useState<number[]>(() =>
    (defaultValue && defaultValue.length > 0 ? defaultValue : [min, safeMax]).map((v) =>
      snap(v, min, safeMax, safeStep)
    )
  )

  const values = (controlled ? value : uncontrolled).map((v) => snap(v, min, safeMax, safeStep))
  const trackRef = React.useRef<HTMLSpanElement>(null)
  const thumbRefs = React.useRef<Array<HTMLSpanElement | null>>([])
  const dragIndex = React.useRef<number | null>(null)

  const commit = (next: number[]) => {
    if (!controlled) setUncontrolled(next)
    onValueChange?.(next)
  }

  const percentOf = (v: number) => ((v - min) / (safeMax - min)) * 100

  const valueFromClientX = (clientX: number): number => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return min
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
    return snap(min + ratio * (safeMax - min), min, safeMax, safeStep)
  }

  const nearestIndex = (v: number): number => {
    let best = 0
    let bestDistance = Infinity
    values.forEach((item, index) => {
      const distance = Math.abs(item - v)
      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    })
    return best
  }

  /** 写入第 index 个滑块；多滑块时不允许越过相邻滑块 */
  const setThumb = (index: number, raw: number) => {
    const next = values.slice()
    const lower = index > 0 ? next[index - 1] + safeStep : min
    const upper = index < next.length - 1 ? next[index + 1] - safeStep : safeMax
    const bounded = lower <= upper ? clamp(raw, lower, upper) : clamp(raw, upper, lower)
    next[index] = snap(bounded, min, safeMax, safeStep)
    if (next.every((v, i) => v === values[i])) return
    commit(next)
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    onPointerDownProp?.(event)
    if (disabled || event.defaultPrevented) return
    if (event.pointerType === "mouse" && event.button !== 0) return

    const next = valueFromClientX(event.clientX)
    const index = nearestIndex(next)
    dragIndex.current = index
    setThumb(index, next)
    event.currentTarget.setPointerCapture(event.pointerId)
    thumbRefs.current[index]?.focus({ preventScroll: true })
    event.preventDefault()
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (disabled || dragIndex.current === null) return
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    setThumb(dragIndex.current, valueFromClientX(event.clientX))
  }

  const endDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (dragIndex.current === null) return
    dragIndex.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return
    const current = values[index]
    let next: number
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = current + safeStep
        break
      case "ArrowLeft":
      case "ArrowDown":
        next = current - safeStep
        break
      case "PageUp":
        next = current + safeStep * 10
        break
      case "PageDown":
        next = current - safeStep * 10
        break
      case "Home":
        next = min
        break
      case "End":
        next = safeMax
        break
      default:
        return
    }
    event.preventDefault()
    setThumb(index, next)
  }

  const percentages = values.map(percentOf)
  // 单值滑杆的填充从 0 开始；多值才是「最小 → 最大」的区间（与 Radix 一致）
  const rangeStart = values.length > 1 ? Math.min(...percentages) : 0
  const rangeEnd = 100 - Math.max(...percentages)

  return (
    <span
      dir="ltr"
      data-slot="slider"
      data-orientation="horizontal"
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={() => {
        dragIndex.current = null
      }}
      {...props}
    >
      <span
        ref={trackRef}
        data-slot="slider-track"
        data-orientation="horizontal"
        className="relative h-1 w-full grow overflow-hidden rounded-none bg-muted"
      >
        <span
          data-slot="slider-range"
          data-orientation="horizontal"
          className="absolute h-full bg-primary select-none"
          style={{ left: `${rangeStart}%`, right: `${rangeEnd}%` }}
        />
      </span>

      {values.map((item, index) => {
        const percentage = percentages[index]
        // 与 Radix 完全一致的定位：left 先扣掉滑块自身占比，再用 translateX(-50%) 居中
        const offset = (percentage / 100) * THUMB_SIZE - THUMB_SIZE / 2
        const left = `calc(${percentage}% ${offset >= 0 ? "-" : "+"} ${Math.abs(offset)}px)`
        return (
          <span
            key={index}
            data-slot="slider-thumb-wrapper"
            style={{
              position: "absolute",
              top: "50%",
              left,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span
              ref={(node) => {
                thumbRefs.current[index] = node
              }}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-label={ariaLabel}
              aria-valuemin={min}
              aria-valuemax={safeMax}
              aria-valuenow={item}
              aria-orientation="horizontal"
              aria-disabled={disabled || undefined}
              data-slot="slider-thumb"
              data-orientation="horizontal"
              className={cn(
                "relative block size-3 shrink-0 rounded-none border border-ring bg-white ring-ring/50 transition select-none",
                "after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3",
                disabled && "pointer-events-none opacity-50"
              )}
              onKeyDown={handleKeyDown(index)}
            />
          </span>
        )
      })}
    </span>
  )
}

export { Slider }
