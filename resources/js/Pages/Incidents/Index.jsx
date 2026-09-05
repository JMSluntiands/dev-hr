import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
        submitted: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
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

export default function Index({
    incidents,
    canManage,
    canCreate,
    canApprove,
    currentUserId,
}) {
    const columnCount = canManage ? 8 : 7;

    const canDelete = (item) => {
        if (canManage) {
            return true;
        }

        return (
            item.reported_by_user_id === currentUserId &&
            item.status === 'pending'
        );
    };

    const handleDelete = (item) => {
        if (
            !window.confirm(
                `Delete incident report for ${item.employee_name}? This action cannot be undone.`,
            )
        ) {
            return;
        }

        router.delete(route('incident.destroy', item.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Incident Report
                </h1>
            }
        >
            <Head title="Incident Report" />

            <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {canManage
                                ? 'Approved incident reports only. Pending items are under Incident for Approval.'
                                : 'Incident reports you submitted or that involve you.'}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                            {canApprove && (
                                <Link
                                    href={route('incident.approvals')}
                                    className="inline-flex shrink-0 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                >
                                    For approval
                                </Link>
                            )}
                            {canCreate && (
                                <Link
                                    href={route('incident.create')}
                                    className="inline-flex shrink-0 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                                >
                                    + New report
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Employee
                                    </th>
                                    {canManage && (
                                        <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                            Submitted By
                                        </th>
                                    )}
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Date / Time
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Injury
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
                                {incidents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columnCount}
                                            className="px-4 py-16 text-center"
                                        >
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                {canManage
                                                    ? 'No approved incident reports yet'
                                                    : 'No incident reports yet'}
                                            </p>
                                            {canCreate && (
                                                <Link
                                                    href={route('incident.create')}
                                                    className="mt-2 inline-block text-sm font-semibold text-teal-600"
                                                >
                                                    Submit your first report
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    incidents.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                {item.employee_name}
                                            </td>
                                            {canManage && (
                                                <td className="px-4 py-3">
                                                    <div className="text-slate-800 dark:text-slate-200">
                                                        {item.submitted_by}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {item.submitted_by_email}
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.incident_type}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.location_area}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.incident_date}{' '}
                                                {item.incident_time}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={
                                                        'inline-flex rounded-md px-2 py-1 text-xs font-medium ' +
                                                        (item.has_injury
                                                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                                                    }
                                                >
                                                    {item.has_injury ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Link
                                                        href={route(
                                                            'incident.show',
                                                            item.id,
                                                        )}
                                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                                    >
                                                        View details
                                                    </Link>
                                                    {canDelete(item) && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(item)
                                                            }
                                                            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
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
