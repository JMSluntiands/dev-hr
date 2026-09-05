import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ logs, modules, canViewAll, filters }) {
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
                route('activity-log.index'),
                {
                    search: search || undefined,
                    module: filters.module || undefined,
                    per_page: filters.per_page,
                },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, filters.search, filters.module, filters.per_page]);

    const updateTable = (overrides = {}) => {
        router.get(
            route('activity-log.index'),
            {
                search: search || undefined,
                module: filters.module || undefined,
                per_page: filters.per_page,
                ...overrides,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Activity Log
                </h1>
            }
        >
            <Head title="Activity Log" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                System activity
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {canViewAll
                                    ? 'All recorded actions across the HR portal.'
                                    : 'Your recorded actions across the HR portal.'}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search activity…"
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:w-56"
                            />
                            <select
                                value={filters.module || ''}
                                onChange={(e) =>
                                    updateTable({
                                        module: e.target.value || undefined,
                                    })
                                }
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                            >
                                <option value="">All modules</option>
                                {modules.map((module) => (
                                    <option key={module} value={module}>
                                        {module}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={filters.per_page}
                                onChange={(e) =>
                                    updateTable({
                                        per_page: Number(e.target.value),
                                    })
                                }
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                            >
                                {[10, 25, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size} / page
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/60">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                        Date / Time
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                        Module
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                        Action
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                        Description
                                    </th>
                                    {canViewAll && (
                                        <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                            User
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={canViewAll ? 5 : 4}
                                            className="px-4 py-12 text-center text-slate-500"
                                        >
                                            No activity recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">
                                                {log.created_at}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                    {log.module}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 capitalize text-slate-700 dark:text-slate-200">
                                                {log.action}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {log.description}
                                            </td>
                                            {canViewAll && (
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {log.user_name}
                                                    </div>
                                                    {log.user_email && (
                                                        <div className="text-xs text-slate-500">
                                                            {log.user_email}
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {(logs.prev_page_url || logs.next_page_url) && (
                        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                            <p className="text-xs text-slate-500">
                                Page {logs.current_page} of {logs.last_page} ·{' '}
                                {logs.total} total
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={!logs.prev_page_url}
                                    onClick={() =>
                                        logs.prev_page_url &&
                                        router.get(logs.prev_page_url, {}, {
                                            preserveState: true,
                                        })
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={!logs.next_page_url}
                                    onClick={() =>
                                        logs.next_page_url &&
                                        router.get(logs.next_page_url, {}, {
                                            preserveState: true,
                                        })
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
