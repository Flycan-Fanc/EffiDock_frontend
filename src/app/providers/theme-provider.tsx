import { useEffect } from "react";

import { useAppStore } from "@/stores/use-app-store";

function resolveTheme(preference: "system" | "light" | "dark") {
  if (preference === "light" || preference === "dark") {
    return preference;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider() {
  const preference = useAppStore((state) => state.themePreference);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const theme = resolveTheme(preference);
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    };

    applyTheme();

    if (preference !== "system") {
      return;
    }

    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [preference]);

  return null;
}
