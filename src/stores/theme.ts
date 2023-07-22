import { atom } from "nanostores";

export type ThemeType = "light" | "dark";

export const themeStore = atom<ThemeType | undefined>();

export function toggleTheme(theme?: ThemeType | undefined) {
  const root = document.getElementById("root");
  if (!theme) {
    theme = themeStore.get() == 'light' ? 'dark' : 'light'
  }
  themeStore.set(theme);
  if (root) {
    const hasTheme = root.classList.contains(theme);
    if (theme == 'light') {
      root.classList.remove('dark');
    } else {
      if (!hasTheme) {
        root.classList.add('dark');
      }
    }
  }
}
