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
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground"
          onClick={() => {
            void copyText(text, label + "成功");
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          aria-label={label}
        >
          {copied ? <Check className="text-primary" /> : <Copy />}
        </Button>
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
    { title: "提交申请", desc: (<>将申请邮件发送至 <a href={"mailto:" + siteInfo.email} className="font-semibold text-primary hover:underline [overflow-wrap:anywhere]">{siteInfo.email}</a>，或使用下方模板在评论区留言</>) },
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
        <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-sm">
          <Users data-icon="inline-start" />
          共 {friends.length} 位朋友
        </Badge>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        {/* 本站信息 */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-[10px] bg-accent text-accent-foreground">
                <Globe className="size-4" />
              </span>
              本站信息
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
                <ItemMedia variant="icon" className="text-primary">
                  {(() => {
                    const Ico = icon;
                    return <Ico />;
                  })()}
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemDescription className="text-xs">{label}</ItemDescription>
                  <ItemTitle className="text-xs font-medium [overflow-wrap:anywhere] [word-break:break-all]">
                    {siteInfo[key]}
                  </ItemTitle>
                </ItemContent>
                <CopyIconButton text={siteInfo[key]} label={"复制" + label} />
              </Item>
            ))}
            <Item variant="outline" size="xs" className="border-primary/25 bg-primary/5">
              <ItemMedia variant="icon" className="text-primary">
                <Mail />
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemDescription className="text-xs">申请邮箱</ItemDescription>
                <ItemTitle className="text-xs font-medium [overflow-wrap:anywhere] [word-break:break-all]">
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
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-[10px] bg-accent text-accent-foreground">
                <UserRound className="size-4" />
              </span>
              申请友链
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <ol className="flex-1 space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="relative flex gap-3">
                  {i < steps.length - 1 && (
                    <span className="absolute bottom-[-4px] left-[13px] top-[30px] w-[2px] bg-border" />
                  )}
                  <Badge className="z-10 size-[27px] shrink-0 justify-center rounded-full p-0 text-xs">
                    {i + 1}
                  </Badge>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold [overflow-wrap:anywhere]">{s.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground [overflow-wrap:anywhere]">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-[10px] border border-border bg-muted/50">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground">申请模板</p>
                <CopyIconButton text={friendTemplate} label="复制申请模板" />
              </div>
              <Separator />
              <pre className="overflow-x-auto whitespace-pre-wrap p-3 font-mono text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere] [word-break:break-word]">
                {friendTemplate}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 注意事项 */}
      <Card className="mb-4">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Info className="size-4 text-primary" />
            注意事项
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-x-6 gap-y-0.5 sm:grid-cols-2">
          {friendNotes.map((note) => (
            <div
              key={note.title}
              className="flex items-baseline gap-2.5 py-[7px] text-sm text-muted-foreground"
            >
              <span className="size-[7px] shrink-0 translate-y-[-1px] rounded-full bg-primary" />
              <p className="min-w-0 [overflow-wrap:anywhere]">
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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {friends.map((f) => (
          <Card
            key={f.title}
            className="gap-3 p-4 transition-all duration-200 hover:-translate-y-1 hover:ring-primary/50 hover:shadow-lg"
          >
            <a
              className="group flex min-w-0 items-center gap-3"
              href={f.siteurl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {f.imgurl && (
                <Avatar className="size-12 rounded-xl after:rounded-xl">
                  <AvatarImage src={f.imgurl} alt={f.title} className="rounded-xl" />
                  <AvatarFallback className="rounded-xl">
                    {f.title.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-bold text-foreground [overflow-wrap:anywhere] [word-break:break-word]">
                  {f.title}
                  <ExternalLink className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere] [word-break:break-word]">
                  {f.desc}
                </p>
              </div>
            </a>
            {f.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border/60 pt-2.5">
                {f.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
