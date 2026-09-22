import { Link } from "react-router-dom";
import { ArrowUp, FileText, Rss } from "lucide-react";
import { siteConfig } from "../config/site";
import { Icon } from "./icons";
import { assetUrl } from "../lib/base";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { to: "/", label: "首页" },
  { to: "/posts", label: "文章" },
  { to: "/archive", label: "归档" },
  { to: "/friends", label: "友链" },
  { to: "/about", label: "关于" },
];

const iconLinks = [
  { href: "https://github.com/wwwaaa123122", label: "GitHub", external: true, icon: "github" as const },
  { href: "/rss.xml", label: "RSS", external: true, icon: "rss" as const },
  { href: "/llms.txt", label: "llms.txt", external: true, icon: "llms" as const },
];

// 页脚：移动端两行（版权 + 链接），桌面端一行左右分布。
// 之间用 Separator 分隔，间距统一走 gap，避免小屏挤成一团。
export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-[900px] px-5 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <p className="text-xs text-muted-foreground sm:text-sm">
            &copy; {new Date().getFullYear()} {siteConfig.author}
            <span className="mx-1.5 hidden sm:inline">·</span>
            <span className="hidden sm:inline">{siteConfig.title}</span>
          </p>

          <div className="flex items-center gap-0.5 sm:gap-1">
            {navLinks.map((l) => (
              <Button key={l.to} asChild variant="link" size="sm" className="px-1.5 text-xs sm:px-2.5 sm:text-[0.8rem]">
                <Link to={l.to}>{l.label}</Link>
              </Button>
            ))}

            <Separator orientation="vertical" className="mx-1 h-3.5 sm:mx-2 sm:h-4" />

            {iconLinks.map((l) => (
              <Button
                key={l.label}
                asChild
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                aria-label={l.label}
                title={l.label}
              >
                <a
                  href={l.icon === "github" ? l.href : assetUrl(l.href)}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer noopener" : undefined}
                >
                  {l.icon === "github" ? (
                    <Icon name="github" size={15} />
                  ) : l.icon === "rss" ? (
                    <Rss className="size-3.5" />
                  ) : (
                    <FileText className="size-3.5" />
                  )}
                </a>
              </Button>
            ))}

            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              onClick={scrollTop}
              aria-label="回到顶部"
              title="回到顶部"
            >
              <ArrowUp className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
