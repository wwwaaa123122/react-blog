import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, BookOpen, FileText, Home, Link2, User } from "lucide-react";
import { publishedPosts } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog
      title="站内全局搜索"
      description="快速搜索全站文章或跳转页面"
      open={open}
      onOpenChange={onOpenChange}
    >
      <CommandInput placeholder="搜索文章标题、内容、分类或页面…" />
      <CommandList>
        <CommandEmpty>未找到相关文章或页面</CommandEmpty>
        <CommandGroup heading="页面跳转">
          <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
            <Home className="size-4" />
            <span>首页</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/posts"))}>
            <BookOpen className="size-4" />
            <span>文章列表</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/archive"))}>
            <Archive className="size-4" />
            <span>归档</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/friends"))}>
            <Link2 className="size-4" />
            <span>友链</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/about"))}>
            <User className="size-4" />
            <span>关于我</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="文章">
          {publishedPosts.map((post) => (
            <CommandItem
              key={post.slug}
              value={post.title + " " + (post.description || "") + " " + post.tags.join(" ") + " " + (post.category || "")}
              onSelect={() => runCommand(() => navigate("/posts/" + post.slug))}
            >
              <FileText className="size-4 shrink-0" />
              <div className="flex flex-1 items-center justify-between gap-2 overflow-hidden">
                <span className="truncate">{post.title}</span>
                {post.category && (
                  <span className="shrink-0">
                    <Badge variant="secondary" size="2xs">
                      {post.category}
                    </Badge>
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
