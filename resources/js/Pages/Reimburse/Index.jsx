import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import useCan from '@/hooks/useCan';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

function statusLabel(status) {
    if (status === 'rejected') return 'Declined';
    if (status === 'for_receipt') return 'For receipt';
    if (status === 'completed') return 'Completed';
    return status;
}

function StatusBadge({ status }) {
    const styles = {
        pending:
            'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        for_receipt:
            'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
        completed:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        rejected:
            'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
        approved:
            'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
    };

    return (
        <span
            className={
                'inline-flex rounded-md px-2 py-1 text-xs font-medium capitalize ' +
                (styles[status] || styles.pending)
            }
        >
            {statusLabel(status)}
        </span>
    );
}

export default function Index({ reimbursements, canReview }) {
    const { flash, errors } = usePage().props;
    const canCreate = useCan('reimburse.create');
    const [notes, setNotes] = useState({});

    const review = (id, status) => {
        if (status === 'rejected' && !(notes[id] || '').trim()) {
            window.alert('Please add a note before declining.');
            return;
        }

        router.post(
            route('reimburse.status', id),
            {
                status,
                review_notes: notes[id] || '',
            },
            { preserveScroll: true },
        );
    };

    const columnCount = canReview ? 7 : 5;

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Reimbursement Request
                </h1>
            }
        >
            <Head title="Reimbursement Request" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                        {flash.error}
                    </div>
                )}
                {errors?.review_notes && (
                    <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
                        {errors.review_notes}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {canReview
                                ? 'Approve or decline pending requests. Declining requires a note.'
                                : 'Your submitted reimbursement requests.'}
                        </p>
                        {canCreate && (
                            <Link
                                href={route('reimburse.create')}
                                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 sm:ml-auto"
                            >
                                + New request
                            </Link>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                    {canReview && (
                                        <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                            Employee
                                        </th>
                                    )}
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
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Status
                                    </th>
                                    {canReview && (
                                        <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {reimbursements.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columnCount}
                                            className="px-4 py-16 text-center"
                                        >
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                No reimbursements yet
                                            </p>
                                            {canCreate && (
                                                <Link
                                                    href={route(
                                                        'reimburse.create',
                                                    )}
                                                    className="mt-2 inline-block text-sm font-semibold text-teal-600 hover:text-teal-500"
                                                >
                                                    Submit your first request
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    reimbursements.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            {canReview && (
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {item.employee_name}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {item.employee_email}
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.expense_type}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.description}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.purchased_date}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                PHP {item.amount}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge
                                                    status={item.status}
                                                />
                                                {item.status === 'rejected' &&
                                                    item.review_notes && (
                                                        <p className="mt-1 max-w-[180px] text-xs text-rose-600 dark:text-rose-300">
                                                            {item.review_notes}
                                                        </p>
                                                    )}
                                            </td>
                                            {canReview && (
                                                <td className="px-4 py-3">
                                                    {item.status ===
                                                    'pending' ? (
                                                        <div className="flex min-w-[220px] flex-col gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Decline note (required)"
                                                                value={
                                                                    notes[
                                                                        item.id
                                                                    ] || ''
                                                                }
                                                                onChange={(e) =>
                                                                    setNotes(
                                                                        (current) => ({
                                                                            ...current,
                                                                            [item.id]:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }),
                                                                    )
                                                                }
                                                                className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                                            />
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        review(
                                                                            item.id,
                                                                            'approved',
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        review(
                                                                            item.id,
                                                                            'rejected',
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                                                                >
                                                                    Decline
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                            )}
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
