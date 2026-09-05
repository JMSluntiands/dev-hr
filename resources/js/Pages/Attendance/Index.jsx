import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const MARKER_STYLES = {
    birthday: 'bg-pink-500',
    leave: 'bg-teal-500',
    sl: 'bg-amber-500',
};

function cellClass(cell, isWeekend) {
    if (!cell) {
        return isWeekend
            ? 'bg-amber-50/70 dark:bg-amber-950/20'
            : 'bg-white dark:bg-slate-900';
    }

    if (cell.status === 'no_clock_in') {
        return 'bg-rose-100 dark:bg-rose-950/50';
    }

    if (cell.status === 'clocked_in') {
        return 'bg-emerald-50 dark:bg-emerald-950/30';
    }

    return isWeekend
        ? 'bg-amber-50/70 dark:bg-amber-950/20'
        : 'bg-white dark:bg-slate-900';
}

export default function Index({
    month,
    year,
    monthLabel,
    employees = [],
    dates = [],
    cells = {},
    myAttendance = null,
}) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    const [clockBusy, setClockBusy] = useState(false);
    const isAdmin = String(user?.role || '').toLowerCase() === 'admin';
    const showPersonalClock = !isAdmin;
    const canClockIn = Boolean(myAttendance?.can_clock_in);

    const goMonth = (delta) => {
        let nextMonth = month + delta;
        let nextYear = year;
        if (nextMonth < 1) {
            nextMonth = 12;
            nextYear -= 1;
        }
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear += 1;
        }

        router.get(
            route('attendance.index'),
            { month: nextMonth, year: nextYear },
            { preserveState: true, preserveScroll: true },
        );
    };

    const submitClockIn = () => {
        if (clockBusy) {
            return;
        }

        setClockBusy(true);
        router.post(route('attendance.clock-in'), {}, {
            preserveScroll: true,
            onFinish: () => setClockBusy(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Attendance
                </h1>
            }
        >
            <Head title="Attendance" />

            {(flash?.success || flash?.error) && (
                <div
                    className={
                        'mb-4 rounded-lg px-4 py-3 text-sm ' +
                        (flash.error
                            ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                            : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300')
                    }
                >
                    {flash.error || flash.success}
                </div>
            )}

            {showPersonalClock && (
                <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#121a2b]">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            My attendance today
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                            {myAttendance?.clocked_in
                                ? `In: ${myAttendance.clocked_in_at || '—'}`
                                : 'Not clocked in'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {canClockIn && (
                            <button
                                type="button"
                                disabled={clockBusy}
                                onClick={submitClockIn}
                                className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
                            >
                                {clockBusy ? 'Saving…' : 'Clock In'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Y = employee · X = date
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded bg-rose-100 ring-1 ring-rose-300" />
                            No clock in
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded bg-emerald-50 ring-1 ring-emerald-300" />
                            Clocked in
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                            Birthday
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                            Leave
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            SL
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => goMonth(-1)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                        ‹
                    </button>
                    <div className="min-w-[9.5rem] rounded-lg bg-amber-100 px-3 py-1.5 text-center text-sm font-semibold text-slate-800 dark:bg-amber-950/40 dark:text-amber-100">
                        {monthLabel}
                    </div>
                    <button
                        type="button"
                        onClick={() => goMonth(1)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#121a2b]">
                {employees.length === 0 ? (
                    <p className="px-6 py-16 text-center text-sm text-slate-500">
                        No employees yet. Add employees to see the attendance
                        calendar.
                    </p>
                ) : (
                    <div className="max-h-[70vh] overflow-auto">
                        <table className="min-w-full border-separate border-spacing-0 text-sm">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 top-0 z-30 border-b border-r border-slate-200 bg-amber-200 px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:border-slate-700 dark:bg-amber-900/60 dark:text-amber-100">
                                        Employee
                                    </th>
                                    {dates.map((dateRow) => (
                                        <th
                                            key={dateRow.date}
                                            className={
                                                'sticky top-0 z-20 min-w-[3.25rem] border-b border-l border-slate-200 px-1.5 py-2 text-center dark:border-slate-700 ' +
                                                (dateRow.is_today
                                                    ? 'bg-teal-200 dark:bg-teal-900/50'
                                                    : dateRow.is_weekend
                                                      ? 'bg-amber-100 dark:bg-amber-950/40'
                                                      : 'bg-amber-50 dark:bg-amber-950/20')
                                            }
                                        >
                                            <div className="text-[10px] font-bold uppercase text-slate-500">
                                                {dateRow.weekday}
                                            </div>
                                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                                {dateRow.day}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <th className="sticky left-0 z-10 border-b border-r border-slate-200 bg-slate-50 px-3 py-2 text-left dark:border-slate-700 dark:bg-slate-900">
                                            <div className="flex items-center gap-2">
                                                {employee.photo_url ? (
                                                    <img
                                                        src={employee.photo_url}
                                                        alt={employee.name}
                                                        title={employee.name}
                                                        className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                                                    />
                                                ) : (
                                                    <span
                                                        title={employee.name}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white"
                                                    >
                                                        {employee.initials}
                                                    </span>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-100">
                                                        {employee.initials}
                                                    </div>
                                                    <div
                                                        className="max-w-[7rem] truncate text-[10px] text-slate-500"
                                                        title={employee.name}
                                                    >
                                                        {employee.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                        {dates.map((dateRow) => {
                                            const cell =
                                                cells?.[dateRow.date]?.[
                                                    employee.id
                                                ] || null;
                                            const title = [
                                                employee.name,
                                                dateRow.date,
                                                cell?.status === 'clocked_in'
                                                    ? `In ${cell.clocked_in_at || ''}`
                                                    : cell?.status ===
                                                        'no_clock_in'
                                                      ? 'No clock in'
                                                      : null,
                                                ...(cell?.markers || []),
                                            ]
                                                .filter(Boolean)
                                                .join(' · ');

                                            return (
                                                <td
                                                    key={`${employee.id}-${dateRow.date}`}
                                                    title={title}
                                                    className={
                                                        'border-b border-l border-slate-200 p-1 text-center dark:border-slate-700 ' +
                                                        cellClass(
                                                            cell,
                                                            dateRow.is_weekend,
                                                        )
                                                    }
                                                >
                                                    <div className="flex min-h-[2.25rem] flex-col items-center justify-center gap-1">
                                                        {cell?.status ===
                                                            'clocked_in' && (
                                                            <span className="text-[9px] font-semibold leading-tight text-emerald-700 dark:text-emerald-300">
                                                                {cell.clocked_in_at ||
                                                                    'IN'}
                                                            </span>
                                                        )}
                                                        {cell?.status ===
                                                            'no_clock_in' && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                                                                —
                                                            </span>
                                                        )}
                                                        {(cell?.markers || [])
                                                            .length > 0 && (
                                                            <div className="flex flex-wrap justify-center gap-0.5">
                                                                {cell.markers.map(
                                                                    (marker) => (
                                                                        <span
                                                                            key={
                                                                                marker
                                                                            }
                                                                            className={`h-1.5 w-1.5 rounded-full ${MARKER_STYLES[marker] || 'bg-slate-400'}`}
                                                                        />
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
