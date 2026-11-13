import { plugin as shadcn } from "@shadcn/lint"
import tsParser from "@typescript-eslint/parser"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { shadcn },
    rules: {
      // 运行时是 Preact（@preact/preset-vite 把 react 别名到 preact/compat），
      // 类型仍是 @types/react —— React 19 新增的这批 API 能通过类型检查但在浏览器里不存在，
      // 属于「编译通过、上线白屏」的坑。用 no-restricted-syntax 精确拦命名导入与 React.xxx 调用，
      // 不用 no-restricted-imports：它会把 `import * as React` 判成「导入了全部名字」。
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ImportDeclaration[source.value='react'] > ImportSpecifier[imported.name=/^(use|useActionState|useFormStatus|useOptimistic|cache|useEffectEvent)$/]",
          message:
            "运行时是 Preact compat，该 React 19 API 不存在（能通过类型检查但线上白屏）。改用 useContext / useState 等 Preact 已实现的 API。",
        },
        {
          selector:
            "MemberExpression[object.name='React'][property.name=/^(use|useActionState|useFormStatus|useOptimistic|cache|useEffectEvent)$/]",
          message:
            "运行时是 Preact compat，该 React 19 API 不存在（能通过类型检查但线上白屏）。",
        },
        {
          selector:
            "ImportDeclaration[source.value='react-dom'] > ImportSpecifier[imported.name=/^(preload|preinit|prefetchDNS|preconnect)$/]",
          message: "Preact compat 不提供 react-dom 的资源预加载 API。",
        },
      ],
      // Pages own layout; components own their own restyling.
      "shadcn/no-restyle": [
        "error",
        {
          allow: ["layout"],
          contracts: [
            // Pages may place and size these primitives, but not restyle them.
            { pattern: "^(Button|Badge|Input|Textarea|Label|Skeleton)$", allow: ["w-full", "h-full", "mt-*", "mb-*", "mx-*", "my-*"] },
            // Titles may change typography, but not family or weight.
            { pattern: "^(CardTitle|DialogTitle|CardDescription)$", allow: ["layout", "typography"] },
            // Content wrappers may change spacing only.
            { pattern: "^(CardContent|CardFooter|CardHeader)$", allow: ["layout", "spacing"] },
          ],
        },
      ],
      // Keep values on the theme scale.
      "shadcn/no-arbitrary-values": "error",
      // Colors must come from the theme (src/index.css CSS variables).
      "shadcn/no-raw-colors": "error",
    },
  },
])
