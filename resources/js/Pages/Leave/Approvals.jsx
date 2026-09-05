import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Fragment, useState } from 'react';

function ActivityLog({ activities = [] }) {
    if (activities.length === 0) {
        return (
            <p className="text-xs text-slate-500">No activity yet.</p>
        );
    }

    return (
        <ol className="space-y-2 border-l border-slate-200 pl-4 dark:border-slate-700">
            {activities.map((activity) => (
                <li key={activity.id}>
                    <div className="text-sm font-medium capitalize text-slate-800 dark:text-white">
                        {activity.action}
                    </div>
                    <div className="text-xs text-slate-500">
                        {activity.user_name} · {activity.created_at}
                    </div>
                    {activity.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            {activity.notes}
                        </p>
                    )}
                </li>
            ))}
        </ol>
    );
}

export default function Approvals({ leaves }) {
    const { flash } = usePage().props;
    const [openLogId, setOpenLogId] = useState(null);
    const [notes, setNotes] = useState({});

    const review = (id, status) => {
        router.post(
            route('leave.status', id),
            {
                status,
                review_notes: notes[id] || '',
            },
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Leave for Approval
                </h1>
            }
        >
            <Head title="Leave for Approval" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {flash.error}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Pending leave requests
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Review and approve or reject employee leave
                            requests.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Employee
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Leave Type
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Dates
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Days
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Reason
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {leaves.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-16 text-center text-slate-500"
                                        >
                                            No pending leave requests.
                                        </td>
                                    </tr>
                                ) : (
                                    leaves.map((leave) => (
                                        <Fragment key={leave.id}>
                                            <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {leave.employee_name}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {leave.employee_email}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                    {leave.leave_type}
                                                </td>
                                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                    {leave.start_date} →{' '}
                                                    {leave.end_date}
                                                </td>
                                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                    {leave.days}
                                                </td>
                                                <td className="max-w-xs truncate px-4 py-3 text-slate-700 dark:text-slate-300">
                                                    {leave.reason}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex min-w-[220px] flex-col gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Review notes (optional)"
                                                            value={
                                                                notes[leave.id] ||
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                setNotes(
                                                                    (current) => ({
                                                                        ...current,
                                                                        [leave.id]:
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
                                                                        leave.id,
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
                                                                        leave.id,
                                                                        'rejected',
                                                                    )
                                                                }
                                                                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                                                            >
                                                                Reject
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setOpenLogId(
                                                                        openLogId ===
                                                                            leave.id
                                                                            ? null
                                                                            : leave.id,
                                                                    )
                                                                }
                                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                                                            >
                                                                Log
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {openLogId === leave.id && (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="bg-slate-50 px-4 py-4 dark:bg-slate-800/40"
                                                    >
                                                        <ActivityLog
                                                            activities={
                                                                leave.activities
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
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
