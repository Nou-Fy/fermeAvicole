const themeScript = `
(() => {
  const storageKey = "ferme-theme";
  const root = document.documentElement;
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const applyTheme = (mode) => {
    const resolved = mode === "system" ? getSystemTheme() : mode;
    root.dataset.theme = resolved;
    root.dataset.themeMode = mode;
  };

  try {
    const stored = localStorage.getItem(storageKey) || "system";
    applyTheme(stored);
  } catch {
    applyTheme("system");
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
