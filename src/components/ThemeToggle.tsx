import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { applyTheme, getInitialTheme, type Theme } from "../lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <button
      className="icon-btn"
      onClick={toggle}
      aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
      title={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} size={19} />
    </button>
  );
}
