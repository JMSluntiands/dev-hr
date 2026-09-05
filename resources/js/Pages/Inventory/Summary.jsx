import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

function IconShell({ children }) {
    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                {children}
            </svg>
        </div>
    );
}

function CategoryIcon({ name = '', code = '' }) {
    const key = `${name} ${code}`.toLowerCase();

    if (key.includes('storage bag') || key.includes('sbag') || key.includes('stb')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16v11a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm3 0V6a5 5 0 0110 0v2M9 13h6"
                />
            </IconShell>
        );
    }

    if (/\bbag\b/.test(key) || key.includes('it-bag')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 00-8 0M5 10h14l-1.2 10.2A2 2 0 0115.81 22H8.19a2 2 0 01-1.99-1.8L5 10zm3-3V6a1 1 0 011-1h6a1 1 0 011 1v1"
                />
            </IconShell>
        );
    }

    if (key.includes('charger') || key.includes('chg')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 7V3m6 4V3M8 7h8a2 2 0 012 2v4.5a5.5 5.5 0 11-11 0V9a2 2 0 012-2zm4 7v4"
                />
            </IconShell>
        );
    }

    if (key.includes('phone') || key.includes('cph')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 3.5h8A1.5 1.5 0 0117.5 5v14a1.5 1.5 0 01-1.5 1.5H8A1.5 1.5 0 016.5 19V5A1.5 1.5 0 018 3.5zM12 18h.01"
                />
            </IconShell>
        );
    }

    if (key.includes('headset') || key.includes('hs-')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 13v-1a8 8 0 0116 0v1M4 13a2 2 0 002 2h1v-4H6a2 2 0 00-2 2zm16 0a2 2 0 01-2 2h-1v-4h1a2 2 0 012 2zm-8 5h3a2 2 0 002-2v-1"
                />
            </IconShell>
        );
    }

    if (key.includes('keyboard') || key.includes('it-key')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8.5A1.5 1.5 0 014.5 7h15A1.5 1.5 0 0121 8.5v7a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 15.5v-7zM7 10h.01M11 10h.01M15 10h.01M7 13h.01M11 13h6"
                />
            </IconShell>
        );
    }

    if (key.includes('laptop stand') || key.includes('stand') || key.includes('lst')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 17h16M7 17l2-8h6l2 8M9 9V6.5A1.5 1.5 0 0110.5 5h3A1.5 1.5 0 0115 6.5V9"
                />
            </IconShell>
        );
    }

    if (key.includes('sleeve') || key.includes('lsl')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 5.5A1.5 1.5 0 017.5 4h9A1.5 1.5 0 0118 5.5v13a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 18.5v-13zM9 8h6"
                />
            </IconShell>
        );
    }

    if (
        key.includes('portable monitor') ||
        key.includes('pmon') ||
        key.includes('pmo')
    ) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 5h10a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zm3 13h4M5 9h2m10 0h2"
                />
            </IconShell>
        );
    }

    if (key.includes('monitor') || key.includes('mon')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v9a1.5 1.5 0 01-1.5 1.5H5.5A1.5 1.5 0 014 14.5v-9zM9 19h6M12 16v3"
                />
            </IconShell>
        );
    }

    if (key.includes('mouse') || key.includes('mou')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3.5c-3 0-5 2.2-5 6.5v4c0 3.3 2 5.5 5 5.5s5-2.2 5-5.5v-4c0-4.3-2-6.5-5-6.5zm0 0v5"
                />
            </IconShell>
        );
    }

    if (key.includes('laptop') || key.includes('lap')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6.5A1.5 1.5 0 015.5 5h13A1.5 1.5 0 0120 6.5V15H4V6.5zM2 18h20"
                />
            </IconShell>
        );
    }

    if (key.includes('power cord') || key.includes('cord') || key.includes('cor')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 3v5m8-5v5M9 8h6v3.5a5 5 0 11-6 0V8zm3 8.5V21"
                />
            </IconShell>
        );
    }

    if (key.includes('table') || key.includes('tbl') || key.includes('tab-')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 9h16v3H4V9zm2 3v8m12-8v8M8 21h8"
                />
            </IconShell>
        );
    }

    if (key.includes('misc')) {
        return (
            <IconShell>
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3z"
                />
            </IconShell>
        );
    }

    return (
        <IconShell>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
        </IconShell>
    );
}

