import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "cyberpunk" | "forest" | "midnight" | "bubblegum" | "peach" | "sky" | "lemon";

const VALID_THEMES: Theme[] = ["light", "cyberpunk", "forest", "midnight", "bubblegum", "peach", "sky", "lemon"];

function isTheme(value: string | null): value is Theme {
    return value !== null && VALID_THEMES.includes(value as Theme);
}

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem("ui-theme");
        return isTheme(saved) ? saved : "midnight";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove all theme classes first
        root.classList.remove(
            "light",
            "theme-cyberpunk",
            "theme-forest",
            "theme-midnight",
            "theme-bubblegum",
            "theme-peach",
            "theme-sky",
            "theme-lemon"
        );

        // Apply the active theme
        if (theme === "light") {
            root.classList.add(theme);
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
