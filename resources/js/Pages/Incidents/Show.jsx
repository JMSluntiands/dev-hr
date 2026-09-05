import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

function Detail({ label, value, className = '' }) {
    return (
        <div className={className}>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </dt>
            <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {value || '—'}
            </dd>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        rejected: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
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

export default function Show({ incident, canDelete, canApprove }) {
    const [reviewNotes, setReviewNotes] = useState('');

    const handleDelete = () => {
        if (
            !window.confirm(
                'Delete this incident report? This action cannot be undone.',
            )
        ) {
            return;
        }

        router.delete(route('incident.destroy', incident.id));
    };

    const review = (status) => {
        router.post(route('incident.status', incident.id), {
            status,
            review_notes: reviewNotes,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Incident Report Details
                </h1>
            }
        >
            <Head title={`Incident - ${incident.employee_name}`} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={
                        incident.status === 'pending' && canApprove
                            ? route('incident.approvals')
                            : route('incident.index')
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Back
                </Link>

                {canDelete && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60"
                    >
                        Delete
                    </button>
                )}
            </div>

            <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {incident.employee_name}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {incident.incident_type} · {incident.location_area}
                            </p>
                        </div>
                        <StatusBadge status={incident.status} />
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2">
                        <Detail label="Company" value={incident.company} />
                        <Detail label="Submitted By" value={incident.submitted_by} />
                        <Detail
                            label="Incident Date / Time"
                            value={`${incident.incident_date} ${incident.incident_time}`}
                        />
                        <Detail
                            label="Report Date / Time"
                            value={`${incident.report_date} ${incident.report_time}`}
                        />
                        <Detail label="Witness" value={incident.witness} />
                        <Detail
                            label="Injury"
                            value={incident.has_injury ? 'Yes' : 'No'}
                        />
                        {incident.reviewed_by_name && (
                            <>
                                <Detail
                                    label="Reviewed By"
                                    value={incident.reviewed_by_name}
                                />
                                <Detail
                                    label="Reviewed At"
                                    value={incident.reviewed_at}
                                />
                            </>
                        )}
                    </dl>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
                    <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                        Details of Incident
                    </h3>
                    <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                        {incident.details}
                    </p>
                </section>

                {incident.has_injury && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
                        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                            Injury Information
                        </h3>
                        {incident.injury_types?.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {incident.injury_types.map((type) => (
                                    <span
                                        key={type}
                                        className="inline-flex rounded-md bg-rose-100 px-2 py-1 text-xs font-medium text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                            {incident.injury_details || '—'}
                        </p>
                    </section>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
                    <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                        Action Taken
                    </h3>
                    <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                        {incident.action_taken || '—'}
                    </p>
                </section>

                {incident.review_notes && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
                        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                            Review Notes
                        </h3>
                        <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                            {incident.review_notes}
                        </p>
                    </section>
                )}

                {incident.attachments?.length > 0 && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
                        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                            Attachments
                        </h3>
                        <ul className="space-y-2">
                            {incident.attachments.map((attachment) => (
                                <li key={attachment.id}>
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400"
                                    >
                                        {attachment.original_name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {canApprove && (
                    <section className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5 shadow-sm dark:border-teal-900 dark:bg-teal-950/20 sm:p-6">
                        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                            Review this report
                        </h3>
                        <input
                            type="text"
                            placeholder="Review notes (optional)"
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            className="mb-3 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => review('approved')}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                            >
                                Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => review('rejected')}
                                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
                            >
                                Reject
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
