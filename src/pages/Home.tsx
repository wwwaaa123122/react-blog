import { Link } from "react-router-dom";
import { profileConfig } from "../config/profile";
import { siteConfig } from "../config/site";
import { publishedPosts, getAllTags } from "../lib/posts";
import PostCard from "../components/PostCard";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import { jsonLd, websiteJsonLd } from "../lib/seo";
import { useEffect, useState } from "react";

const iconNames = {
  github: "github",
  x: "x",
  telegram: "telegram",
  mail: "mail",
  bilibili: "bilibili",
} as const;

export default function Home() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const recent = publishedPosts.slice(0, 5);
  const totalWords = publishedPosts.reduce((sum, p) => sum + p.words, 0);
  const siteStart = new Date(siteConfig.since, 0, 1);
  const days = Math.max(
    0,
    Math.floor((now.getTime() - siteStart.getTime()) / 86400000)
  );

  return (
    <>
      <Seo
        title={siteConfig.title}
        description={siteConfig.description}
        path="/"
        keywords={siteConfig.keywords}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd()) }}
      />

      {/* 个人资料 */}
      <section className="card hero">
        <div className="hero-inner">
          <div className="avatar-wrap">
            <img className="avatar" src={profileConfig.avatar} alt={profileConfig.name} />
            <span className="avatar-status" title="在线" />
          </div>
          <h1 className="hero-name">{profileConfig.name}</h1>
          <p className="hero-bio">{profileConfig.bio}</p>
          <span className="hero-slogan">✦ {siteConfig.subtitle} ✦</span>

          <div className="hero-links">
            {profileConfig.links.map((link) => (
              <a
                key={link.name}
                className="social-btn"
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Icon name={iconNames[link.icon] ?? "link"} size={16} />
                {link.name}
              </a>
            ))}
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">{publishedPosts.length}</div>
              <div className="stat-label">文章</div>
            </div>
            <div className="stat">
              <div className="stat-value">{getAllTags().length}</div>
              <div className="stat-label">标签</div>
            </div>
            <div className="stat">
              <div className="stat-value">{totalWords}</div>
              <div className="stat-label">字数</div>
            </div>
            <div className="stat">
              <div className="stat-value">{days}</div>
              <div className="stat-label">建站天数</div>
            </div>
          </div>
        </div>
      </section>

      {/* 最新文章 */}
      <h2 className="section-title">最新文章</h2>
      {recent.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      {publishedPosts.length > 5 && (
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <Link className="btn btn-ghost" to="/posts">
            查看全部文章 →
          </Link>
        </div>
      )}
    </>
  );
}
