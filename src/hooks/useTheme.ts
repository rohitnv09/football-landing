import { useEffect, useState } from "react";
import type { ThemeName } from "../types";

const themeClasses = ["theme-red", "theme-blue", "theme-yellow", "theme-white"];

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>("green");

  useEffect(() => {
    document.body.classList.remove(...themeClasses);

    if (theme !== "green") {
      document.body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return { theme, setTheme };
}
