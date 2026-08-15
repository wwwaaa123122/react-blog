import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

const links = [
  { to: "/", label: "首页" },
  { to: "/posts", label: "文章" },
  { to: "/archive", label: "归档" },
  { to: "/friends", label: "友链" },
  { to: "/about", label: "关于" },
];

export default function Navbar() {
  const loc = useLocation();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 w-full max-w-[880px] items-center justify-between px-5">
        <Link to="/" className="text-lg font-bold tracking-tight text-foreground">
          "Blog."
        </Link>
        <nav className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                loc.pathname === link.to || (link.to !== "/" && loc.pathname.startsWith(link.to))
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
