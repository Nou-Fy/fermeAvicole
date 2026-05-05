"use client";

import { useTheme } from "@/components/theme/theme-provider";

const options = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Systeme" },
] as const;

export function ThemeToggle() {
  const { mode, resolvedTheme, setMode } = useTheme();

  return (
    <div className="theme-switcher" aria-label="Choix du theme">
      <span className="theme-indicator">{resolvedTheme === "dark" ? "Theme sombre" : "Theme clair"}</span>
      <div className="theme-toggle" role="tablist" aria-label="Mode de theme">
        {options.map((option) => (
          <button
            key={option.value}
            className={
              mode === option.value
                ? "theme-option theme-option-active"
                : "theme-option"
            }
            onClick={() => setMode(option.value)}
            role="tab"
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
