import { useEffect, useState } from 'react';

const STORAGE_KEY = 'luntian-theme';

export function getPreferredTheme() {
    if (typeof window === 'undefined') {
        return 'dark';
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
}

export default function useTheme() {
    const [theme, setThemeState] = useState(() => getPreferredTheme());

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setThemeState((current) => (current === 'dark' ? 'light' : 'dark'));
    };

    const setTheme = (value) => {
        if (value === 'light' || value === 'dark') {
            setThemeState(value);
        }
    };

    return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
