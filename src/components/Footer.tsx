import { Link } from "react-router-dom";
import { ArrowUp, Rss } from "lucide-react";
import { siteConfig } from "../config/site";
import { Icon } from "../components/icons";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-[900px] px-5 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} {siteConfig.author}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{siteConfig.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">首页</Link>
            <Link to="/posts" className="text-xs text-muted-foreground hover:text-foreground transition-colors">文章</Link>
            <Link to="/archive" className="text-xs text-muted-foreground hover:text-foreground transition-colors">归档</Link>
            <Link to="/friends" className="text-xs text-muted-foreground hover:text-foreground transition-colors">友链</Link>
            <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">关于</Link>
            <span className="text-muted-foreground/30">|</span>
            <a href="https://github.com/wwwaaa123122" target="_blank" rel="noreferrer noopener" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
              <Icon name="github" size={16} />
            </a>
            <a href="/rss.xml" target="_blank" rel="noreferrer noopener" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="RSS">
              <Rss className="size-4" />
            </a>
            <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" onClick={scrollTop} aria-label="回到顶部">
              <ArrowUp className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
