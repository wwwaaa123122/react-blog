// 预渲染入口：先注入构建环境（POSTS_DIR / VITE_BASE），再动态加载 prerender.tsx。
// 必须用动态 import —— ESM 静态 import 会先于任何代码执行，导致 posts.ts 读不到环境变量。
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.env.POSTS_DIR = process.env.POSTS_DIR || join(root, "src/posts");
process.env.VITE_BASE = process.env.VITE_BASE || "/";

await import("./prerender.tsx");
