import { Palette } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

const FIRE_ROUTES = /^\/dhurandhar(\/|$)|^\/problems\/sp-/;

const THEMES = [
    { id: "light",     label: "Light",     dot: "bg-zinc-200" },
    { id: "cyberpunk", label: "Cyberpunk", dot: "bg-pink-500" },
    { id: "forest",    label: "Forest",    dot: "bg-green-600" },
    { id: "midnight",  label: "Midnight",  dot: "bg-indigo-900" },
    { id: "bubblegum", label: "Bubblegum", dot: "bg-pink-300" },
    { id: "peach",     label: "Peach",     dot: "bg-orange-200" },
    { id: "sky",       label: "Sky",       dot: "bg-sky-300" },
    { id: "lemon",     label: "Lemon",     dot: "bg-yellow-200" },
] as const;

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { pathname } = useLocation();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (FIRE_ROUTES.test(pathname)) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Change theme"
            >
                <Palette className="h-5 w-5" />
                <span className="text-sm">Themes</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md border border-zinc-800 bg-zinc-950 py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-[200]">
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setTheme(t.id);
                                setIsOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-800 ${theme === t.id ? "text-primary font-medium" : "text-muted-foreground"
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full border border-zinc-700 ${t.dot}`} />
                                {t.label}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
