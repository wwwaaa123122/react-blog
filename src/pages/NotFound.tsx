import { Link } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="px-5 py-[90px] text-center">
      <p className="notfound-code">404</p>
      <p className="mt-2.5 text-xl font-bold">页面飞走了 🦋</p>
      <p className="mt-2 text-[14px] text-muted-foreground">
        你访问的页面不存在或已被移除
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/">
            <Home className="size-4" />
            回到首页
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/posts">
            <BookOpen className="size-4" />
            浏览文章
          </Link>
        </Button>
      </div>
    </div>
  );
}
