'use client';

import * as React from 'react';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggleButton() {
    const [mounted, setMounted] = React.useState(false);
    const { setTheme, theme } = useTheme();

    console.log('Current theme:', theme);

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-9 w-9" />;
    }

    return (
        <button
            onClick={() => {
                console.log('Toggling theme from', theme, 'to', theme === 'light' ? 'dark' : 'light');
                setTheme(theme === 'light' ? 'dark' : 'light');
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent"
            aria-label="Toggle theme"
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    );
}
