import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "ocean" | "sunset" | "cyberpunk" | "forest" | "midnight" | "rose" | "solar" | "mint" | "bubblegum" | "lavender" | "peach" | "sky" | "lemon";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem("ui-theme");
        return (saved as Theme) || "dark";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove all theme classes first
        root.classList.remove(
            "dark",
            "light",
            "theme-ocean",
            "theme-sunset",
            "theme-cyberpunk",
            "theme-forest",
            "theme-midnight",
            "theme-rose",
            "theme-solar",
            "theme-mint",
            "theme-bubblegum",
            "theme-lavender",
            "theme-peach",
            "theme-sky",
            "theme-lemon"
        );

        // Apply the active theme
        if (theme === "dark" || theme === "light") {
            root.classList.add(theme); // Standard tailwind dark mode expects just "dark" class
        } else {
            root.classList.add(`theme-${theme}`);
        }

        localStorage.setItem("ui-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
