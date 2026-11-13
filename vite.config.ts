import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // base 支持环境变量覆盖：GitHub Pages 子路径部署时由 CI 传入 VITE_BASE=/react-blog/
  base: process.env.VITE_BASE || "/",
  // Preact 通过预设接管构建与 HMR：它会自动把 react / react-dom / react/jsx-runtime
  // 指向 preact/compat（含 dev 的 prefresh 热更新），源码里的 import 一行都不用改。
  plugins: [preact(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
