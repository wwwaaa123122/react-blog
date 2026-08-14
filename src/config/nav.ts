import type { NavLink } from "../types";

export const navLinks: NavLink[] = [
  { name: "首页", to: "/" },
  { name: "文章", to: "/posts" },
  { name: "归档", to: "/archive" },
  { name: "友链", to: "/friends" },
  { name: "关于", to: "/about" },
  { name: "管理", to: "/admin" },
  { name: "GitHub", url: "https://github.com/wwwaaa123122", external: true },
  {
    name: "统计",
    url: "https://umami.xc-lr.cn/share/FNH4YZYF9xPh0Xjt",
    external: true,
  },
];
