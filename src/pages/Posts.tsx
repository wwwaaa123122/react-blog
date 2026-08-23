import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { publishedPosts, getAllTags } from "../lib/posts";
import PostCard from "../components/PostCard";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent } from "@/components/ui/pagination";

const PAGE_SIZE = 9;

export default function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get("tag") ?? "";
  const cat = searchParams.get("cat") ?? "";
  // 搜索词与页码也放进 URL（?q= / ?page=）：可分享、刷新/后退不丢失
  const keyword = searchParams.get("q") ?? "";
  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const tags = getAllTags();
  const categories = [...new Set(publishedPosts.map(p => p.category).filter(Boolean))];

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
      if (t === tag) sp.delete("tag");
      else sp.set("tag", t);
    }, { resetPage: true });
  };

  const selectCat = (c: string) => {
    updateParams((sp) => {
      if (c === cat) sp.delete("cat");
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
        <p className="text-sm text-muted-foreground">共 {publishedPosts.length} 篇文章</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search" value={keyword} onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="搜索文章…" aria-label="搜索文章" className="h-10 pl-9 pr-10 text-sm rounded-xl [&::-webkit-search-cancel-button]:hidden"
        />
        {keyword && (
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 size-8" onClick={() => onKeywordChange("")} aria-label="清除搜索">
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-xs text-muted-foreground mr-1">分类</span>
          <Badge variant={cat === "" ? "default" : "secondary"} asChild>
            <button type="button" className="cursor-pointer" onClick={() => selectCat("")}>全部</button>
          </Badge>
          {categories.map((c) => (
            <Badge key={c} variant={cat === c ? "default" : "secondary"} asChild>
              <button type="button" className="cursor-pointer" onClick={() => selectCat(c)}>{c}</button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <span className="text-xs text-muted-foreground mr-1">标签</span>
        <Badge variant={tag === "" ? "default" : "secondary"} asChild>
          <button type="button" className="cursor-pointer" onClick={() => selectTag("")}>全部</button>
        </Badge>
        {tags.map((t) => (
          <Badge key={t} variant={tag === t ? "default" : "secondary"} asChild>
            <button type="button" className="cursor-pointer" onClick={() => selectTag(t)}>{t}</button>
          </Badge>
        ))}
      </div>

      {/* Grid */}
      {pagePosts.length === 0 ? (
        <div className="py-20 text-center">
          <Search className="mx-auto size-8 text-muted-foreground opacity-40 mb-3" />
          <p className="text-sm text-muted-foreground">没有找到相关文章</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {pagePosts.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination aria-label="分页" className="mb-10">
          <PaginationContent>
            <Button variant="outline" size="icon" disabled={current === 1} onClick={() => goToPage(current - 1)} aria-label="上一页">
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === current ? "default" : "outline"}
                size="icon"
                className="size-9 text-sm"
                onClick={() => goToPage(n)}
                aria-label={"第 " + n + " 页"}
                aria-current={n === current ? "page" : undefined}
              >
                {n}
              </Button>
            ))}
            <Button variant="outline" size="icon" disabled={current === totalPages} onClick={() => goToPage(current + 1)} aria-label="下一页">
              <ChevronRight className="size-4" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
