import useTheme from '@/hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className={
                `inline-flex h-10 w-10 items-center justify-center rounded-xl border border-teal-200/80 bg-white text-teal-600 shadow-sm transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800/80 dark:text-amber-300 dark:hover:bg-slate-700 ${className}`
            }
        >
            {isDark ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                >
                    <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm9-6a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm12.95 5.95a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM7.464 6.05A1 1 0 0 1 6.05 7.464l-.707-.707A1 1 0 0 1 6.757 5.343l.707.707Zm9.192-1.414a1 1 0 0 1 1.414 1.414l-.707.707A1 1 0 1 1 16.95 5.343l.707-.707ZM6.05 16.536a1 1 0 0 1 1.414 1.414l-.707.707A1 1 0 0 1 5.343 17.243l.707-.707ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                </svg>
            )}
        </button>
    );
}
