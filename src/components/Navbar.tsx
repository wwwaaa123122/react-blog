import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { BarChart3, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { Icon } from "../components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { to: "/", label: "首页" },
  { to: "/posts", label: "文章" },
  { to: "/archive", label: "归档" },
  { to: "/friends", label: "友链" },
  { to: "/about", label: "关于" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-background/50"
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-[900px] items-center justify-between px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-foreground shrink-0">
          <span className="font-bold text-base tracking-tight">Starlr</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "text-primary bg-primary-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link to="/posts?tag=" aria-label="搜索">
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <Search className="size-4" />
            </Button>
          </Link>
          <a href="https://github.com/wwwaaa123122" target="_blank" rel="noreferrer noopener" aria-label="GitHub">
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <Icon name="github" size={16} />
            </Button>
          </a>
          <a href="https://umami.xc-lr.cn/share/FNH4YZYF9xPh0Xjt" target="_blank" rel="noreferrer noopener" aria-label="统计">
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hidden sm:inline-flex">
              <BarChart3 className="size-4" />
            </Button>
          </a>
          <ThemeToggle />
          {/* Mobile: popover menu instead of full-width block */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" aria-label="菜单">
                  <Menu className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                {links.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive }) => cn(
                        "w-full",
                        isActive && "font-semibold text-primary"
                      )}
                    >
                      {link.label}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <a href="https://umami.xc-lr.cn/share/FNH4YZYF9xPh0Xjt" target="_blank" rel="noreferrer noopener" className="w-full">
                    <BarChart3 className="size-3.5 mr-2" />
                    统计
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
