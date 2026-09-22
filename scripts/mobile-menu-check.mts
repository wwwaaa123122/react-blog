// 回归检查：移动端导航菜单展开时不得给 <body> 注入滚动条补偿布局。
//
// 背景：Radix 的 modal 菜单（默认 modal=true）会通过 RemoveScroll 消除页面滚动条，
// 并向文档注入 `body[data-scroll-locked] { margin-right: <gap>px !important }`
// （react-remove-scroll-bar 的 gapMode 默认是 "margin"）。
// 移动端滚动条宽度一旦被测量就会被单例缓存，于是菜单展开时居中的主内容整体左移。
// 导航菜单不需要锁定页面滚动，因此 Root 必须传 modal={false}。
//
// 用法: npx tsx scripts/mobile-menu-check.mts
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import ThemeToggle from "../src/components/theme-toggle";

// 布局相关的组件在 Node 下渲染需要文章目录（与 scripts/prerender.tsx 同样的注入）
process.env.POSTS_DIR = process.env.POSTS_DIR || "src/posts";
(globalThis as unknown as { __BASE_URL__?: string }).__BASE_URL__ = "/";
(globalThis as unknown as { __POSTS_DIR__?: string }).__POSTS_DIR__ = "src/posts";

const failures: string[] = [];
const passes: string[] = [];

// 1) 静态检查源码：相关 DropdownMenu 根组件必须声明 modal={false}
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

for (const file of ["src/components/Navbar.tsx", "src/components/theme-toggle.tsx"]) {
  const src = readFileSync(join(root, file), "utf-8");
  const roots = [...src.matchAll(/<DropdownMenu(\s[^>]*)?>/g)].map((m) => m[1] ?? "");
  if (roots.length === 0) {
    failures.push(`${file}: 未找到 <DropdownMenu> 根组件`);
    continue;
  }
  const bad = roots.filter((attrs) => !/modal=\{false\}/.test(attrs));
  if (bad.length) {
    failures.push(
      `${file}: ${bad.length} 处 <DropdownMenu> 未设置 modal={false}（会导致 body margin-right 补偿、内容左移）`
    );
  } else {
    passes.push(`${file}: DropdownMenu 均为非模态（modal={false}）`);
  }
}

// 2) 渲染检查：非模态菜单展开时，输出中不应出现 aria-modal / 滚动锁标记
const markup = renderToStaticMarkup(
  React.createElement(
    MemoryRouter,
    null,
    React.createElement(Navbar),
    React.createElement(ThemeToggle)
  )
);
if (/data-scroll-locked|aria-modal="true"/.test(markup)) {
  failures.push("导航菜单渲染输出出现模态标记（data-scroll-locked / aria-modal）");
} else {
  passes.push("导航菜单渲染输出无模态标记");
}

// 3) 移动端主交互元素：逐个整页渲染，捕获 Slot/Slottable 之类的结构性错误，
//    以及"回到顶部"这类必须存在的移动端交互入口
const pages: Array<[string, () => Promise<{ default: React.ComponentType }>]> = [
  ["Home", () => import("../src/pages/Home")],
  ["Posts", () => import("../src/pages/Posts")],
  ["Components", () => import("../src/pages/Components")],
];
for (const [name, load] of pages) {
  try {
    const mod = await load();
    const html = renderToStaticMarkup(
      React.createElement(MemoryRouter, null, React.createElement(mod.default))
    );
    passes.push(`${name}: 整页渲染通过 (${html.length} 字节)`);
  } catch (e) {
    failures.push(`${name}: 整页渲染失败 -> ${(e as Error).message}`);
  }
}

// 4) 移动端固定元素检查：回到顶部按钮必须存在且不被 Tooltip 包裹（触屏无 hover）
const backToTopSrc = readFileSync(join(root, "src/components/BackToTop.tsx"), "utf-8");
if (!/aria-label="回到顶部"/.test(backToTopSrc)) {
  failures.push("BackToTop: 缺少 aria-label=\"回到顶部\"");
} else if (/TooltipProvider/.test(backToTopSrc)) {
  failures.push("BackToTop: 仍被 Tooltip 包裹（触屏长按会弹系统菜单）");
} else {
  passes.push("BackToTop: 移动端无 Tooltip、含可访问名称");
}

// 已知第三方噪音：input-otp 未受控时会同时传 value 与 defaultValue 给内部 input，
// 渲染 Components 页时 React 会打印受控/非受控警告，这里静默掉。
const originalWarn = console.warn.bind(console);
console.warn = (...args: unknown[]): void => {
  const first = typeof args[0] === "string" ? args[0] : "";
  if (first.includes("both value and defaultValue props")) return;
  originalWarn(...args);
};

console.log("\n=== 移动端菜单布局回归检查 ===");
for (const p of passes) console.log("  ✓ " + p);
for (const f of failures) console.log("  ✗ " + f);
if (failures.length) {
  console.log(`\n${failures.length} 项失败\n`);
  process.exit(1);
}
console.log(`\n全部通过（${passes.length} 项）\n`);
