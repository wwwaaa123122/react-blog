// 从 shadcn 官方 registry 拉取组件源码并适配到本项目：
//   1) deps 里的 "cn" 是本项目用不上的包，导入改为 "@/lib/utils"
//   2) registry 内部导入（@/registry/<style>/ui/x）改为 "@/components/ui/x"
//   3) <IconPlaceholder lucide="XIcon" .../> 展开为 lucide-react 的 <XIcon/>
//   4) hooks（use-mobile 等）写入 src/hooks/
// 用法: node scripts/fetch-shadcn.mjs dialog sheet table tabs
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const STYLE = "radix-nova";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://ui.shadcn.com/r/styles/" + STYLE;

const cache = new Map();
async function fetchItem(name) {
  if (cache.has(name)) return cache.get(name);
  const res = await fetch(BASE + "/" + name + ".json");
  if (!res.ok) throw new Error("registry " + name + " -> HTTP " + res.status);
  const json = await res.json();
  cache.set(name, json);
  return json;
}

async function resolve(name, acc = new Map()) {
  if (acc.has(name)) return acc;
  const item = await fetchItem(name);
  acc.set(name, item);
  for (const dep of item.registryDependencies || []) {
    if (!dep.startsWith("http")) await resolve(dep, acc);
  }
  return acc;
}

function transform(content) {
  let out = content;
  const iconNames = new Set();

  out = out.replace(/<IconPlaceholder\b[\s\S]*?\/>/g, (block) => {
    const m = block.match(/lucide="([^"]+)"/);
    if (!m) return "";
    const icon = m[1];
    iconNames.add(icon);
    return block
      .replace(/\s*lucide="[^"]*"/, "")
      .replace(/\s*tabler="[^"]*"/, "")
      .replace(/\s*hugeicons="[^"]*"/, "")
      .replace(/\s*phosphor="[^"]*"/, "")
      .replace(/\s*remixicon="[^"]*"/, "")
      .replace(/^<IconPlaceholder\b/, "<" + icon);
  });
  out = out.replace(
    /import \{ IconPlaceholder \} from "@\/app\/\(create\)\/components\/icon-placeholder"\n/,
    ""
  );

  out = out.replace(new RegExp('"@/registry/' + STYLE + '/ui/([^"]+)"', "g"), '"@/components/ui/$1"');
  out = out.replace(new RegExp('"@/registry/' + STYLE + '/hooks/([^"]+)"', "g"), '"@/hooks/$1"');
  out = out.replace(new RegExp('"@/registry/' + STYLE + '/lib/([^"]+)"', "g"), '"@/lib/$1"');
  out = out.replace(/from "cn"/g, 'from "@/lib/utils"');

  if (iconNames.size) {
    if (/from "lucide-react"/.test(out)) {
      out = out.replace(/import \{([^}]+)\} from "lucide-react"\n/, (_m, inner) => {
        const merged = new Set(
          inner.split(",").map((s) => s.trim()).filter(Boolean).concat([...iconNames])
        );
        return "import { " + [...merged].sort().join(", ") + ' } from "lucide-react"\n';
      });
    } else {
      const importLine = "import { " + [...iconNames].sort().join(", ") + ' } from "lucide-react"\n';
      // 注意：必须跳过整个（可能多行的）import 语句，否则会插进 { } 中间
      const re = /^import[\s\S]*?from\s+"[^"]+"\s*;?\s*$/gm;
      let end = -1;
      let m;
      while ((m = re.exec(out)) !== null) end = m.index + m[0].length;
      out = end === -1 ? importLine + out : out.slice(0, end) + "\n" + importLine + out.slice(end);
    }
  }

  return out.replace(/\n{3,}/g, "\n\n");
}

function targetPath(filePath) {
  const m = filePath.match(/registry\/[^/]+\/(ui|hooks|lib)\/(.+)$/);
  if (!m) return null;
  const kind = m[1];
  const rest = m[2];
  const dir = kind === "ui" ? "src/components/ui" : kind === "hooks" ? "src/hooks" : "src/lib";
  return join(root, dir, rest);
}

const args = process.argv.slice(2);
if (!args.length) {
  console.error("usage: node scripts/fetch-shadcn.mjs <component...>");
  process.exit(1);
}

const allDeps = new Set();
const written = [];

for (const name of args) {
  const items = await resolve(name);
  for (const [itemName, item] of items) {
    for (const d of item.dependencies || []) if (d !== "cn") allDeps.add(d);
    for (const file of item.files || []) {
      const dest = targetPath(file.path);
      if (!dest) {
        console.log("[skip] " + itemName + " -> " + file.path);
        continue;
      }
      writeFileSync(dest, transform(file.content));
      written.push(dest.replace(root + "/", "") + "  (" + itemName + ")");
    }
  }
}

console.log("[shadcn] 写入 " + written.length + " 个文件：");
for (const w of written) console.log("  - " + w);
if (allDeps.size) console.log("[shadcn] 需要安装的依赖: " + [...allDeps].join(" "));
