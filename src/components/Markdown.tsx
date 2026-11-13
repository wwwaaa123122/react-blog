import { useEffect, useRef } from "react";
import { copyToClipboard } from "../lib/clipboard";

/**
 * 文章正文渲染器（客户端）。
 *
 * 正文 HTML 由构建脚本预先生成（scripts/build-content.mts，渲染器在 lib/markdown-render.tsx）。
 * 这样浏览器既不用下载 react-markdown / remark / rehype / highlight.js（约 340 KB JS），
 * 也不用在每篇文章上重新解析一遍 Markdown —— 只插入一段字符串。
 *
 * 唯一需要 JS 的交互是代码块的「复制」按钮：用事件委托 + DOM 属性切换，
 * 避免为每个代码块挂一个 React 组件与 state。
 */
export default function Markdown({ html }: { html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const timers = new WeakMap<HTMLButtonElement, number>();

    const onClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>("[data-copy-code]");
      if (!button || !root.contains(button)) return;

      const block = button.closest(".code-block");
      const code = block?.querySelector("code");
      if (!code) return;
      if (!(await copyToClipboard(code.textContent ?? ""))) return;

      button.dataset.copied = "true";
      button.setAttribute("aria-label", "已复制");
      const label = button.querySelector("[data-copy-label]");
      if (label) label.textContent = "已复制";

      const prev = timers.get(button);
      if (prev) window.clearTimeout(prev);
      timers.set(
        button,
        window.setTimeout(() => {
          button.dataset.copied = "false";
          button.setAttribute("aria-label", "复制代码");
          if (label) label.textContent = "复制";
        }, 1500)
      );
    };

    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("click", onClick);
      for (const button of root.querySelectorAll<HTMLButtonElement>("[data-copy-code]")) {
        const t = timers.get(button);
        if (t) window.clearTimeout(t);
      }
    };
  }, []);

  return <div ref={rootRef} className="markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}
