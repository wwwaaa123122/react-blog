import { useState } from "react";
import {
  Check, Copy, ExternalLink, Globe, Image as ImageIcon,
  Info, Link2, Mail, MessageSquareText, UserRound, Users,
} from "lucide-react";
import {
  getEnabledFriends, siteInfo, friendNotes, friendTemplate,
} from "../config/friends";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return { copied, copy };
}

function CopyIconButton({ text, label = "复制" }: { text: string; label?: string }) {
  const { copied, copy } = useCopy();
  return (
    <Button variant="ghost" size="icon" className="size-7 shrink-0 rounded-[7px] text-muted-foreground"
      onClick={() => copy(text)} aria-label={label} title={label}>
      {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
    </Button>
  );
}

const infoFields = [
  { key: "name", label: "站点名称", icon: Globe },
  { key: "desc", label: "站点描述", icon: MessageSquareText },
  { key: "url", label: "站点链接", icon: Link2 },
  { key: "avatar", label: "头像链接", icon: ImageIcon },
] as const;

export default function Friends() {
  const friends = getEnabledFriends();
  const { copied, copy } = useCopy();
  const siteInfoBlock = ["站点名称：" + siteInfo.name, "站点描述：" + siteInfo.desc, "站点链接：" + siteInfo.url, "头像链接：" + siteInfo.avatar].join("\n");
  const steps = [
    { title: "添加本站友链", desc: "请先在您的网站友链页面添加本站信息，可直接复制下方内容" },
    { title: "提交申请", desc: (<>将申请邮件发送至 <a href={"mailto:" + siteInfo.email} className="font-semibold text-primary hover:underline [overflow-wrap:anywhere]">{siteInfo.email}</a>，或使用下方模板在评论区留言</>) },
    { title: "等待审核", desc: "确认信息无误后会尽快添加您的友链" },
  ];
  return (
    <>
      <Seo title="友链" description="友情链接与友链申请方式，与优秀的朋友们一起成长" path="/friends" />
      <Breadcrumb items={[{ label: "友链", to: "/friends" }]} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-2">友链</h1>
          <p className="text-base text-muted-foreground">与优秀的朋友们一起成长</p>
        </div>
        <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-sm"><Users className="size-3.5" />共 {friends.length} 位朋友</Badge>
      </div>
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2.5 text-lg font-bold">
              <span className="grid size-8 place-items-center rounded-[10px] bg-accent text-accent-foreground"><Globe className="size-4" /></span>本站信息</h3>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => copy(siteInfoBlock)}>
              {copied ? <Check className="size-3 text-primary" /> : <Copy className="size-3" />}复制全部</Button>
          </div>
          {infoFields.map(({ key, label, icon: Ico }) => (
            <div key={key} className="mb-2 flex items-center justify-between gap-2 rounded-[9px] border border-border/60 bg-muted/50 px-3 py-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <Ico className="size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="min-w-0 text-xs font-medium [overflow-wrap:anywhere] [word-break:break-all]" title={siteInfo[key]}>{siteInfo[key]}</p>
                </div>
              </div>
              <CopyIconButton text={siteInfo[key]} label={"复制" + label} />
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between gap-2 rounded-[9px] border border-primary/25 bg-primary/5 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">申请邮箱</p>
                <p className="min-w-0 text-xs font-medium [overflow-wrap:anywhere] [word-break:break-all]">
                  <a href={"mailto:" + siteInfo.email} className="transition-colors hover:text-primary hover:underline">{siteInfo.email}</a>
                </p>
              </div>
            </div>
            <CopyIconButton text={siteInfo.email} label="复制申请邮箱" />
          </div>
        </Card>
        <Card className="flex flex-col p-6">
          <h3 className="mb-4 flex items-center gap-2.5 text-lg font-bold">
            <span className="grid size-8 place-items-center rounded-[10px] bg-accent text-accent-foreground"><UserRound className="size-4" /></span>申请友链</h3>
          <ol className="flex-1 space-y-4">
            {steps.map((s, i) => (
              <li key={i} className="relative flex gap-3">
                {i < steps.length - 1 && <span className="absolute bottom-[-4px] left-[13px] top-[30px] w-[2px] bg-border" />}
                <span className="z-10 flex size-[27px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(260,80%,55%)] text-xs font-bold text-primary-foreground">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold [overflow-wrap:anywhere]">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground [overflow-wrap:anywhere]">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-[10px] border border-border bg-muted/50">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground">申请模板</p>
              <CopyIconButton text={friendTemplate} label="复制申请模板" />
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap p-3 font-mono text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere] [word-break:break-word]">{friendTemplate}</pre>
          </div>
        </Card>
      </div>
      <Card className="mb-4 p-5">
        <h3 className="mb-3.5 flex items-center gap-2 text-base font-bold"><Info className="size-4 text-primary" />注意事项</h3>
        <div className="grid gap-x-6 gap-y-0.5 sm:grid-cols-2">
          {friendNotes.map((note) => (
            <div key={note.title} className="flex items-baseline gap-2.5 py-[7px] text-sm text-muted-foreground">
              <span className="size-[7px] shrink-0 translate-y-[-1px] rounded-full bg-primary" />
              <p className="min-w-0 [overflow-wrap:anywhere]"><strong className="font-semibold text-foreground">{note.title}</strong>：{note.content}</p>
            </div>
          ))}
        </div>
      </Card>
      <h2 className="mb-4 mt-8 text-3xl font-bold tracking-tight flex items-center gap-2.5">
        友链列表 <Badge variant="secondary">{friends.length}</Badge>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {friends.map((f) => (
          <a key={f.title} className="group flex min-w-0 flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg" href={f.siteurl} target="_blank" rel="noreferrer noopener">
            <div className="flex items-center gap-3">
              {f.imgurl ? (
                <img className="size-12 shrink-0 rounded-xl border border-border object-cover transition-transform duration-200 group-hover:scale-105" src={f.imgurl} alt={f.title} loading="lazy" />
              ) : (
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent text-lg font-bold text-primary">{f.title.charAt(0)}</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-bold text-foreground [overflow-wrap:anywhere] [word-break:break-word]">
                  {f.title}<ExternalLink className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere] [word-break:break-word]">{f.desc}</p>
              </div>
            </div>
            {f.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border/60 pt-2.5">
                {f.tags.map((t) => (<Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>))}
              </div>
            )}
          </a>
        ))}
      </div>
    </>
  );
}
