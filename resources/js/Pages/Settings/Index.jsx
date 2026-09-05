import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import useCan from '@/hooks/useCan';
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

function roleLabel(role) {
    return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function Index({ syncedEmails, allowedDomain, roles }) {
    const { flash } = usePage().props;
    const canUpdateRole = useCan('settings.role.update');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) {
            return syncedEmails;
        }

        return syncedEmails.filter(
            (account) =>
                account.name.toLowerCase().includes(q) ||
                account.email.toLowerCase().includes(q) ||
                (account.role || '').toLowerCase().includes(q),
        );
    }, [syncedEmails, search]);

    const updateRole = (userId, role) => {
        router.patch(
            route('settings.role.update', userId),
            { role },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Account
                </h1>
            }
        >
            <Head title="Account" />

            <div className="space-y-4">
                {flash?.success && (
                    <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Google Workspace emails
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Accounts synced via Google Sign-In (@
                                {allowedDomain}).
                            </p>
                        </div>
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search accounts..."
                            className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/80">
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">
                                        Synced
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-16 text-center"
                                        >
                                            <p className="font-medium text-slate-800 dark:text-white">
                                                {syncedEmails.length === 0
                                                    ? 'No synced emails yet'
                                                    : 'No matching accounts'}
                                            </p>
                                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                                {syncedEmails.length === 0
                                                    ? 'Emails will appear here after users sign in with Google Workspace.'
                                                    : 'Try a different search.'}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((account) => (
                                        <tr
                                            key={account.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">
                                                        {initials(account.name)}
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {account.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                {account.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                {canUpdateRole ? (
                                                    <select
                                                        value={account.role}
                                                        onChange={(e) =>
                                                            updateRole(
                                                                account.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        aria-label={`Role for ${account.name}`}
                                                        className="w-36 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                                    >
                                                        {roles.map((role) => (
                                                            <option
                                                                key={role}
                                                                value={role}
                                                            >
                                                                {roleLabel(
                                                                    role,
                                                                )}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                        {roleLabel(
                                                            account.role,
                                                        )}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                    Synced
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                                                {account.synced_at}
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
