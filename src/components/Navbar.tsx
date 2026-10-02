import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Archive, BarChart3, BookOpen, Home as HomeIcon, Link2, Menu, Search, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./theme-toggle";
import SearchDialog from "./SearchDialog";
import { Icon } from "./icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { to: "/", label: "首页", icon: "home" },
  { to: "/posts", label: "文章", icon: "book" },
  { to: "/archive", label: "归档", icon: "archive" },
  { to: "/friends", label: "友链", icon: "link" },
  { to: "/about", label: "关于", icon: "user" },
];

function linkIcon(icon: string, className: string) {
  switch (icon) {
    case "home": return <HomeIcon className={className} />;
    case "book": return <BookOpen className={className} />;
    case "archive": return <Archive className={className} />;
    case "link": return <Link2 className={className} />;
    case "user": return <User className={className} />;
    default: return null;
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-200",
          scrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-xs"
            : "bg-background/50"
        )}
      >
        <div className="mx-auto flex h-14 w-full max-w-230 md:max-w-250 lg:max-w-280 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 text-foreground shrink-0 group">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="font-bold text-base tracking-tight">Starlr</span>
          </Link>

          <nav aria-label="主导航" className="hidden md:flex items-center gap-1">
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

          <div className="flex items-center gap-1 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="搜索 (⌘K)"
              title="全局搜索 (⌘K)"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-4" />
            </Button>
            <Button asChild variant="ghost" size="icon-lg" aria-label="GitHub">
              <a href="https://github.com/wwwaaa123122" target="_blank" rel="noreferrer noopener">
                <Icon name="github" size={16} />
              </a>
            </Button>
            <div className="hidden sm:inline-flex">
              <Button asChild variant="ghost" size="icon-lg" aria-label="统计">
                <a href="https://umami.xc-lr.cn/share/FNH4YZYF9xPh0Xjt" target="_blank" rel="noreferrer noopener">
                  <BarChart3 className="size-4" />
                </a>
              </Button>
            </div>
            <ThemeToggle />
            <div className="md:hidden">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-lg" aria-label="菜单">
                    <Menu className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-40">
                  <DropdownMenuItem onClick={() => setSearchOpen(true)}>
                    <Search className="size-3.5" />
                    全局搜索 (⌘K)
                  </DropdownMenuItem>
                  {links.map((link) => (
                    <DropdownMenuItem key={link.to} asChild>
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        className={({ isActive }) => cn(
                          "w-full flex items-center gap-2",
                          isActive && "font-semibold text-primary"
                        )}
                      >
                        {linkIcon(link.icon, "size-3.5")}
                        {link.label}
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem asChild>
                    <a href="https://umami.xc-lr.cn/share/FNH4YZYF9xPh0Xjt" target="_blank" rel="noreferrer noopener" className="w-full flex items-center gap-2">
                      <BarChart3 className="size-3.5" />
                      统计
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
