import { Link } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="notfound-code">404</p>
      <p className="mt-2 text-lg font-bold">页面飞走了</p>
      <p className="mt-2 text-sm text-muted-foreground mb-6">你访问的页面不存在或已被移除</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild><Link to="/"><Home className="size-4" /> 回到首页</Link></Button>
        <Button asChild variant="outline"><Link to="/posts"><BookOpen className="size-4" /> 浏览文章</Link></Button>
      </div>
    </div>
  );
}
