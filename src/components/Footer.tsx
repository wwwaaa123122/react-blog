import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { assetUrl } from "../lib/base";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-6 text-center text-[13px] text-muted-foreground">
      <div className="mx-auto w-full max-w-[880px] px-5">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
            {siteConfig.author}
          </Link>
          {" · "}
          {siteConfig.subtitle} · Powered by React &amp; Vite
        </p>
        <p className="mt-1">
          <Link to="/" className="text-muted-foreground transition-colors hover:text-primary">
            首页
          </Link>
          {" · "}
          <Link to="/posts" className="text-muted-foreground transition-colors hover:text-primary">
            文章
          </Link>
          {" · "}
          <Link to="/archive" className="text-muted-foreground transition-colors hover:text-primary">
            归档
          </Link>
          {" · "}
          <Link to="/friends" className="text-muted-foreground transition-colors hover:text-primary">
            友链
          </Link>
          {" · "}
          <Link to="/about" className="text-muted-foreground transition-colors hover:text-primary">
            关于
          </Link>
          {" · "}
          <a
            href={assetUrl("llms.txt")}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            llms.txt
          </a>
          {" · "}
          <a
            href={assetUrl("sitemap.xml")}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            sitemap
          </a>
        </p>
      </div>
    </footer>
  );
}
