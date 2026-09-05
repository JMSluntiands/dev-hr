import { useEffect, useMemo, useRef, useState } from 'react';

const defaultInputClass =
    'block w-full rounded-xl border-0 bg-[#eef3f8] px-3.5 py-2.5 text-slate-800 shadow-none placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

export default function SearchableSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Search...',
    emptyMessage = 'No results found',
    inputClassName = defaultInputClass,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef(null);

    const selected = options.find((option) => option.name === value) ?? null;

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        if (normalized === '') {
            return options;
        }

        return options.filter((option) =>
            [option.name, option.employee_number, option.department, option.position]
                .filter(Boolean)
                .some((text) => text.toLowerCase().includes(normalized)),
        );
    }, [options, query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
                setQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option.name);
        setOpen(false);
        setQuery('');
    };

    const displayValue = open ? query : selected?.name ?? value ?? '';

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    className={inputClassName}
                    value={displayValue}
                    placeholder={placeholder}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);

                        if (event.target.value === '') {
                            onChange('');
                        }
                    }}
                    onFocus={() => {
                        setOpen(true);
                        setQuery('');
                    }}
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => {
                            onChange('');
                            setQuery('');
                            setOpen(false);
                        }}
                        className="absolute inset-y-0 end-0 flex items-center pe-3 text-xs font-medium text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        Clear
                    </button>
                )}
            </div>

            {open && (
                <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    {filtered.length === 0 ? (
                        <li className="px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400">
                            {emptyMessage}
                        </li>
                    ) : (
                        filtered.map((option) => (
                            <li key={option.id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`flex w-full flex-col px-3.5 py-2.5 text-start text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                                        option.name === value
                                            ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                                            : 'text-slate-700 dark:text-slate-200'
                                    }`}
                                >
                                    <span className="font-medium">{option.name}</span>
                                    {(option.employee_number ||
                                        option.department ||
                                        option.position) && (
                                        <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            {[
                                                option.employee_number,
                                                option.department,
                                                option.position,
                                            ]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}
