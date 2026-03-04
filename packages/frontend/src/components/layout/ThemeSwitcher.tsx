import { Palette } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useRef, useEffect } from "react";

const THEMES = [
    { id: "dark", label: "Dark" },
    { id: "light", label: "Light" },
    { id: "ocean", label: "Ocean" },
    { id: "sunset", label: "Sunset" },
    { id: "cyberpunk", label: "Cyberpunk" },
    { id: "forest", label: "Forest" },
    { id: "midnight", label: "Midnight" },
    { id: "rose", label: "Rose" },
    { id: "solar", label: "Solar" },
] as const;

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-md p-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Change theme"
            >
                <Palette className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md border border-zinc-800 bg-zinc-950 py-1 shadow-lg ring-1 ring-black ring-opacity-5">
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
                                <div
                                    className={`h-3 w-3 rounded-full border border-zinc-700 ${t.id === 'dark' ? 'bg-zinc-900' :
                                            t.id === 'light' ? 'bg-zinc-200' :
                                                t.id === 'ocean' ? 'bg-cyan-600' :
                                                    t.id === 'sunset' ? 'bg-orange-500' :
                                                        t.id === 'cyberpunk' ? 'bg-pink-500' :
                                                            t.id === 'forest' ? 'bg-green-600' :
                                                                t.id === 'midnight' ? 'bg-indigo-900' :
                                                                    t.id === 'rose' ? 'bg-rose-500' :
                                                                        'bg-yellow-500'
                                        }`}
                                />
                                {t.label}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
