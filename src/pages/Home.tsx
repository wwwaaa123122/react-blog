import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { profileConfig } from "../config/profile";
import { siteConfig } from "../config/site";
import { publishedPosts, getAllTags } from "../lib/posts";
import PostCard from "../components/PostCard";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import { jsonLd, websiteJsonLd } from "../lib/seo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const stats = [
    { value: publishedPosts.length, label: "文章" },
    { value: getAllTags().length, label: "标签" },
    { value: totalWords, label: "字数" },
    { value: days, label: "建站天数" },
  ];

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
      <Card className="relative overflow-hidden px-8 py-10 text-center sm:px-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(500px 220px at 50% -40px, var(--primary-soft), transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="relative inline-block">
            <img
              className="h-[110px] w-[110px] rounded-full border-4 border-background object-cover shadow-xl ring-2 ring-primary"
              src={profileConfig.avatar}
              alt={profileConfig.name}
            />
            <span
              className="absolute bottom-[10px] right-[6px] h-[22px] w-[22px] rounded-full bg-green-500 ring-[3px] ring-background"
              title="在线"
            />
          </div>
          <h1 className="mt-[18px] text-[26px] font-extrabold tracking-[1px]">
            {profileConfig.name}
          </h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">
            {profileConfig.bio}
          </p>
          <span className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1 text-[13px] font-semibold text-accent-foreground">
            ✦ {siteConfig.subtitle} ✦
          </span>

          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {profileConfig.links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-[7px] rounded-full border border-border bg-card px-4 py-2 text-[13.5px] font-semibold text-muted-foreground transition-all hover:-translate-y-px hover:border-primary hover:text-primary"
              >
                {link.icon === "mail" ? (
                  <Mail className="size-4" />
                ) : (
                  <Icon name={link.icon} size={16} />
                )}
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-6 flex justify-center border-t border-border pt-5">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={
                  "max-w-[160px] flex-1 text-center" +
                  (i > 0 ? " border-l border-border" : "")
                }
              >
                <div className="text-[21px] font-extrabold text-primary">
                  {s.value}
                </div>
                <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 最新文章 */}
      <h2 className="mb-4 mt-8 flex items-center gap-2.5 text-[17px] font-bold">
        <span className="h-[18px] w-1 rounded-[3px] bg-primary" />
        最新文章
      </h2>
      {recent.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      {publishedPosts.length > 5 && (
        <div className="mt-2 text-center">
          <Button asChild variant="outline">
            <Link to="/posts">查看全部文章 →</Link>
          </Button>
        </div>
      )}
    </>
  );
}
