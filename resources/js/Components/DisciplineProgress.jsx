function StatusBadge({ status }) {
    const styles = {
        Active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        Resolved:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        Escalated: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    };

    if (!status) {
        return (
            <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
        );
    }

    return (
        <span
            className={
                'inline-flex w-fit rounded-md px-2.5 py-1 text-xs font-semibold ' +
                (styles[status] || styles.Active)
            }
        >
            {status}
        </span>
    );
}

export default function DisciplineProgress({
    progress,
    title = 'Discipline Level Progress',
    showReset = false,
    onReset = null,
}) {
    if (!progress) {
        return null;
    }

    const current = Number(progress.current_level) || 0;
    const total = Number(progress.total_levels) || 5;
    const steps = progress.steps || [];
    const percent = total > 0 ? Math.min(100, (current / total) * 100) : 0;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                    {title}
                </h2>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Current: Level {current}/{total}
                    </span>
                    {showReset && onReset && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60"
                        >
                            Reset progress
                        </button>
                    )}
                </div>
            </div>

            <div className="relative pt-1">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                        className="h-full rounded-full bg-orange-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <div className="mt-3 grid grid-cols-5 gap-1 text-center text-xs font-medium text-slate-600 dark:text-slate-300">
                    {steps.map((step, index) => {
                        const level = index + 1;
                        const reached = current >= level;

                        return (
                            <span
                                key={step.key || step.label}
                                className={
                                    reached
                                        ? 'text-orange-600 dark:text-orange-400'
                                        : 'text-slate-400 dark:text-slate-500'
                                }
                            >
                                {step.label}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                    Latest status:
                </span>
                <StatusBadge status={progress.latest_status} />
            </div>
        </div>
    );
}
