// 复制文本到剪贴板。
// Clipboard API 只在安全上下文（HTTPS / localhost）可用，失败时回退到
// 隐藏 textarea + execCommand，覆盖 http 部署、旧浏览器与权限被拒的场景。
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 继续走兼容回退
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
