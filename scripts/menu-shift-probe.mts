// 移动端菜单展开时的布局诊断：在 jsdom 中挂载真实组件、展开菜单，
// 记录 <html>/<body> 的属性与内联样式变化、注入的 <style> 规则、portal 内容。
// 用法: npx tsx scripts/menu-shift-probe.mts
import { JSDOM } from "jsdom";

const dom = new JSDOM(
  `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div></body></html>`,
  { url: "https://xc-lr.cn/", pretendToBeVisual: true, width: 390, height: 844 }
);
const w = dom.window as unknown as Window & typeof globalThis;
// Node 26 的 globalThis.navigator 是只读 getter，必须用 defineProperty 覆盖
const define = (name: string, value: unknown): void =>
  Object.defineProperty(globalThis, name, { value, writable: true, configurable: true });
define("window", w);
define("document", w.document);
define("navigator", w.navigator);
define("HTMLElement", w.HTMLElement);
define("Element", w.Element);
define("Node", w.Node);
define("Event", w.Event);
define("CustomEvent", w.CustomEvent);
define("MouseEvent", w.MouseEvent);
define("PointerEvent", (w as any).PointerEvent ?? w.MouseEvent);
define("KeyboardEvent", w.KeyboardEvent);
define("FocusEvent", w.FocusEvent);
define("EventTarget", w.EventTarget);
define("DocumentFragment", w.DocumentFragment);
define("ShadowRoot", (w as any).ShadowRoot);
(globalThis as any).getComputedStyle = w.getComputedStyle.bind(w);
(globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16);
(globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// 模拟移动端：视口 390，文档宽度略小 -> 传统滚动条占 15px
Object.defineProperty(w, "innerWidth", { value: 390, writable: true, configurable: true });
Object.defineProperty(w.document.documentElement, "clientWidth", { value: 375, writable: true, configurable: true });

import React from "react";
import { act, render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const { default: Navbar } = await import("../src/components/Navbar");
const { default: ThemeToggle } = await import("../src/components/theme-toggle");

type Snap = {
  htmlAttrs: string;
  bodyAttrs: string;
  htmlStyle: string;
  bodyStyle: string;
  styles: string;
};

function snapshot(): Snap {
  const d = w.document;
  return {
    htmlAttrs: [...d.documentElement.attributes].map((a) => `${a.name}="${a.value}"`).join(" "),
    bodyAttrs: [...d.body.attributes].map((a) => `${a.name}="${a.value}"`).join(" "),
    htmlStyle: d.documentElement.getAttribute("style") ?? "",
    bodyStyle: d.body.getAttribute("style") ?? "",
    styles: [...d.querySelectorAll("style")].map((s) => s.textContent ?? "").join("\n"),
  };
}

function diff(label: string, before: Snap, after: Snap) {
  const lines: string[] = [];
  for (const k of Object.keys(before) as (keyof Snap)[]) {
    if (before[k] !== after[k]) {
      lines.push(`    ${k}:`);
      lines.push(`      前: ${JSON.stringify(before[k]).slice(0, 300)}`);
      lines.push(`      后: ${JSON.stringify(after[k]).slice(0, 300)}`);
    }
  }
  if (lines.length) {
    console.log(`  ✗ ${label} —— 有变化：`);
    lines.forEach((l) => console.log(l));
  } else {
    console.log(`  ✓ ${label} —— <html>/<body> 无任何变化`);
  }
  return lines.length > 0;
}

console.log("\n=== 移动端菜单展开诊断 ===\n");

// --- 1) 导航菜单（移动端折叠菜单） ---
const view1 = render(
  React.createElement(MemoryRouter, null, React.createElement(Navbar))
);
const trigger = view1.getByLabelText("菜单");
const before1 = snapshot();
await act(async () => {
  trigger.dispatchEvent(new w.PointerEvent("pointerdown", { bubbles: true, cancelable: true, button: 0 }));
  trigger.dispatchEvent(new w.MouseEvent("click", { bubbles: true, cancelable: true }));
});
const after1 = snapshot();
const menuOpen = !!w.document.querySelector("[data-slot='dropdown-menu-content']");
console.log(`  菜单是否展开: ${menuOpen ? "是" : "否"}`);
const changed1 = diff("导航菜单展开", before1, after1);

// 菜单本体：portal 内容、内联样式、以及所有可能影响横向布局的属性
const content = w.document.querySelector("[data-slot='dropdown-menu-content']");
if (content) {
  console.log("\n  菜单内容 HTML 片段:");
  console.log("    " + (content.outerHTML || "").replace(/\s+/g, " ").slice(0, 700));
  console.log("  菜单内联 style:", JSON.stringify(content.getAttribute("style")));
  const wrapper = content.parentElement;
  console.log("  portal 包裹层:", wrapper?.tagName, JSON.stringify(wrapper?.getAttribute("style")));
  console.log("  portal 父节点:", wrapper?.parentElement?.tagName, "id=", wrapper?.parentElement?.id);
}
const bodyKids = [...w.document.body.children].map((el) => el.tagName + (el.id ? "#" + el.id : ""));
console.log("  body 直接子节点:", bodyKids.join(", "));
cleanup();

// --- 2) 主题菜单 ---
const view2 = render(
  React.createElement(MemoryRouter, null, React.createElement(ThemeToggle))
);
const t2 = view2.getByLabelText("切换主题");
const before2 = snapshot();
await act(async () => {
  t2.dispatchEvent(new w.PointerEvent("pointerdown", { bubbles: true, cancelable: true, button: 0 }));
  t2.dispatchEvent(new w.MouseEvent("click", { bubbles: true, cancelable: true }));
});
const changed2 = diff("主题菜单展开", before2, snapshot());
cleanup();

// --- 3) 注入样式里是否存在滚动条补偿规则 ---
const allStyles = snapshot().styles;
const compensation = /data-scroll-locked|margin-right:|padding-right:/.test(allStyles);
console.log(`\n  文档中注入的 <style> 是否含滚动条补偿规则: ${compensation ? "是" : "否"}`);
if (compensation) {
  console.log("  匹配到的规则片段:");
  for (const m of allStyles.matchAll(/[^{}]*\{[^}]*\}/g)) {
    if (/data-scroll-locked|margin-right|padding-right/.test(m[0])) {
      console.log("    " + m[0].replace(/\s+/g, " ").slice(0, 200));
    }
  }
}

console.log(
  `\n结论: ${changed1 || changed2 || compensation ? "仍存在展开时的文档级改动，需继续排查" : "展开时未对 <html>/<body> 做任何改动"}\n`
);
