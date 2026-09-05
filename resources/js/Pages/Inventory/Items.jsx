import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import useCan from '@/hooks/useCan';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function SortIcon({ active, direction }) {
    return (
        <span className="ml-1 inline-flex flex-col text-[9px] leading-none text-slate-400">
            <span className={active && direction === 'asc' ? 'text-slate-800 dark:text-white' : ''}>
                ▲
            </span>
            <span className={active && direction === 'desc' ? 'text-slate-800 dark:text-white' : ''}>
                ▼
            </span>
        </span>
    );
}

export default function Items({
    items,
    filters,
    canManage = false,
    isOwnView = false,
}) {
    const canAdd = useCan('inventory.manage') || canManage;
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search === (filters.search || '')) {
                return;
            }

            router.get(
                route('inventory.items'),
                {
                    search: search || undefined,
                    sort: filters.sort,
                    direction: filters.direction,
                    per_page: filters.per_page,
                },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, filters.search, filters.sort, filters.direction, filters.per_page]);

    const updateTable = (overrides = {}) => {
        router.get(
            route('inventory.items'),
            {
                search: search || undefined,
                sort: filters.sort,
                direction: filters.direction,
                per_page: filters.per_page,
                ...overrides,
            },
            { preserveState: true, replace: true },
        );
    };

    const toggleSort = (column) => {
        const nextDirection =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        updateTable({ sort: column, direction: nextDirection });
    };

    const columns = [
        { key: 'item_code', label: 'Item ID' },
        { key: 'name', label: 'Item Name' },
        { key: 'description', label: 'Description' },
        { key: 'type', label: 'Type' },
        { key: 'allocated_to_name', label: 'Allocated To' },
        { key: 'condition', label: 'Item Condition' },
        { key: 'remarks', label: 'Remarks' },
        { key: 'date_arrived', label: 'Date Arrived' },
        { key: 'brand', label: 'Brand / Manufacturer' },
        { key: 'date_purchased', label: 'Date Purchased' },
        { key: 'status', label: 'Status' },
    ];

    const title = isOwnView ? 'List of my items' : 'List of items';

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {title}
                </h1>
            }
        >
            <Head title={title} />

            {flash?.success && (
                <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {flash.success}
                </div>
            )}

            <div className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm">
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h6"
                    />
                </svg>
                {isOwnView ? 'List of my items' : 'List of items'}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search items..."
                        className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />

                    <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                        <select
                            value={filters.per_page}
                            onChange={(e) =>
                                updateTable({ per_page: Number(e.target.value) })
                            }
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        >
                            {[10, 25, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n} / page
                                </option>
                            ))}
                        </select>

                        {canAdd && (
                            <>
                                <a
                                    href={route('inventory.items.export', {
                                        search: search || undefined,
                                        sort: filters.sort,
                                        direction: filters.direction,
                                    })}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    Export to Excel
                                </a>
                                <Link
                                    href={route('inventory.items.create')}
                                    className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                                >
                                    + Add item
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/60">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="whitespace-nowrap px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleSort(column.key)}
                                            className="inline-flex items-center"
                                        >
                                            {column.label}
                                            <SortIcon
                                                active={filters.sort === column.key}
                                                direction={filters.direction}
                                            />
                                        </button>
                                    </th>
                                ))}
                                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                                    Service Length
                                </th>
                                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                                    Pictures
                                </th>
                                <th className="whitespace-nowrap px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                                    Print Label
                                </th>
                                <th className="whitespace-nowrap px-3 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {items.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + 4}
                                        className="px-4 py-10 text-center text-slate-500"
                                    >
                                        {isOwnView
                                            ? 'No items allocated to you yet.'
                                            : 'No inventory items yet. Add the first item.'}
                                    </td>
                                </tr>
                            ) : (
                                items.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                    >
                                        <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-800 dark:text-slate-100">
                                            {item.item_code}
                                        </td>
                                        <td className="max-w-[10rem] truncate px-3 py-3 text-slate-700 dark:text-slate-200">
                                            {item.name}
                                        </td>
                                        <td className="max-w-[12rem] truncate px-3 py-3 text-slate-600 dark:text-slate-300">
                                            {item.description || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-200">
                                            {item.type || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-200">
                                            {item.allocated_to || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-200">
                                            {item.condition || '—'}
                                        </td>
                                        <td className="max-w-[10rem] truncate px-3 py-3 text-slate-600 dark:text-slate-300">
                                            {item.remarks || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-200">
                                            {item.date_arrived || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-200">
                                            {item.brand || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-200">
                                            {item.date_purchased || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-200">
                                            {item.status || '—'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-600 dark:text-slate-300">
                                            {item.service_length || '—'}
                                        </td>
                                        <td className="px-3 py-3">
                                            {(item.pictures || []).length > 0 ? (
                                                <div className="flex items-center -space-x-2">
                                                    {item.pictures
                                                        .slice(0, 3)
                                                        .map((picture) => (
                                                            <a
                                                                key={picture.path}
                                                                href={picture.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-block"
                                                            >
                                                                <img
                                                                    src={picture.url}
                                                                    alt={item.name}
                                                                    className="h-10 w-10 rounded-md object-cover ring-2 ring-white dark:ring-slate-900"
                                                                />
                                                            </a>
                                                        ))}
                                                    {item.pictures.length > 3 && (
                                                        <span className="pl-3 text-xs font-semibold text-slate-500">
                                                            +{item.pictures.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3">
                                            <Link
                                                href={route(
                                                    'inventory.items.print',
                                                    item.id,
                                                )}
                                                className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300"
                                            >
                                                Print
                                            </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <Link
                                                    href={route(
                                                        'inventory.items.show',
                                                        item.id,
                                                    )}
                                                    className="text-xs font-semibold text-slate-700 hover:text-teal-700 dark:text-slate-200"
                                                >
                                                    View
                                                </Link>
                                                {canAdd && (
                                                    <>
                                                        <Link
                                                            href={route(
                                                                'inventory.items.edit',
                                                                item.id,
                                                            )}
                                                            className="text-xs font-semibold text-teal-700 hover:text-teal-600 dark:text-teal-400"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (
                                                                    !window.confirm(
                                                                        `Delete ${item.item_code}?`,
                                                                    )
                                                                ) {
                                                                    return;
                                                                }
                                                                router.delete(
                                                                    route(
                                                                        'inventory.items.destroy',
                                                                        item.id,
                                                                    ),
                                                                );
                                                            }}
                                                            className="text-xs font-semibold text-rose-600 hover:text-rose-500"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {items.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                        <span className="text-slate-500">
                            Page {items.current_page} of {items.last_page}
                        </span>
                        <div className="flex gap-2">
                            {items.prev_page_url && (
                                <Link
                                    href={items.prev_page_url}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200"
                                >
                                    Previous
                                </Link>
                            )}
                            {items.next_page_url && (
                                <Link
                                    href={items.next_page_url}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
