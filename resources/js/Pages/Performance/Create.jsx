import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import SearchableSelect from '@/Components/SearchableSelect';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const RATING_OPTIONS = [
    { value: 1, label: 'Poor' },
    { value: 2, label: 'Fair' },
    { value: 3, label: 'OK' },
    { value: 4, label: 'Good' },
    { value: 5, label: 'Excellent' },
];

const fieldClass =
    'block w-full rounded-xl border border-slate-200 bg-[#f4f7fb] px-3.5 py-2.5 text-sm text-slate-800 shadow-none placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white';

function FieldLabel({ children, required = false }) {
    return (
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {children}
            {required && <span className="text-rose-500"> *</span>}
        </span>
    );
}

function CompetencyCard({
    competency,
    rating,
    explanation,
    onRatingChange,
    onExplanationChange,
    ratingError,
    explanationError,
}) {
    const [rubricOpen, setRubricOpen] = useState(false);
    const rubricEntries = Object.entries(competency.rubric || {}).sort(
        ([a], [b]) => Number(a) - Number(b),
    );

    return (
        <section className="rounded-2xl border border-slate-200 border-t-4 border-t-orange-500 bg-white p-5 shadow-sm dark:border-slate-700 dark:border-t-orange-500 dark:bg-slate-900 sm:p-6">
            <div className="mb-5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {competency.title}
                    <span className="text-rose-500"> *</span>
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {competency.question}
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Select one rating
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {RATING_OPTIONS.map((option) => {
                        const selected = Number(rating) === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onRatingChange(option.value)}
                                className={
                                    'flex flex-col items-center justify-center rounded-xl border bg-white px-2 py-3 transition dark:bg-slate-900 ' +
                                    (selected
                                        ? 'border-sky-500 ring-2 ring-sky-200 dark:border-sky-400 dark:ring-sky-900'
                                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500')
                                }
                            >
                                <span className="text-lg font-bold text-slate-800 dark:text-white">
                                    {option.value}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {option.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-slate-400">
                    <span>Needs improvement</span>
                    <span>Excellent</span>
                </div>
            </div>
            <InputError message={ratingError} className="mt-2" />

            <button
                type="button"
                onClick={() => setRubricOpen((open) => !open)}
                className="mt-4 flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 transition hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950/60"
            >
                <span className="inline-flex items-center gap-2">
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    View rating rubric
                </span>
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
                <div className="mt-2 space-y-2 rounded-xl border border-amber-100 bg-white p-4 text-sm dark:border-amber-900/40 dark:bg-slate-900">
                    {rubricEntries.map(([score, text]) => (
                        <div key={score} className="flex gap-3">
                            <span className="w-16 shrink-0 font-semibold text-amber-800 dark:text-amber-300">
                                {score} —{' '}
                                {RATING_OPTIONS.find((o) => o.value === Number(score))
                                    ?.label || ''}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300">
                                {text}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-5">
                <FieldLabel required>Brief explanation for this rating</FieldLabel>
                <textarea
                    rows={3}
                    value={explanation}
                    onChange={(e) => onExplanationChange(e.target.value)}
                    placeholder="Share specific examples or observations..."
                    className={fieldClass + ' min-h-[88px] resize-y'}
                />
                <InputError message={explanationError} className="mt-1" />
            </div>
        </section>
    );
}

export default function Create({
    employees = [],
    competencies = [],
    supervisorName = '',
    defaultReviewDate = '',
}) {
    const initialRatings = useMemo(() => {
        const map = {};
        competencies.forEach((item) => {
            map[item.key] = { rating: '', explanation: '' };
        });
        return map;
    }, [competencies]);

    const { data, setData, post, processing, errors, transform } = useForm({
        review_date: defaultReviewDate || '',
        supervisor_name: supervisorName || '',
        employee_id: '',
        ratings: initialRatings,
    });

    const employeeOptions = employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        employee_number: employee.employee_number,
        department: employee.department,
        position: employee.position,
    }));

    const selectedEmployee = employees.find(
        (employee) => String(employee.id) === String(data.employee_id),
    );

    const setRatingField = (key, field, value) => {
        setData('ratings', {
            ...data.ratings,
            [key]: {
                ...data.ratings[key],
                [field]: value,
            },
        });
    };

    const submit = (e) => {
        e.preventDefault();

        transform((form) => ({
            ...form,
            ratings: competencies.map((item) => ({
                competency_key: item.key,
                rating: form.ratings[item.key]?.rating
                    ? Number(form.ratings[item.key].rating)
                    : null,
                explanation: form.ratings[item.key]?.explanation || '',
            })),
        }));

        post(route('performance.store'));
    };

    const ratingErrorFor = (key, index) =>
        errors[`ratings.${index}.rating`] ||
        errors[`ratings.${key}.rating`] ||
        null;

    const explanationErrorFor = (key, index) =>
        errors[`ratings.${index}.explanation`] ||
        errors[`ratings.${key}.explanation`] ||
        null;

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Conduct performance review
                </h1>
            }
        >
            <Head title="Conduct performance review" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Rate competencies for an employee under your supervision.
                </p>
                <Link
                    href={route('performance.index')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Back to list
                </Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {(errors.ratings || Object.keys(errors).length > 0) && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                        {errors.ratings ||
                            'Please complete all required fields before submitting.'}
                    </div>
                )}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
                    <div className="mb-5 flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Review details
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Who is being evaluated and when the review applies.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                            <FieldLabel required>Review date</FieldLabel>
                            <input
                                type="date"
                                value={data.review_date}
                                onChange={(e) =>
                                    setData('review_date', e.target.value)
                                }
                                className={fieldClass}
                            />
                            <InputError
                                message={errors.review_date}
                                className="mt-1"
                            />
                        </label>

                        <label className="block">
                            <FieldLabel required>Supervisor name</FieldLabel>
                            <input
                                type="text"
                                value={data.supervisor_name}
                                onChange={(e) =>
                                    setData('supervisor_name', e.target.value)
                                }
                                className={fieldClass}
                            />
                            <InputError
                                message={errors.supervisor_name}
                                className="mt-1"
                            />
                        </label>

                        <div className="sm:col-span-2">
                            <FieldLabel required>Name of staff</FieldLabel>
                            <SearchableSelect
                                value={selectedEmployee?.name ?? ''}
                                onChange={(value) => {
                                    const employee = employees.find(
                                        (item) => item.name === value,
                                    );
                                    setData(
                                        'employee_id',
                                        employee ? String(employee.id) : '',
                                    );
                                }}
                                options={employeeOptions}
                                placeholder="— Select employee —"
                                emptyMessage="No employees found"
                            />
                            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                Choose an active employee. The review stores their{' '}
                                <span className="font-semibold">full name</span>{' '}
                                from HR so it matches &quot;My performance
                                review.&quot;
                            </p>
                            <InputError
                                message={errors.employee_id}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <FieldLabel>Department</FieldLabel>
                            <div className={fieldClass + ' text-slate-500'}>
                                {selectedEmployee?.department || '—'}
                            </div>
                        </div>
                        <div>
                            <FieldLabel>Position</FieldLabel>
                            <div className={fieldClass + ' text-slate-500'}>
                                {selectedEmployee?.position || '—'}
                            </div>
                        </div>
                        <div className="sm:col-span-2 sm:max-w-xs">
                            <FieldLabel>Employee ID</FieldLabel>
                            <div className={fieldClass + ' text-slate-500'}>
                                {selectedEmployee?.employee_number || '—'}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="space-y-4">
                    <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Competencies
                    </p>

                    {competencies.map((competency, index) => (
                        <CompetencyCard
                            key={competency.key}
                            competency={competency}
                            rating={data.ratings[competency.key]?.rating}
                            explanation={
                                data.ratings[competency.key]?.explanation || ''
                            }
                            onRatingChange={(value) =>
                                setRatingField(competency.key, 'rating', value)
                            }
                            onExplanationChange={(value) =>
                                setRatingField(
                                    competency.key,
                                    'explanation',
                                    value,
                                )
                            }
                            ratingError={ratingErrorFor(competency.key, index)}
                            explanationError={explanationErrorFor(
                                competency.key,
                                index,
                            )}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                            Ready to submit?
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Double-check ratings and explanations before sending.
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        {processing ? 'Submitting…' : 'Submit review'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
