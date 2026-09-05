import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DisciplineProgress from '@/Components/DisciplineProgress';
import { Head, Link, router, usePage } from '@inertiajs/react';

function Detail({ label, value, className = '' }) {
    return (
        <div className={className}>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
                {value || '—'}
            </dd>
        </div>
    );
}

function LevelBadge({ level }) {
    const key = String(level || '').toLowerCase();

    const styles = {
        'verbal warning':
            'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        'written warning':
            'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
        'final warning':
            'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
        suspension:
            'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
        termination:
            'bg-slate-800 text-white dark:bg-slate-700 dark:text-slate-100',
    };

    return (
        <span
            className={
                'inline-flex rounded-md px-2 py-1 text-xs font-medium ' +
                (styles[key] ||
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300')
            }
        >
            {level}
        </span>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        Resolved:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        Escalated: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    };

    return (
        <span
            className={
                'inline-flex rounded-md px-2 py-1 text-xs font-medium ' +
                (styles[status] || styles.Active)
            }
        >
            {status || 'Active'}
        </span>
    );
}

const STATUS_OPTIONS = ['Active', 'Resolved', 'Escalated'];

export default function Show({
    record,
    progress = null,
    canUpdateStatus = false,
    canReset = false,
}) {
    const { flash } = usePage().props;

    const updateStatus = (status) => {
        router.post(
            route('discipline.status', record.id),
            { status },
            { preserveScroll: true },
        );
    };

    const resetProgress = () => {
        if (
            !window.confirm(
                `Reset discipline progress for ${record.employee_name}? This marks current cycle records as resolved and starts progress at Level 0.`,
            )
        ) {
            return;
        }

        router.post(route('discipline.reset', record.employee_id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Discipline record details
                </h1>
            }
        >
            <Head title={`Discipline - ${record.employee_name}`} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={route('discipline.index')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                    Back to list
                </Link>

                {canUpdateStatus && (
                    <select
                        value={record.status || 'Active'}
                        onChange={(e) => updateStatus(e.target.value)}
                        className="min-w-[8.5rem] rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {flash?.success && (
                <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {flash.success}
                </div>
            )}

            <div className="mb-4">
                <DisciplineProgress
                    progress={progress}
                    showReset={canReset && !!record.employee_id}
                    onReset={resetProgress}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#121a2b] sm:p-6">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {record.employee_name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {[record.employee_number, record.department, record.position]
                                .filter(Boolean)
                                .join(' · ') || '—'}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <LevelBadge level={record.discipline_level} />
                        <StatusBadge status={record.status} />
                    </div>
                </div>

                <dl className="grid gap-4 sm:grid-cols-2">
                    <Detail label="Incident date" value={record.incident_date} />
                    <Detail label="Next review" value={record.next_review_date} />
                    <Detail label="Offense type" value={record.offense_type} />
                    <Detail label="Recorded by" value={record.recorded_by} />
                    <Detail
                        label="Incident description"
                        value={record.incident_description}
                        className="sm:col-span-2"
                    />
                    <Detail
                        label="Action taken"
                        value={record.action_taken}
                        className="sm:col-span-2"
                    />
                    <Detail label="Created" value={record.created_at} />
                </dl>
            </div>
        </AuthenticatedLayout>
    );
}