export default function Summary({
    categories = [],
    grandTotal = 0,
    selectedCategory = null,
    categoryItems = [],
    canOpenItem = false,
}) {
    const tableRef = useRef(null);
    const selectedName = selectedCategory?.name || '';

    useEffect(() => {
        if (selectedCategory && tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedCategory?.name]);

    const openCategory = (category) => {
        const isSame =
            selectedName &&
            selectedName.toLowerCase() === category.name.toLowerCase();

        router.get(
            route('inventory.summary'),
            isSame ? {} : { category: category.name },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                        Inventory Summary
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        Total count per item category. Click a card to view
                        items.
                    </p>
                </div>
            }
        >
            <Head title="Inventory Summary" />

            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                    <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                            Inventory overview
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Counts by category
                        </p>
                    </div>
                    <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm dark:bg-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">
                            Grand total
                        </span>
                        <span className="ms-2 font-semibold text-slate-800 dark:text-white">
                            {grandTotal}
                        </span>
                    </div>
                </div>

                {categories.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
                        <p className="font-medium text-slate-800 dark:text-white">
                            No inventory categories yet
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Add items to the inventory catalog to see totals
                            here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((category) => {
                            const isActive =
                                selectedName.toLowerCase() ===
                                category.name.toLowerCase();

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => openCategory(category)}
                                    className={
                                        'rounded-xl border bg-white px-4 py-3 text-left shadow-sm transition hover:border-teal-300 hover:bg-teal-50/40 dark:bg-slate-900 dark:hover:border-teal-700 dark:hover:bg-teal-950/20 ' +
                                        (isActive
                                            ? 'border-teal-500 ring-2 ring-teal-200 dark:border-teal-400 dark:ring-teal-900'
                                            : 'border-slate-200 dark:border-slate-700')
                                    }
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                {category.name}
                                            </h3>
                                            {category.code && (
                                                <p className="mt-0.5 font-mono text-xs text-slate-400">
                                                    {category.code}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <CategoryIcon
                                                name={category.name}
                                                code={category.code}
                                            />
                                            <div className="text-right">
                                                <div className="text-2xl font-semibold leading-none tracking-tight text-slate-900 dark:text-white">
                                                    {category.total_count}
                                                </div>
                                                <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                    Total
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {selectedCategory && (
                    <div
                        ref={tableRef}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                            <div>
                                <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                                    {selectedCategory.name}
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {categoryItems.length} item
                                    {categoryItems.length === 1 ? '' : 's'}
                                    {selectedCategory.code
                                        ? ` · ${selectedCategory.code}`
                                        : ''}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    router.get(route('inventory.summary'), {}, {
                                        preserveState: true,
                                        preserveScroll: true,
                                    })
                                }
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>

                        {categoryItems.length === 0 ? (
                            <p className="px-4 py-10 text-center text-sm text-slate-500">
                                No items found for this category.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">
                                                Item ID
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Item Name
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Type
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Allocated To
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Condition
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Brand
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Date Arrived
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {categoryItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                            >
                                                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-200">
                                                    {canOpenItem ? (
                                                        <Link
                                                            href={route(
                                                                'inventory.items.show',
                                                                item.id,
                                                            )}
                                                            className="font-semibold text-teal-700 hover:underline dark:text-teal-300"
                                                        >
                                                            {item.item_code}
                                                        </Link>
                                                    ) : (
                                                        item.item_code
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-slate-800 dark:text-slate-100">
                                                    {item.name}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                    {item.type || '—'}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                    {item.allocated_to_name ||
                                                        '—'}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                    {item.condition || '—'}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                    {item.status || '—'}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                    {item.brand || '—'}
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">
                                                    {item.date_arrived || '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
