import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

function initials(name = '') {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function StatusBadge({ status }) {
    const clockedIn = status === 'Clocked in';

    return (
        <span
            className={
                'inline-flex rounded-md px-2 py-1 text-xs font-semibold ' +
                (clockedIn
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300')
            }
        >
            {status}
        </span>
    );
}

const EVENT_STYLES = {
    birthday: {
        chip: 'bg-pink-100 text-pink-800 dark:bg-pink-950/50 dark:text-pink-300',
        dot: 'bg-pink-500',
        label: 'Birthday',
    },
    leave: {
        chip: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
        dot: 'bg-teal-500',
        label: 'Leave',
    },
    sl: {
        chip: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300',
        dot: 'bg-amber-500',
        label: 'SL',
    },
};

function EventAvatar({ event, size = 'sm' }) {
    const sizeClass = size === 'md' ? 'h-9 w-9 text-xs' : 'h-6 w-6 text-[9px]';
    const ringClass =
        event.type === 'birthday'
            ? 'ring-pink-400'
            : event.type === 'sl'
              ? 'ring-amber-400'
              : 'ring-teal-400';

    if (event.photo_url) {
        return (
            <img
                src={event.photo_url}
                alt={event.employee}
                title={event.employee}
                className={`${sizeClass} rounded-full object-cover ring-2 ${ringClass}`}
            />
        );
    }

    return (
        <span
            title={event.employee}
            className={
                `${sizeClass} inline-flex items-center justify-center rounded-full font-bold ring-2 ` +
                ringClass +
                ' ' +
                (EVENT_STYLES[event.type]?.chip ||
                    'bg-slate-100 text-slate-700')
            }
        >
            {event.initials || initials(event.employee)}
        </span>
    );
}

function DashboardCalendar({ calendar }) {
    const month = calendar?.month ?? new Date().getMonth() + 1;
    const year = calendar?.year ?? new Date().getFullYear();
    const events = calendar?.events ?? [];

    const [selectedDate, setSelectedDate] = useState(null);

    const eventsByDate = useMemo(() => {
        const map = {};
        for (const event of events) {
            if (!map[event.date]) {
                map[event.date] = [];
            }
            map[event.date].push(event);
        }
        return map;
    }, [events]);

    const monthLabel = useMemo(
        () =>
            new Date(year, month - 1, 1).toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
            }),
        [month, year],
    );

    const weeks = useMemo(() => {
        const first = new Date(year, month - 1, 1);
        const startWeekday = first.getDay(); // 0 Sun
        const daysInMonth = new Date(year, month, 0).getDate();
        const cells = [];

        for (let i = 0; i < startWeekday; i += 1) {
            cells.push(null);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            cells.push({
                day,
                date,
                events: eventsByDate[date] || [],
            });
        }

        while (cells.length % 7 !== 0) {
            cells.push(null);
        }

        const rows = [];
        for (let i = 0; i < cells.length; i += 7) {
            rows.push(cells.slice(i, i + 7));
        }
        return rows;
    }, [year, month, eventsByDate]);

    const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

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

        setSelectedDate(null);
        router.get(
            route('dashboard'),
            { month: nextMonth, year: nextYear },
            { preserveState: true, preserveScroll: true },
        );
    };

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#121a2b]">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Calendar
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Birthdays, leave, and sick leave (SL)
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => goMonth(-1)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        ‹
                    </button>
                    <div className="min-w-[9.5rem] text-center text-sm font-semibold text-slate-800 dark:text-white">
                        {monthLabel}
                    </div>
                    <button
                        type="button"
                        onClick={() => goMonth(1)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="grid gap-4 p-4 lg:grid-cols-12 lg:p-5">
                <div className="lg:col-span-8">
                    <div className="mb-3 flex flex-wrap gap-3 text-xs">
                        {Object.entries(EVENT_STYLES).map(([key, style]) => (
                            <span
                                key={key}
                                className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300"
                            >
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${style.dot}`}
                                />
                                {style.label}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                            (day) => (
                                <div key={day} className="py-1">
                                    {day}
                                </div>
                            ),
                        )}
                    </div>

                    <div className="mt-1 grid grid-cols-7 gap-1">
                        {weeks.flat().map((cell, index) => {
                            if (!cell) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="min-h-[3.25rem] rounded-lg bg-slate-50/60 dark:bg-slate-900/40"
                                    />
                                );
                            }

                            const isSelected = selectedDate === cell.date;
                            const isToday = cell.date === todayKey;
                            const uniquePeople = [];
                            const seen = new Set();
                            for (const event of cell.events) {
                                const key = event.employee;
                                if (seen.has(key)) {
                                    continue;
                                }
                                seen.add(key);
                                uniquePeople.push(event);
                            }

                            return (
                                <button
                                    key={cell.date}
                                    type="button"
                                    onClick={() => setSelectedDate(cell.date)}
                                    className={
                                        'flex min-h-[3.75rem] flex-col rounded-lg border px-1.5 py-1 text-left transition ' +
                                        (isSelected
                                            ? 'border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/30'
                                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600')
                                    }
                                >
                                    <span
                                        className={
                                            'inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ' +
                                            (isToday
                                                ? 'bg-teal-600 text-white'
                                                : 'text-slate-700 dark:text-slate-200')
                                        }
                                    >
                                        {cell.day}
                                    </span>
                                    <div className="mt-auto flex flex-wrap items-center gap-0.5 pt-1">
                                        {uniquePeople.slice(0, 3).map((event) => (
                                            <EventAvatar
                                                key={`${event.employee}-${event.type}`}
                                                event={event}
                                            />
                                        ))}
                                        {uniquePeople.length > 3 && (
                                            <span className="text-[9px] font-semibold text-slate-400">
                                                +{uniquePeople.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/40 lg:col-span-4">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                        {selectedDate
                            ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                                  'en-US',
                                  {
                                      weekday: 'long',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                  },
                              )
                            : 'Select a day'}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                        {selectedDate
                            ? `${selectedEvents.length} event${selectedEvents.length === 1 ? '' : 's'}`
                            : 'Click a date to see birthday, leave, and SL.'}
                    </p>

                    <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
                        {!selectedDate ? (
                            <div className="space-y-2">
                                {events.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                        No birthday, leave, or SL this month.
                                    </p>
                                ) : (
                                    events.slice(0, 8).map((event, index) => (
                                        <button
                                            key={`${event.date}-${event.type}-${event.employee}-${index}`}
                                            type="button"
                                            onClick={() =>
                                                setSelectedDate(event.date)
                                            }
                                            className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left hover:border-teal-300 dark:border-slate-700 dark:bg-slate-900"
                                        >
                                            <EventAvatar
                                                event={event}
                                                size="md"
                                            />
                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-center gap-1.5">
                                                    <span
                                                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${EVENT_STYLES[event.type]?.chip}`}
                                                    >
                                                        {EVENT_STYLES[event.type]
                                                            ?.label || event.label}
                                                    </span>
                                                </span>
                                                <span className="mt-0.5 block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                                    {event.employee}
                                                </span>
                                                <span className="block text-xs text-slate-500">
                                                    {event.date}
                                                    {event.detail
                                                        ? ` · ${event.detail}`
                                                        : ''}
                                                </span>
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : selectedEvents.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No events on this day.
                            </p>
                        ) : (
                            selectedEvents.map((event, index) => (
                                <div
                                    key={`${event.type}-${event.employee}-${index}`}
                                    className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                                >
                                    <EventAvatar event={event} size="md" />
                                    <div className="min-w-0 flex-1">
                                        <span
                                            className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold ${EVENT_STYLES[event.type]?.chip}`}
                                        >
                                            {EVENT_STYLES[event.type]?.label ||
                                                event.label}
                                        </span>
                                        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                            {event.employee}
                                        </p>
                                        {event.detail && (
                                            <p className="text-xs text-slate-500">
                                                {event.detail}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Dashboard({
    stats = {},
    attendance = [],
    attendanceDate = null,
    canViewAttendance = false,
    canViewCalendar = false,
    calendar = null,
    myAttendance = null,
}) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    const [clockBusy, setClockBusy] = useState(false);
    const isAdmin = String(user?.role || '').toLowerCase() === 'admin';
    const showPersonalClock = !isAdmin;
    const canClockIn = Boolean(myAttendance?.can_clock_in);

    const noClockIn = useMemo(
        () => attendance.filter((row) => !row.clocked_in),
        [attendance],
    );

    const clockedInList = useMemo(
        () => attendance.filter((row) => row.clocked_in),
        [attendance],
    );

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
                    Dashboard
                </h1>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#121a2b]">
                    <p className="text-sm text-teal-700 dark:text-teal-400">
                        Welcome back
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
                        {user.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        You&apos;re signed in to the Luntian HR Portal.
                    </p>
                </div>

                {(flash?.success || flash?.error) && (
                    <div
                        className={
                            'rounded-lg px-4 py-3 text-sm ' +
                            (flash.error
                                ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                                : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300')
                        }
                    >
                        {flash.error || flash.success}
                    </div>
                )}

                {(showPersonalClock || stats.leave_requests != null) && (
                    <div
                        className={
                            'grid gap-4 ' +
                            (showPersonalClock && stats.leave_requests != null
                                ? 'sm:grid-cols-2'
                                : 'sm:grid-cols-1')
                        }
                    >
                        {showPersonalClock && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#121a2b]">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        Attendance Today
                                    </div>

                                    {canClockIn && (
                                        <button
                                            type="button"
                                            disabled={clockBusy}
                                            onClick={submitClockIn}
                                            className="shrink-0 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
                                        >
                                            {clockBusy ? 'Saving…' : 'Clock In'}
                                        </button>
                                    )}
                                </div>

                                {myAttendance?.clocked_in ? (
                                    <div className="mt-3 space-y-1">
                                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                            Clocked in
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            In: {myAttendance.clocked_in_at || '—'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-3 space-y-1">
                                        <div className="text-2xl font-bold text-slate-800 dark:text-white">
                                            Not clocked in
                                        </div>
                                        <p className="text-sm text-slate-500">
                                            {myAttendance?.date
                                                ? `Record for ${myAttendance.date}`
                                                : 'Use Clock In to start your day.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {stats.leave_requests != null && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#121a2b]">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Leave Requests
                                </div>
                                <div className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                                    {String(stats.leave_requests)}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {(canViewAttendance || canViewCalendar) && (
                    <div className="grid gap-4 xl:grid-cols-12">
                        {canViewAttendance && (
                            <div
                                className={
                                    'grid gap-4 ' +
                                    (canViewCalendar
                                        ? 'xl:col-span-4'
                                        : 'xl:col-span-12 md:grid-cols-2')
                                }
                            >
                                <section className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#121a2b]">
                                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                                No clock in
                                            </h3>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {attendanceDate
                                                    ? `Today · ${attendanceDate}`
                                                    : 'Today'}
                                                {' · '}
                                                {noClockIn.length} employee
                                                {noClockIn.length === 1
                                                    ? ''
                                                    : 's'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="max-h-[32rem] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                                        {noClockIn.length === 0 ? (
                                            <p className="px-5 py-10 text-center text-sm text-slate-500">
                                                Everyone has clocked in today.
                                            </p>
                                        ) : (
                                            noClockIn.map((employee) => (
                                                <div
                                                    key={employee.id}
                                                    className="flex items-center gap-3 px-5 py-3"
                                                >
                                                    {employee.photo_url ? (
                                                        <img
                                                            src={
                                                                employee.photo_url
                                                            }
                                                            alt={employee.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-200">
                                                            {initials(
                                                                employee.name,
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                            {employee.name}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500">
                                                            {[
                                                                employee.employee_number,
                                                                employee.department,
                                                                employee.position,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(' · ') ||
                                                                '—'}
                                                        </p>
                                                    </div>
                                                    <StatusBadge status="No clock in" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#121a2b]">
                                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                                Clocked in
                                            </h3>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {attendanceDate
                                                    ? `Today · ${attendanceDate}`
                                                    : 'Today'}
                                                {' · '}
                                                {clockedInList.length} employee
                                                {clockedInList.length === 1
                                                    ? ''
                                                    : 's'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="max-h-[32rem] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                                        {clockedInList.length === 0 ? (
                                            <p className="px-5 py-10 text-center text-sm text-slate-500">
                                                No one has clocked in yet.
                                            </p>
                                        ) : (
                                            clockedInList.map((employee) => (
                                                <div
                                                    key={employee.id}
                                                    className="flex items-center gap-3 px-5 py-3"
                                                >
                                                    {employee.photo_url ? (
                                                        <img
                                                            src={
                                                                employee.photo_url
                                                            }
                                                            alt={employee.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                                                            {initials(
                                                                employee.name,
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                            {employee.name}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500">
                                                            {[
                                                                employee.employee_number,
                                                                employee.department,
                                                                employee.position,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(' · ') ||
                                                                '—'}
                                                            {employee.clocked_in_at
                                                                ? ` · In ${employee.clocked_in_at}`
                                                                : ''}
                                                        </p>
                                                    </div>
                                                    <StatusBadge status="Clocked in" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                        {canViewCalendar && calendar && (
                            <div
                                className={
                                    canViewAttendance
                                        ? 'xl:col-span-8'
                                        : 'xl:col-span-12'
                                }
                            >
                                <DashboardCalendar calendar={calendar} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
