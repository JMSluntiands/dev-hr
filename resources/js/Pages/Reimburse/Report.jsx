import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Report({
    reimbursements = [],
    filters = {},
    totalAmount = '0.00',
}) {
    const { flash } = usePage().props;
    const [from, setFrom] = useState(filters.from || '');
    const [to, setTo] = useState(filters.to || '');

    const applyFilters = (event) => {
        event.preventDefault();
        router.get(
            route('reimburse.report'),
            {
                from: from || undefined,
                to: to || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setFrom('');
        setTo('');
        router.get(route('reimburse.report'), {}, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Report of Reimbursement
                </h1>
            }
        >
            <Head title="Report of Reimbursement" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <form
                        onSubmit={applyFilters}
                        className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:flex-wrap sm:items-end"
                    >
                        <label className="block space-y-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                From
                            </span>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            />
                        </label>
                        <label className="block space-y-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                To
                            </span>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            />
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                            >
                                Apply filter
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="sm:ml-auto">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Total completed
                            </p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                                PHP {totalAmount}
                            </p>
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Employee
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Expense Type
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Purchased Date
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Completed
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Evidence
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {reimbursements.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-16 text-center text-slate-500"
                                        >
                                            No completed reimbursements for the
                                            selected dates.
                                        </td>
                                    </tr>
                                ) : (
                                    reimbursements.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-900 dark:text-white">
                                                    {item.employee_name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {item.employee_email}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.expense_type}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.description}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.purchased_date}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.completed_at || '—'}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                PHP {item.amount}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.evidence_receipt_url ? (
                                                    <a
                                                        href={
                                                            item.evidence_receipt_url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm font-semibold text-teal-600 hover:text-teal-500"
                                                    >
                                                        View
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
