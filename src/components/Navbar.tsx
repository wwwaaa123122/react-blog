import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ExternalLink, Menu, X } from "lucide-react";
import { navLinks } from "../config/nav";
import { siteConfig } from "../config/site";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const desktopCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-1.5 rounded-[9px] px-3 py-[7px] text-[14.5px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
      isActive && "bg-accent text-primary hover:text-primary"
    );

  const mobileCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
      isActive && "bg-accent text-primary hover:text-primary"
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] w-full max-w-[880px] items-center justify-between gap-4 px-5">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 text-[17px] font-bold tracking-[0.3px] text-foreground"
          onClick={() => setOpen(false)}
        >
          <span className="brand-logo h-[34px] w-[34px] rounded-[10px] text-base">
            萤
          </span>
          <span>{siteConfig.title}</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex list-none items-center gap-0.5">
            {navLinks.map((link) => (
              <li key={link.to ?? link.name}>
                {link.to ? (
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={desktopCls}
                  >
                    {link.name}
                  </NavLink>
                ) : (
                  <a
                    className={desktopCls({ isActive: false })}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {link.name}
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="菜单"
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto flex w-full max-w-[880px] flex-col gap-0.5 px-5 py-4">
            {navLinks.map((link) =>
              link.to ? (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={mobileCls}
                  onClick={() => setOpen(false)}
                >
                  {link.name}
                </NavLink>
              ) : (
                <a
                  key={link.name}
                  className={mobileCls({ isActive: false })}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {link.name}
                  <ExternalLink className="size-3" />
                </a>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
