import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Approvals({ incidents }) {
    const [notes, setNotes] = useState({});

    const review = (id, status) => {
        router.post(
            route('incident.status', id),
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
                    Incident for Approval
                </h1>
            }
        >
            <Head title="Incident for Approval" />

            <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Pending incident reports
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Approve to add the report to the main Incident list, or
                            reject it.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[960px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Employee
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Submitted By
                                    </th>
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
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {incidents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-16 text-center text-slate-500"
                                        >
                                            No pending incident reports.
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
                                            <td className="px-4 py-3">
                                                <div className="text-slate-800 dark:text-slate-200">
                                                    {item.submitted_by}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {item.submitted_by_email}
                                                </div>
                                            </td>
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
                                                <div className="flex min-w-[240px] flex-col gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Review notes (optional)"
                                                        value={notes[item.id] || ''}
                                                        onChange={(e) =>
                                                            setNotes((current) => ({
                                                                ...current,
                                                                [item.id]: e.target.value,
                                                            }))
                                                        }
                                                        className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link
                                                            href={route(
                                                                'incident.show',
                                                                item.id,
                                                            )}
                                                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                                        >
                                                            View details
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                review(item.id, 'approved')
                                                            }
                                                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                review(item.id, 'rejected')
                                                            }
                                                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                                                        >
                                                            Reject
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
