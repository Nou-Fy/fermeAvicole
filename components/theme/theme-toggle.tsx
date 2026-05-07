"use client";

import { useTheme } from "@/components/theme/theme-provider";
import { useState, useEffect, useRef } from "react";

const options = [
  { value: "light", label: "☀️" },
  { value: "dark", label: "🌙" },
  { value: "system", label: "💻" },
] as const;

export function ThemeToggle() {
  const { mode, resolvedTheme, setMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="theme-switcher-container" ref={dropdownRef}>
      <div className={`theme-switcher ${isOpen ? "is-open" : ""}`}>
        <div className="theme-toggle" role="tablist">
          {options.map((option) => (
            <button
              key={option.value}
              className={
                mode === option.value
                  ? "theme-option theme-option-active"
                  : "theme-option"
              }
              onClick={() => {
                setMode(option.value);
                setIsOpen(false); // Ferme le menu après sélection
              }}
              role="tab"
              type="button">
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
