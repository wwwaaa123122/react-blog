import { useState } from "react";
import {
  Check, Copy, ExternalLink, Globe, Image as ImageIcon,
  Info, Link2, Mail, MessageSquareText, UserRound, Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  getEnabledFriends, siteInfo, friendNotes, friendTemplate,
} from "../config/friends";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 复制到剪贴板：成功/失败都用 shadcn Sonner 反馈，不再各自维护状态
async function copyText(text: string, message: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message);
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success(message);
    } catch {
      toast.error("复制失败，请手动选择文本");
    }
  }
}

// 复制按钮：shadcn Button + Tooltip，图标随复制状态短暂切换为对勾
function CopyIconButton({ text, label = "复制" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0 text-muted-foreground">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              void copyText(text, label + "成功");
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            aria-label={label}
          >
            {copied ? <Check className="text-primary" /> : <Copy />}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>{copied ? "已复制" : label}</TooltipContent>
    </Tooltip>
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
  const siteInfoBlock = [
    "站点名称：" + siteInfo.name,
    "站点描述：" + siteInfo.desc,
    "站点链接：" + siteInfo.url,
    "头像链接：" + siteInfo.avatar,
  ].join("\n");

  const steps = [
    { title: "添加本站友链", desc: "请先在您的网站友链页面添加本站信息，可直接复制下方内容" },
    { title: "提交申请", desc: (<>将申请邮件发送至 <a href={"mailto:" + siteInfo.email} className="font-semibold text-primary hover:underline break-words">{siteInfo.email}</a>，或使用下方模板在评论区留言</>) },
    { title: "等待审核", desc: "确认信息无误后会尽快添加您的友链" },
  ];

  return (
    <TooltipProvider>
      <Seo title="友链" description="友情链接与友链申请方式，与优秀的朋友们一起成长" path="/friends/" />
      <Breadcrumb items={[{ label: "友链", to: "/friends/" }]} />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">友链</h1>
          <p className="text-sm text-muted-foreground">与优秀的朋友们一起成长</p>
        </div>
        <Badge variant="secondary" size="pill">
          <Users data-icon="inline-start" />
          共 {friends.length} 位朋友
        </Badge>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        {/* 本站信息 */}
        <Card>
          <CardHeader variant="bordered">
            <CardTitle>
              <span className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-md bg-accent text-accent-foreground">
                  <Globe className="size-4" />
                </span>
                本站信息
              </span>
            </CardTitle>
            <CardAction>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyText(siteInfoBlock, "本站信息已复制")}
              >
                <Copy data-icon="inline-start" />
                复制全部
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-2">
            {infoFields.map(({ key, label, icon }) => (
              <Item key={key} variant="muted" size="xs">
                <ItemMedia variant="primary">
                  {(() => {
                    const Ico = icon;
                    return <Ico />;
                  })()}
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemDescription>{label}</ItemDescription>
                  <ItemTitle className="break-all">
                    {siteInfo[key]}
                  </ItemTitle>
                </ItemContent>
                <CopyIconButton text={siteInfo[key]} label={"复制" + label} />
              </Item>
            ))}
            <Item variant="accent" size="xs">
              <ItemMedia variant="primary">
                <Mail />
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemDescription>申请邮箱</ItemDescription>
                <ItemTitle className="break-all">
                  <a
                    href={"mailto:" + siteInfo.email}
                    className="transition-colors hover:text-primary hover:underline"
                  >
                    {siteInfo.email}
                  </a>
                </ItemTitle>
              </ItemContent>
              <CopyIconButton text={siteInfo.email} label="复制申请邮箱" />
            </Item>
          </CardContent>
        </Card>

        {/* 申请流程 */}
        <Card className="flex flex-col">
          <CardHeader variant="bordered">
            <CardTitle>
              <span className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-md bg-accent text-accent-foreground">
                  <UserRound className="size-4" />
                </span>
                申请友链
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <ol className="flex-1 space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="relative flex gap-3">
                  {i < steps.length - 1 && (
                    <span className="absolute -bottom-1 left-3.25 top-7.5 w-0.5 bg-border" />
                  )}
                  <Badge size="step">
                    {i + 1}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold break-words">{s.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground break-words">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-md border border-border bg-muted/50">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground">申请模板</p>
                <CopyIconButton text={friendTemplate} label="复制申请模板" />
              </div>
              <Separator />
              <pre className="overflow-x-auto whitespace-pre-wrap p-3 font-mono text-xs leading-relaxed text-muted-foreground break-words">
                {friendTemplate}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 注意事项 */}
      <Card className="mb-4">
        <CardHeader variant="bordered">
          <CardTitle>
            <span className="flex items-center gap-2">
              <Info className="size-4 text-primary" />
              注意事项
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-x-6 gap-y-0.5 sm:grid-cols-2">
          {friendNotes.map((note) => (
            <div
              key={note.title}
              className="flex items-baseline gap-2.5 py-1.75 text-sm text-muted-foreground"
            >
              <span className="size-1.75 shrink-0 -translate-y-0.25 rounded-full bg-primary" />
              <p className="min-w-0 break-words">
                <strong className="font-semibold text-foreground">{note.title}</strong>：{note.content}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 友链列表 */}
      <h2 className="mb-4 mt-8 flex items-center gap-2.5 text-3xl font-bold tracking-tight">
        友链列表 <Badge variant="secondary">{friends.length}</Badge>
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {friends.map((f) => (
          <div key={f.title} className="cv-auto">
          <Card size="cozy" variant="interactive">
            <a
              className="group flex min-w-0 items-center gap-3"
              href={f.siteurl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {f.imgurl && (
                <Avatar shape="rounded" className="size-12">
                  <AvatarImage src={f.imgurl} alt={f.title} loading="lazy" decoding="async" />
                  <AvatarFallback>
                    {f.title.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-bold text-foreground transition-colors group-hover:text-primary break-words">
                  {f.title}
                  <ExternalLink className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground break-words">
                  {f.desc}
                </p>
              </div>
            </a>
            {f.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border/60 pt-2.5">
                {f.tags.map((t) => (
                  <Badge key={t} variant="secondary" size="xs">{t}</Badge>
                ))}
              </div>
            )}
          </Card>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
