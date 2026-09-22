import { Link } from "react-router-dom";
import { ArrowUp, FileText, Rss } from "lucide-react";
import { siteConfig } from "../config/site";
import { Icon } from "./icons";
import { assetUrl } from "../lib/base";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          <div className="flex items-center gap-1">
            <Button asChild variant="link" size="sm">
              <Link to="/">首页</Link>
            </Button>
            <Button asChild variant="link" size="sm">
              <Link to="/posts">文章</Link>
            </Button>
            <Button asChild variant="link" size="sm">
              <Link to="/archive">归档</Link>
            </Button>
            <Button asChild variant="link" size="sm">
              <Link to="/friends">友链</Link>
            </Button>
            <Button asChild variant="link" size="sm">
              <Link to="/about">关于</Link>
            </Button>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="ghost" size="sm" aria-label="GitHub">
                    <a href="https://github.com/wwwaaa123122" target="_blank" rel="noreferrer noopener">
                      <Icon name="github" size={16} />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>GitHub</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="ghost" size="sm" aria-label="RSS">
                    <a href={assetUrl("/rss.xml")} target="_blank" rel="noreferrer noopener">
                      <Rss className="size-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>RSS</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="ghost" size="sm" aria-label="llms.txt">
                    <a href={assetUrl("/llms.txt")} target="_blank" rel="noreferrer noopener">
                      <FileText className="size-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>llms.txt</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={scrollTop} aria-label="回到顶部">
                    <ArrowUp className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>回到顶部</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </footer>
  );
}
