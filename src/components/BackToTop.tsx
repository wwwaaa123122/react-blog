import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "back-to-top size-[44px] rounded-[13px] shadow-lg",
        visible && "visible"
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="回到顶部"
      title="回到顶部"
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
