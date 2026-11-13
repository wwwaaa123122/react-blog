// toast 门面：用法与 `import { toast } from "sonner"` 一致（可直接调用，
// 也支持 .success / .error / .promise），但 sonner 本体、图标和 Toaster 宿主
// 都是首次调用时才下载并挂载。
//
// 首屏因此少 68 KB 源码 —— 绝大多数访客不会点"复制链接"，也就永远不付这份流量。
type SonnerModule = typeof import("sonner");
type Kind = "success" | "error" | "info" | "warning" | "message";

let loading: Promise<SonnerModule> | null = null;

function ensure(): Promise<SonnerModule> {
  loading ??= (async () => {
    const host = await import("../components/toast-host");
    host.mountToastHost();
    // 等 Toaster 订阅完成，否则第一条提示会被丢掉
    await host.whenToastHostReady;
    return import("sonner");
  })();
  return loading;
}

// 统一吞掉加载/调用异常：提示失败不应影响复制、提交等主流程
const run = (task: (mod: SonnerModule) => unknown): void => {
  void ensure()
    .then(task)
    .catch(() => {
      /* 静默降级 */
    });
};

const call = (kind: Kind) => (message: string) => run((mod) => mod.toast[kind](message));

export const toast = Object.assign(call("message"), {
  success: call("success"),
  error: call("error"),
  info: call("info"),
  warning: call("warning"),
  promise: (...args: Parameters<SonnerModule["toast"]["promise"]>) =>
    run((mod) => mod.toast.promise(...args)),
});
