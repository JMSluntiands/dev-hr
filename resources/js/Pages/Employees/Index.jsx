import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import useCan from '@/hooks/useCan';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function initials(name = '') {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function StatusBadge({ status }) {
    const key = String(status || '')
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

    const styles = {
        active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        resigned: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
        terminated: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    };

    return (
        <span
            className={
                'inline-block rounded-md px-2 py-1 text-xs font-medium capitalize ' +
                (styles[key] || styles.inactive)
            }
        >
            {status}
        </span>
    );
}

export default function Index({ employees, filters }) {
    const canCreate = useCan('employees.create');
    const canEdit = useCan('employees.edit');
    const canView = useCan('employees.view');
    const showActions = canView || canEdit;
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search === (filters.search || '')) {
                return;
            }

            router.get(
                route('employees.index'),
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
            route('employees.index'),
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

    const columns = [
        { key: 'employee_number', label: 'Employee ID' },
        { key: 'first_name', label: 'Name' },
        { key: 'department', label: 'Department' },
        { key: 'position', label: 'Position' },
        { key: 'date_hired', label: 'Date Hired' },
        { key: 'employment_status', label: 'Status' },
    ];

    const columnCount = columns.length + (showActions ? 1 : 0);

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Employees
                </h1>
            }
        >
            <Head title="Employees" />

            <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-700">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search employees..."
                            className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        />

                        {canCreate && (
                            <Link
                                href={route('employees.create')}
                                className="ml-auto inline-flex shrink-0 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                            >
                                + Add employee
                            </Link>
                        )}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                    {columns.map((column) => {
                                        const isActive = filters.sort === column.key;
                                        return (
                                            <th
                                                key={column.key}
                                                className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300"
                                            >
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
                                            </th>
                                        );
                                    })}
                                    {showActions && (
                                        <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {employees.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columnCount}
                                            className="px-4 py-16 text-center"
                                        >
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                No employees found
                                            </p>
                                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                                {canCreate
                                                    ? 'Click Add employee to create one.'
                                                    : 'No employee records available.'}
                                            </p>
                                            {canCreate && (
                                                <Link
                                                    href={route(
                                                        'employees.create',
                                                    )}
                                                    className="mt-4 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
                                                >
                                                    + Add employee
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    employees.data.map((employee) => (
                                        <tr
                                            key={employee.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                                                {employee.employee_number}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {employee.photo_url ? (
                                                        <img
                                                            src={employee.photo_url}
                                                            alt={employee.full_name}
                                                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                                                            {initials(
                                                                employee.full_name,
                                                            )}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-slate-900 dark:text-white">
                                                            {employee.full_name}
                                                        </div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                            {employee.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                {employee.department || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                {employee.position || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                {employee.date_hired || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge
                                                    status={
                                                        employee.employment_status
                                                    }
                                                />
                                            </td>
                                            {showActions && (
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {canView && (
                                                            <Link
                                                                href={route(
                                                                    'employees.show',
                                                                    employee.id,
                                                                )}
                                                                className="inline-flex items-center rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
                                                            >
                                                                View
                                                            </Link>
                                                        )}
                                                        {canEdit && (
                                                            <Link
                                                                href={route(
                                                                    'employees.edit',
                                                                    employee.id,
                                                                )}
                                                                className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                                            >
                                                                Edit
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
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
                                {employees.from ?? 0}-{employees.to ?? 0} of{' '}
                                {employees.total}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={!employees.prev_page_url}
                                onClick={() =>
                                    updateTable({
                                        page: employees.current_page - 1,
                                    })
                                }
                                className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800"
                            >
                                Prev
                            </button>
                            <span>
                                {employees.current_page} /{' '}
                                {employees.last_page || 1}
                            </span>
                            <button
                                type="button"
                                disabled={!employees.next_page_url}
                                onClick={() =>
                                    updateTable({
                                        page: employees.current_page + 1,
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
