import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "../lib/router";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { publishedPosts, getAllTags } from "../lib/posts";
import { profileConfig } from "../config/profile";
import PostCard from "../components/PostCard";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { PageHeader, SectionLabel } from "../components/page";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { prefersReducedMotion } from "@/lib/motion";

const PAGE_SIZE = 9;

// 筛选选项来自静态文章数据：只在模块加载时算一次，不随输入/翻页重算
const tags = getAllTags();
const categories = [
  ...new Set(publishedPosts.map((p) => p.category).filter(Boolean)),
] as string[];

// 筛选组：标签内联在左侧（省掉一行标题），芯片在移动端单行横滑、md 以上换行
function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div className="mb-3 flex items-start gap-3">
      <SectionLabel className="w-8 shrink-0 pt-1.5">{label}</SectionLabel>
      <div className="min-w-0 flex-1 overflow-x-auto pb-1">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={1}
          aria-label={label}
          value={value === "" ? "all" : value}
          onValueChange={(v) => {
            // 再次点击已选中项时 v 为空字符串，视为回到「全部」
            onChange(v === "" || v === "all" ? "" : v);
          }}
          // 移动端 20 多个标签若全部换行要占 9 行，把列表挤到首屏之外
          className="flex-nowrap justify-start md:flex-wrap"
        >
          <ToggleGroupItem value="all">
            全部
          </ToggleGroupItem>
          {options.map((o) => (
            <ToggleGroupItem key={o} value={o}>
              {o}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}

/** 已选筛选条件：与 Badge secondary 同一视觉（h-5 / 12px / 方角），右侧挂删除按钮。 */
function FilterChip({
  label,
  onRemove,
  removeLabel,
}: {
  label: string;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <span className="inline-flex h-5 items-center gap-1 bg-secondary px-2 text-xs font-medium text-foreground">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="cursor-pointer text-muted-foreground transition-colors hover:text-primary"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

export default function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const tag = searchParams.get("tag") ?? "";
  const cat = searchParams.get("cat") ?? "";
  // 搜索词与页码也放进 URL（?q= / ?page=）：可分享、刷新/后退不丢失
  const keyword = searchParams.get("q") ?? "";
  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  // 全文搜索索引（含正文）体积约 45 KB，只在列表页按需加载：
  // 首屏不下载它，输入时也不必每次重复 toLowerCase 全文。
  //
  // 触发时机从"空闲 2 秒"改成"用户碰搜索框/开始输入"：这一页的 LCP 是首屏
  // 卡片封面图，而空闲回调很可能正好落在图片下载中途，几十 KB 的索引会和
  // 封面图抢慢速带宽（实测把 LCP 推后 300~400 ms）。搜索框没被碰过时，
  // 索引对用户没有任何价值，等 8 秒兜底即可。
  const [searchIndex, setSearchIndex] = useState<Record<string, string> | null>(null);
  const indexRequested = useRef(false);
  const loadSearchIndex = useCallback(() => {
    if (indexRequested.current) return;
    indexRequested.current = true;
    import("../generated/search-index.json")
      .then((mod) => setSearchIndex(mod.default as Record<string, string>))
      .catch(() => {
        /* 索引缺失时搜索降级为「不过滤」，不影响列表浏览 */
      });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadSearchIndex, 8000);
    return () => window.clearTimeout(timer);
  }, [loadSearchIndex]);

  const filtered = useMemo(() => {
    let list = publishedPosts;
    if (cat) list = list.filter((p) => p.category === cat);
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    const kw = keyword.trim().toLowerCase();
    if (kw && searchIndex) {
      list = list.filter((p) => searchIndex[p.slug]?.includes(kw));
    }
    return list;
  }, [cat, tag, keyword, searchIndex]);

  // 键盘快捷键：按 / 聚焦搜索框（焦点已在可输入元素内时不拦截，避免吞掉 "/" 字符）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typing) return;
      e.preventDefault();
      loadSearchIndex();
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loadSearchIndex]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pagePosts = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // 统一更新 URL 参数；过滤条件变化时重置页码
  const updateParams = (
    mutator: (sp: URLSearchParams) => void,
    options?: { resetPage?: boolean; replace?: boolean }
  ) => {
    const next = new URLSearchParams(searchParams);
    mutator(next);
    if (options?.resetPage) next.delete("page");
    setSearchParams(next, options?.replace ? { replace: true } : undefined);
  };

  const selectTag = (t: string) => {
    updateParams((sp) => {
      if (t === tag || !t) sp.delete("tag");
      else sp.set("tag", t);
    }, { resetPage: true });
  };

  const selectCat = (c: string) => {
    updateParams((sp) => {
      if (c === cat || !c) sp.delete("cat");
      else sp.set("cat", c);
    }, { resetPage: true });
  };

  const onKeywordChange = (v: string) => {
    // 逐字输入用 replace，避免刷爆历史记录
    updateParams((sp) => {
      if (v) sp.set("q", v);
      else sp.delete("q");
    }, { resetPage: true, replace: true });
  };

  // 翻页时回到页面顶部，避免停留在旧列表的滚动位置
  const goToPage = (n: number) => {
    updateParams((sp) => sp.set("page", String(n)));
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <>
      <Seo
        title="文章"
        description={publishedPosts.length + " 篇技术文章"}
        path="/posts/"
        ogImage={profileConfig.avatar}
      />
      <Breadcrumb items={[{ label: "文章", to: "/posts/" }]} />

      <PageHeader
        title="文章"
        description={
          <span aria-live="polite" aria-atomic="true">
            {filtered.length === publishedPosts.length
              ? `共 ${publishedPosts.length} 篇文章`
              : `找到 ${filtered.length} 篇文章`}
          </span>
        }
      />

      {/* 搜索：shadcn InputGroup（前缀图标 + 后缀清除按钮） */}
      <InputGroup className="mb-3 h-10">
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          ref={searchRef}
          type="search"
          value={keyword}
          onChange={(e) => {
            loadSearchIndex();
            onKeywordChange(e.target.value);
          }}
          onFocus={loadSearchIndex}
          onPointerEnter={loadSearchIndex}
          placeholder="搜索文章…（按 / 快速聚焦）"
          aria-label="搜索文章（快捷键 /）"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className="[&::-webkit-search-cancel-button]:hidden"
        />
        {keyword && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => onKeywordChange("")}
              aria-label="清除搜索"
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      <FilterGroup label="分类" value={cat} options={categories} onChange={selectCat} />
      <FilterGroup label="标签" value={tag} options={tags} onChange={selectTag} />

      <Separator className="my-4" />

      {(cat || tag || keyword) && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>当前筛选：</span>
          {cat && <FilterChip label={"分类: " + cat} onRemove={() => selectCat(cat)} removeLabel="移除分类筛选" />}
          {tag && <FilterChip label={"标签: " + tag} onRemove={() => selectTag(tag)} removeLabel="移除标签筛选" />}
          {keyword && (
            <FilterChip
              label={'关键词: "' + keyword + '"'}
              onRemove={() => onKeywordChange("")}
              removeLabel="清除关键词"
            />
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              updateParams((sp) => {
                sp.delete("cat");
                sp.delete("tag");
                sp.delete("q");
              }, { resetPage: true });
            }}
          >
            重置全部
          </Button>
        </div>
      )}

      {/* 列表 / 空状态 */}
      {pagePosts.length === 0 ? (
        <Empty variant="solid" className="my-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>没有找到相关文章</EmptyTitle>
            <EmptyDescription>换个关键词，或清除筛选条件试试。</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateParams((sp) => {
                  sp.delete("cat");
                  sp.delete("tag");
                  sp.delete("q");
                }, { resetPage: true });
              }}
            >
              清除所有筛选条件
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pagePosts.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      )}

      {/* 分页：shadcn Pagination */}
      {totalPages > 1 && (
        <Pagination aria-label="分页" className="mb-10">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                disabled={current === 1}
                onClick={() => goToPage(current - 1)}
                aria-label="上一页"
              >
                <ChevronLeft />
              </Button>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <PaginationItem key={n}>
                <Button
                  variant={n === current ? "default" : "outline"}
                  size="icon"
                  onClick={() => goToPage(n)}
                  aria-label={"第 " + n + " 页"}
                  aria-current={n === current ? "page" : undefined}
                >
                  {n}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                disabled={current === totalPages}
                onClick={() => goToPage(current + 1)}
                aria-label="下一页"
              >
                <ChevronRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
