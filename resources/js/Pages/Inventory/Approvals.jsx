import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Approvals({ requests = [] }) {
    const { flash } = usePage().props;
    const [notes, setNotes] = useState({});

    const review = (id, status) => {
        router.post(
            route('inventory.request.status', id),
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
                    Item for Approval
                </h1>
            }
        >
            <Head title="Item for Approval" />

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

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Pending item requests
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Review and approve or decline employee item requests.
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
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-16 text-center text-slate-500"
                                        >
                                            No pending item requests.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((item) => (
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
                                                <div className="flex min-w-[220px] flex-col gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Review notes (optional)"
                                                        value={
                                                            notes[item.id] || ''
                                                        }
                                                        onChange={(e) =>
                                                            setNotes(
                                                                (current) => ({
                                                                    ...current,
                                                                    [item.id]:
                                                                        e.target
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
