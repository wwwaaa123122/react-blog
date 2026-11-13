// 极简路由：只覆盖本站实际用到的能力。
//
// 为什么不用 react-router：它的源码 363 KB，压缩后仍占 29.4 KB gzip，而且被单独
// 打成一个分包、每个页面首屏都要下载。本站的路由表是静态的（8 条 + 3 条站外跳转），
// 没有 loader / action / 嵌套数据 / 滚动恢复等需求，用不到它的九成代码。
//
// 这里实现同一套声明式 API（Routes/Route/Link/NavLink/Outlet/Navigate/
// useLocation/useParams/useSearchParams + BrowserRouter/MemoryRouter），
// 语法与原来完全一致，业务代码只需换 import 路径。
import {
  Children,
  createContext,
  createElement,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

export interface Location {
  pathname: string;
  search: string;
  hash: string;
}

interface NavigateOptions {
  replace?: boolean;
}

const ROOT: Location = { pathname: "/", search: "", hash: "" };

const LocationContext = createContext<Location>(ROOT);
const NavigateContext = createContext<(to: string, options?: NavigateOptions) => void>(() => {});
const ParamsContext = createContext<Record<string, string>>({});
const OutletContext = createContext<ReactNode>(null);
const BasenameContext = createContext("");

const isExternal = (to: string): boolean => /^[a-z][a-z0-9+.-]*:|^\/\//i.test(to);

// 统一解析成 { pathname, search, hash }；基址用占位 origin，只为借用 URL 的解析规则
function parseUrl(url: string): Location {
  const u = new URL(url, "http://router.local");
  return { pathname: u.pathname, search: u.search, hash: u.hash };
}

// 去掉部署基址（"/react-blog"），得到路由内部使用的路径
function stripBasename(pathname: string, basename: string): string {
  if (!basename) return pathname;
  if (pathname === basename) return "/";
  if (pathname.startsWith(basename + "/")) return pathname.slice(basename.length);
  return pathname;
}

const withBasename = (to: string, basename: string): string =>
  !basename || !to.startsWith("/") ? to : basename + to;

/* ------------------------------------------------------------------ *
 * Router
 * ------------------------------------------------------------------ */

export function BrowserRouter({
  basename = "",
  children,
}: {
  basename?: string;
  children?: ReactNode;
}) {
  const read = useCallback(
    (): Location => {
      const loc = window.location;
      return {
        pathname: stripBasename(loc.pathname, basename) || "/",
        search: loc.search,
        hash: loc.hash,
      };
    },
    [basename]
  );

  const [location, setLocation] = useState<Location>(read);

  const navigate = useCallback(
    (to: string, options?: NavigateOptions) => {
      // 站外地址（/gh、/rss 这类重定向）不能进 history，直接换页面
      if (isExternal(to)) {
        window.location.replace(to);
        return;
      }
      const url = withBasename(to, basename);
      if (options?.replace) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
      setLocation(read());
    },
    [basename, read]
  );

  useEffect(() => {
    // 前进/后退：popstate 由浏览器触发，这里只同步状态。
    // 注意不监听 scroll，滚动位置交给 Layout 在换页时处理。
    const onPop = () => setLocation(read());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [read]);

  return createElement(
    BasenameContext.Provider,
    { value: basename },
    createElement(
      NavigateContext.Provider,
      { value: navigate },
      createElement(LocationContext.Provider, { value: location }, children)
    )
  );
}

// 预渲染 / 单元检查用：不碰 window，只把 initialEntries[0] 当作当前地址
export function MemoryRouter({
  basename = "",
  initialEntries = ["/"],
  children,
}: {
  basename?: string;
  initialEntries?: string[];
  children?: ReactNode;
}) {
  const initial = parseUrl(initialEntries[0] ?? "/");
  const [location, setLocation] = useState<Location>({
    ...initial,
    pathname: stripBasename(initial.pathname, basename) || "/",
  });

  const navigate = useCallback((to: string) => setLocation(parseUrl(to)), []);

  return createElement(
    BasenameContext.Provider,
    { value: basename },
    createElement(
      NavigateContext.Provider,
      { value: navigate },
      createElement(LocationContext.Provider, { value: location }, children)
    )
  );
}

/* ------------------------------------------------------------------ *
 * 路由匹配
 * ------------------------------------------------------------------ */

interface RouteProps {
  path?: string;
  element?: ReactNode;
  children?: ReactNode;
}

interface Segment {
  path?: string;
  element?: ReactNode;
}

type Branch = Segment[];

// 把 <Routes> 的 JSX 树摊平成"根到叶子"的分支列表
function flattenRoutes(node: ReactNode, prefix: Branch = []): Branch[] {
  const branches: Branch[] = [];
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props as RouteProps;
    const segment: Segment = { path: props.path, element: props.element };
    const chain = [...prefix, segment];
    if (props.children != null) branches.push(...flattenRoutes(props.children, chain));
    else branches.push(chain);
  });
  return branches;
}

