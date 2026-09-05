import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import useCan from '@/hooks/useCan';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({
    reviews,
    filters,
    canCreate = false,
    canManage = false,
    isOwnView = false,
}) {
    const canAddCreate = useCan('performance.create');
    const canAddManage = useCan('performance.manage');
    const canAdd = canAddCreate || canAddManage || canCreate;
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
                route('performance.index'),
                {
                    search: search || undefined,
                    per_page: filters.per_page,
                },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, filters.search, filters.per_page]);

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {isOwnView ? 'My performance reviews' : 'Performance Review'}
                </h1>
            }
        >
            <Head title={isOwnView ? 'My performance reviews' : 'Performance Review'} />

            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                    {isOwnView ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Reviews submitted by your supervisor.
                        </p>
                    ) : (
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search reviews..."
                            className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        />
                    )}

                    {canAdd && (
                        <Link
                            href={route('performance.create')}
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 sm:ml-auto"
                        >
                            + Conduct review
                        </Link>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/60">
                            <tr>
                                {!isOwnView && (
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Employee
                                    </th>
                                )}
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Review date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Supervisor
                                </th>
                                {canManage && (
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Submitted by
                                    </th>
                                )}
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Overall
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {reviews.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={isOwnView ? (canManage ? 6 : 5) : canManage ? 7 : 6}
                                        className="px-4 py-10 text-center text-slate-500"
                                    >
                                        No performance reviews yet.
                                    </td>
                                </tr>
                            ) : (
                                reviews.data.map((review) => (
                                    <tr
                                        key={review.id}
                                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                    >
                                        {!isOwnView && (
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-800 dark:text-slate-100">
                                                    {review.employee_name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {[review.employee_number, review.department]
                                                        .filter(Boolean)
                                                        .join(' · ') || '—'}
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                                            {review.review_date}
                                        </td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                                            {review.supervisor_name}
                                        </td>
                                        {canManage && (
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                                                {review.reviewed_by || '—'}
                                            </td>
                                        )}
                                        <td className="px-4 py-3">
                                            <span className="inline-flex rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                                                {review.overall_score ?? '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                {review.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={route('performance.show', review.id)}
                                                className="text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {reviews.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-700">
                        <span className="text-slate-500">
                            Page {reviews.current_page} of {reviews.last_page}
                        </span>
                        <div className="flex gap-2">
                            {reviews.prev_page_url && (
                                <Link
                                    href={reviews.prev_page_url}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200"
                                >
                                    Previous
                                </Link>
                            )}
                            {reviews.next_page_url && (
                                <Link
                                    href={reviews.next_page_url}
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
