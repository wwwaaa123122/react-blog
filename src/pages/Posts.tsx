import { useEffect, useMemo, useState } from "react";
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
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const tags = getAllTags();

  const filtered = useMemo(() => {
    let list = publishedPosts;
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
  }, [tag, keyword]);

  useEffect(() => { setPage(1); }, [tag, keyword]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pagePosts = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selectTag = (t: string) => {
    if (t === tag) { searchParams.delete("tag"); }
    else { searchParams.set("tag", t); }
    setSearchParams(searchParams);
  };

  return (
    <>
      <Seo title="文章" description={publishedPosts.length + " 篇技术文章"} path="/posts" />
      <Breadcrumb items={[{ label: "文章", to: "/posts" }]} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">文章</h1>
        <p className="text-sm text-muted-foreground">共 {publishedPosts.length} 篇文章</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索文章…" className="h-10 pl-9 pr-10 text-sm rounded-xl"
        />
        {keyword && (
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 size-8" onClick={() => setKeyword("")} aria-label="清除搜索">
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
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
        <Pagination className="mb-10">
          <PaginationContent>
            <Button variant="outline" size="icon" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="上一页">
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button key={n} variant={n === current ? "default" : "outline"} size="icon" className="size-9 text-sm" onClick={() => setPage(n)}>{n}</Button>
            ))}
            <Button variant="outline" size="icon" disabled={current === totalPages} onClick={() => setPage(current + 1)} aria-label="下一页">
              <ChevronRight className="size-4" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
