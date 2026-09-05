import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DisciplineProgress from '@/Components/DisciplineProgress';
import useCan from '@/hooks/useCan';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function LevelBadge({ level }) {
    const key = String(level || '').toLowerCase();

    const styles = {
        'verbal warning': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        'written warning': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
        'final warning': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
        suspension: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
        termination: 'bg-slate-800 text-white dark:bg-slate-700 dark:text-slate-100',
    };

    return (
        <span
            className={
                'inline-flex rounded-md px-2 py-1 text-xs font-medium ' +
                (styles[key] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300')
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
                'inline-flex w-fit rounded-md px-2 py-1 text-xs font-medium ' +
                (styles[status] || styles.Active)
            }
        >
            {status || 'Active'}
        </span>
    );
}

const STATUS_OPTIONS = ['Active', 'Resolved', 'Escalated'];

export default function Index({
    records,
    filters,
    canManage,
    canCreate,
    isOwnView = false,
    progress = null,
}) {
    const canAdd = useCan('discipline.create') || canCreate;
    const canUpdateStatus = canManage || canAdd;
    const [search, setSearch] = useState(filters.search || '');

    const updateStatus = (id, status) => {
        router.post(
            route('discipline.status', id),
            { status },
            { preserveScroll: true },
        );
    };

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search === (filters.search || '')) {
                return;
            }

            router.get(
                route('discipline.index'),
                {
                    search: search || undefined,
                    sort: filters.sort,
                    direction: filters.direction,
                    per_page: filters.per_page,
                },
                { preserveState: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search, filters.search, filters.sort, filters.direction, filters.per_page]);

    const updateTable = (overrides = {}) => {
        router.get(
            route('discipline.index'),
            {
                search: search || undefined,
                sort: filters.sort,
                direction: filters.direction,
                per_page: filters.per_page,
                ...overrides,
            },
            { preserveState: true, replace: true },
        );
    };

    const toggleSort = (column) => {
        const nextDirection =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        updateTable({ sort: column, direction: nextDirection });
    };

    const columns = isOwnView
        ? [
              { key: 'incident_date', label: 'Incident Date' },
              { key: 'offense_type', label: 'Offense Type' },
              { key: 'discipline_level', label: 'Discipline Level' },
              { key: 'next_review_date', label: 'Next Review' },
              { key: 'status', label: 'Status' },
          ]
        : [
              { key: 'employee_name', label: 'Employee' },
              { key: 'incident_date', label: 'Incident Date' },
              { key: 'offense_type', label: 'Offense Type' },
              { key: 'discipline_level', label: 'Discipline Level' },
              { key: 'next_review_date', label: 'Next Review' },
              { key: 'status', label: 'Status' },
          ];

    if (canManage) {
        columns.splice(1, 0, { key: 'recorded_by', label: 'Recorded By' });
    }

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Progressive Discipline
                </h1>
            }
        >
            <Head title="Progressive Discipline" />

            <div className="space-y-4">
                {isOwnView && progress && (
                    <DisciplineProgress progress={progress} />
                )}

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        {isOwnView ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Your progressive discipline records.
                            </p>
                        ) : (
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search discipline records..."
                                className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            />
                        )}

                        {canAdd && (
                            <Link
                                href={route('discipline.create')}
                                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 sm:ml-auto"
                            >
                                + Add record
                            </Link>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                    {columns.map((column) => {
                                        const isActive = filters.sort === column.key;
                                        const sortable =
                                            column.key !== 'recorded_by' &&
                                            column.key !== 'status';

                                        return (
                                            <th
                                                key={column.key}
                                                className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300"
                                            >
                                                {sortable ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleSort(column.key)
                                                        }
                                                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        {column.label}
                                                        <span className="text-[10px] text-slate-400">
                                                            {isActive
                                                                ? filters.direction ===
                                                                  'asc'
                                                                    ? '↑'
                                                                    : '↓'
                                                                : '↕'}
                                                        </span>
                                                    </button>
                                                ) : (
                                                    column.label
                                                )}
                                            </th>
                                        );
                                    })}
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {records.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length + 1}
                                            className="px-4 py-16 text-center"
                                        >
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                {isOwnView
                                                    ? 'No discipline records on your file'
                                                    : 'No discipline records yet'}
                                            </p>
                                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                                {canAdd
                                                    ? 'Click Add record to create one.'
                                                    : isOwnView
                                                      ? 'Records will appear here if HR adds one for you.'
                                                      : 'No records available.'}
                                            </p>
                                            {canAdd && (
                                                <Link
                                                    href={route('discipline.create')}
                                                    className="mt-4 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                                                >
                                                    + Add record
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    records.data.map((record) => (
                                        <tr
                                            key={record.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            {!isOwnView && (
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {record.employee_name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {record.employee_number ||
                                                            '—'}
                                                        {record.department
                                                            ? ` · ${record.department}`
                                                            : ''}
                                                    </div>
                                                </td>
                                            )}
                                            {canManage && (
                                                <td className="px-4 py-3">
                                                    <div className="text-slate-800 dark:text-slate-200">
                                                        {record.recorded_by}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {record.recorded_by_email}
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {record.incident_date || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {record.offense_type}
                                            </td>
                                            <td className="px-4 py-3">
                                                <LevelBadge
                                                    level={record.discipline_level}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {record.next_review_date || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {canUpdateStatus ? (
                                                    <select
                                                        value={
                                                            record.status ||
                                                            'Active'
                                                        }
                                                        onChange={(e) =>
                                                            updateStatus(
                                                                record.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-auto rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                                    >
                                                        {STATUS_OPTIONS.map(
                                                            (option) => (
                                                                <option
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                ) : (
                                                    <StatusBadge
                                                        status={record.status}
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={route(
                                                        'discipline.show',
                                                        record.id,
                                                    )}
                                                    className="inline-flex items-center rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span>Rows</span>
                            <select
                                value={filters.per_page}
                                onChange={(e) =>
                                    updateTable({
                                        per_page: Number(e.target.value),
                                        page: 1,
                                    })
                                }
                                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span>
                                {records.from ?? 0}-{records.to ?? 0} of{' '}
                                {records.total}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={!records.prev_page_url}
                                onClick={() =>
                                    updateTable({
                                        page: records.current_page - 1,
                                    })
                                }
                                className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800"
                            >
                                Prev
                            </button>
                            <span>
                                {records.current_page} / {records.last_page || 1}
                            </span>
                            <button
                                type="button"
                                disabled={!records.next_page_url}
                                onClick={() =>
                                    updateTable({
                                        page: records.current_page + 1,
                                    })
                                }
                                className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
