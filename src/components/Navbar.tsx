import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 w-full max-w-[880px] items-center justify-between px-5">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight text-foreground"
        >
          Blog.
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/posts" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            文章
          </Link>
          <Link to="/friends" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            友链
          </Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            关于
          </Link>
          <Link to="/archive" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            归档
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
