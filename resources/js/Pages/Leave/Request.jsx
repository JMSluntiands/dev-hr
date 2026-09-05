import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
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
        return (
            <p className="text-xs text-slate-500 dark:text-slate-400">
                No activity yet.
            </p>
        );
    }

    return (
        <ol className="space-y-3 border-l border-slate-200 pl-4 dark:border-slate-700">
            {activities.map((activity) => (
                <li key={activity.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-teal-500" />
                    <div className="text-sm font-medium capitalize text-slate-800 dark:text-white">
                        {activity.action}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.user_name} · {activity.created_at}
                    </div>
                    {activity.notes && (
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                            {activity.notes}
                        </p>
                    )}
                </li>
            ))}
        </ol>
    );
}

export default function Request({ myRequests = [] }) {
    const [openLogId, setOpenLogId] = useState(null);

    const cancelRequest = (id) => {
        if (!window.confirm('Cancel this leave request?')) {
            return;
        }

        router.post(route('leave.cancel', id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Leave Request
                </h1>
            }
        >
            <Head title="Leave Request" />

            <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Your leave requests. Open activity log to see status
                            updates.
                        </p>
                        <Link
                            href={route('leave.create')}
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 sm:ml-auto"
                        >
                            + Request leave
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
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
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {myRequests.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-16 text-center"
                                        >
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                No leave requests yet
                                            </p>
                                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                                Click Request leave to submit one.
                                            </p>
                                            <Link
                                                href={route('leave.create')}
                                                className="mt-4 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                                            >
                                                + Request leave
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    myRequests.map((leave) => (
                                        <Fragment key={leave.id}>
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
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
                                                    <StatusBadge
                                                        status={leave.status}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap items-center gap-2">
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
                                                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                                        >
                                                            {openLogId === leave.id
                                                                ? 'Hide log'
                                                                : 'Activity log'}
                                                        </button>
                                                        {leave.status ===
                                                            'pending' && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    cancelRequest(
                                                                        leave.id,
                                                                    )
                                                                }
                                                                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {openLogId === leave.id && (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="bg-slate-50 px-4 py-4 dark:bg-slate-800/40"
                                                    >
                                                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                            Activity log
                                                        </h3>
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
