import { Link, useNavigate, type LinkProps, type To } from "react-router-dom";
import { navigateWithViewTransition } from "../lib/viewTransition";

// 带共享元素过渡的链接：用于"打开文章"的入口（列表封面/标题、上一篇/下一篇）
export default function TransitionLink({ to, onClick, children, ...rest }: LinkProps) {
  const navigate = useNavigate();

  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        // 仅拦截左键单击、无修饰键、非新窗口的普通导航
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (rest.target && rest.target !== "_self") return;
        e.preventDefault();
        navigateWithViewTransition(navigate as (t: To) => void, to);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
