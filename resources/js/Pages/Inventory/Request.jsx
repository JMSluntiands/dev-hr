import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import useCan from '@/hooks/useCan';
import { Head, Link, usePage } from '@inertiajs/react';

function StatusBadge({ status }) {
    const styles = {
        pending:
            'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        approved:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        rejected:
            'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    };

    return (
        <span
            className={
                'inline-flex rounded-md px-2 py-1 text-xs font-medium capitalize ' +
                (styles[status] || styles.pending)
            }
        >
            {status === 'rejected' ? 'Declined' : status}
        </span>
    );
}

export default function Request({ myRequests = [], canApprove = false }) {
    const { flash } = usePage().props;
    const canCreate = useCan('inventory.request') && !canApprove;

    const columnCount = canApprove ? 6 : 5;

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Request item
                </h1>
            }
        >
            <Head title="Request item" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {canApprove
                                ? 'All inventory item requests (pending, approved, and declined).'
                                : 'Your inventory item requests.'}
                        </p>
                        {canCreate && (
                            <Link
                                href={route('inventory.request.create')}
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
                                    {canApprove && (
                                        <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                            Employee
                                        </th>
                                    )}
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Request number
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Item name
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Details
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Submitted
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {myRequests.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columnCount}
                                            className="px-4 py-16 text-center"
                                        >
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                {canApprove
                                                    ? 'No item requests yet'
                                                    : 'No item requests yet'}
                                            </p>
                                            {canCreate && (
                                                <Link
                                                    href={route(
                                                        'inventory.request.create',
                                                    )}
                                                    className="mt-2 inline-block text-sm font-semibold text-teal-600 hover:text-teal-500"
                                                >
                                                    Submit your first request
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    myRequests.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            {canApprove && (
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {item.employee_name}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {item.employee_email}
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                {item.item_code}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.item_name}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.details || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.created_at}
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
