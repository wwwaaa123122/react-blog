import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { publishedPosts, getAllTags } from "../lib/posts";
import PostCard from "../components/PostCard";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
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

const PAGE_SIZE = 9;

// 筛选组：标题 + 一组 ToggleGroup 形式的「标签页」（选中态由组件库的 data-state 提供）
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
    <div className="mb-3">
      <div className="mb-1.5 text-xs text-muted-foreground">{label}</div>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        spacing={1}
        value={value === "" ? "all" : value}
        onValueChange={(v) => {
          // 再次点击已选中项时 v 为空字符串，视为回到「全部」
          onChange(v === "" || v === "all" ? "" : v);
        }}
        className="flex-wrap justify-start"
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

  const tags = getAllTags();
  const categories = [...new Set(publishedPosts.map(p => p.category).filter(Boolean))] as string[];

  const filtered = useMemo(() => {
    let list = publishedPosts;
    if (cat) list = list.filter((p) => p.category === cat);
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(kw) ||
          p.description.toLowerCase().includes(kw) ||
          p.content.toLowerCase().includes(kw) ||
          p.tags.some((t) => t.toLowerCase().includes(kw))
      );
    }
    return list;
  }, [cat, tag, keyword]);

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
      searchRef.current?.focus();
      searchRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Seo title="文章" description={publishedPosts.length + " 篇技术文章"} path="/posts/" />
      <Breadcrumb items={[{ label: "文章", to: "/posts/" }]} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">文章</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length === publishedPosts.length
            ? `共 ${publishedPosts.length} 篇文章`
            : `找到 ${filtered.length} 篇文章`}
        </p>
      </div>

      {/* 搜索：shadcn InputGroup（前缀图标 + 后缀清除按钮） */}
      <InputGroup shape="rounded" className="mb-4 h-10">
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          ref={searchRef}
          type="search"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="搜索文章…（按 / 快速聚焦）"
          aria-label="搜索文章（快捷键 /）"
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
      <div className="mb-6">
        <FilterGroup label="标签" value={tag} options={tags} onChange={selectTag} />
      </div>

      <Separator className="mb-6" />

      {(cat || tag || keyword) && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>当前筛选：</span>
          {cat && (
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-foreground">
              分类: {cat}
              <button
                type="button"
                onClick={() => selectCat(cat)}
                aria-label="移除分类筛选"
                className="hover:text-primary cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          {tag && (
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-foreground">
              标签: {tag}
              <button
                type="button"
                onClick={() => selectTag(tag)}
                aria-label="移除标签筛选"
                className="hover:text-primary cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          {keyword && (
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-foreground">
              关键词: "{keyword}"
              <button
                type="button"
                onClick={() => onKeywordChange("")}
                aria-label="清除关键词"
                className="hover:text-primary cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
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
        <Empty className="my-16">
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
