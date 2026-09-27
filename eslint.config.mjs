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
