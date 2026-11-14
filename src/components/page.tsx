import type { ComponentType, ReactNode } from "react";
import { BookOpen, Clock } from "lucide-react";

import { Link } from "../lib/router";
import { cn } from "@/lib/utils";
import { formatDate, readingTime } from "../lib/posts";
import type { Post } from "../types";
import { Badge } from "@/components/ui/badge";

/**
 * 全站排版原语。
 *
 * 为什么要有一层：此前每个页面各自写 `text-2xl font-bold tracking-tight mb-2`、
 * `text-xs font-semibold uppercase tracking-wider` 之类的类名，同一语义在不同页面
 * 长出 16 / 18 / 30px 三种字号，`h2` 在友链页甚至和页面标题一样大。
 * 把「页面标题 / 区块标题 / 小标签 / 元信息 / 标签组」这五种角色固化在这里，
 * 页面只负责组合，字号与间距就不会再各自漂移。
 *
 * 字号基线（UI 层）：
 *   页面标题 24 → 30px（md）  700
 *   区块标题 18px             700
 *   卡片标题 16px             600  （见 CardTitle）
 *   正文      14px            400
 *   元信息    12px            400
 *   小标签    12px            600 + 字距
 */

/** 页面标题区：h1 + 副标题 + 右侧附加信息（数量、徽章等）。 */
export function PageHeader({
  title,
  description,
  eyebrow,
  meta,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  /** 标题上方的一行小徽章（技术栈、状态等） */
  eyebrow?: ReactNode;
  /** 与标题同一基线右侧的次要信息（数量、更新时间） */
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-10 border-b border-border pb-7", className)}>
      {eyebrow && <div className="mb-3 flex flex-wrap items-center gap-2">{eyebrow}</div>}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {meta && (
          <div className="text-xs text-muted-foreground tabular-nums">{meta}</div>
        )}
      </div>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}

/** 区块标题：页面内的分节（最新文章 / 友链列表 / 年份 / 相关文章）。 */
export function SectionHeading({
  children,
  meta,
  action,
  as: Tag = "h2",
  id,
  rule = false,
  className,
}: {
  children: ReactNode;
  /** 紧跟标题的数量等次要信息（12px，与标题基线对齐） */
  meta?: ReactNode;
  /** 右侧操作区（按钮等） */
  action?: ReactNode;
  as?: "h2" | "h3";
  id?: string;
  /** 在标题上方压一条通栏细线：用于页面中段的独立区块，强化分节 */
  rule?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex items-center justify-between gap-3",
        rule && "border-t border-border pt-4",
        className
      )}
    >
      <Tag
        id={id}
        className={cn(
          "flex items-baseline gap-2 font-bold tracking-tight",
          Tag === "h3" ? "text-base" : "text-lg"
        )}
      >
        {children}
        {meta && (
          <span className="text-xs font-normal text-muted-foreground tabular-nums">
            {meta}
          </span>
        )}
      </Tag>
      {action}
    </div>
  );
}

/** 小标签：侧栏分组、目录、卡片内的微型标题。 */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </div>
  );
}

/** 元信息行：日期 / 分类 / 阅读时长等，12px 弱化、可换行。 */
export function MetaRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground tabular-nums",
        className
      )}
    >
      {children}
    </div>
  );
}

/** 元信息条目：可选 12px 图标 + 文本。 */
export function MetaItem({
  icon: Icon,
  children,
}: {
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {Icon && <Icon className="size-3" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** 文章元信息：首页列表、列表页卡片共用同一套日期/分类/时长。 */
export function PostMeta({ post, className }: { post: Post; className?: string }) {
  return (
    <MetaRow className={className}>
      <time dateTime={post.published}>{formatDate(post.published)}</time>
      {post.category && <MetaItem icon={BookOpen}>{post.category}</MetaItem>}
      <MetaItem icon={Clock}>{readingTime(post.words)}</MetaItem>
    </MetaRow>
  );
}

/** 标签组：全站统一 secondary + xs 徽章，链接到筛选页。 */
export function TagList({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {tags.map((t) => (
        <Link key={t} to={"/posts?tag=" + encodeURIComponent(t)}>
          <Badge variant="secondary" size="xs">
            {t}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
