"use client"

import { cloneElement, useCallback, useEffect, useId, useRef, useState } from "react"
import type {
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
  SyntheticEvent,
} from "react"

import { cn } from "@/lib/utils"
import { useLocation } from "@/lib/router"

// 轻量下拉菜单（替换 Radix DropdownMenu）。
//
// 为什么自己写：@radix-ui/react-menu + floating-ui + react-remove-scroll +
// focus-scope 这一串，序列化后约 200 KB 源码、压缩后十几 KB，只为了两个
// 各 3~6 项的小菜单。而 Radix 的模态菜单还需要 RemoveScroll 给 <body> 注入
// margin-right 补偿（移动端会让居中内容整体左移，见历史回归问题）。
//
// 这里用「定位在触发器的相对容器内」替代浮层定位，天然不锁定滚动、
// 不移动 body，键盘可达性与焦点归还仍按 WAI-ARIA menu 模式实现。

export const menuItemClass =
  "relative flex w-full cursor-default select-none items-center gap-1.5 rounded-md px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent data-[active]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

interface MenuProps {
  /** 触发器元素，会被注入 aria-expanded / aria-controls / onClick */
  trigger: ReactElement
  /** 菜单项容器内容 */
  children: ReactNode
  /** 触发器的可访问名称，同时用于菜单的 aria-label */
  label: string
  align?: "start" | "end"
  className?: string
}

export function Menu({ trigger, children, label, align = "end", className }: MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerId = useId()
  const panelId = useId()
  const { pathname, search } = useLocation()

  const close = useCallback((restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) {
      // 用 id 取回触发器，避免依赖 Radix Slot 那样的 ref 透传
      requestAnimationFrame(() => document.getElementById(triggerId)?.focus())
    }
  }, [triggerId])

  // 换页后自动收起（菜单里的链接被点击时不会卸载导航栏）
  const routeKey = pathname + search
  const prevRoute = useRef(routeKey)
  useEffect(() => {
    if (prevRoute.current !== routeKey) {
      prevRoute.current = routeKey
      setOpen(false)
    }
  }, [routeKey])

  // 点击外部关闭；用 pointerdown 而非 click，避免先触发外部元素的 click
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  // 展开后把焦点移到第一项（键盘用户可以立刻用方向键）
  useEffect(() => {
    if (!open) return
    const items = panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')
    items?.[0]?.focus()
  }, [open])

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
    )
    const current = items.indexOf(document.activeElement as HTMLElement)

    switch (event.key) {
      case "Escape":
        event.preventDefault()
        close(true)
        break
      case "ArrowDown":
        event.preventDefault()
        items[(current + 1) % items.length]?.focus()
        break
      case "ArrowUp":
        event.preventDefault()
        items[(current - 1 + items.length) % items.length]?.focus()
        break
      case "Home":
        event.preventDefault()
        items[0]?.focus()
        break
      case "End":
        event.preventDefault()
        items[items.length - 1]?.focus()
        break
      case "Tab":
        // 焦点离开即视为放弃操作
        setOpen(false)
        break
      default:
        break
    }
  }

  // 点中任意菜单项后收起（保持与 Radix 一致的"选中即关闭"）
  const onPanelClick = (event: SyntheticEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('[role="menuitem"]')) close()
  }

  return (
    <div ref={rootRef} className="relative">
      {cloneElement(trigger, {
        id: triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? panelId : undefined,
        onClick: (event: ReactMouseEvent<HTMLElement>) => {
          // 触发器自身的 onClick 先执行（如原有埋点），再切换展开状态
          (trigger.props as { onClick?: (e: ReactMouseEvent<HTMLElement>) => void }).onClick?.(event)
          setOpen((value) => !value)
        },
      } as Record<string, unknown>)}

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="menu"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onPanelKeyDown}
          onClick={onPanelClick}
          style={{ animation: "fadeIn 0.12s ease-out both" }}
          className={cn(
            "absolute top-full z-50 mt-1.5 min-w-40 overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden",
            align === "end" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
