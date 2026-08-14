import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // base 支持环境变量覆盖：GitHub Pages 子路径部署时由 CI 传入 VITE_BASE=/react-blog/
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
