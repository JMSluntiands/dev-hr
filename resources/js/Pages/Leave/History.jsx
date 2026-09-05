import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Fragment, useState } from 'react';

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
        cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    };

    return (
        <span
            className={
                'inline-flex rounded-md px-2 py-1 text-xs font-medium capitalize ' +
                (styles[status] || styles.pending)
            }
        >
            {status}
        </span>
    );
}

function ActivityLog({ activities = [] }) {
    if (activities.length === 0) {
        return <p className="text-xs text-slate-500">No activity yet.</p>;
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

export default function History({ leaves, canApprove }) {
    const { flash } = usePage().props;
    const [openLogId, setOpenLogId] = useState(null);

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Leave History
                </h1>
            }
        >
            <Head title="Leave History" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Completed leave requests
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Approved, rejected, and cancelled leave records.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                    {canApprove && (
                                        <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                            Employee
                                        </th>
                                    )}
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
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Activity
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {leaves.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={canApprove ? 6 : 5}
                                            className="px-4 py-16 text-center text-slate-500"
                                        >
                                            No leave history yet.
                                        </td>
                                    </tr>
                                ) : (
                                    leaves.map((leave) => (
                                        <Fragment key={leave.id}>
                                            <tr>
                                                {canApprove && (
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-slate-900 dark:text-white">
                                                            {
                                                                leave.employee_name
                                                            }
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {
                                                                leave.employee_email
                                                            }
                                                        </div>
                                                    </td>
                                                )}
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
                                                <td className="px-4 py-3">
                                                    <StatusBadge
                                                        status={leave.status}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
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
                                                        {openLogId === leave.id
                                                            ? 'Hide'
                                                            : 'View log'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {openLogId === leave.id && (
                                                <tr>
                                                    <td
                                                        colSpan={
                                                            canApprove ? 6 : 5
                                                        }
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
