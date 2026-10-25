import { useEffect, useRef } from "react";

/**
 * 文章阅读进度条：固定在视口顶部，宽度随滚动推进。
 *
 * 实现要点：
 *  - rAF 节流：滚动事件可能每帧触发多次，只在下一次帧渲染前算一次
 *  - 用 transform: scaleX 而非 width：scaleX 走合成器，不触发回流/重绘
 *  - 缓存可滚动高度：scrollHeight 只在文档结构变化时变，不必每帧读取
 *    （resize 与首次测量时刷新即可）
 *  - 进度为 0 或 1 时直接归零/拉满，避免亚像素残留
 */
export default function ReadingProgress({ target }: { target?: React.RefObject<HTMLElement | null> }) {
  const barRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef({ scrollable: 0, offset: 0, raf: 0 });

  useEffect(() => {
    const measure = () => {
      // 以目标元素（文章）为准，回退到整页
      const el = target?.current;
      if (el) {
        // offsetTop 相对最近的定位祖先（文章外面的 .relative 容器），不是文档；
        // 用 rect + scrollY 取得文章在文档中的真实起点。
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        cacheRef.current.scrollable = Math.max(1, bottom - window.innerHeight);
        // 起点偏移：文章顶部滚到视口顶时进度才从 0 开始
        cacheRef.current.offset = top;
      } else {
        const doc = document.documentElement;
        cacheRef.current.scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
        cacheRef.current.offset = 0;
      }
    };

    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const { scrollable, offset = 0 } = cacheRef.current;
      const raw = (window.scrollY - offset) / scrollable;
      const p = raw <= 0 ? 0 : raw >= 1 ? 1 : raw;
      bar.style.transform = `scaleX(${p})`;
      bar.style.opacity = p <= 0 ? "0" : "1";
    };

    const onScroll = () => {
      const c = cacheRef.current;
      if (c.raf) return;
      c.raf = requestAnimationFrame(() => {
        c.raf = 0;
        update();
      });
    };

    // 封面图、字体、评论 iframe 加载都会改变文章高度：
    // 重新测量，否则进度条会按旧的（更短的）高度提前走到 100%。
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const el = target?.current;
    const ro = typeof ResizeObserver !== "undefined" && el
      ? new ResizeObserver(onResize)
      : undefined;
    if (el) ro?.observe(el);
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      ro?.disconnect();
      if (cacheRef.current.raf) cancelAnimationFrame(cacheRef.current.raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [target]);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-primary/80"
      style={{ transform: "scaleX(0)", opacity: 0 }}
    />
  );
}
