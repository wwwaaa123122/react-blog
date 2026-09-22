import { useEffect, useRef, useState } from "react";

// 移动端布局诊断面板：仅在 URL 带 ?diag=1 时出现，正常访问完全不影响页面。
// 用途：在没有 DevTools 的手机上，把展开菜单前后的关键布局数值直接显示在屏幕上，
// 便于把"内容左移"这类问题定位到具体是哪个元素/哪个属性在变。
type Row = { label: string; value: string; changed?: boolean };

function collect(): Record<string, string> {
  const d = document;
  const el = d.documentElement;
  const body = d.body;
  const cs = getComputedStyle(body);
  const hs = getComputedStyle(el);
  const out: Record<string, string> = {
    "视口 innerWidth": String(window.innerWidth),
    "html.clientWidth": String(el.clientWidth),
    "滚动条宽度(估)": String(window.innerWidth - el.clientWidth),
    "html.scrollWidth": String(el.scrollWidth),
    "body.scrollWidth": String(body.scrollWidth),
    "横向溢出": String(el.scrollWidth - el.clientWidth),
    "scrollX / scrollY": `${Math.round(window.scrollX)} / ${Math.round(window.scrollY)}`,
    "body overflowX/Y": `${cs.overflowX} / ${cs.overflowY}`,
    "html overflowX/Y": `${hs.overflowX} / ${hs.overflowY}`,
    "body padding L/R": `${cs.paddingLeft} / ${cs.paddingRight}`,
    "body margin L/R": `${cs.marginLeft} / ${cs.marginRight}`,
    "body 内联 style": body.getAttribute("style") ?? "(无)",
    "body 属性": [...body.attributes].map((a) => a.name).join(",") || "(无)",
    "html 内联 style": el.getAttribute("style") ?? "(无)",
    "html class": el.className || "(无)",
  };

  const pick = (sel: string, name: string) => {
    const n = d.querySelector(sel);
    if (!n) {
      out[name] = "(未找到)";
      return;
    }
    const r = n.getBoundingClientRect();
    out[name] = `left=${r.left.toFixed(1)} width=${r.width.toFixed(1)} right=${r.right.toFixed(1)}`;
  };
  pick("header", "header 位置");
  pick("#main > div", "正文容器位置");
  pick("[data-slot='dropdown-menu-content']", "菜单面板位置");
  return out;
}

export default function DebugProbe() {
  const [enabled, setEnabled] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [copied, setCopied] = useState(false);
  // 基准值放在 ref 里：页面刚加载（菜单未展开）时的状态
  const baseRef = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).get("diag") === "1");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    baseRef.current = collect();
    const tick = () => {
      const next = collect();
      const base = baseRef.current;
      setRows(
        Object.keys(next).map((label) => ({
          label,
          value: next[label],
          changed: base ? base[label] !== next[label] : false,
        }))
      );
    };
    tick();
    const id = window.setInterval(tick, 350);
    return () => window.clearInterval(id);
  }, [enabled]);

  if (!enabled) return null;

  const changed = rows.filter((r) => r.changed);
  const text = rows.map((r) => `${r.changed ? "*" : " "} ${r.label}: ${r.value}`).join("\n");

  return (
    <div className="fixed inset-x-2 top-2 z-[200] max-h-[70vh] overflow-auto rounded-xl border border-border bg-background/95 p-3 font-mono text-[11px] leading-relaxed shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-2">
        <strong className="text-xs">
          布局诊断（带 * 的是展开菜单后发生变化的项，共 {changed.length} 项）
        </strong>
        <button
          type="button"
          className="rounded-md border border-border px-2 py-0.5 text-[11px]"
          onClick={() => {
            navigator.clipboard?.writeText(text).then(
              () => setCopied(true),
              () => setCopied(false)
            );
          }}
        >
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <table className="w-full border-collapse">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={r.changed ? "bg-destructive/15" : undefined}>
              <td className="whitespace-nowrap pr-2 align-top">{r.changed ? "* " : "  "}{r.label}</td>
              <td className="break-all align-top">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[10px] text-muted-foreground">
        操作：先看一遍数值 → 展开右上角菜单 → 再看带 * 的行。把这些行截图或复制发我即可。
      </p>
    </div>
  );
}
