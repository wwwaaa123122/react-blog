import { useState } from "react";
import { Check, Copy, ExternalLink, Link2, UserRound } from "lucide-react";
import {
  getEnabledFriends,
  siteInfo,
  friendNotes,
  friendTemplate,
} from "../config/friends";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 shrink-0 rounded-[7px] text-muted-foreground"
      onClick={copy}
      aria-label="复制"
      title="复制"
    >
      {copied ? (
        <Check className="size-3.5 text-primary" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </Button>
  );
}

export default function Friends() {
  const friends = getEnabledFriends();

  const infoRows = [
    { label: "站点名称", value: siteInfo.name },
    { label: "站点描述", value: siteInfo.desc },
    { label: "站点链接", value: siteInfo.url },
    { label: "头像链接", value: siteInfo.avatar },
  ];

  const steps = [
    {
      title: "添加本站友链",
      desc: "请先在您的网站友链页面添加本站信息，可直接复制左侧各字段",
    },
    {
      title: "评论区留言或发送申请邮件",
      desc: (
        <>
          请将右侧邮箱复制到邮件客户端，或直接点击：
          <code className="rounded-[5px] border border-border bg-muted px-1.5 py-px font-mono text-[12px] text-primary [overflow-wrap:anywhere]">
            {siteInfo.email}
          </code>
        </>
      ),
    },
    {
      title: "等待审核",
      desc: "确认信息无误后会尽快添加您的友链",
    },
  ];

  return (
    <>
      <Seo
        title="友链"
        description="友情链接与友链申请方式，与优秀的朋友们一起成长"
        path="/friends"
      />
      <Breadcrumb items={[{ label: "友链", to: "/friends" }]} />

      <div className="mb-6">
        <h1 className="text-[26px] font-extrabold tracking-[0.5px]">友链</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          与优秀的朋友们一起成长
        </p>
      </div>

      {/* 申请信息 */}
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
            <Link2 className="size-[18px] text-primary" />
            本站信息
          </h3>
          {infoRows.map((item) => (
            <div
              key={item.label}
              className="mb-2 flex items-center justify-between gap-2 rounded-[9px] bg-muted/60 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-[11.5px] text-muted-foreground">
                  {item.label}
                </p>
                <p
                  className="min-w-0 text-[12.8px] font-medium [overflow-wrap:anywhere] [word-break:break-all]"
                  title={item.value}
                >
                  {item.value}
                </p>
              </div>
              <CopyButton text={item.value} />
            </div>
          ))}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold">
            <UserRound className="size-[18px] text-primary" />
            申请友链
          </h3>
          <ol className="space-y-4">
            {steps.map((s, i) => (
              <li key={i} className="relative flex gap-3">
                {i < steps.length - 1 && (
                  <span className="absolute bottom-[-4px] left-[13px] top-[30px] w-[2px] bg-border" />
                )}
                <span className="z-10 flex size-[27px] shrink-0 items-center justify-center rounded-full bg-primary text-[12.5px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold [overflow-wrap:anywhere]">
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-muted-foreground [overflow-wrap:anywhere]">
                    {s.desc}
                  </p>
                  {i === 1 && (
                    <div className="relative mt-2 rounded-[9px] border border-border bg-muted/60 p-3 pr-10 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-muted-foreground [overflow-wrap:anywhere] [word-break:break-word]">
                      {friendTemplate}
                      <span className="absolute right-2 top-2">
                        <CopyButton text={friendTemplate} />
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* 注意事项 */}
      <Card className="mb-4 p-5">
        <h3 className="mb-3.5 flex items-center gap-2 text-[15.5px] font-bold">
          <Badge variant="outline" className="h-5 w-fit">
            提示
          </Badge>
          注意事项
        </h3>
        {friendNotes.map((note) => (
          <div
            key={note.title}
            className="flex items-baseline gap-2.5 py-[7px] text-[13.8px] text-muted-foreground"
          >
            <span className="size-[7px] shrink-0 translate-y-[-1px] rounded-full bg-primary" />
            <p className="min-w-0 [overflow-wrap:anywhere]">
              <strong className="font-semibold text-foreground">
                {note.title}
              </strong>
              ：{note.content}
            </p>
          </div>
        ))}
      </Card>

      {/* 友链列表 */}
      <h2 className="mb-4 mt-8 flex items-center gap-2.5 text-[17px] font-bold">
        <span className="h-[18px] w-1 rounded-[3px] bg-primary" />
        友链列表（{friends.length}）
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {friends.map((f) => (
          <a
            key={f.title}
            className="flex min-w-0 items-start gap-3.5 rounded-xl bg-card p-[18px] ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            href={f.siteurl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {f.imgurl ? (
              <img
                className="size-[52px] shrink-0 rounded-[14px] border border-border bg-muted object-cover"
                src={f.imgurl}
                alt={f.title}
                loading="lazy"
              />
            ) : (
              <span className="grid size-[52px] shrink-0 place-items-center rounded-[14px] border border-border bg-muted text-xl font-bold text-primary">
                {f.title.charAt(0)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[15px] font-bold text-foreground [overflow-wrap:anywhere] [word-break:break-word]">
                {f.title}
                <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
              </p>
              <p className="mt-1 line-clamp-2 text-[12.8px] leading-relaxed text-muted-foreground [overflow-wrap:anywhere] [word-break:break-word]">
                {f.desc}
              </p>
              {f.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {f.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[11px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
