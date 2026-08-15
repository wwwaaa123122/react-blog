import { ExternalLink, Link2, UserRound } from "lucide-react";
import { siteConfig } from "../config/site";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PAGES_CMS_URL = "https://app.pagescms.org/";

const steps = [
  {
    title: "登录 GitHub",
    desc: "在后台使用 GitHub 账号登录，并安装 Pages CMS GitHub App 到本仓库",
  },
  {
    title: "选择仓库",
    desc: (
      <>
        打开部署本博客的仓库（仓库根目录已有{" "}
        <code className="rounded-[5px] border border-border bg-muted px-1.5 py-px font-mono text-[12px] text-primary [overflow-wrap:anywhere]">
          .pages.yml
        </code>{" "}
        配置）
      </>
    ),
  },
  {
    title: "编辑内容",
    desc: "文章（src/posts）、个人资料（src/data/profile.json）、友链（src/data/friends.json）、站点配置（src/data/site.json）",
  },
  {
    title: "保存发布",
    desc: "每次保存会自动提交到仓库，GitHub Actions 检测到推送后自动重新构建并部署站点",
  },
];

export default function Admin() {
  return (
    <>
      <Seo title="后台管理" path="/admin" noindex />
      <Breadcrumb items={[{ label: "管理", to: "/admin" }]} />

      <div className="mb-6">
        <h1 className="text-[26px] font-extrabold tracking-[0.5px]">后台管理</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          通过 Pages CMS 在线编辑文章、个人资料与友链，保存后自动提交并触发部署
        </p>
      </div>

      <Card className="mb-4 flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-[34px] place-items-center rounded-[9px] bg-accent text-accent-foreground">
            <UserRound className="size-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[14.5px] font-bold [overflow-wrap:anywhere]">
              Pages CMS · {siteConfig.title}
            </p>
            <p className="text-[12.5px] text-muted-foreground">
              内容保存在仓库中，由 GitHub Actions 自动构建部署
            </p>
          </div>
        </div>
        <Button asChild>
          <a href={PAGES_CMS_URL} target="_blank" rel="noreferrer noopener">
            <ExternalLink className="size-[15px]" />
            新窗口打开后台
          </a>
        </Button>
      </Card>

      <Card className="h-[72vh] min-h-[480px] overflow-hidden">
        <iframe
          src={PAGES_CMS_URL}
          title="Pages CMS"
          className="h-full w-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </Card>

      <Card className="mt-4 p-6">
        <h3 className="mb-3.5 flex items-center gap-2 text-[15.5px] font-bold">
          <Link2 className="size-[17px] text-primary" />
          使用说明
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
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