const joinPath = (base: string, path: string): string =>
  path.startsWith("/") ? path : `${base.replace(/\/$/, "")}/${path}`;

interface Match {
  branch: Branch;
  params: Record<string, string>;
  score: number;
}

// 单条完整模式与路径匹配；:param 捕获一段，* 捕获剩余全部
function matchPattern(pattern: string, pathname: string): { params: Record<string, string>; score: number } | null {
  const patternParts = pattern.replace(/\/+$/, "").split("/").filter(Boolean);
  const pathParts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const params: Record<string, string> = {};
  let score = 0;

  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    if (part === "*") {
      // 通配只兜底，优先级最低
      params["*"] = pathParts.slice(i).join("/");
      return { params, score: score - 1000 };
    }
    const value = pathParts[i];
    if (value === undefined) return null;
    if (part.startsWith(":")) {
      params[part.slice(1)] = decodeURIComponent(value);
      score += 2;
    } else if (part === value) {
      score += 4;
    } else {
      return null;
    }
  }

  // 模式必须吃满整条路径（除通配外），否则算不匹配
  if (pathParts.length !== patternParts.length) return null;
  return { params, score };
}

function matchBranch(branch: Branch, pathname: string): Match | null {
  // 整条分支拼成一个完整模式后再匹配：中间层（如 Layout）没有 path，
  // 只是包裹，不参与"是否吃满路径"的判断。
  let pattern = "/";
  for (const segment of branch) {
    if (segment.path) pattern = joinPath(pattern, segment.path);
  }
  const result = matchPattern(pattern, pathname);
  return result ? { branch, params: result.params, score: result.score + branch.length } : null;
}

function renderBranch(branch: Branch, params: Record<string, string>, index: number): ReactNode {
  const segment = branch[index];
  if (!segment) return null;
  const outlet = index + 1 < branch.length ? renderBranch(branch, params, index + 1) : null;
  return createElement(
    ParamsContext.Provider,
    { value: params, key: index },
    createElement(OutletContext.Provider, { value: outlet }, segment.element ?? null)
  );
}

export function Route(_props: RouteProps): null {
  return null;
}

export function Routes({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation();
  const branches = useMemo(() => flattenRoutes(children), [children]);
  const match = useMemo(() => {
    let best: Match | null = null;
    for (const branch of branches) {
      const candidate = matchBranch(branch, pathname);
      if (candidate && (!best || candidate.score > best.score)) best = candidate;
    }
    return best;
  }, [branches, pathname]);

  if (!match) return null;
  return renderBranch(match.branch, match.params, 0);
}

export function Outlet(): ReactNode {
  return useContext(OutletContext);
}

/* ------------------------------------------------------------------ *
 * 导航
 * ------------------------------------------------------------------ */

export function useLocation(): Location {
  return useContext(LocationContext);
}

export function useNavigate() {
  return useContext(NavigateContext);
}

export function useParams(): Record<string, string> {
  return useContext(ParamsContext);
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }): null {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);
  return null;
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  replace?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}

export function Link({ to, replace, onClick, ref, ...rest }: LinkProps) {
  const navigate = useNavigate();
  const basename = useContext(BasenameContext);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    // 保留浏览器原生行为：新标签页、下载、组合键点击、站外链接
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (rest.target && rest.target !== "_self") return;
    if (rest.download !== undefined || isExternal(to)) return;
    event.preventDefault();
    navigate(to, { replace });
  };

  return createElement("a", { ...rest, ref, href: withBasename(to, basename), onClick: handleClick });
}

interface NavLinkProps extends Omit<LinkProps, "className" | "children"> {
  end?: boolean;
  className?: string | ((state: { isActive: boolean }) => string);
  children?: ReactNode | ((state: { isActive: boolean }) => ReactNode);
}

export function NavLink({ to, end = false, className, children, ...rest }: NavLinkProps) {
  const { pathname } = useLocation();
  const path = to.split("?")[0].replace(/\/+$/, "") || "/";
  const isActive = end ? pathname === path : pathname === path || pathname.startsWith(path + "/");

  return createElement(
    Link,
    {
      ...rest,
      to,
      "aria-current": isActive ? "page" : undefined,
      className: typeof className === "function" ? className({ isActive }) : className,
    },
    typeof children === "function" ? children({ isActive }) : children
  );
}

export function useSearchParams(): [
  URLSearchParams,
  (next: URLSearchParams | Record<string, string>, options?: NavigateOptions) => void,
] {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setParams = useCallback(
    (next: URLSearchParams | Record<string, string>, options?: NavigateOptions) => {
      const query = next instanceof URLSearchParams ? next.toString() : new URLSearchParams(next).toString();
      navigate(query ? `${pathname}?${query}` : pathname, options);
    },
    [navigate, pathname]
  );

  return [params, setParams];
}

export type { LinkProps, NavLinkProps, RouteProps, ReactElement };
