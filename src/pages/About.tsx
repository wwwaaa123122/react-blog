import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { profileConfig } from "../config/profile";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { jsonLd, personJsonLd } from "../lib/seo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ADULT_DATE = new Date("2030-07-20T00:00:00").getTime();

function Countdown() {
  const [text, setText] = useState("");
  useEffect(() => {
    const update = () => {
      const d = ADULT_DATE - Date.now();
      if (d <= 0) { setText("成年了！"); return false; }
      const days = Math.floor(d / 86400000);
      const h = Math.floor((d % 86400000) / 3600000);
      const m = Math.floor((d % 3600000) / 60000);
      const s = Math.floor((d % 60000) / 1000);
      setText(days + " 天 " + h + " 小时 " + m + " 分 " + s + " 秒");
      return true;
    };
    update();
    const timer = setInterval(() => { if (!update()) clearInterval(timer); }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Badge variant="secondary" className="text-xs">成年倒计时</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold tabular-nums">{text}</p>
      </CardContent>
    </Card>
  );
}

export default function About() {
  return (
    <>
      <Seo title="关于我" description="认识一下这个博客的主人" path="/about/" />
      <Breadcrumb items={[{ label: "关于", to: "/about/" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd()) }} />
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">关于我</h1>
        <p className="text-sm text-muted-foreground">认识一下这个博客的主人</p>
      </div>
      <div className="max-w-[600px]">
        <div className="flex items-center gap-4 mb-6">
          <Avatar size="lg" className="size-14">
            <AvatarImage src={profileConfig.avatar} alt={profileConfig.name} />
          </Avatar>
          <div className="min-w-0">
            <h2 className="text-lg font-bold">{profileConfig.name}</h2>
            <p className="text-sm text-muted-foreground">{profileConfig.bio}</p>
          </div>
        </div>

        <div className="prose-sm text-muted-foreground space-y-3 mb-8">
          <p>一个初中生，喜欢折腾技术、打游戏、看番。</p>
          <p>这个博客主要分享网络技术、服务器部署、内网穿透、静态网站搭建、CDN 优化、容器化部署等教程与实践经验，偶尔记录生活。</p>
        </div>

        <h3 className="text-sm font-bold mb-3">联系方式</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href="https://space.bilibili.com/3493078983772353" target="_blank" rel="noreferrer noopener"><Icon name="bilibili" size={14} /> Bilibili</a>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href="https://t.me/wwwaaa123122" target="_blank" rel="noreferrer noopener"><Icon name="telegram" size={14} /> Telegram</a>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href="https://github.com/wwwaaa123122" target="_blank" rel="noreferrer noopener"><Icon name="github" size={14} /> GitHub</a>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href="mailto:wwwaaa123122@outlook.com"><Mail className="size-3.5" /> 邮箱</a>
          </Button>
        </div>

        <Separator className="mb-6" />
        <Countdown />
      </div>
    </>
  );
}
