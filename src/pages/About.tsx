import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { profileConfig } from "../config/profile";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { assetUrl } from "../lib/base";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ADULT_DATE = new Date("2030-07-20T00:00:00").getTime();

function Countdown() {
  const [text, setText] = useState("");

  useEffect(() => {
    const update = () => {
      const distance = ADULT_DATE - Date.now();
      if (distance <= 0) {
        setText("成年了！🎉🎉🎉");
        return false;
      }
      const days = Math.floor(distance / 86400000);
      const hours = Math.floor((distance % 86400000) / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);
      setText(days + " 天 " + hours + " 小时 " + minutes + " 分 " + seconds + " 秒");
      return true;
    };
    update();
    const timer = setInterval(() => {
      if (!update()) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <p className="countdown-title">成年倒计时</p>
      <p className="countdown-value">{text}</p>
    </div>
  );
}

export default function About() {
  return (
    <>
      <Seo title="关于我" description="认识一下这个博客的主人" path="/about" />
      <Breadcrumb items={[{ label: "关于", to: "/about" }]} />

      <div className="mb-6">
        <h1 className="text-[26px] font-extrabold tracking-[0.5px]">关于我</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          认识一下这个博客的主人
        </p>
      </div>

      <Card className="p-8 sm:p-9">
        <div className="flex items-center gap-[18px]">
          <Avatar size="lg" className="size-[72px]">
            <AvatarImage src={profileConfig.avatar} alt={profileConfig.name} />
            <AvatarFallback>{profileConfig.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold">{profileConfig.name}</h2>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              {profileConfig.bio}
            </p>
          </div>
        </div>

        <div className="markdown mt-5">
          <p>一个初中生，喜欢折腾技术、打游戏、看番。</p>
          <p>
            这个博客主要分享网络技术、服务器部署、内网穿透、静态网站搭建、CDN
            优化、容器化部署等教程与实践经验，偶尔记录生活。
          </p>
        </div>

        <h3 className="mt-6 text-base font-bold">联系我</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-[11px] border border-border bg-muted/50 px-4 py-3">
            <img
              className="size-[38px] shrink-0 rounded-[9px] object-cover"
              src={assetUrl("/images/qiwei.svg")}
              alt="企业微信"
            />
            <div className="min-w-0">
              <p className="text-[13px] text-muted-foreground">企业微信</p>
              <p className="text-[14px] font-semibold [overflow-wrap:anywhere]">
                星辰旅人
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[11px] border border-border bg-muted/50 px-4 py-3">
            <img
              className="size-[38px] shrink-0 rounded-[9px] object-cover"
              src={assetUrl("/images/QQ.svg")}
              alt="QQ"
            />
            <div className="min-w-0">
              <p className="text-[13px] text-muted-foreground">QQ</p>
              <p className="text-[14px] font-semibold [overflow-wrap:anywhere]">
                3385016019
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[11px] border border-border bg-muted/50 px-4 py-3">
            <span className="grid size-[38px] shrink-0 place-items-center rounded-[9px] bg-accent text-accent-foreground">
              <Mail className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-muted-foreground">邮箱</p>
              <p className="text-[14px] font-semibold [overflow-wrap:anywhere]">
                <a href="mailto:i@mcxclr.top" className="hover:underline">
                  i@mcxclr.top
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button asChild variant="outline" className="rounded-full">
            <a
              href="https://space.bilibili.com/3493078983772353"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon name="bilibili" size={16} />
              Bilibili
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <a
              href="https://t.me/wwwaaa123122"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon name="telegram" size={16} />
              Telegram
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <a
              href="https://github.com/wwwaaa123122"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon name="github" size={16} />
              GitHub
            </a>
          </Button>
        </div>

        <Countdown />
      </Card>
    </>
  );
}
