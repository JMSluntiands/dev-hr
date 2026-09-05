import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const RATING_LABELS = {
    1: 'Poor',
    2: 'Fair',
    3: 'OK',
    4: 'Good',
    5: 'Excellent',
};

function Detail({ label, value }) {
    return (
        <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </dt>
            <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                {value || '—'}
            </dd>
        </div>
    );
}

function RatingCard({ item }) {
    const [rubricOpen, setRubricOpen] = useState(false);
    const rubricEntries = Object.entries(item.rubric || {}).sort(
        ([a], [b]) => Number(a) - Number(b),
    );

    return (
        <section className="rounded-2xl border border-slate-200 border-t-4 border-t-orange-500 bg-white p-5 shadow-sm dark:border-slate-700 dark:border-t-orange-500 dark:bg-slate-900 sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        {item.title}
                    </h3>
                    {item.question && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.question}
                        </p>
                    )}
                </div>
                <span className="inline-flex items-center rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
                    {item.rating} — {item.rating_label || RATING_LABELS[item.rating]}
                </span>
            </div>

            {rubricEntries.length > 0 && (
                <>
                    <button
                        type="button"
                        onClick={() => setRubricOpen((open) => !open)}
                        className="mb-4 flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
                    >
                        <span>View rating rubric</span>
                        <svg
                            className={
                                'h-4 w-4 transition ' + (rubricOpen ? 'rotate-180' : '')
                            }
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {rubricOpen && (
                        <div className="mb-4 space-y-2 rounded-xl border border-amber-100 bg-white p-4 text-sm dark:border-amber-900/40 dark:bg-slate-950">
                            {rubricEntries.map(([score, text]) => (
                                <div key={score} className="flex gap-3">
                                    <span className="w-20 shrink-0 font-semibold text-amber-800 dark:text-amber-300">
                                        {score} — {RATING_LABELS[score]}
                                    </span>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Brief explanation
                </p>
                <p className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                    {item.explanation || '—'}
                </p>
            </div>
        </section>
    );
}

export default function Show({ review }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Performance review details
                </h1>
            }
        >
            <Head title={`Review - ${review.employee_name}`} />

            <div className="mb-6">
                <Link
                    href={route('performance.index')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Back to list
                </Link>
            </div>

            {flash?.success && (
                <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {flash.success}
                </div>
            )}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {review.employee_name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {[review.employee_number, review.department, review.position]
                                .filter(Boolean)
                                .join(' · ') || '—'}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-md bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                            Overall {review.overall_score ?? '—'}
                        </span>
                        <span className="inline-flex rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                            {review.status}
                        </span>
                    </div>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Detail label="Review date" value={review.review_date} />
                    <Detail label="Supervisor" value={review.supervisor_name} />
                    <Detail label="Submitted by" value={review.reviewed_by} />
                    <Detail label="Submitted" value={review.created_at} />
                </dl>
            </div>

            <div className="space-y-4">
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Competencies
                </p>
                {review.ratings.map((item) => (
                    <RatingCard key={item.key} item={item} />
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
