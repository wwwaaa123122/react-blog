import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { profileConfig } from "../config/profile";
import { resolveAssetUrl } from "../lib/base";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { PageHeader, SectionHeading, SectionLabel } from "../components/page";
import { jsonLd, personJsonLd } from "../lib/seo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ADULT_DATE = new Date("2030-07-20T00:00:00").getTime();

function formatRemaining(ms: number): string {
  if (ms <= 0) return "成年了！";
  const days = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return days + " 天 " + h + " 小时 " + m + " 分 " + s + " 秒";
}

function Countdown() {
  // 初值同步计算：避免首帧显示空白、再被 effect 填入
  const [text, setText] = useState(() => formatRemaining(ADULT_DATE - Date.now()));
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = ADULT_DATE - Date.now();
      setText(formatRemaining(remaining));
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Card size="sm">
      <CardHeader>
        <SectionLabel>成年倒计时</SectionLabel>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{text}</p>
      </CardContent>
    </Card>
  );
}

export default function About() {
  return (
    <>
      <Seo
        title="关于我"
        description="认识一下这个博客的主人"
        path="/about/"
        ogImage={profileConfig.avatar}
      />
      {/* 单列页面：连同面包屑与标题一起收进 720px 居中列，
          否则 1080 的容器里正文只占左侧三分之二，右侧大片留白 */}
      <div className="mx-auto max-w-180">
      <Breadcrumb items={[{ label: "关于", to: "/about/" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd()) }} />
      <PageHeader title="关于我" description="认识一下这个博客的主人" />

        <div className="mb-6 flex items-center gap-4">
          <Avatar size="lg" className="size-14 shrink-0">
            <AvatarImage
              src={resolveAssetUrl(profileConfig.avatar)}
              alt={profileConfig.name}
              loading="eager"
              decoding="async"
            />
            <AvatarFallback>{profileConfig.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="text-lg font-bold tracking-tight">{profileConfig.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{profileConfig.bio}</p>
          </div>
        </div>

        <div className="mb-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>一个初中生，喜欢折腾技术、打游戏、看番。</p>
          <p>这个博客主要分享网络技术、服务器部署、内网穿透、静态网站搭建、CDN 优化、容器化部署等教程与实践经验，偶尔记录生活。</p>
        </div>

        <SectionHeading as="h3" className="mb-3">联系方式</SectionHeading>
        <div className="mb-8 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="https://space.bilibili.com/3493078983772353" target="_blank" rel="noreferrer noopener">
              <Icon name="bilibili" size={14} data-icon="inline-start" /> Bilibili
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="https://t.me/wwwaaa123122" target="_blank" rel="noreferrer noopener">
              <Icon name="telegram" size={14} data-icon="inline-start" /> Telegram
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="https://github.com/wwwaaa123122" target="_blank" rel="noreferrer noopener">
              <Icon name="github" size={14} data-icon="inline-start" /> GitHub
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="mailto:wwwaaa123122@outlook.com">
              <Mail className="size-3.5" data-icon="inline-start" /> 邮箱
            </a>
          </Button>
        </div>

        <Separator className="mb-8" />

        <SectionHeading as="h3" className="mb-3">关注领域与技术</SectionHeading>
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <SectionLabel>技术栈与开发</SectionLabel>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Preact 11 · TypeScript · Tailwind CSS v4 · Vite · shadcn/ui · Node.js
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <SectionLabel>运维与网络</SectionLabel>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Arch Linux, Cloudflare Pages/Workers, Docker, 内网穿透, CDN 优化
              </p>
            </CardContent>
          </Card>
        </div>

        <SectionHeading as="h3" className="mb-3">关于本站</SectionHeading>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          本站建于 2025 年，是一个记录个人技术探索与生活的极简博客。
          界面由 Preact 11 + shadcn/ui + Tailwind v4 搭建，采用构建期预渲染、
          自研极简路由与静态资源优化，具备完整的亮/暗主题支持与即时全局检索体验。
        </p>

        <Separator className="mb-8" />
        <Countdown />
      </div>
    </>
  );
}
