import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { assetUrl } from "../lib/base";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link to="/">{siteConfig.author}</Link> · {siteConfig.subtitle} ·
          Powered by React &amp; Vite
        </p>
        <p style={{ marginTop: 4 }}>
          <Link to="/">首页</Link>
          {" · "}
          <Link to="/posts">文章</Link>
          {" · "}
          <Link to="/archive">归档</Link>
          {" · "}
          <Link to="/friends">友链</Link>
          {" · "}
          <Link to="/about">关于</Link>
          {" · "}
          <a href={assetUrl("llms.txt")} target="_blank" rel="noreferrer noopener">llms.txt</a>
          {" · "}
          <a href={assetUrl("sitemap.xml")} target="_blank" rel="noreferrer noopener">sitemap</a>
        </p>
      </div>
    </footer>
  );
}
