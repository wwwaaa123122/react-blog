import { siteConfig } from "../config/site";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-[880px] px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.author}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">首页</a>
          <a href="/posts" className="hover:text-foreground transition-colors">文章</a>
          <a href="/archive" className="hover:text-foreground transition-colors">归档</a>
          <a href="/friends" className="hover:text-foreground transition-colors">友链</a>
          <a href="/about" className="hover:text-foreground transition-colors">关于</a>
          <a href="https://github.com/wwwaaa123122" target="_blank" rel="noreferrer noopener" className="hover:text-foreground transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
